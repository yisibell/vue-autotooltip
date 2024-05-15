<template>
  <div class="box">
    <button v-autotooltip="{ content: 'dark theme', effect: 'dark' }">dark</button>
    <button v-autotooltip="{ content: 'light theme', effect: 'light' }">light</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ThemeUsage',
  setup() {}
})
</script>

<style lang="scss" scoped>
.box {
  button {
    margin-right: 16px;
  }
}
</style>
