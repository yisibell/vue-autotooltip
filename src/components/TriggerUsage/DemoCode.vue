<template>
  <div style="height: 300px;overflow-y: auto;">
    <div>Defaults is <code>hover</code></div>

    <div class="box">
      <button v-autotooltip="{ content: 'dark theme', effect: 'dark' }">dark</button>
      <button v-autotooltip="{ content: 'light theme', effect: 'light' }">light</button>
    </div>

    <div>With <code>click</code></div>

    <div class="box" style="height: 1000px;">
      <button v-autotooltip="{ content: 'dark theme', effect: 'dark', trigger: 'click' }">
        dark
      </button>
      <button
        v-autotooltip="{
          content: 'dark light theme',
          effect: 'dark-light',
          trigger: 'click',
          duration: 0,
          placement: 'bottom',
          disabled: disabled
        }"
      >
        dark light
      </button>

      <button @click="disabled = !disabled">toggle disabled status {{ disabled }}</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const disabled = ref(false)
</script>

<style lang="scss" scoped>
.box {
  button {
    margin-right: 16px;
  }
}
</style>
