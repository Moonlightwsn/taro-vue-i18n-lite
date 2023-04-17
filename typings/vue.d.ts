export {}
declare module "vue" {
  export interface ComponentCustomProperties {
    $t: TranslateFunction
  }
}
