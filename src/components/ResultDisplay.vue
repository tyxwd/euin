<template>
  <view class="result-section" v-if="hasResult">
    <!-- SVM/决策树 结果展示 -->
    <view v-if="isSvmOrTree">
      <!-- 主要预测结果 -->
      <view class="result-card" :class="{ 'alarm-active': isAlarm }">
        <text class="result-title">{{ $t('result.predictedType') || '预测类型' }}:</text>
        <text class="result-text" :class="resultClass">{{ predictedTypeLabel }}</text>
      </view>

      <!-- 置信度 -->
      <view class="result-card mt-20" v-if="selectedType==='svm'">
        <text class="result-title">{{ $t('result.confidence') || '置信度' }}:</text>
        <text class="result-text">{{ (result?.confidence * 100).toFixed(2) }}%</text>
      </view>

      <!-- 数据信息 -->
      <view class="info-card mt-20">
        <text class="info-title">{{ $t('dataInfo.title') || '数据信息' }}</text>
        <view class="info-row">
          <text class="info-label">{{ $t('dataInfo.originalLength') || '原始数据长度' }}:</text>
          <text class="info-value">{{ result?.original_length }} {{ $t('dataInfo.dataPoints') || '个数据点' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">{{ $t('dataInfo.processedLength') || '处理后数据长度' }}:</text>
          <text class="info-value">{{ result?.processed_length }} {{ $t('dataInfo.dataPoints') || '个数据点' }}</text>
        </view>
      </view>

      <!-- 概率分布 -->
      <probability-display
          v-if="selectedType === 'svm' && probabilities && Object.keys(probabilities).length > 0"
          :probabilities="probabilities"
          :chart-mode="chartMode"
          @toggle-chart="toggleChartMode"
      />
    </view>

    <!-- 定量计算 结果展示 -->
    <view v-if="isQuantitative">
      <!-- 化合物名称 -->
      <view class="result-card">
        <text class="result-title">{{ $t('result.compoundName') || '化合物名称' }}:</text>
        <text class="result-text healthy">{{ result?.compound_name }}</text>
      </view>

      <!-- 浓度结果 -->
      <view class="result-card mt-20">
        <text class="result-title">{{ $t('result.concentration') || '浓度' }}:</text>
        <text class="result-text">{{ result?.concentration?.toFixed(6) }} {{ result?.unit }}</text>
      </view>

      <!-- 计算详情 -->
      <view class="result-card mt-20" v-if="calculationData">
        <text class="result-title">{{ $t('result.calculationDetails') || '计算详情' }}:</text>
        <text class="calc-detail-text">{{ result?.calculation_details }}</text>

        <view class="calc-data-section mt-10">
          <view class="calc-data-row">
            <text class="calc-data-label">{{ $t('result.intensity1') || '强度1' }}
              ({{ $t('result.rowNumPrefix') }}{{ calculationData.intensity_1.row_number }}{{
                $t('result.rowNumSuffix')
              }}):
            </text>
            <text class="calc-data-value">{{ calculationData.intensity_1.value.toFixed(6) }}</text>
          </view>
          <view class="calc-data-row">
            <text class="calc-data-label">{{ $t('result.intensity2') || '强度2' }}
              ({{ $t('result.rowNumPrefix') }}{{ calculationData.intensity_2.row_number }}{{
                $t('result.rowNumSuffix')
              }}):
            </text>
            <text class="calc-data-value">{{ calculationData.intensity_2.value.toFixed(6) }}</text>
          </view>
          <view class="calc-data-row">
            <text class="calc-data-label">{{ $t('result.intensityRatio') || '强度比值' }} (y):</text>
            <text class="calc-data-value">{{ calculationData.ratio_y.toFixed(6) }}</text>
          </view>
          <view class="calc-data-row">
            <text class="calc-data-label">{{ $t('result.formula') || '计算公式' }}:</text>
            <text class="calc-data-value">{{ calculationData.formula_parameters.formula }}</text>
          </view>
          <view class="calc-data-row">
            <text class="calc-data-label">{{ $t('result.formulaParams') || '公式参数' }}:</text>
            <text class="calc-data-value">a = {{ calculationData.formula_parameters.a }}, b =
              {{ calculationData.formula_parameters.b }}
            </text>
          </view>
        </view>
      </view>

      <!-- 质量控制信息 -->
      <view class="info-card mt-20" v-if="qualityInfo">
        <text class="info-title">{{ $t('result.qualityInfo') || '质量控制信息' }}</text>
        <view class="info-row">
          <text class="info-label">{{ $t('result.dataValidation') || '数据验证' }}:</text>
          <text class="info-value">{{
              qualityInfo.data_validation === 'passed' ? ($t('result.passed') || '通过') : ($t('result.failed') || '失败')
            }}
          </text>
        </view>
        <view class="info-row">
          <text class="info-label">{{ $t('result.totalRows') || '文件总行数' }}:</text>
          <text class="info-value">{{ qualityInfo.rows_checked }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">{{ $t('result.minRequiredRows') || '最小要求行数' }}:</text>
          <text class="info-value">{{ qualityInfo.minimum_required }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">{{ $t('result.intensityRatio') || '强度比值' }}:</text>
          <text class="info-value">{{ qualityInfo.intensity_ratio.toFixed(6) }}</text>
        </view>
      </view>
    </view>

    <!-- 文件信息 -->
    <file-info-display
        v-if="fileInfo"
        :file-info="fileInfo"
        :result="result"
        :is-quantitative="isQuantitative"
    />

    <!-- 重新分析按钮 -->
    <view class="reanalyze-section mt-20">
      <button class="reanalyze-btn" @click="$emit('reanalyze')">{{ $t('action.reanalyze') || '重新分析' }}</button>
    </view>
  </view>
</template>

<script>
import ProbabilityDisplay from './ProbabilityDisplay.vue'
import FileInfoDisplay from './FileInfoDisplay.vue'
import {RESULT_CLASSES} from '@/config/models'

export default {
  name: 'ResultDisplay',
  components: {
    ProbabilityDisplay,
    FileInfoDisplay
  },
  props: {
    hasResult: Boolean,
    isSvmOrTree: Boolean,
    isQuantitative: Boolean,
    result: Object,
    probabilities: Object,
    calculationData: Object,
    qualityInfo: Object,
    fileInfo: Object,
    selectedType: String,
    chartMode: String
  },
  data() {
    return {
      vibrationActive: false // 标记是否正在执行 5s 震动，防止重复触发
    }
  },
  computed: {
    resultClass() {
      const type = this.result?.predicted_type || ''
      if (RESULT_CLASSES.healthy.includes(type)) return 'healthy'
      if (RESULT_CLASSES.subHealthy.includes(type)) return 'sub-healthy'
      if (RESULT_CLASSES.ill.includes(type)) return 'ill'
      return 'ill'
    },
    predictedTypeLabel() {
      const type = this.result?.predicted_type || ''
      return this.$t(`result.predictedTypes.${type}`, type)
    },
    isAlarm() {
      return this.result?.alarm_type
    }
  },
  watch: {
    isAlarm: {
      handler(newVal) {
        // 只有当 isAlarm 从无变为有（字符串）时，触发一次 5s 震动
        if (newVal && !this.vibrationActive) {
          this.triggerFiveSecondVibration();
        }
      },
      immediate: true
    }
  },
  methods: {
    toggleChartMode() {
      this.$emit('toggle-chart')
    },
    triggerFiveSecondVibration() {
      this.vibrationActive = true;

      // 每 400ms 触发一次长震动，连续触发模拟长震动感
      const intervalId = setInterval(() => {
        uni.vibrateLong();
      }, 400);

      // 5秒后停止震动逻辑
      setTimeout(() => {
        clearInterval(intervalId);
        // 如果需要彻底静止，部分安卓机型支持，iOS不支持
        // this.vibrationActive = false;
      }, 3000);
    },
  }
}
</script>

<style scoped>
/* 结果区域样式 */
.result-section {
  width: 100%;
  margin-bottom: 60rpx;
  transition: all 0.3s ease;
}


/* 通用卡片样式 */
.result-card, .info-card {
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
.info-title {
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

.reanalyze-section {
  margin-top: 20rpx;
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

/* 当处于告警状态时执行动画 */
.alarm-active {
  animation: alarm-flash 1.5s infinite; /* 1.5秒循环一次 */
  border: 2rpx solid rgba(244, 67, 54, 0.3); /* 增加一层淡红边框增强视觉提示 */
}

/* 警示闪烁动画定义 */
@keyframes alarm-flash {
  0% {
    background-color: transparent;
  }
  50% {
    /* 淡淡的红色警告色 */
    background-color: rgba(244, 67, 54, 0.15);
  }
  100% {
    background-color: transparent;
  }
}
</style>