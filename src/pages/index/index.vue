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
      <!-- 新增：计算方法选择区域 -->
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
      <!-- SVM/决策树 结果展示 -->
      <view v-if="isSvmOrTree">
        <!-- 主要预测结果 -->
        <view class="result-card">
          <text class="result-title">{{ $t('result.predictedType') || '预测类型' }}:</text>
          <text class="result-text" :class="resultClass">{{ result.predicted_type }}</text>
        </view>

        <!-- 置信度 -->
        <view class="result-card mt-20" v-if="selectedType==='svm'">
          <text class="result-title">{{ $t('result.confidence') || '置信度' }}:</text>
          <text class="result-text">{{ (result.confidence * 100).toFixed(2) }}%</text>
        </view>

        <!--        &lt;!&ndash; 四分类饼图展示 &ndash;&gt;-->
        <!--        <view class="four-category-pie mt-20" v-if="probabilities && Object.keys(probabilities).length >= 4">-->
        <!--          <view class="section-header">-->
        <!--            <text class="section-title">{{ $t('result.categoryDistribution') || '分类分布' }}</text>-->
        <!--          </view>-->

        <!--          <view class="pie-chart-container">-->
        <!--            &lt;!&ndash; 饼图 &ndash;&gt;-->
        <!--            <view class="pie-wrapper" :style="{ width: pieSize + 'px', height: pieSize + 'px' }">-->
        <!--              <view class="pie-chart" :style="pieStyle">-->
        <!--                <view class="pie-center">-->
        <!--                  <text class="pie-total">总计</text>-->
        <!--                  <text class="pie-total-value">100%</text>-->
        <!--                </view>-->
        <!--              </view>-->
        <!--            </view>-->

        <!--            &lt;!&ndash; 图例 &ndash;&gt;-->
        <!--            <view class="pie-legend">-->
        <!--              <view-->
        <!--                class="legend-item"-->
        <!--                v-for="(category, index) in pieCategories"-->
        <!--                :key="index"-->
        <!--                @click="toggleLegend(index)"-->
        <!--                :class="{ 'active': activeLegend === index }"-->
        <!--              >-->
        <!--                <view class="legend-info">-->
        <!--                  <view class="legend-color" :style="{ backgroundColor: category.color }"></view>-->
        <!--                  <view class="legend-details">-->
        <!--                    <text class="legend-name">{{ category.name }}</text>-->
        <!--                    <text class="legend-percentage">{{ category.percentage }}%</text>-->
        <!--                  </view>-->
        <!--                </view>-->
        <!--                <text class="legend-angle">{{ category.angle }}°</text>-->
        <!--              </view>-->
        <!--            </view>-->
        <!--          </view>-->
        <!--        </view>-->

        <!-- 数据信息 -->
        <view class="info-card mt-20">
          <text class="info-title">{{ $t('dataInfo.title') || '数据信息' }}</text>
          <view class="info-row">
            <text class="info-label">{{ $t('dataInfo.originalLength') || '原始数据长度' }}:</text>
            <text class="info-value">{{ result.original_length }} {{ $t('dataInfo.dataPoints') || '个数据点' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">{{ $t('dataInfo.processedLength') || '处理后数据长度' }}:</text>
            <text class="info-value">{{ result.processed_length }} {{ $t('dataInfo.dataPoints') || '个数据点' }}</text>
          </view>
        </view>

        <!-- 概率分布（扇形 / 条形切换） -->
        <view
            class="probabilities-card mt-20"
            v-if="selectedType === 'svm' && probabilities && Object.keys(probabilities).length > 0"
        >
          <view class="prob-header-line">
            <text class="prob-title">
              {{ $t('probability.title') || '概率分布' }}
            </text>

            <view class="chart-switch">
              <!-- 扇形图图标 -->
              <view
                  class="chart-icon"
                  :class="{ active: chartMode === 'pie' }"
                  @click.stop="toggleChartMode"
              >
                <icon-pie></icon-pie>
              </view>
              <!-- 条形图图标 -->
              <view
                  class="chart-icon"
                  :class="{ active: chartMode === 'bar' }"
                  @click.stop="toggleChartMode"
              >
                <icon-bar></icon-bar>
              </view>
            </view>
          </view>

          <!-- 图表容器 -->
          <div v-if="chartMode === 'pie'"
               class="prob-chart"
          >
            <view class="pie-chart-container">
              <!-- 饼图 -->
              <view class="pie-wrapper" :style="{ width: pieSize + 'px', height: pieSize + 'px' }">
                <view class="pie-chart" :style="pieStyle">
                  <view class="pie-center">
                    <!--                  <text class="pie-total">总计</text>-->
                    <!--                  <text class="pie-total-value">100%</text>-->
                  </view>
                </view>
              </view>

              <!-- 图例 -->
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
                      <!--                      <text class="legend-percentage">{{ category.percentage }}%</text>-->
                    </view>
                  </view>
                  <text class="legend-angle">{{ category.percentage }}%</text>
                </view>
              </view>
            </view>
          </div>

          <!-- 条形图（你原来的样式，复用） -->
          <view v-if="chartMode === 'bar'" class="prob-bar-wrapper">
            <view class="prob-item" v-for="(prob, className) in probabilities" :key="className">
              <view class="prob-header">
                <text class="prob-name">{{ formatClassName(className) }}</text>
                <text class="prob-percent">{{ (prob * 100).toFixed(2) }}%</text>
              </view>
              <view class="prob-bar">
                <view
                    class="prob-bar-fill"
                    :style="{ width: (prob * 100) + '%' }"
                    :class="getColorClass(className)"
                ></view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 定量计算 结果展示 -->
      <view v-if="isQuantitative">
        <!-- 化合物名称 -->
        <view class="result-card">
          <text class="result-title">{{ $t('result.compoundName') || '化合物名称' }}:</text>
          <text class="result-text healthy">{{ result.compound_name }}</text>
        </view>

        <!-- 浓度结果 -->
        <view class="result-card mt-20">
          <text class="result-title">{{ $t('result.concentration') || '浓度' }}:</text>
          <text class="result-text">{{ result.concentration.toFixed(6) }} {{ result.unit }}</text>
        </view>

        <!-- 计算详情 -->
        <view class="result-card mt-20" v-if="calculationData">
          <text class="result-title">{{ $t('result.calculationDetails') || '计算详情' }}:</text>
          <text class="calc-detail-text">{{ result.calculation_details }}</text>

          <view class="calc-data-section mt-10">
            <view class="calc-data-row">
              <text class="calc-data-label">{{ $t('result.intensity1') || '强度1' }}
                (第{{ calculationData.intensity_1.row_number }}行):
              </text>
              <text class="calc-data-value">{{ calculationData.intensity_1.value.toFixed(6) }}</text>
            </view>
            <view class="calc-data-row">
              <text class="calc-data-label">{{ $t('result.intensity2') || '强度2' }}
                (第{{ calculationData.intensity_2.row_number }}行):
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

      <!-- 文件信息（通用） -->
      <view class="file-info-card mt-20" v-if="fileInfo">
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
        <!-- 计算方法和模型（通用） -->
        <view class="file-info-row" v-if="result.calc_method">
          <text class="file-info-label">{{ $t('fileInfo.calcMethod') || '计算方法' }}:</text>
          <text class="file-info-value">{{ getTypeLabel(result.calc_method) }}</text>
        </view>
        <view class="file-info-row" v-if="result.calc_model">
          <text class="file-info-label">{{ $t('fileInfo.calcModel') || '计算模型' }}:</text>
          <text class="file-info-value">{{ getModelLabel(result.calc_model) }}</text>
        </view>
      </view>

      <!-- 重新分析按钮 -->
      <view class="reanalyze-section mt-20">
        <button class="reanalyze-btn" @click="resetAnalysis">{{ $t('action.reanalyze') || '重新分析' }}</button>
      </view>
    </view>

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
import * as echarts from 'echarts'
import fileTypes from '@/config/fileTypes.js'
import Settings from "@/config/settings";
import IconPie from "@/icons/icon-pie.vue";
import IconBar from "@/icons/icon-bar.vue";
import TeamGuide from "@/components/TeamGuide.vue";
import TeamLogoDisplay from "@/components/TeamLogoDisplay.vue";
import TeamIntro from "@/components/TeamIntro.vue";
import {sleep} from "@/utils";

const languageConfig = {
  'en': {name: 'English', locale: 'en'},
  'zh-CN': {name: '中文（简体）', locale: 'zh-CN'},
}

// SVM模型配置
const SVM_MODEL_CONFIGS = {
  'default': {name: '默认模型'},
  'brca': {name: 'BRCA模型'},
  'brca_mix': {name: 'BRCA混合模型'},
  'p': {name: 'P模型'},
  'p_mix': {name: 'P混合模型'},
  'hpv': {name: 'HPV模型'}
}

// 定量计算模型配置
const QUANTITATIVE_COMPOUND_CONFIGS = {
  'retinol': {name: '视黄醇'},
  'vitamin_k': {name: '维生素K'},
  'vitamin_d': {name: '维生素D'},
  'carotene': {name: '胡萝卜素'},
  'brca1_mt': {name: 'BRCA1突变型'},
  'brca1_wt': {name: 'BRCA1野生型'},
  'p16': {name: 'p16蛋白'},
  'p21': {name: 'p21蛋白'},
  'p53': {name: 'p53蛋白'}
}

// 决策树模型配置
const TREE_MODEL_CONFIGS = {
  "hu_r": {name: "胡萝卜素和视黄醇混合"},
  "hu_vd": {name: "胡萝卜素和VD混合"},
  "hu_vd_vk": {name: "胡萝卜素和VD、VK混合"},
  "hu_vk": {name: "胡萝卜素和VK混合"},
  "vk_r_vd": {name: "视黄醇和VK、VD混合"}
}

// 四分类颜色配置
const FOUR_CATEGORY_COLORS = {
  'β-carotene': '#FF6B6B',      // 红色
  'retinol': '#4e63cd',         // 青色
  'VitaminD3': '#FFD166',       // 黄色
  'VitaminK3': '#06D6A0'        // 绿色
}

export default {
  components: {
    TeamGuide,
    TeamIntro,
    TeamLogoDisplay,
    IconPie,
    IconBar
  },

  data() {
    return {
      fileName: '',
      fileTempPath: '',
      result: null,
      probabilities: null,
      fileInfo: null,
      isLoading: false,
      baseUrl: Settings.baseUrl,
      languageIndex: 0,
      languageOptions: [],
      currentLanguage: {},
      showLanguageModal: false,
      // 新增：计算方法相关
      selectedType: 'svm', // svm / quantitative / tree
      selectedTypeIndex: 0, // picker索引
      selectedModel: 'default', // 模型key
      selectedModelIndex: 0, // 模型picker索引
      typeOptions: [
        {value: 'svm', label: this.$t('method.type.svm') || 'SVM算法'},
        {value: 'quantitative', label: this.$t('method.type.quantitative') || '定量计算'},
        {value: 'tree', label: this.$t('method.type.tree') || '决策树模型'}
      ],
      modelOptions: [], // 动态生成的模型选项
      // 定量计算专属数据
      calculation_data: null,
      quality_info: null,

      chartMode: 'pie',        // pie | bar
      probChart: null,

      // 新增：四分类饼图相关数据
      pieSize: 120,            // 饼图大小
      activeLegend: null,      // 当前选中的图例
      pieAnimation: false      // 饼图动画开关
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
    },
    // 判断是否是SVM/决策树类型
    isSvmOrTree() {
      return this.hasResult && ['svm', 'tree'].includes(this.result.calc_method)
    },
    // 判断是否是定量计算类型
    isQuantitative() {
      return this.hasResult && this.result.calc_method === 'quantitative'
    },
    // 快捷访问定量计算数据
    calculationData() {
      return this.calculation_data
    },
    qualityInfo() {
      return this.quality_info
    },

    // 新增：四分类饼图相关计算属性
    pieCategories() {
      // 四分类显示名称映射
      const CATEGORY_NAME_MAP = {
        'VitaminD3': this.$t('probability.vitaminD3') || '维生素D3',
        'VitaminK3': this.$t('probability.vitaminK3') || '维生素K3',
        'retinol': this.$t('probability.retinol') || '视黄醇',
        'β-carotene': this.$t('probability.betaCarotene') || 'β-胡萝卜素'
      }

      if (!this.probabilities || Object.keys(this.probabilities).length < 4) {
        return []
      }

      const categories = []
      let currentAngle = 0

      // 确保按照固定的顺序显示
      const categoryOrder = ['β-carotene', 'retinol', 'VitaminD3', 'VitaminK3']

      categoryOrder.forEach(categoryKey => {
        const probability = this.probabilities[`prob_${categoryKey}`] || 0
        const percentage = (probability * 100).toFixed(2)
        const angle = (probability * 360).toFixed(0)

        categories.push({
          name: CATEGORY_NAME_MAP[categoryKey] || categoryKey,
          value: probability,
          percentage: percentage,
          angle: angle,
          color: FOUR_CATEGORY_COLORS[categoryKey] || '#CCCCCC',
          // 这里暂时不设置 startAngle 和 endAngle，后面会重新计算
        })
      })

      // 按照 percentage 从大到小排序
      categories.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))

      // 重新计算扇形角度
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
        transform: this.pieAnimation ? 'rotate(360deg)' : 'rotate(0deg)',
        transition: this.pieAnimation ? 'transform 20s linear' : 'none'
      }
    }
  },

  onLoad() {
    this.initLanguage()
    // 初始化模型选项
    this.updateModelOptions(this.selectedType)
  },

  onUnload() {
    if (this.probChart) {
      this.probChart.dispose()
      this.probChart = null
    }
  },

  watch: {
    '$i18n.locale': {
      handler() {
        uni.setNavigationBarTitle({
          title: this.$t('page.title')
        })
        // 语言切换时更新选择器标签
        this.updateTypeOptionsI18n()
      },
      immediate: true
    },
    selectedType(newVal) {
      this.updateModelOptions(newVal)
    },
    probabilities(newVal) {
      if (newVal && Object.keys(newVal).length >= 4) {
        // 当有概率数据时，可以添加一些初始化逻辑
        this.calculatePieData()
      }
    }
  },

  methods: {
    // 团队介绍开始按钮点击事件
    onTeamIntroStart() {
      console.log('用户点击开始使用按钮')
    },

    // 重置分析
    resetAnalysis() {
      this.result = null
      this.probabilities = null
      this.fileInfo = null
      this.fileName = ''
      this.fileTempPath = ''
      this.calculation_data = null
      this.quality_info = null
      // 重置计算方法选择
      this.selectedType = 'svm'
      this.selectedTypeIndex = 0
      this.updateModelOptions('svm')
      this.chartMode = 'pie'
      // 重置饼图数据
      this.activeLegend = null
      this.pieAnimation = false

      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    },

    // 新增：计算饼图数据
    calculatePieData() {
      // 数据已经在计算属性中处理
      // 这里可以添加其他处理逻辑
    },

    // 新增：切换饼图动画
    togglePieAnimation() {
      this.pieAnimation = !this.pieAnimation
    },

    // 初始化语言设置
    initLanguage() {
      this.languageOptions = Object.values(languageConfig)
      let savedLang = uni.getStorageSync('preferredLanguage')
      if (savedLang === 'zh') savedLang = 'zh-CN'
      const defaultLang = 'en'
      this.setLanguage(defaultLang)
    },

    // 优化系统语言识别
    getSystemLanguage() {
      try {
        const systemLang = uni.getSystemInfoSync().language || 'zh-CN'
        const langKeys = Object.keys(languageConfig)
        if (langKeys.includes(systemLang)) return systemLang
        const shortLang = systemLang.split('-')[0]
        const matchedKey = langKeys.find(key => key.startsWith(shortLang))
        return matchedKey || 'zh-CN'
      } catch (e) {
        return 'zh-CN'
      }
    },

    // 设置语言
    setLanguage(lang) {
      if (languageConfig[lang]) {
        this.$i18n.locale = lang
        this.currentLanguage = languageConfig[lang]
        this.languageIndex = this.languageOptions.findIndex(item => item.locale === lang)
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

    // 新增：更新计算方法选项的国际化
    updateTypeOptionsI18n() {
      this.typeOptions = [
        {value: 'svm', label: this.$t('method.type.svm') || 'SVM算法'},
        {value: 'quantitative', label: this.$t('method.type.quantitative') || '定量计算'},
        {value: 'tree', label: this.$t('method.type.tree') || '决策树模型'}
      ]
    },

    // 更新模型选项
    updateModelOptions(type) {
      switch (type) {
        case 'svm':
          this.modelOptions = Object.entries(SVM_MODEL_CONFIGS).map(([key, config]) => ({
            value: key,
            label: this.$t(`method.model.${key}`) || config.name
          }));
          break;
        case 'quantitative':
          this.modelOptions = Object.entries(QUANTITATIVE_COMPOUND_CONFIGS).map(([key, config]) => ({
            value: key,
            label: this.$t(`method.model.${key}`) || config.name
          }));
          break;
        case 'tree':
          this.modelOptions = Object.entries(TREE_MODEL_CONFIGS).map(([key, config]) => ({
            value: key,
            label: this.$t(`method.model.${key}`) || config.name
          }));
          break;
        default:
          this.modelOptions = [{value: 'default', label: '默认模型'}];
      }
      // 重置模型选择为第一个选项
      this.selectedModel = this.modelOptions[0]?.value || 'default'
      this.selectedModelIndex = 0
    },

    // 新增：计算方法选择变化
    onTypeChange(e) {
      const index = e.detail.value
      this.selectedType = this.typeOptions[index].value
      this.selectedTypeIndex = index
    },

    // 模型选择变化
    onModelChange(e) {
      const index = e.detail.value
      this.selectedModel = this.modelOptions[index].value
      this.selectedModelIndex = index
    },

    // 新增：获取计算方法显示标签
    getTypeLabel(type) {
      if (!type) return ''
      const item = this.typeOptions.find(item => item.value === type)
      return item?.label || type
    },

    // 获取模型显示标签
    getModelLabel(model) {
      if (!model) return '';

      // 根据当前选择的类型或者结果中的类型来获取正确的配置
      const currentType = this.selectedType || (this.result && this.result.calc_method);

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
    },

    chooseFile() {
      // #ifdef H5
      // H5方案：使用input元素
      uni.chooseFile({
        count: 1,
        type: 'file',
        success: (res) => {
          const file = res.tempFiles[0];
          this.fileName = file.name;
          this.fileTempPath = res.tempFilePaths[0];
          this.uploadToBackend();
        },
        fail: (err) => {
          console.error(err);
          uni.showToast({title: '选择文件失败', icon: 'none'});
        }
      });
      // #endif

      // #ifdef APP-PLUS
      // APP方案：使用原生能力（兼容所有旧版本）
      this.openNativeFileChooser();
      // #endif
    },

    // ========== APP端：原生文件选择 ==========
    openNativeFileChooser() {
      const main = plus.android.runtimeMainActivity();
      const Intent = plus.android.importClass('android.content.Intent');

      const intent = new Intent(Intent.ACTION_GET_CONTENT);
      intent.setType("*/*"); // 所有文件类型（可限定为text/plain）
      intent.addCategory(Intent.CATEGORY_OPENABLE);

      // 选择文件后的回调
      main.onActivityResult = (requestCode, resultCode, data) => {
        console.log("requestCode:", requestCode, "resultCode:", resultCode);
        if (requestCode === 100 && resultCode === -1 && data) { // -1 = RESULT_OK
          const uri = data.getData();
          this.readTxtFileByUriForAndroid10(uri);
        }
      };

      main.startActivityForResult(intent, 100);
    },

    // ========== 适配Android 10+：通过URI直接读取（无需真实路径） ==========
    readTxtFileByUriForAndroid10(uri) {
      try {
        const main = plus.android.runtimeMainActivity();
        // 1. 获取ContentResolver对象（必须通过plus.android.invoke）
        const contentResolver = main.getContentResolver();
        if (!contentResolver) {
          console.error('【Android10+】获取ContentResolver失败');
          return;
        }

        // 2. 调用openInputStream（关键：用plus.android.invoke执行原生方法）
        let inputStream = null;
        try {
          inputStream = plus.android.invoke(contentResolver, 'openInputStream', uri);
        } catch (e) {
          console.error('【Android10+】调用openInputStream失败：', e);
          return;
        }

        // 3. 读取输入流内容（原生IO操作）
        const InputStreamReader = plus.android.importClass('java.io.InputStreamReader');
        const BufferedReader = plus.android.importClass('java.io.BufferedReader');
        const isr = new InputStreamReader(inputStream, 'utf-8');
        const br = new BufferedReader(isr);

        let line = '';
        let txtContent = '';
        // 逐行读取（readLine也需用invoke，避免直接调用）
        while (true) {
          line = plus.android.invoke(br, 'readLine');
          if (line === null) break;
          txtContent += line + '\n';
        }

        // 4. 关闭流（必须关闭，避免内存泄漏）
        plus.android.invoke(br, 'close');
        plus.android.invoke(isr, 'close');
        plus.android.invoke(inputStream, 'close');

        // console.log('【Android10+】通过URI读取TXT内容：', txtContent);
        this.fileName = this.getFileNameFromUri(uri); // 从URI解析文件名
        // console.log(this.fileName)
        this.uploadToBackend(txtContent);

      } catch (error) {
        console.error('【Android10+】URI读取TXT失败：', error);
      }
    },

    getFileNameFromUri(uri) {
      try {
        const main = plus.android.runtimeMainActivity();
        const contentResolver = main.getContentResolver();
        const Cursor = plus.android.importClass('android.database.Cursor');
        const DisplayName = plus.android.importClass('android.provider.OpenableColumns').DISPLAY_NAME;

        // 查询文件名
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
    },

    // 校验文件类型
    isAllowedFileType(fileName) {
      const lowerName = fileName.toLowerCase()
      return fileTypes.textFiles?.includes('.txt') || lowerName.endsWith('.txt')
    },

    // 上传文件到后端
    uploadToBackend(fileDetail = '') {
      this.isLoading = true
      uni.showLoading({
        title: this.$t('tip.uploading') || '上传中...',
        mask: true
      })

      this.result = null
      this.probabilities = null
      this.fileInfo = null
      this.calculation_data = null
      this.quality_info = null

      uni.uploadFile({
        url: `${this.baseUrl}/upload`,
        filePath: this.fileTempPath,
        name: 'file',
        fileType: 'text',
        formData: {
          fileDetail: fileDetail,
        },
        success: (uploadRes) => {
          this.isLoading = false
          uni.hideLoading()

          let uploadResult
          try {
            uploadResult = JSON.parse(uploadRes.data)
          } catch (e) {
            console.error('上传响应解析失败:', e)
            uni.showToast({
              title: this.$t('error.uploadParseError') || '上传响应解析失败',
              icon: 'none',
              duration: 2000
            })
            return
          }

          if (uploadResult.status === 'success' && uploadResult.file_info) {
            const fileInfo = uploadResult.file_info
            const relativePath = `${fileInfo.month_folder}/file/${fileInfo.uuid_filename}`
            this.predictResult(relativePath)
          } else {
            uni.showToast({
              title: uploadResult.message || this.$t('error.uploadFailed') || '上传失败',
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
            title: this.$t('error.uploadFailed') || '上传失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },

    // 调用预测接口（新增type_和model参数）
    predictResult(relativePath) {
      this.isLoading = true
      this.chartMode = 'pie'
      uni.showLoading({
        title: this.$t('tip.predicting') || '分析中...',
        mask: true
      })

      uni.request({
        url: `${this.baseUrl}/predict_custom`,
        method: 'POST',
        data: {
          file_path: relativePath,
          type_: this.selectedType, // 新增计算方法类型
          model: this.selectedModel // 新增模型选择
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (predictRes) => {
          this.isLoading = false
          uni.hideLoading()
          const predictResult = predictRes.data

          if (predictResult.status === 'success') {
            this.result = predictResult.result
            // 保存定量计算的额外数据
            this.calculation_data = predictResult.calculation_data || null
            this.quality_info = predictResult.quality_info || null
            this.probabilities = predictResult.probabilities || {}
            this.fileInfo = predictResult.file_info || {}
            // 记录使用的计算方法和模型（用于前端判断展示类型）
            this.result.calc_method = this.selectedType
            this.result.calc_model = this.selectedModel
            if (this.selectedType === 'svm') {
              this.chartMode = 'bar'
              this.toggleChartMode()
            }
          } else {
            uni.showToast({
              title: predictResult.message || this.$t('error.predictFailed') || '分析失败',
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
            title: this.$t('error.predictFailed') || '分析失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },

    // 格式化类别名称
    formatClassName(className) {
      const name = className.replace('prob_', '')
      const nameMap = {
        'VitaminD3': this.$t('probability.vitaminD3') || '维生素D3',
        'VitaminK3': this.$t('probability.vitaminK3') || '维生素K3',
        'retinol': this.$t('probability.retinol') || '视黄醇',
        'β-carotene': this.$t('probability.betaCarotene') || 'β-胡萝卜素'
      }
      return nameMap[name] || name
    },

    // 获取概率条样式类
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

    getColorClass(className) {
      const name = className.replace('prob_', '')
      const classMap = {
        'β-carotene': 'carotene-bar',
        'VitaminD3': 'd3-bar',
        'VitaminK3': 'k3-bar',
        'retinol': 'retinol-bar'
      }
      return classMap[name] || 'default-bar'
    },

    // 获取文件名
    getFileName(fullPath) {
      return fullPath ? fullPath.split('/').pop() : this.$t('fileInfo.unknownFile') || '未知文件'
    },

    // 获取文件类型显示文本
    getFileTypeText(fileType) {
      return fileType === 'custom' ? (this.$t('fileInfo.customFile') || '自定义文件') : (this.$t('fileInfo.defaultFile') || '默认文件')
    },

    toggleChartMode() {
      this.chartMode = this.chartMode === 'pie' ? 'bar' : 'pie'
      this.$nextTick(this.renderProbChart)
    },

    getProbChartData() {
      return Object.entries(this.probabilities).map(([key, value]) => ({
        name: this.formatClassName(key),
        value: +(value * 100).toFixed(2)
      }))
    },

    renderProbChart() {
      sleep().then(() => {
        console.log(this.$refs.probChartRef)
        if (!this.$refs.probChartRef) return

        this.probChart = echarts.init(this.$refs.probChartRef)

        if (this.chartMode === 'pie') {
          this.probChart.setOption({
            tooltip: {
              trigger: 'item',
              formatter: '{b}: {c}%'
            },
            series: [
              {
                type: 'pie',
                radius: '55%',
                data: this.getProbChartData(),
                label: {
                  formatter: '{b}\n{c}%',
                  fontSize: 12,
                  overflow: 'break',
                  width: 80
                }
              }
            ]
          })
        } else {
          this.probChart = null
        }
      })
    },
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
  //height: 320rpx;
  //min-height: 160px;
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