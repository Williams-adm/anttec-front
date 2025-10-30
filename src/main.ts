//import './assets/main.css'
import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

//Font awesomo
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBarsStaggered,
  faChartLine,
  faLayerGroup,
  faTags,
  faAngleRight,
  faCircleInfo,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons'
library.add(
  faBarsStaggered,
  faChartLine,
  faLayerGroup,
  faTags,
  faAngleRight,
  faCircleInfo,
  faPenToSquare,
)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
