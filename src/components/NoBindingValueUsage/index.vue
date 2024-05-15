<template>
  <div class="box">
    <button v-autotooltip>this is a text overflow content!</button>
    <button v-autotooltip>content!</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'NoBindingValueUsage',
  setup() {}
})
</script>

<style lang="scss" scoped>
.box {
  button {
    max-width: 100px;
    margin-right: 16px;
  }
}
</style>
