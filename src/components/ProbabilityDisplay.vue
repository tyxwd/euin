<template>
  <view class="probabilities-card mt-20">
    <view class="prob-header-line">
      <text class="prob-title">{{ $t('probability.title') || '概率分布' }}</text>
      <view class="chart-switch">
        <view
            class="chart-icon"
            :class="{ active: chartMode === 'pie' }"
            @click.stop="toggleChart"
        >
          <icon-pie></icon-pie>
        </view>
        <view
            class="chart-icon"
            :class="{ active: chartMode === 'bar' }"
            @click.stop="toggleChart"
        >
          <icon-bar></icon-bar>
        </view>
      </view>
    </view>

    <!-- 饼图 -->
    <div v-if="chartMode === 'pie'" class="prob-chart">
      <view class="pie-chart-container">
        <view class="pie-wrapper" :style="{ width: pieSize + 'px', height: pieSize + 'px' }">
          <view class="pie-chart" :style="pieStyle">
            <view class="pie-center">
            </view>
          </view>
        </view>
        <view class="pie-legend">
          <view
              class="legend-item"
              v-for="(category, index) in pieCategories"
              :key="index"
              :class="{ 'active': activeLegend === index }"
          >
            <view class="legend-info">
              <view class="legend-color" :style="{ backgroundColor: category.color }"></view>
              <view class="legend-details">
                <text class="legend-name">{{ category.name }}</text>
              </view>
            </view>
            <text class="legend-angle">{{ category.percentage }}%</text>
          </view>
        </view>
      </view>
    </div>

    <!-- 条形图 -->
    <view v-if="chartMode === 'bar'" class="prob-bar-wrapper">
      <view class="prob-item" v-for="(prob, className) in probabilities" :key="className">
        <view class="prob-header">
          <text class="prob-name">{{ formatClassName(className) }}</text>
          <text class="prob-percent">{{ (prob * 100).toFixed(2) }}%</text>
        </view>
        <view class="prob-bar">
          <view
              class="prob-bar-fill"
              :style="{ width: (prob * 100) + '%', backgroundColor: getColor(className) }"
          ></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import IconPie from "@/icons/icon-pie.vue";
import IconBar from "@/icons/icon-bar.vue";
import { FOUR_CATEGORY_COLORS, EXTENDED_COLORS, CLASS_NAME_MAPPINGS } from '@/config/models'

export default {
  name: 'ProbabilityDisplay',
  components: {
    IconPie,
    IconBar
  },
  props: {
    probabilities: Object,
    chartMode: String
  },
  data() {
    return {
      pieSize: 120,
      activeLegend: null
    }
  },
  computed: {
    pieCategories() {
      if (!this.probabilities || Object.keys(this.probabilities).length === 0) {
        return []
      }

      const categories = []
      let currentAngle = 0

      const probKeys = Object.keys(this.probabilities).filter(key => key.startsWith('prob_'))

      probKeys.forEach((probKey, index) => {
        const categoryKey = probKey.replace('prob_', '')
        const probability = this.probabilities[probKey] || 0
        const percentage = (probability * 100).toFixed(2)
        const angle = (probability * 360).toFixed(0)

        const displayName = this.$t(CLASS_NAME_MAPPINGS[categoryKey]) || categoryKey
        const color = FOUR_CATEGORY_COLORS[categoryKey] || EXTENDED_COLORS[index % EXTENDED_COLORS.length]

        categories.push({
          name: displayName,
          value: probability,
          percentage: percentage,
          angle: angle,
          color: color,
        })
      })

      categories.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))

      categories.forEach(category => {
        const angle = parseFloat(category.angle)
        category.startAngle = currentAngle
        category.endAngle = currentAngle + angle
        currentAngle += angle
      })

      return categories
    },

    pieStyle() {
      if (this.pieCategories.length === 0) {
        return {}
      }

      let gradient = ''
      this.pieCategories.forEach((category, index) => {
        const startAngle = category.startAngle
        const endAngle = category.endAngle

        if (index === 0) {
          gradient += `${category.color} ${startAngle}deg ${endAngle}deg`
        } else {
          gradient += `, ${category.color} ${startAngle}deg ${endAngle}deg`
        }
      })

      return {
        background: `conic-gradient(${gradient})`,
        transform: 'rotate(0deg)',
        transition: 'none'
      }
    }
  },
  methods: {
    toggleChart() {
      this.$emit('toggle-chart')
    },

    formatClassName(className) {
      const name = className.replace('prob_', '')
      return this.$t(CLASS_NAME_MAPPINGS[name]) || name
    },

    getColor(className) {
      const name = className.replace('prob_', '')
      if (FOUR_CATEGORY_COLORS[name]) {
        return FOUR_CATEGORY_COLORS[name]
      }
      const allCategories = Object.keys(this.probabilities || {}).filter(key => key.startsWith('prob_'))
      const index = allCategories.indexOf(className)
      return EXTENDED_COLORS[index % EXTENDED_COLORS.length]
    }
  }
}
</script>

<style scoped>
.probabilities-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 36rpx 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.prob-header-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.prob-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
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

.prob-chart {
  width: 100%;
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
  box-shadow: inset 0 0 10rpx rgba(0, 0, 0, 0.05);
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

.legend-angle {
  font-size: 26rpx;
  color: #2c3e50;
  font-weight: 500;
}

.prob-bar-wrapper {
  margin-top: 20rpx;
}

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
</style>