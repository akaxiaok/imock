import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'mockjs';
import Avue from '@smallwei/avue';
import 'element-ui/lib/theme-chalk/index.css';

import '@smallwei/avue/lib/index.css';

Vue.use(ElementUI);

Vue.use(Avue);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
