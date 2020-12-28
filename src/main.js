import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'mockjs';

import '@smallwei/avue/lib/index.css';

import JsonEditor from 'vue-json-edit';
import VueHighlightJS from 'vue-highlightjs';
import Code from './components/Code';

Vue.component('CodePre', Code);
Vue.use(VueHighlightJS);
Vue.use(JsonEditor);
Vue.use(ElementUI);

Vue.use(window.AVUE);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
