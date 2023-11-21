import Vue from 'vue'
import App from './App.vue'
import router from 'router/index.js'
import store from './store/index.js'
import VueQuillEditor from 'vue-quill-editor'
import axios from 'axios'

// element-ui
import {
  Icon,
  Table,
  TableColumn,
  Form,
  FormItem,
  RadioGroup,
  Radio,
  Input,
  Checkbox,
  MessageBox,
  Pagination,
  Dialog,
  Scrollbar,
  Image,
  Upload,
  Button,
  Option,
  Select,
  InputNumber,
  DatePicker,
  Card,
} from 'element-ui'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(Icon)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Scrollbar)
Vue.use(Image)
Vue.use(Upload)
Vue.use(Button)
Vue.use(Option)
Vue.use(Select)
Vue.use(InputNumber)
Vue.use(DatePicker)
Vue.use(Card)
Vue.use(VueQuillEditor, /* { 默认全局 } */)
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;

// register custom base component
import Mooc from './register.js'
import 'assets/theme/index.styl'
Vue.use(Mooc)

import 'assets/stylus/index.styl'

axios.default.timeout=50000

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
