<template>
  <div class="">
    <DemoPanel title="Basic Usage" :initial-expand="false">
      <DemoCode />
      <template #code>
        <pre class="lang-markup"><code>{{ formatLibName(DemoCodeRaw) }}</code></pre>
      </template>
    </DemoPanel>
  </div>
</template>

<script lang="ts" setup>
import DemoCode from './DemoCode.vue'
import DemoCodeRaw from './DemoCode.vue?raw'
import { formatLibName } from '@/utils'

defineOptions({
  name: 'BasicUsage'
})
</script>
