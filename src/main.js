import { createSSRApp } from 'vue'
import App from './App.vue'
import i18n from './lang/index' // 引入国际化配置

export function createApp() {
  const app = createSSRApp(App)
  app.use(i18n) // 安装国际化插件
  return {
    app
  }
}
