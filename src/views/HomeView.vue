<template>
  <main class="home-main">
    <BasicUsage />
    <NoBindingValueUsage />
    <ThemeUsage />
    <TriggerUsage />
  </main>
</template>

<script lang="ts" setup>
import 'prismjs'
import BasicUsage from '@/components/BasicUsage/index.vue'
import NoBindingValueUsage from '@/components/NoBindingValueUsage/index.vue'
import ThemeUsage from '@/components/ThemeUsage/index.vue'
import TriggerUsage from '@/components/TriggerUsage/index.vue'
</script>

<style lang="scss" scoped>
.home-main {
  max-width: 980px;
  margin: 0 auto;
}
</style>
