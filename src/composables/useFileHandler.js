import { ref, readonly } from 'vue'
import Settings from "@/config/settings";
import fileTypes from '@/config/fileTypes.js'

export const useFileHandler = () => {
  const fileName = ref('')
  const fileTempPath = ref('')
  const isLoading = ref(false)
  const result = ref(null)
  const probabilities = ref(null)
  const fileInfo = ref(null)
  const calculationData = ref(null)
  const qualityInfo = ref(null)

  const baseUrl = Settings.baseUrl

  const resetAnalysis = () => {
    result.value = null
    probabilities.value = null
    fileInfo.value = null
    fileName.value = ''
    fileTempPath.value = ''
    calculationData.value = null
    qualityInfo.value = null
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  }

  const chooseFile = (selectedType, selectedModel) => {
    // #ifdef H5
    uni.chooseFile({
      count: 1,
      type: 'file',
      success: (res) => {
        const file = res.tempFiles[0];
        fileName.value = file.name;
        fileTempPath.value = res.tempFilePaths[0];
        uploadToBackend('', selectedType, selectedModel);
      },
      fail: (err) => {
        console.error(err);
        uni.showToast({title: '选择文件失败', icon: 'none'});
      }
    });
    // #endif

    // #ifdef APP-PLUS
    openNativeFileChooser(selectedType, selectedModel);
    // #endif
  }

  const openNativeFileChooser = (selectedType, selectedModel) => {
    const main = plus.android.runtimeMainActivity();
    const Intent = plus.android.importClass('android.content.Intent');

    const intent = new Intent(Intent.ACTION_GET_CONTENT);
    intent.setType("*/*");
    intent.addCategory(Intent.CATEGORY_OPENABLE);

    main.onActivityResult = (requestCode, resultCode, data) => {
      if (requestCode === 100 && resultCode === -1 && data) {
        const uri = data.getData();
        readTxtFileByUriForAndroid10(uri, selectedType, selectedModel);
      }
    };

    main.startActivityForResult(intent, 100);
  }

  const readTxtFileByUriForAndroid10 = (uri, selectedType, selectedModel) => {
    try {
      const main = plus.android.runtimeMainActivity();
      const contentResolver = main.getContentResolver();

      let inputStream = null;
      try {
        inputStream = plus.android.invoke(contentResolver, 'openInputStream', uri);
      } catch (e) {
        console.error('调用openInputStream失败：', e);
        return;
      }

      const InputStreamReader = plus.android.importClass('java.io.InputStreamReader');
      const BufferedReader = plus.android.importClass('java.io.BufferedReader');
      const isr = new InputStreamReader(inputStream, 'utf-8');
      const br = new BufferedReader(isr);

      let line = '';
      let txtContent = '';
      while (true) {
        line = plus.android.invoke(br, 'readLine');
        if (line === null) break;
        txtContent += line + '\n';
      }

      plus.android.invoke(br, 'close');
      plus.android.invoke(isr, 'close');
      plus.android.invoke(inputStream, 'close');

      fileName.value = getFileNameFromUri(uri);
      uploadToBackend(txtContent, selectedType, selectedModel);

    } catch (error) {
      console.error('URI读取TXT失败：', error);
    }
  }

  const getFileNameFromUri = (uri) => {
    try {
      const main = plus.android.runtimeMainActivity();
      const contentResolver = main.getContentResolver();
      const Cursor = plus.android.importClass('android.database.Cursor');
      const DisplayName = plus.android.importClass('android.provider.OpenableColumns').DISPLAY_NAME;

      const cursor = plus.android.invoke(contentResolver, 'query', uri, [DisplayName], null, null, null);
      let fileName = '未知文件.txt';
      if (cursor && plus.android.invoke(cursor, 'moveToFirst')) {
        const index = plus.android.invoke(cursor, 'getColumnIndex', DisplayName);
        fileName = plus.android.invoke(cursor, 'getString', index);
        plus.android.invoke(cursor, 'close');
      }
      return fileName;
    } catch (e) {
      console.error('解析文件名失败：', e);
      return '未知文件.txt';
    }
  }

  const uploadToBackend = (fileDetail, selectedType, selectedModel) => {
    isLoading.value = true
    uni.showLoading({
      title: '上传中...',
      mask: true
    })

    result.value = null
    probabilities.value = null
    fileInfo.value = null
    calculationData.value = null
    qualityInfo.value = null

    uni.uploadFile({
      url: `${baseUrl}/upload`,
      filePath: fileTempPath.value,
      name: 'file',
      fileType: 'text',
      formData: {
        fileDetail: fileDetail,
      },
      success: (uploadRes) => {
        isLoading.value = false
        uni.hideLoading()

        let uploadResult
        try {
          uploadResult = JSON.parse(uploadRes.data)
        } catch (e) {
          uni.showToast({
            title: '上传响应解析失败',
            icon: 'none',
            duration: 2000
          })
          return
        }

        if (uploadResult.status === 'success' && uploadResult.file_info) {
          const fileInfoData = uploadResult.file_info
          const relativePath = `${fileInfoData.month_folder}/file/${fileInfoData.uuid_filename}`
          predictResult(relativePath, selectedType, selectedModel)
        } else {
          uni.showToast({
            title: uploadResult.message || '上传失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: (err) => {
        isLoading.value = false
        uni.hideLoading()
        console.error('上传文件失败:', err)
        uni.showToast({
          title: '上传失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

  const predictResult = (relativePath, selectedType, selectedModel) => {
    isLoading.value = true
    uni.showLoading({
      title: '分析中...',
      mask: true
    })

    uni.request({
      url: `${baseUrl}/predict_custom`,
      method: 'POST',
      data: {
        file_path: relativePath,
        type_: selectedType,
        model: selectedModel
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (predictRes) => {
        isLoading.value = false
        uni.hideLoading()
        const predictResult = predictRes.data

        if (predictResult.status === 'success') {
          result.value = predictResult.result || {}
          calculationData.value = predictResult.calculation_data || null
          qualityInfo.value = predictResult.quality_info || null
          probabilities.value = predictResult.probabilities || {}
          fileInfo.value = predictResult.file_info || {}
          if (result.value) {
            result.value.calc_method = selectedType
            result.value.calc_model = selectedModel
          }
        } else {
          uni.showToast({
            title: predictResult.message || '分析失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: (err) => {
        isLoading.value = false
        uni.hideLoading()
        console.error('预测接口调用失败:', err)
        uni.showToast({
          title: '分析失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

  return {
    fileName,
    fileTempPath,
    isLoading,
    result,
    probabilities,
    fileInfo,
    calculationData,
    qualityInfo,
    chooseFile,
    resetAnalysis
  }
}