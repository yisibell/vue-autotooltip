<p align="center">
  <a href="https://www.npmjs.org/package/vue-autotooltip">
    <img src="https://img.shields.io/npm/v/vue-autotooltip.svg">
  </a>
  <a href="https://npmcharts.com/compare/vue-autotooltip?minimal=true">
    <img src="https://img.shields.io/npm/dm/vue-autotooltip.svg">
  </a>
  <br>
</p>

# vue-autotooltip

Auto tooltip (directive) for Vue.js.

- [Release Notes](./CHANGELOG.md)
- [Examples](http://hongwenqing.com/vue-autotooltip/)

# Features

- `Autotooltip` directive.

| Version | Support Vue Version | Status |
| :-----: | :-----------------: | :----: |
| `v1.x`  |      `^2.7.x`       |   ✔️   |
| `v2.x`  |      `^3.2.x`       |   ✔️   |

# Installation

```bash
# pnpm
$ pnpm add vue-autotooltip

# yarn
$ yarn add vue-autotooltip

# npm
$ npm i vue-autotooltip
```

# Usage

1. Import styles

```ts
import 'vue-autotooltip/dist/style.css'
```

2. Install directive

```ts
import { createApp } from 'vue'
import { Autotooltip } from 'vue-autotooltip'
import App from '@/App.vue'
// ...

const app = createApp(App)

app.directive('autotooltip', Autotooltip)

// ...
```

3. Use it where needed

```vue
<div>
  <span v-autotooltip>tooltip content 2</span>
</div>
```

# Binding Value

## Has binding value

- If the **binding value** is a `string`, it will be used by content of **tooltip**.
- If the **binding value** is a `plain object`, It will be considered as an advanced configuration for **tooltip**.

Configuration details as belows:

|     Key      |              Type               |  Default Value  |               Description                |
| :----------: | :-----------------------------: | :-------------: | :--------------------------------------: |
|  `content`   |            `string`             |   `undefined`   |           Content of tooltip.            |
|   `effect`   | `dark` / `light` / `dark-light` |     `dark`      |              Tooltip theme.              |
| `placement`  |            `string`             |      `top`      |           Position of Tooltip.           |
|  `appendTo`  |    `string` / `HTMLElement`     | `document.body` | Where to insert the **tooltip** element. |
| `arrowWidth` |            `number`             |       `8`       |   Specify the arrow width of tooltip.    |
| `showArrow`  |            `boolean`            |     `true`      |    Specify whether to display arrows.    |
|  `trigger`   |        `hover` / `click`        |     `hover`     |        Specify the trigger event.        |
|  `disabled`  |            `boolean`            |     `false`     |     Whether to disable the tooltip.      |
|  `duration`  |            `number`             |       `0`       |        Tooltip display duration.         |
|   `offset`   |       `[number, number]`        |    `[0, 0]`     |               Set offset.                |

## Has not binding value

- If a binding value is not specified for `v-autotooltip`, the `innerText` of the referenced element will be displayed as the content of the tooltip.
- Only when there is a text overflow will the display of tooltip be activated, and add a truncation effect to the text display.
