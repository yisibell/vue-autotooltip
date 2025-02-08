import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import DemoifyUI from 'demoify'
import { Autotooltip } from '@/lib/main'

import 'demoify/lib/style.css'
import 'prismjs/themes/prism.min.css'

const app = createApp(App)

app.directive('autotooltip', Autotooltip)
app.use(DemoifyUI)
app.use(router)

app.mount('#app')
