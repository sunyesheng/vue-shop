import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import 'default-passive-events'
import TreeTable from 'vue-table-with-tree-grid'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import nprogress from 'nprogress'

// 将富文本编辑器注册为全局可用
Vue.use(VueQuillEditor)
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 添加拦截器 在请求拦截器显示进度条 在相应拦截器隐藏进度条
axios.interceptors.response.use(config => {
  nprogress.done()
  return config
})
axios.interceptors.request.use(
  config => {
    nprogress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.filter('dateFormat', function (time) {
  const dt = new Date(time)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d}-${hh}-${mm}-${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
