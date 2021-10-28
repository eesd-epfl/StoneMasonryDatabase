import Vue from "vue";
import App from "./App.vue";
import ECharts from "vue-echarts";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

Vue.config.productionTip = false;

Vue.component("v-chart", ECharts);

new Vue({
  render: h => h(App)
}).$mount("#app");
