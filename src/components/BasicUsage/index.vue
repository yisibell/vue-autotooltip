<template>
  <div class="box">
    <div class="top">
      <div class="item">
        <button v-autotooltip="{ content: 'Top Left 提示文字', placement: 'top-start' }">
          上左
        </button>
      </div>
      <div class="item">
        <button v-autotooltip="{ content: 'Top Center 提示文字', placement: 'top' }">上边</button>
      </div>
      <div class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
        <button v-autotooltip="{ content: 'Top Right 提示文字', placement: 'top-end' }">
          上右
        </button>
      </div>
    </div>
    <div class="left">
      <div class="item">
        <button v-autotooltip="{ content: 'Left Top 提示文字', placement: 'left-start' }">
          左上
        </button>
      </div>
      <div class="item">
        <button v-autotooltip="{ content: 'Left Center 提示文字', placement: 'left' }">左边</button>
      </div>
      <div class="item">
        <button v-autotooltip="{ content: 'Left Bottom 提示文字', placement: 'left-end' }">
          左下
        </button>
      </div>
    </div>
    <div class="right">
      <div class="item">
        <button v-autotooltip="{ content: 'Right Top 提示文字', placement: 'right-start' }">
          右上
        </button>
      </div>
      <div class="item">
        <button v-autotooltip="{ content: 'Right Center 提示文字', placement: 'right' }">
          右边
        </button>
      </div>
      <div class="item">
        <button v-autotooltip="{ content: 'Right Bottom 提示文字', placement: 'right-end' }">
          右下
        </button>
      </div>
    </div>
    <div class="bottom">
      <div class="item">
        <button v-autotooltip="{ content: 'LBottom Left 提示文字', placement: 'bottom-start' }">
          下左
        </button>
      </div>
      <div class="item">
        <button v-autotooltip="{ content: 'Bottom Center 提示文字', placement: 'bottom' }">
          下边
        </button>
      </div>
      <div class="item">
        <button v-autotooltip="{ content: 'Bottom Right 提示文字', placement: 'bottom-end' }">
          下右
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'BasicUsage',
  setup() {}
})
</script>

<style lang="scss" scoped>
.box {
  width: 400px;
  margin: 50px auto;

  .top {
    text-align: center;
  }

  .left {
    float: left;
    width: 60px;
  }

  .right {
    float: right;
    width: 60px;
  }

  .bottom {
    clear: both;
    text-align: center;
  }

  .item {
    margin: 4px;
    display: inline-block;
  }
}
</style>
