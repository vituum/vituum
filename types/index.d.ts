export interface UserConfig {
    input?: string[]
    formats?: string[]
    pages?: import('./plugins/pages').UserConfig
    imports?: import('./plugins/imports').UserConfig
}
