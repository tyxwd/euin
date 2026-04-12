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
      <!-- 计算方法选择区域 -->
      <view class="method-selector">
        <view class="select-item">
          <text class="select-label">{{ $t('method.type.title') }}:</text>
          <picker mode="selector" :range="typeOptions" :range-key="'label'" :model="selectedTypeIndex"
                  @change="onTypeChange"
                  style="flex: 1">
            <view class="picker-display">
              <text>{{ getTypeLabel(selectedType) }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <view class="select-item mt-10">
          <text class="select-label">{{ $t('method.model.title') }}:</text>
          <picker mode="selector" :range="modelOptions" :range-key="'label'" :model="selectedModelIndex"
                  @change="onModelChange"
                  style="flex: 1">
            <view class="picker-display">
              <text>{{ getModelLabel(selectedModel) }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
      </view>

      <button class="upload-btn" @click="handleChooseFile" :disabled="isLoading">{{ $t('action.upload') }}</button>
      <text class="file-name" v-if="fileName">{{ $t('tip.uploadTip') }}: {{ fileName }}</text>
    </view>

    <!-- 团队介绍组件 -->
    <team-intro :show="!hasResult" @start="onTeamIntroStart"/>

    <team-logo-display v-if="!hasResult"></team-logo-display>

    <!-- 结果展示组件 -->
    <result-display
        :key="displayKey"
        :has-result="hasResult"
        :is-svm-or-tree="isSvmOrTree"
        :is-quantitative="isQuantitative"
        :result="result"
        :probabilities="probabilities"
        :calculation-data="calculationData"
        :quality-info="qualityInfo"
        :file-info="fileInfo"
        :selected-type="selectedType"
        :chart-mode="chartMode"
        @reanalyze="handleResetAnalysis"
        @toggle-chart="toggleChartMode"
    />

    <!-- 自定义语言选择模态框 -->
    <view class="language-modal" v-if="showLanguageModal" @click="closeLanguageModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ $t('language.selectLanguage') || '选择语言' }}</text>
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
import TeamGuide from "@/components/TeamGuide.vue";
import TeamIntro from "@/components/TeamIntro.vue";
import TeamLogoDisplay from "@/components/TeamLogoDisplay.vue";
import ResultDisplay from "@/components/ResultDisplay.vue";
import {languageMixin, modelMixin} from "@/mixins";
import {useFileHandler} from "@/composables/useFileHandler";

export default {
  name: 'Index',
  components: {
    TeamGuide,
    TeamIntro,
    TeamLogoDisplay,
    ResultDisplay
  },
  mixins: [languageMixin, modelMixin],
  setup() {
    const {
      fileName,
      isLoading,
      result,
      probabilities,
      fileInfo,
      calculationData,
      qualityInfo,
      chooseFile,
      resetAnalysis
    } = useFileHandler()

    return {
      fileName,
      isLoading,
      result,
      probabilities,
      fileInfo,
      calculationData,
      qualityInfo,
      chooseFile,
      resetAnalysis
    }
  },
  data() {
    return {
      chartMode: 'pie',
      displayKey: 0,
    }
  },
  computed: {
    hasResult() {
      return this.result !== null
    },
    isSvmOrTree() {
      return this.hasResult && ['svm', 'tree'].includes(this.result.calc_method)
    },
    isQuantitative() {
      return this.hasResult && this.result.calc_method === 'quantitative'
    }
  },
  async onLoad() {
    this.initLanguage()
    await this.refreshModelConfigs()
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
    onTeamIntroStart() {
      console.log('用户点击开始使用按钮')
    },
    handleChooseFile() {
      this.chooseFile(this.selectedType, this.selectedModel)
    },
    handleResetAnalysis() {
      this.resetAnalysis()
      this.chartMode = 'pie'
      this.displayKey += 1
    },
    toggleChartMode() {
      this.chartMode = this.chartMode === 'pie' ? 'bar' : 'pie'
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

/* 新增：计算方法选择器样式 */
.method-selector {
  width: 100%;
  margin-bottom: 30rpx;
}

.select-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.select-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-right: 20rpx;
  flex-shrink: 0;
  width: 120rpx;
  text-align: left;
}

.picker-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding: 10rpx 15rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  background-color: #f9f9f9;
}

.picker-display text:first-child {
  font-size: 28rpx;
  color: #333;
  text-align: left;
  flex: 1;
}

.mt-10 {
  margin-top: 10rpx;
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

/* 四分类饼图样式 */
.four-category-pie {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 36rpx 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.section-header {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  display: block;
}

.pie-chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20rpx;
}

.pie-wrapper {
  position: relative;
  border-radius: 50%;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
}

.pie-chart {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  height: 20%;
  background-color: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 10rpx rgba(0, 0, 0, 0.05);
}

.pie-total {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.pie-total-value {
  font-size: 32rpx;
  color: #2c3e50;
  font-weight: bold;
  margin-top: 5rpx;
}

.pie-legend {
  width: 320rpx;
}

.legend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6rpx;
  margin-bottom: 6rpx;
  border-radius: 12rpx;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  border: 2rpx solid transparent;
  font-size: 12px;
}

.legend-item.active {
  border-color: #3498db;
  background-color: #e8f4fc;
  transform: translateX(5rpx);
}

.legend-item:active {
  opacity: 0.8;
}

.legend-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.legend-color {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.legend-details {
  display: flex;
  flex-direction: column;
}

.legend-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 3rpx;
}

.legend-percentage {
  font-size: 24rpx;
  color: #7f8c8d;
}

.legend-angle {
  font-size: 26rpx;
  color: #2c3e50;
  font-weight: 500;
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

.carotene-bar {
  background: linear-gradient(90deg, #FF6B6B, #FF6B6B);
}

.k3-bar {
  background: linear-gradient(90deg, #06D6A0, #06D6A0);
}

.d3-bar {
  background: linear-gradient(90deg, #FFD166, #FFD166);
}

.retinol-bar {
  background: linear-gradient(90deg, #4e63cd, #4e63cd);
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

/* 定量分析计算详情样式 */
.calc-detail-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  margin-top: 10rpx;
  display: block;
}

.calc-data-section {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.calc-data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.calc-data-label {
  font-size: 26rpx;
  color: #666;
}

.calc-data-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
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

  .select-label {
    font-size: 26rpx;
    width: 120rpx;
  }

  .picker-display text:first-child {
    font-size: 26rpx;
  }

  .calc-detail-text {
    font-size: 26rpx;
  }

  .calc-data-label, .calc-data-value {
    font-size: 24rpx;
  }

  /* 饼图响应式调整 */
  .pie-wrapper {
    width: 180rpx !important;
    height: 180rpx !important;
  }

  .legend-name {
    font-size: 26rpx;
  }

  .legend-percentage {
    font-size: 22rpx;
  }

  .legend-angle {
    font-size: 24rpx;
  }
}

.reanalyze-btn {
  background-color: #2f83e5;
  color: #fff;
  border: none;
  border-radius: 12rpx;
  height: 80rpx;
  font-size: 32rpx;
  padding: 0 40rpx;
  width: 100%;
}

.reanalyze-btn:active {
  opacity: 0.9;
  transform: scale(0.98);
}

.prob-chart {
  width: 100%;
}

.prob-header-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.view-hint {
  font-size: 24rpx;
  color: #999;
}

.prob-bar-wrapper {
  margin-top: 20rpx;
}

.chart-switch {
  display: flex;
  gap: 12rpx;
}

.chart-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  font-size: 32rpx;
  color: #999;
  background: #f5f5f5;
  transition: all 0.2s;
}

.chart-icon.active {
  color: #fff;
  background: #4c7ef3;
}
</style>