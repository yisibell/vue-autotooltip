<template>
  <div>
    <div>
      <div v-autotooltip style="max-width: 100px">tooltip content 1</div>
    </div>
    <div>
      <span v-autotooltip>tooltip content 2</span>
    </div>
    <div>
      <span v-autotooltip="`binding content`">tooltip content 3</span>
    </div>

    <div style="text-align: center">
      <span v-autotooltip="`binding content`">tooltip content 4</span>
    </div>
    <div style="text-align: center">
      <span v-autotooltip="{ content: `binding content`, effect: 'light' }">tooltip content 5</span>
    </div>
  </div>
</template>
