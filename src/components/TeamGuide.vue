<template>
  <view class="team-guide-wrapper">
    <view class="team-guide">
      <view class="card-header">
        <text class="card-icon">📝</text>
        <text class="card-title">{{ $t('teamIntro.guide.title') }}</text>
      </view>

      <view class="guide-steps">
        <view
            class="step-item"
            v-for="(step, index) in steps"
            :key="index"
        >
          <view class="step-number">{{ index + 1 }}</view>
          <text class="step-text">{{ step }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TeamGuide',
  computed: {
    steps() {
      const steps = this.$tm('teamIntro.guide.steps')
      return Array.isArray(steps) ? steps : []
    },
  },
}
</script>

<style scoped>
.team-guide-wrapper {
  width: 100%;
}

.team-guide {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  border: 2rpx solid #f0f0f0;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.card-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

/* 使用指引步骤 */
.guide-steps {
  margin-top: 8rpx;
}

.step-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.step-number {
  width: 48rpx;
  height: 48rpx;
  background: linear-gradient(135deg, #409eff, #69b1ff);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.step-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  flex: 1;
  padding-top: 8rpx;
}
</style>
