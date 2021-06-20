<template>
  <div>
    <el-button type="info" @click="logout">logout</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style  scoped>
</style>
