<template>
  <div class="home">
    <button @click="logout">Logout</button>
    <MataMonstro/>
  </div>
</template>

<script>
import firebase from 'firebase'

import MataMonstro from '@/components/MataMonstro.vue'

export default {
  name: 'home',
  components: {
    MataMonstro
  },
  methods: {
    logout: function() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>
