import Vue from 'vue'
import firebase from 'firebase'
import App from './App.vue'
import router from './router/index.js'
import './plugins/axios'

Vue.config.productionTip = false

// Em produção, realocar o firebase para um arquivo dedicado.

let app = '';

firebase.initializeApp({
  apiKey: "AIzaSyAaGd7puocwLXWPTPntJ7iRgq_vwH-z520",
    authDomain: "fire-0000.firebaseapp.com",
    databaseURL: "https://fire-0000.firebaseio.com",
    projectId: "fire-0000",
    storageBucket: "fire-0000.appspot.com",
    messagingSenderId: "228335456577"
});

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app');
  }
});


