import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = 'https://fire-0000.firebaseio.com/'

Vue.use({
    install(Vue) {
        Vue.prototype.$http = axios
    }
})