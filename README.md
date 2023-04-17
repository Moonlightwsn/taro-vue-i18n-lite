# taro-vue-i18n-lite

轻量级国际化插件 Taro Vue3 版本

## 安装

在 Taro 项目根目录下安装

```bash
npm i taro-vue-i18n-lite
# 或使用yarn
yarn add taro-vue-i18n-lite
# 或使用pnpm
pnpm add taro-vue-i18n-lite
```

## 快速上手

Typescript 支持

修改`tsconfig.json`

```json
{
  "include": ["node_modules/taro-vue-i18n-lite/typings"]
}
```

安装插件

```typescript
import { createApp } from "vue"
import i18n from "taro-vue-i18n-lite"

// 定义国际化文本
const messages = {
  "zh-CN": {
    say: {
      hi: "嗨～",
    },
  },
  "en-US": {
    say: {
      hi: "Hi~",
    },
  },
}

// 通过 `App.use()` 安装 `Vue` 插件：`taro-vue-i18n-lite`
const App = createApp({})
App.use(i18n, {
  locale: "zh-CN",
  messages,
})
```

视图中使用

```html
<template>
  <div>{{ $t("say.hi") }}</div>
</template>
<script setup></script>
```

输出

```html
<div>嗨～</div>
```

## 更多用法

### 动态切换语言

```html
<template>
  <div>{{ $t("say.hi") }}</div>
  <button @click="changeLocale">点我切换语言</button>
</template>
<script setup>
  import { useI18n } from "taro-vue-i18n-lite"

  const i18n = useI18n()

  const changeLocale = () => {
    const currentLocale = i18n.getCurrentLocale()
    i18n.changeLocale(currentLocale === "zh-CN" ? "en-US" : "zh-CN")
  }
</script>
```

### 在 `JS/TS` 中翻译文本

```html
<template>
  <div>{{ hi }}</div>
  <button @click="translate">点我翻译</button>
</template>
<script setup>
  import { ref } from "vue"
  import { useI18n } from "taro-vue-i18n-lite"

  const i18n = useI18n()

  const hi = ref("say.hi")

  const translate = () => {
    hi.value = i18n.t("say.hi")
  }
</script>
```

输出由

```html
<div>say.hi</div>
```

变为

```html
<div>嗨～</div>
```

### 动态参数

```typescript
// 定义国际化文本
const messages = {
  "zh-CN": {
    say: {
      hi: "嗨～ {name}",
    },
  },
  "en-US": {
    say: {
      hi: "Hi~ {name}",
    },
  },
}
```

```html
<div>{{ $t("say.hi", { name: 'i18n' }) }}</div>
```

输出

```html
<div>嗨～ i18n</div>
```

### 配合 UI 组件

以 `NutUI` 为例，配合 `taro-vue-i18n-lite` 使用：

安装 `NutUI` 参考指南 [快速上手](https://nutui.jd.com/taro/vue/4x/#/zh-CN/guide/start)

```typescript
import { createApp } from "vue"
import { Locale } from "@nutui/nutui-taro"
import i18n from "taro-vue-i18n-lite"

import enUS from "@nutui/nutui-taro/dist/packages/locale/lang/en-US"
import zhCN from "@nutui/nutui-taro/dist/packages/locale/lang/zh-CN"

const App = createApp({})

const messages = {
  "zh-CN": {
    say: {
      hi: "嗨～ {name}",
      goodbye: "再见！",
    },
  },
  "en-US": {
    say: {
      hi: "Hi~ {name}",
      goodbye: "Goodbye!",
    },
  },
}

App.use(i18n, {
  locale: "zh-CN",
  messages,
  onInstall: (locale: string) => {
    Locale.use(locale, locale === "zh-CN" ? zhCN : enUS)
  },
  onChange: (locale: string) => {
    Locale.use(locale, locale === "zh-CN" ? zhCN : enUS)
  },
})
```

## 交流

如果你有新的功能需求或者想参与到这个国际化插件的开发中，欢迎提 `Issue`或添加我的好友

`QQ: 543456277`
