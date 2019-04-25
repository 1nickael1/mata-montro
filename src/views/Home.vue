<template>
  <div class="home">
    <MataMonstro/>
  </div>
</template>

<script>
// @ is an alias to /src
import MataMonstro from '@/components/MataMonstro.vue'

export default {
  name: 'home',
  components: {
    MataMonstro
  }
}
</script>
