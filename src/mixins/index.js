import { languageConfig, SVM_MODEL_CONFIGS, QUANTITATIVE_COMPOUND_CONFIGS, TREE_MODEL_CONFIGS, CALCULATION_TYPES } from '@/config/models'

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
      modelOptions: []
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
    updateTypeOptionsI18n() {
      this.typeOptions = CALCULATION_TYPES.map(type => ({
        value: type.value,
        label: this.$t(type.label) || type.value
      }))
    },

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
      this.selectedModel = this.modelOptions[0]?.value || 'default'
      this.selectedModelIndex = 0
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