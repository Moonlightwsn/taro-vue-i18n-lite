import type { App, PluginInstallFunction } from "vue"

export type Locale = string

export type Messages = {
  [key in Locale]: any
}

export type Listener = (Locale) => any

export type Options = {
  locale: Locale
  fallbackLocale: Locale
  messages: Messages
  onInstall?: (Locale) => any
  onChange?: Listener
}

export type TokensCacheItem = {
  tokens: string[]
  vars?: (string | number)[]
}

export type TokensCache = {
  [key in Locale]: { [key: string]: TokensCacheItem }
}

export type TranslateOptions = {
  defaultMessage?: string
  [key: string]: any
}

export type TranslateFunction = (
  key: string,
  tOptions?: TranslateOptions
) => string

export type ChangeLocaleFunction = (locale: Locale) => void

export type I18nHook = {
  getCurrentLocale: () => Locale
  t: TranslateFunction
  changeLocale: ChangeLocaleFunction
}

export declare function useI18n(): I18nHook

declare namespace _default {
  export { install }
  export { version }
}

export const install: PluginInstallFunction
export const version: "0.1.0"
export default _default
