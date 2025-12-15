<template>
  <view class="container">
    <!-- 语言选择器 -->
    <view class="language-selector" @click="openLanguageModal">
      <view class="language-picker">
        <text class="current-language">{{ currentLanguage.name }}</text>
        <text class="picker-arrow">▼</text>
      </view>
    </view>
    <team-guide v-if="!hasResult"></team-guide>
    <!-- 上传区域 -->
    <view class="upload-section" v-if="!hasResult">
      <button class="upload-btn" @click="chooseFile" :disabled="isLoading">{{ $t('action.upload') }}</button>
      <text class="file-name" v-if="fileName">{{ $t('tip.uploadTip') }}: {{ fileName }}</text>
    </view>
    <!-- 团队介绍组件 -->
    <team-intro :show="!hasResult"
                @start="onTeamIntroStart"
    />
    <team-logo-display v-if="!hasResult"></team-logo-display>

    <!-- 结果区域 -->
    <view class="result-section" v-if="hasResult">
      <!-- 主要预测结果 -->
      <view class="result-card">
        <text class="result-title">{{ $t('result.predictedType') }}:</text>
        <text class="result-text" :class="resultClass">{{ result.predicted_type }}</text>
      </view>

      <!-- 置信度 -->
      <view class="result-card mt-20">
        <text class="result-title">{{ $t('result.confidence') }}:</text>
        <text class="result-text">{{ (result.confidence * 100).toFixed(2) }}%</text>
      </view>

      <!-- 数据信息 -->
      <view class="info-card mt-20">
        <text class="info-title">{{ $t('dataInfo.title') }}</text>
        <view class="info-row">
          <text class="info-label">{{ $t('dataInfo.originalLength') }}:</text>
          <text class="info-value">{{ result.original_length }} {{ $t('dataInfo.dataPoints') }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">{{ $t('dataInfo.processedLength') }}:</text>
          <text class="info-value">{{ result.processed_length }} {{ $t('dataInfo.dataPoints') }}</text>
        </view>
      </view>

      <!-- 概率分布 -->
      <view class="probabilities-card mt-20" v-if="probabilities && Object.keys(probabilities).length > 0">
        <text class="prob-title">{{ $t('probability.title') }}</text>
        <view class="prob-item" v-for="(prob, className) in probabilities" :key="className">
          <view class="prob-header">
            <text class="prob-name">{{ formatClassName(className) }}</text>
            <text class="prob-percent">{{ (prob * 100).toFixed(2) }}%</text>
          </view>
          <view class="prob-bar">
            <view
                class="prob-bar-fill"
                :style="{ width: (prob * 100) + '%' }"
                :class="getProbBarClass(className)"
            ></view>
          </view>
        </view>
      </view>

      <!-- 文件信息 -->
      <view class="file-info-card mt-20" v-if="fileInfo">
        <text class="file-info-title">{{ $t('fileInfo.title') }}</text>
        <view class="file-info-row">
          <text class="file-info-label">{{ $t('fileInfo.usedFile') }}:</text>
          <text class="file-info-value">{{ getFileName(fileInfo.used_file) }}</text>
        </view>
        <view class="file-info-row">
          <text class="file-info-label">{{ $t('fileInfo.fileType') }}:</text>
          <text class="file-info-value">{{ getFileTypeText(fileInfo.file_type) }}</text>
        </view>
      </view>

      <!-- 重新分析按钮 -->
      <view class="reanalyze-section mt-20">
        <button class="reanalyze-btn" @click="resetAnalysis">{{ $t('action.reanalyze') }}</button>
      </view>
    </view>

    <!-- 自定义语言选择模态框 -->
    <view class="language-modal" v-if="showLanguageModal" @click="closeLanguageModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ $t('language.selectLanguage') }}</text>
          <text class="modal-close" @click="closeLanguageModal">×</text>
        </view>
        <view class="language-list">
          <view
              class="language-item"
              v-for="item in languageOptions"
              :key="item.locale"
              @click="selectLanguage(item.locale)"
              :class="{ active: currentLanguage.locale === item.locale }"
          >
            <text class="language-name">{{ item.name }}</text>
            <text class="checkmark" v-if="currentLanguage.locale === item.locale">✓</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import fileTypes from '@/config/fileTypes.js'
import TeamGuide from "@/components/TeamGuide.vue";
import TeamLogoDisplay from "@/components/TeamLogoDisplay.vue";
import TeamIntro from "@/components/TeamIntro.vue";

// 语言配置：扩展为12种，locale与i18n注册的标识完全一致
const languageConfig = {
  'en': {name: 'English', locale: 'en'},
  'zh-CN': {name: '中文（简体）', locale: 'zh-CN'},
  // 'ja': {name: '日本語', locale: 'ja'},
  // 'ko': {name: '한국어', locale: 'ko'},
  // 'es': {name: 'Español', locale: 'es'},
  // 'fr': {name: 'Français', locale: 'fr'},
  // 'de': {name: 'Deutsch', locale: 'de'},
  // 'ru': {name: 'Русский', locale: 'ru'},
  // 'pt-BR': {name: 'Português (Brasil)', locale: 'pt-BR'},
  // 'ar': {name: 'العربية', locale: 'ar'},
  // 'it': {name: 'Italiano', locale: 'it'},
  // 'hi': {name: 'हिन्दी', locale: 'hi'}
}

export default {
  components: {
    TeamGuide,
    TeamIntro,
    TeamLogoDisplay
  },

  data() {
    return {
      fileName: '',
      fileTempPath: '',
      result: null,
      probabilities: null,
      fileInfo: null,
      isLoading: false,
      baseUrl: 'http://43.138.48.175/npj',
      languageIndex: 0,
      languageOptions: [],
      currentLanguage: {},
      showLanguageModal: false
    }
  },

  computed: {
    resultClass() {
      const type = this.result?.predicted_type || ''
      if (['β-carotene', 'VitaminD3', '健康类型1'].includes(type)) return 'healthy'
      if (['retinol', '亚健康类型1'].includes(type)) return 'sub-healthy'
      return 'ill'
    },
    isH5() {
      return process.env.VUE_APP_PLATFORM === 'h5'
    },
    hasResult() {
      return this.result !== null
    }
  },

  onLoad() {
    this.initLanguage()
  },

  watch: {
    '$i18n.locale': {
      handler() {
        uni.setNavigationBarTitle({
          title: this.$t('page.title')
        })
      },
      immediate: true
    }
  },

  methods: {
    // 团队介绍开始按钮点击事件
    onTeamIntroStart() {
      console.log('用户点击开始使用按钮')
      // 这里可以添加一些动画效果或其他逻辑
    },

    // 重置分析
    resetAnalysis() {
      this.result = null
      this.probabilities = null
      this.fileInfo = null
      this.fileName = ''
      this.fileTempPath = ''
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0 // 动画时长（ms）
      })
    },
    // 初始化语言设置（兼容旧数据+系统语言识别）
    initLanguage() {
      // 获取所有12种语言选项
      this.languageOptions = Object.values(languageConfig)

      // 读取本地存储（兼容旧版'zh'→'zh-CN'）
      let savedLang = uni.getStorageSync('preferredLanguage')
      if (savedLang === 'zh') savedLang = 'zh-CN' // 旧数据迁移

      // 识别系统语言（优先完整匹配，再匹配前缀）
      // const systemLang = this.getSystemLanguage()
      // const defaultLang = savedLang || systemLang || 'zh-CN'
      const defaultLang = 'en'

      this.setLanguage(defaultLang)
    },

    // 优化系统语言识别：支持完整标识（如zh-CN）和前缀匹配（如en-US→en）
    getSystemLanguage() {
      try {
        const systemLang = uni.getSystemInfoSync().language || 'zh-CN'
        const langKeys = Object.keys(languageConfig)

        // 1. 完整匹配（如zh-CN直接命中）
        if (langKeys.includes(systemLang)) return systemLang

        // 2. 前缀匹配（如en-US→en，ja-JP→ja）
        const shortLang = systemLang.split('-')[0]
        const matchedKey = langKeys.find(key => key.startsWith(shortLang))
        return matchedKey || 'zh-CN'
      } catch (e) {
        return 'zh-CN' // 异常时默认中文
      }
    },

    // 设置语言（同步i18n和本地存储）
    setLanguage(lang) {
      if (languageConfig[lang]) {
        this.$i18n.locale = lang // 与i18n注册的标识一致
        this.currentLanguage = languageConfig[lang]
        // 更新选择器索引
        this.languageIndex = this.languageOptions.findIndex(item => item.locale === lang)
        // 持久化存储
        uni.setStorageSync('preferredLanguage', lang)
      }
    },

    // 打开语言选择模态框
    openLanguageModal() {
      this.showLanguageModal = true
    },

    // 关闭语言选择模态框
    closeLanguageModal() {
      this.showLanguageModal = false
    },

    // 选择语言
    selectLanguage(lang) {
      this.setLanguage(lang)
      this.closeLanguageModal()
    },

    // 选择文件（原有逻辑不变）
    chooseFile() {
      uni.chooseFile({
        count: 1,
        type: 'file',
        success: (res) => {
          const file = res.tempFiles[0]
          this.fileName = file.name
          this.fileTempPath = res.tempFilePaths[0]

          if (!this.isAllowedFileType(file.name)) {
            uni.showToast({
              title: this.$t('error.fileTypeError') + file.name.split('.').pop().toLowerCase(),
              icon: 'none',
              duration: 2000
            })
            return
          }

          this.uploadToBackend()
        },
        fail: (err) => {
          console.error('选择文件失败:', err)
          uni.showToast({
            title: this.$t('error.chooseFileError'),
            icon: 'none',
            duration: 2000
          })
        }
      })
    },

    // 校验文件类型（原有逻辑不变）
    isAllowedFileType(fileName) {
      const lowerName = fileName.toLowerCase()
      return fileTypes.textFiles?.includes('.txt') || lowerName.endsWith('.txt')
    },

    // 上传文件到后端（原有逻辑不变）
    uploadToBackend() {
      this.isLoading = true
      uni.showLoading({
        title: this.$t('tip.uploading'),
        mask: true
      })

      // 重置之前的结果
      this.result = null
      this.probabilities = null
      this.fileInfo = null

      uni.uploadFile({
        url: `${this.baseUrl}/upload`,
        filePath: this.fileTempPath,
        name: 'file',
        fileType: 'text',
        success: (uploadRes) => {
          this.isLoading = false
          uni.hideLoading()

          let uploadResult
          try {
            uploadResult = JSON.parse(uploadRes.data)
          } catch (e) {
            console.error('上传响应解析失败:', e)
            uni.showToast({
              title: this.$t('error.uploadParseError'),
              icon: 'none',
              duration: 2000
            })
            return
          }

          if (uploadResult.status === 'success' && uploadResult.file_info) {
            const fileInfo = uploadResult.file_info
            const relativePath = `${fileInfo.month_folder}/file/${fileInfo.uuid_filename}`
            // console.log('上传成功，相对路径:', relativePath)
            this.predictResult(relativePath)
          } else {
            uni.showToast({
              title: uploadResult.message || this.$t('error.uploadFailed'),
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: (err) => {
          this.isLoading = false
          uni.hideLoading()
          console.error('上传文件失败:', err)
          uni.showToast({
            title: this.$t('error.uploadFailed'),
            icon: 'none',
            duration: 2000
          })
        }
      })
    },

    // 调用预测接口（原有逻辑不变）
    predictResult(relativePath) {
      this.isLoading = true
      uni.showLoading({
        title: this.$t('tip.predicting'),
        mask: true
      })

      uni.request({
        url: `${this.baseUrl}/predict_custom`,
        method: 'POST',
        data: {
          file_path: relativePath
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (predictRes) => {
          this.isLoading = false
          uni.hideLoading()
          const predictResult = predictRes.data

          if (predictResult.status === 'success') {
            // 分别存储不同类型的数据
            this.result = predictResult.result
            this.probabilities = predictResult.probabilities || {}
            this.fileInfo = predictResult.file_info || {}

            // console.log('完整预测结果:', predictResult)
          } else {
            uni.showToast({
              title: predictResult.message || this.$t('error.predictFailed'),
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: (err) => {
          this.isLoading = false
          uni.hideLoading()
          console.error('预测接口调用失败:', err)
          uni.showToast({
            title: this.$t('error.predictFailed'),
            icon: 'none',
            duration: 2000
          })
        }
      })
    },

    // 格式化类别名称 - 使用翻译（原有逻辑不变）
    formatClassName(className) {
      const name = className.replace('prob_', '')
      const nameMap = {
        'VitaminD3': this.$t('probability.vitaminD3'),
        'VitaminK3': this.$t('probability.vitaminK3'),
        'retinol': this.$t('probability.retinol'),
        'β-carotene': this.$t('probability.betaCarotene')
      }
      return nameMap[name] || name
    },

    // 获取概率条样式类（原有逻辑不变）
    getProbBarClass(className) {
      const name = className.replace('prob_', '')
      const classMap = {
        'β-carotene': 'healthy-bar',
        'VitaminD3': 'healthy-bar',
        'VitaminK3': 'sub-healthy-bar',
        'retinol': 'ill-bar'
      }
      return classMap[name] || 'default-bar'
    },

    // 获取文件名（从完整路径中提取）（原有逻辑不变）
    getFileName(fullPath) {
      return fullPath ? fullPath.split('/').pop() : this.$t('fileInfo.unknownFile')
    },

    // 获取文件类型显示文本 - 使用翻译（原有逻辑不变）
    getFileTypeText(fileType) {
      return fileType === 'custom' ? this.$t('fileInfo.customFile') : this.$t('fileInfo.defaultFile')
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.upload-section {
  width: 100%;
  padding: 40rpx 0 0;
  text-align: center;
}

.upload-btn {
  background: #2f83e5;
  color: #fff !important;
  border: none !important;
  border-radius: 12rpx;
  height: 90rpx;
  font-size: 34rpx;
  font-weight: 600;
  padding: 0 40rpx;
  margin-bottom: 20rpx;
}

.upload-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.upload-btn:disabled {
  opacity: 0.7;
  transform: none;
}

.file-name {
  font-size: 28rpx;
  color: #666;
  background-color: #fff;
  padding: 16rpx 24rpx;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.result-section {
  width: 100%;
  margin-bottom: 60rpx;
}

/* 通用卡片样式 */
.result-card, .info-card, .probabilities-card, .file-info-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 36rpx 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.mt-20 {
  margin-top: 20rpx;
}

/* 主要结果样式 */
.result-title {
  font-size: 30rpx;
  color: #333;
  margin-right: 10rpx;
}

.result-text {
  font-size: 38rpx;
  font-weight: 700;
}

.healthy {
  color: #4CAF50;
}

.sub-healthy {
  color: #FFC107;
}

.ill {
  color: #F44336;
}

/* 信息卡片样式 */
.info-title, .prob-title, .file-info-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
  display: block;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.info-label {
  font-size: 28rpx;
  color: #666;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

/* 概率卡片样式 */
.prob-item {
  margin-bottom: 24rpx;
}

.prob-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.prob-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.prob-percent {
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
}

.prob-bar {
  height: 12rpx;
  background-color: #f0f0f0;
  border-radius: 6rpx;
  overflow: hidden;
}

.prob-bar-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.5s ease-in-out;
}

.healthy-bar {
  background: linear-gradient(90deg, #4CAF50, #66BB6A);
}

.sub-healthy-bar {
  background: linear-gradient(90deg, #FFC107, #FFD54F);
}

.ill-bar {
  background: linear-gradient(90deg, #F44336, #EF5350);
}

.default-bar {
  background: linear-gradient(90deg, #2196F3, #42A5F5);
}

/* 文件信息样式 */
.file-info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.file-info-label {
  font-size: 28rpx;
  color: #666;
  flex-shrink: 0;
  margin-right: 20rpx;
}

.file-info-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  text-align: right;
  word-break: break-all;
}

/* 语言选择器样式 */
.language-selector {
  position: fixed;
  top: 0;
  height: 44px;
  display: flex;
  align-items: center;
  right: 30rpx;
  z-index: 1000;
}

.language-picker {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border: 2rpx solid #409EFF;
  border-radius: 20rpx;
  padding: 8rpx 12rpx;
  backdrop-filter: blur(10px);
}

.current-language {
  font-size: 26rpx;
  color: #409EFF;
  font-weight: 500;
  margin-right: 8rpx;
}

.picker-arrow {
  font-size: 20rpx;
  color: #409EFF;
}

/* 语言选择模态框样式 */
.language-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: #fff;
  border-radius: 20rpx;
  width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
  animation: modalShow 0.3s ease;
}

@keyframes modalShow {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 30rpx 20rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
  line-height: 1;
  padding: 10rpx;
}

.language-list {
  max-height: 600rpx;
  overflow-y: auto;
}

.language-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
  transition: background-color 0.2s;
}

.language-item:active {
  background-color: #f8f8f8;
}

.language-item.active {
  background-color: #f0f7ff;
}

.language-name {
  font-size: 30rpx;
  color: #333;
}

.checkmark {
  color: #409EFF;
  font-size: 28rpx;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 320px) {
  .container {
    padding: 30rpx 20rpx;
  }

  .upload-btn {
    height: 80rpx;
    font-size: 30rpx;
  }

  .result-text {
    font-size: 34rpx;
  }

  .info-title, .prob-title, .file-info-title {
    font-size: 30rpx;
  }

  .info-label, .info-value, .prob-name, .prob-percent, .file-info-label, .file-info-value {
    font-size: 26rpx;
  }

  .current-language {
    font-size: 24rpx;
  }

  .modal-content {
    width: 560rpx;
  }

  .modal-title {
    font-size: 30rpx;
  }

  .language-name {
    font-size: 28rpx;
  }
}

.reanalyze-btn {
  background-color: #2f83e5;
  color: #fff;
}

</style>