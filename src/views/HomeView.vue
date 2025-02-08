<template>
  <main class="home-main">
    <BasicUsage />
    <NoBindingValueUsage />
    <ThemeUsage />
  </main>
</template>

<script lang="ts" setup>
import 'prismjs'
import BasicUsage from '@/components/BasicUsage/index.vue'
import NoBindingValueUsage from '@/components/NoBindingValueUsage/index.vue'
import ThemeUsage from '@/components/ThemeUsage/index.vue'
</script>

<style lang="scss" scoped>
.home-main {
  max-width: 980px;
  margin: 0 auto;
}
</style>
