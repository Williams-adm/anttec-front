//import './assets/main.css'
import './style.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

//Font awesomo
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faAngleDown,
  faAngleRight,
  faAngleUp,
  faBarsStaggered,
  faBook,
  faBox,
  faBoxesStacked,
  faCalendar,
  faCartShopping,
  faChartLine,
  faCircleInfo,
  faCirclePlus,
  faClipboardList,
  faEye,
  faFileInvoice,
  faGear,
  faImages,
  faLayerGroup,
  faLink,
  faList,
  faListCheck,
  faMagnifyingGlass,
  faPenToSquare,
  faShop,
  faTags,
  faTrashCan,
  faUser,
  faWarehouse,
  faBars,
  faAnglesRight,
  faXmark,
  faAngleLeft,
  faHouse,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(
  faBarsStaggered,
  faChartLine,
  faLayerGroup,
  faTags,
  faAngleRight,
  faCircleInfo,
  faPenToSquare,
  faList,
  faBoxesStacked,
  faAngleUp,
  faAngleDown,
  faBox,
  faBook,
  faListCheck,
  faTrashCan,
  faEye,
  faGear,
  faCirclePlus,
  faClipboardList,
  faWarehouse,
  faShop,
  faLink,
  faFileInvoice,
  faImages,
  faCalendar,
  faMagnifyingGlass,
  faCartShopping,
  faUser,
  faBars,
  faAnglesRight,
  faXmark,
  faAngleLeft,
  faHouse,
  faPlus,
  faMinus,
)

import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons'
library.add(faFacebookF, faInstagram)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
