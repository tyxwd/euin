<template>
  <view class="team-intro" v-if="show">
    <!-- 标题 -->
    <view class="intro-header">
      <text class="intro-title">{{ $t('teamIntro.title') }}</text>
      <text class="intro-subtitle">{{ $t('teamIntro.subtitle') }}</text>
    </view>

    <!-- 内容 -->
    <view class="intro-content">
      <!-- 团队使命 -->
      <view class="intro-card">
        <view class="card-header">
          <text class="card-icon">🎯</text>
          <text class="card-title">{{ $t('teamIntro.mission.title') }}</text>
        </view>
        <text class="card-desc">{{ $t('teamIntro.mission.description') }}</text>
      </view>

      <!-- 技术优势 -->
      <view class="intro-card">
        <view class="card-header">
          <text class="card-icon">🚀</text>
          <text class="card-title">{{ $t('teamIntro.technology.title') }}</text>
        </view>
        <view class="tech-list">
          <view
            class="tech-item"
            v-for="(tech, index) in technologyFeatures"
            :key="index"
          >
            <text class="tech-dot">•</text>
            <text class="tech-text">{{ tech }}</text>
          </view>
        </view>
      </view>

      <!-- 核心成员 -->
<!--      <view class="intro-card">-->
<!--        <view class="card-header">-->
<!--          <text class="card-icon">👥</text>-->
<!--          <text class="card-title">{{ $t('teamIntro.team.title') }}</text>-->
<!--        </view>-->
<!--        <view class="team-grid">-->
<!--          <view-->
<!--            class="team-member"-->
<!--            v-for="member in teamMembers"-->
<!--            :key="member.name"-->
<!--          >-->
<!--            <text class="member-avatar">{{ member.avatar }}</text>-->
<!--            <view class="member-info">-->
<!--              <text class="member-name">{{ member.name }}</text>-->
<!--              <text class="member-role">{{ member.role }}</text>-->
<!--            </view>-->
<!--          </view>-->
<!--        </view>-->
<!--      </view>-->
    </view>
  </view>
</template>

<script>

export default {
  name: 'TeamIntro',
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    technologyFeatures() {
      const features = this.$tm('teamIntro.technology.features')
      return Array.isArray(features) ? features : []
    },
    teamMembers() {
      const members = this.$tm('teamIntro.team.members')
      return Array.isArray(members) ? members : []
    },
  },
}
</script>


<style scoped>
.team-intro {
  width: 100%;
  padding: 40rpx 0 0 ;
}

/* 标题区域 */
.intro-header {
  text-align: center;
  margin-bottom: 60rpx;
}

.intro-title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 16rpx;
}

.intro-subtitle {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

/* 内容区域 */
.intro-content {
  margin-bottom: 50rpx;
}

.intro-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx 32rpx;
  margin-bottom: 30rpx;
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

.card-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

/* 技术列表 */
.tech-list {
  margin-top: 8rpx;
}

.tech-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.tech-dot {
  color: #409eff;
  font-size: 24rpx;
  margin-right: 12rpx;
  margin-top: 8rpx;
}

.tech-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  flex: 1;
}

/* 团队成员 */
.team-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
  margin-top: 8rpx;
}

.team-member {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border: 1rpx solid #e9ecef;
}

.member-avatar {
  font-size: 40rpx;
  margin-right: 16rpx;
}

.member-info {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 4rpx;
}

.member-role {
  font-size: 24rpx;
  color: #666;
}

/* 使用指引 */
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

/* 开始按钮区域 */
.start-section {
  text-align: center;
  margin-top: 40rpx;
}

.start-btn {
  background: linear-gradient(135deg, #409eff, #69b1ff);
  color: #fff;
  border: none;
  border-radius: 12rpx;
  height: 90rpx;
  font-size: 34rpx;
  font-weight: 600;
  padding: 0 60rpx;
  box-shadow: 0 8rpx 24rpx rgba(64, 158, 255, 0.3);
}

.start-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}
</style>
