<template>
  <view class="file-info-card mt-20">
    <text class="file-info-title">{{ $t('fileInfo.title') || '文件信息' }}</text>
    <view class="file-info-row">
      <text class="file-info-label">{{ $t('fileInfo.fileType') || '文件类型' }}:</text>
      <text class="file-info-value">{{ getFileTypeText(fileInfo.file_type) }}</text>
    </view>
    <!-- 定量计算专属文件信息 -->
    <view class="file-info-row" v-if="isQuantitative && fileInfo.compound_type">
      <text class="file-info-label">{{ $t('fileInfo.compoundType') || '化合物类型' }}:</text>
      <text class="file-info-value">{{ getModelLabel(fileInfo.compound_type) }}</text>
    </view>
    <view class="file-info-row" v-if="isQuantitative && fileInfo.total_rows">
      <text class="file-info-label">{{ $t('fileInfo.totalRows') || '文件总行数' }}:</text>
      <text class="file-info-value">{{ fileInfo.total_rows }}</text>
    </view>
    <!-- 计算方法和模型 -->
    <view class="file-info-row" v-if="result?.calc_method">
      <text class="file-info-label">{{ $t('fileInfo.calcMethod') || '计算方法' }}:</text>
      <text class="file-info-value">{{ getTypeLabel(result.calc_method) }}</text>
    </view>
    <view class="file-info-row" v-if="result?.calc_model">
      <text class="file-info-label">{{ $t('fileInfo.calcModel') || '计算模型' }}:</text>
      <text class="file-info-value">{{ getModelLabel(result.calc_model) }}</text>
    </view>
  </view>
</template>

<script>
import { SVM_MODEL_CONFIGS, QUANTITATIVE_COMPOUND_CONFIGS, TREE_MODEL_CONFIGS, CALCULATION_TYPES } from '@/config/models'

export default {
  name: 'FileInfoDisplay',
  props: {
    fileInfo: Object,
    result: Object,
    isQuantitative: Boolean
  },
  methods: {
    getFileTypeText(fileType) {
      return fileType === 'custom' ? (this.$t('fileInfo.customFile') || '自定义文件') : (this.$t('fileInfo.defaultFile') || '默认文件')
    },

    getTypeLabel(type) {
      if (!type) return ''
      const item = CALCULATION_TYPES.find(item => item.value === type)
      return item ? this.$t(item.label) || type : type
    },

    getModelLabel(model) {
      if (!model) return '';

      const currentType = this.result?.calc_method;

      switch (currentType) {
        case 'svm':
          return this.$t(`method.model.${model}`) || SVM_MODEL_CONFIGS[model]?.name || model;
        case 'quantitative':
          return this.$t(`method.model.${model}`) || QUANTITATIVE_COMPOUND_CONFIGS[model]?.name || model;
        case 'tree':
          return this.$t(`method.model.${model}`) || TREE_MODEL_CONFIGS[model]?.name || model;
        default:
          return model;
      }
    }
  }
}
</script>

<style scoped>
.file-info-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 36rpx 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.file-info-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
  display: block;
}

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
</style>