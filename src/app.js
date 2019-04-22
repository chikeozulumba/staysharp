/* eslint-disable prefer-const */
/* eslint-disable no-new */
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import {
	store,
} from './utils/State';

let url = 'http://localhost:3000/';
url = 'https://stay-sharp.herokuapp.com/';
// url = 'https://staysharp.ng/';

Vue.use(Vuex);
Vue.prototype.$url = url;

new Vue({
	store,
	el: '#app',
	render: h => h(App),
});
