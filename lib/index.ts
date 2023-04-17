/// <reference path="../typings/index.d.ts" />
import { ref, inject } from "vue"

import type { App } from "vue"
import type {
  Locale,
  I18nHook,
  Listener,
  Options,
  TokensCache,
  TranslateOptions,
} from "../typings/index"

const useI18n = () => {
  const i18n = inject("i18n") as I18nHook
  return i18n
}

const templateHandler = (strings: string[], ...keys: (string | number)[]) => {
  return (...values: any[]) => {
    const dict = values[values.length - 1] || {}
    const first = strings.shift()
    const result = [first]
    keys.forEach((key) => {
      const value = Number.isInteger(key) ? values[Number(key)] : dict[key]
      result.push(value, strings.shift())
    })
    if (strings.length > 0) {
      result.push(...strings.reverse())
    }
    return result.join("")
  }
}

const parse = (template: string) => {
  const tmpStrArr: string[] = Array.from(template || "")
  const tokens: string[] = []
  const vars: (string | number)[] = []
  let queue: string[] = []
  let cursor: number = -1
  for (let i = 0; i < tmpStrArr.length; i += 1) {
    const char: string = tmpStrArr[i]
    queue.push(char)
    if (char === "{") {
      cursor = i
    } else if (char === "}" && cursor >= 0 && i > cursor + 1) {
      // {} 内为空时视为普通字符，不认为有动态插入的参数
      if (cursor > 0) {
        const token = queue.slice(0, cursor).join("")
        tokens.push(token)
      } else if (tokens.length === 0) {
        // 动态参数在首位时，垫一个空字符，保证参数位置正确
        tokens.push("")
      }
      const varName = queue.slice(cursor + 1, i).join("")
      vars.push(varName)
      queue = queue.slice(i + 1)
      cursor = -1
    }
  }
  if (queue.length > 0) {
    tokens.push(queue.join(""))
  }
  return {
    tokens,
    vars,
  }
}

// 对翻译过的文本进行缓存，避免重复解析
let tokensCache: TokensCache = {}
const onChangeListeners: Listener[] = []

export default {
  install: (app: App<Element>, options: Options) => {
    const {
      locale: defaultLocale,
      fallbackLocale = "zh-CN",
      messages = {},
      onInstall,
      onChange,
    } = options || {}

    const locale = ref<Locale>(defaultLocale || fallbackLocale)
    if (!tokensCache[locale.value]) {
      tokensCache[locale.value] = {}
    }

    if (onInstall) {
      onInstall(locale.value)
    }
    if (onChange) {
      onChangeListeners.push(onChange)
    }

    const translate = (key: string, tOptions?: TranslateOptions) => {
      const { defaultMessage, ...params } = tOptions || {}

      let tokens: string[]
      let vars

      if (tokensCache[locale.value][key]) {
        ;({ tokens, vars } = tokensCache[locale.value][key])
      } else {
        // 获取 `messages` 对象的深层属性
        // 使用 `key` 作为索引
        const tmp = key.split(".").reduce((o, i) => {
          if (o) return o[i]
        }, messages[locale.value || fallbackLocale])
        ;({ tokens, vars } = parse(tmp))
        // 缓存解析结果
        tokensCache[locale.value][key] = {
          tokens,
          vars,
        }
      }
      const text = templateHandler([...tokens], ...(vars || []))(params)
      return text || defaultMessage || key || ""
    }

    const changeLocale = (nextLocale: Locale) => {
      const _nextLocale = nextLocale || fallbackLocale
      for (let i = 0; i < onChangeListeners.length; i += 1) {
        onChangeListeners[i](_nextLocale)
      }
      if (!tokensCache[_nextLocale]) {
        tokensCache[_nextLocale] = {}
      }
      locale.value = _nextLocale
    }

    app.config.globalProperties.$t = translate

    const i18nHook: I18nHook = {
      getCurrentLocale: () => locale.value,
      t: translate,
      changeLocale,
    }

    app.provide<I18nHook>("i18n", i18nHook)
  },
}

export { useI18n }
