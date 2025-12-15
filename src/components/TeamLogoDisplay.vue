<template>
  <view class="team-logo-display" v-if="show">
    <!-- 标题部分 -->
    <view class="logo-header">
      <text class="logo-title">{{ $t('teamLogo.title') }}</text>
      <text class="logo-subtitle">{{ $t('teamLogo.subtitle') }}</text>
    </view>

    <!-- Logo 展示区域 -->
    <view class="logo-grid">
      <view
        class="logo-card"
        v-for="(logo, index) in logos"
        :key="index"
      >
        <image
          class="logo-img"
          :src="logo.src"
          :alt="logo.name"
          mode="aspectFit"
        />
        <view class="logo-info">
          <view class="logo-name">{{ logo.name }}</view>
          <view class="logo-desc">{{ logo.desc }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TeamLogoDisplay',
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    logos() {
      // 从 i18n 文件中获取 logo 数组
      const items = this.$tm('teamLogo.items')
      return Array.isArray(items) ? items : []
    },
  },
}
</script>

<style scoped>
.team-logo-display {
  width: 100%;
  padding: 0 0 100rpx 0 ;
}

/* 标题 */
.logo-header {
  text-align: center;
  margin-bottom: 60rpx;
}

.logo-title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 16rpx;
}

.logo-subtitle {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

/* 网格布局 */
.logo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

/* 每个 logo 卡片 */
.logo-card {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  border: 2rpx solid #f0f0f0;
  text-align: center;
  padding: 30rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-img {
  width: 240rpx;
  height: 240rpx;
  object-fit: contain;
  margin-bottom: 16rpx;
}

.logo-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.logo-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}
</style>
