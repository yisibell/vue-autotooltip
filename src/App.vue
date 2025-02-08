<template>
  <DemoHeader
    logo-text="Ttip"
    title="Vue Autotooltip"
    title-link="https://github.com/yisibell/vue-autotooltip"
    :right-links="[
      {
        href: 'https://github.com/yisibell/vue-autotooltip',
        title: 'Documentation'
      },
      {
        href: 'https://github.com/yisibell/vue-autotooltip/blob/main/CHANGELOG.md',
        title: 'Changelog'
      },
      { href: 'https://github.com/yisibell/vue-autotooltip', title: 'Github' }
    ]"
  />
  <RouterView />
</template>

<script setup lang="ts">
import { DemoHeader } from 'demoify'
import { RouterView } from 'vue-router'
</script>
