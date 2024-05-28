<template>
  <div class="box">
    <button v-autotooltip @click="count++">{{ content1 + count }}</button>
    <button v-autotooltip>content!</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'NoBindingValueUsage',
  setup() {
    const content1 = ref('this is a text overflow content!')

    const count = ref(1)

    return {
      content1,
      count
    }
  }
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
