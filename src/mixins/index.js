import { languageConfig, getCalculationTypes, getModelConfigMap, loadSiteRuntimeModelConfig } from '@/config/models'
import { loadBackendLangConfig } from '@/lang/index'
import { SITE } from '@/config/settings'

export const languageMixin = {
  data() {
    return {
      languageOptions: [],
      currentLanguage: {},
      showLanguageModal: false
    }
  },
  methods: {
    initLanguage() {
      this.languageOptions = Object.values(languageConfig)
      let savedLang = uni.getStorageSync('preferredLanguage')
      if (savedLang === 'zh') savedLang = 'zh-CN'
      const defaultLang = 'en'
      this.setLanguage(savedLang || this.getSystemLanguage() || defaultLang)
    },

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

    setLanguage(lang) {
      if (languageConfig[lang]) {
        this.$i18n.locale = lang
        this.currentLanguage = languageConfig[lang]
        this.languageIndex = this.languageOptions.findIndex(item => item.locale === lang)
        uni.setStorageSync('preferredLanguage', lang)
      }
    },

    openLanguageModal() {
      this.showLanguageModal = true
    },

    closeLanguageModal() {
      this.showLanguageModal = false
    },

    selectLanguage(lang) {
      this.setLanguage(lang)
      this.closeLanguageModal()
    }
  }
}

export const modelMixin = {
  data() {
    return {
      selectedType: 'svm',
      selectedTypeIndex: 0,
      selectedModel: 'default',
      selectedModelIndex: 0,
      typeOptions: [],
      modelOptions: [],
      modelConfigLoading: false
    }
  },
  created() {
    this.updateTypeOptionsI18n()
  },
  watch: {
    selectedType(newVal) {
      this.updateModelOptions(newVal)
    },
    '$i18n.locale'() {
      this.updateTypeOptionsI18n()
      this.updateModelOptions(this.selectedType)
    }
  },
  methods: {
    async refreshModelConfigs() {
      this.modelConfigLoading = true
      await Promise.all([
        loadBackendLangConfig(),
        loadSiteRuntimeModelConfig(SITE)
      ])
      this.updateTypeOptionsI18n()
      this.syncSelectionWithAvailableTypes()
      this.modelConfigLoading = false
    },

    syncSelectionWithAvailableTypes() {
      if (!this.typeOptions.length) {
        this.selectedType = 'svm'
        this.selectedTypeIndex = 0
        this.updateModelOptions(this.selectedType)
        return
      }

      const availableTypeIndex = this.typeOptions.findIndex(item => item.value === this.selectedType)
      const nextTypeIndex = availableTypeIndex >= 0 ? availableTypeIndex : 0
      const nextType = this.typeOptions[nextTypeIndex].value

      this.selectedTypeIndex = nextTypeIndex
      this.selectedType = nextType
      this.updateModelOptions(nextType)
    },

    updateTypeOptionsI18n() {
      this.typeOptions = getCalculationTypes().map(type => ({
        value: type.value,
        label: this.$t(type.label) || type.value
      }))
      if (this.typeOptions.length) {
        const currentTypeIndex = this.typeOptions.findIndex(item => item.value === this.selectedType)
        this.selectedTypeIndex = currentTypeIndex >= 0 ? currentTypeIndex : 0
      }
    },

    updateModelOptions(type) {
      const modelConfigMap = getModelConfigMap(type)

      if (!type || !this.typeOptions.find(item => item.value === type)) {
        const fallbackType = this.typeOptions[0]?.value
        if (fallbackType) {
          this.selectedType = fallbackType
          this.selectedTypeIndex = 0
          return this.updateModelOptions(fallbackType)
        }
      }

      const nextModelOptions = Object.entries(modelConfigMap).map(([key, config]) => ({
        value: key,
        label: this.$t(`method.model.${key}`) || config.name
      }))

      if (nextModelOptions.length) {
        this.modelOptions = nextModelOptions
        this.selectedModel = nextModelOptions[0].value
        this.selectedModelIndex = 0
      } else {
        this.modelOptions = []
        this.selectedModel = ''
        this.selectedModelIndex = 0
      }
    },

    onTypeChange(e) {
      const index = e.detail.value
      this.selectedType = this.typeOptions[index].value
      this.selectedTypeIndex = index
    },

    onModelChange(e) {
      const index = e.detail.value
      this.selectedModel = this.modelOptions[index].value
      this.selectedModelIndex = index
    },

    getTypeLabel(type) {
      if (!type) return ''
      const item = this.typeOptions.find(item => item.value === type)
      return item?.label || type
    },

    getModelLabel(model) {
      if (!model) return '';

      const currentType = this.selectedType || (this.result && this.result.calc_method);
      const modelConfigMap = getModelConfigMap(currentType)

      switch (currentType) {
        case 'svm':
          return this.$t(`method.model.${model}`) || modelConfigMap[model]?.name || model;
        case 'quantitative':
          return this.$t(`method.model.${model}`) || modelConfigMap[model]?.name || model;
        case 'tree':
          return this.$t(`method.model.${model}`) || modelConfigMap[model]?.name || model;
        default:
          return model;
      }
    }
  }
}