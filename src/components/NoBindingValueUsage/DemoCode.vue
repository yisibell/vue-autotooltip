<template>
  <div class="box">
    <button v-autotooltip @click="count++">{{ content1 + count }}</button>
    <button v-autotooltip>content!</button>

    <button v-autotooltip="{ effect: 'light' }">
      <span>test content, nested dom</span>
    </button>

    <label v-autotooltip style="padding-right: 20px; display: inline-block; max-width: 120px">
      has padding content
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const content1 = ref('this is a text overflow content!')

const count = ref(1)
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  button {
    max-width: 100px;
    margin-right: 16px;
  }
}
</style>
