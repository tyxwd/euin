import { ref } from 'vue'
import Settings from "@/config/settings";

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
                uni.showToast({ title: 'File selection failed', icon: 'none' });
            }
        });
        // #endif

        // #ifdef APP-PLUS
        // Initial feedback for the user
        uni.showLoading({
            title: 'Opening selector...',
            mask: true
        });

        // Delay to ensure the loading animation starts before the system intent opens
        setTimeout(() => {
            openNativeFileChooser(selectedType, selectedModel);
        }, 150);
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

                // Show parsing status immediately
                uni.showLoading({
                    title: 'Reading content...',
                    mask: true
                });

                // Crucial: Put the heavy "while" loop inside a timeout
                // to prevent the UI thread from freezing before the dialog appears.
                setTimeout(() => {
                    readTxtFileByUriForAndroid10(uri, selectedType, selectedModel);
                }, 150);
            } else {
                uni.hideLoading();
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
                console.error('Failed to openInputStream:', e);
                uni.hideLoading();
                return;
            }

            const InputStreamReader = plus.android.importClass('java.io.InputStreamReader');
            const BufferedReader = plus.android.importClass('java.io.BufferedReader');
            const isr = new InputStreamReader(inputStream, 'utf-8');
            const br = new BufferedReader(isr);

            let line = '';
            let txtContent = '';

            // This is the heavy part. It will still take time for 50KB,
            // but the user will see the "Reading content..." spinner now.
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
            console.error('Failed to read URI:', error);
            uni.hideLoading();
        }
    }

    const getFileNameFromUri = (uri) => {
        try {
            const main = plus.android.runtimeMainActivity();
            const contentResolver = main.getContentResolver();
            const Cursor = plus.android.importClass('android.database.Cursor');
            const DisplayName = plus.android.importClass('android.provider.OpenableColumns').DISPLAY_NAME;

            const cursor = plus.android.invoke(contentResolver, 'query', uri, [DisplayName], null, null, null);
            let fileName = 'unknown.txt';
            if (cursor && plus.android.invoke(cursor, 'moveToFirst')) {
                const index = plus.android.invoke(cursor, 'getColumnIndex', DisplayName);
                fileName = plus.android.invoke(cursor, 'getString', index);
                plus.android.invoke(cursor, 'close');
            }
            return fileName;
        } catch (e) {
            return 'unknown.txt';
        }
    }

    const uploadToBackend = (fileDetail, selectedType, selectedModel) => {
        isLoading.value = true
        uni.showLoading({
            title: 'Uploading...',
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
                let uploadResult
                try {
                    uploadResult = JSON.parse(uploadRes.data)
                } catch (e) {
                    uni.hideLoading()
                    uni.showToast({ title: 'Response parse error', icon: 'none' });
                    return
                }

                if (uploadResult.status === 'success' && uploadResult.file_info) {
                    const fileInfoData = uploadResult.file_info
                    const relativePath = `${fileInfoData.month_folder}/file/${fileInfoData.uuid_filename}`
                    predictResult(relativePath, selectedType, selectedModel)
                } else {
                    uni.hideLoading()
                    uni.showToast({ title: uploadResult.message || 'Upload failed', icon: 'none' });
                }
            },
            fail: (err) => {
                uni.hideLoading()
                uni.showToast({ title: 'Upload network error', icon: 'none' });
            },
            complete: () => {
                isLoading.value = false
            }
        })
    }

    const predictResult = (relativePath, selectedType, selectedModel) => {
        uni.showLoading({ title: 'Analyzing...', mask: true })

        uni.request({
            url: `${baseUrl}/predict_custom`,
            method: 'POST',
            data: {
                file_path: relativePath,
                type_: selectedType,
                model: selectedModel
            },
            header: { 'Content-Type': 'application/json' },
            success: (predictRes) => {
                uni.hideLoading()
                const res = predictRes.data
                if (res.status === 'success') {
                    result.value = res.result || {}
                    calculationData.value = res.calculation_data || null
                    qualityInfo.value = res.quality_info || null
                    probabilities.value = res.probabilities || {}
                    fileInfo.value = res.file_info || {}
                    if (result.value) {
                        result.value.calc_method = selectedType
                        result.value.calc_model = selectedModel
                    }
                } else {
                    uni.showToast({ title: res.message || 'Analysis failed', icon: 'none' });
                }
            },
            fail: (err) => {
                uni.hideLoading()
                uni.showToast({ title: 'Prediction request failed', icon: 'none' });
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