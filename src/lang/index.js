import { createI18n } from 'vue-i18n'

// 1. 导入所有语言文件（按 locales 文件夹路径导入）
import en from './en'       // 英语
import zhCN from './zh-CN'  // 中文简体（变量名不能含横杠，用驼峰 zhCN）
import ja from './ja'       // 日语
import ko from './ko'       // 韩语
import es from './es'       // 西班牙语
import fr from './fr'       // 法语
import de from './de'       // 德语
import ru from './ru'       // 俄语
import ptBR from './pt-BR'  // 巴西葡语（变量名驼峰 ptBR）
import ar from './ar'       // 阿拉伯语
import it from './it'       // 意大利语
import hi from './hi'       // 印地语

// 2. 初始化国际化实例
const i18n = createI18n({
  locale: 'en',                     // 默认语言（可改为 'zh-CN' 设为中文默认）
  fallbackLocale: 'en',             // 降级语言（当目标语言缺失时使用）
  legacy: false,                    // 启用 Composition API 必须设为 false
  globalInjection: true,            // 全局注入 $t 函数（模板中可直接用 {{ $t('action.upload') }}）
  messages: {
    // 3. 注册所有语言：键名 = 语言标识（与文件名一致），值 = 导入的语言对象
    en: en,
    'zh-CN': zhCN,  // 语言标识用字符串（支持横杠），对应导入的变量 zhCN
    ja: ja,
    ko: ko,
    es: es,
    fr: fr,
    de: de,
    ru: ru,
    'pt-BR': ptBR,  // 巴西葡语标识（字符串形式支持横杠）
    ar: ar,
    it: it,
    hi: hi
  }
})

export default i18n