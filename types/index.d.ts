export interface UserConfig {
    input?: string[]
    normalizeBasePath?: boolean
    formats?: string[]
    pages?: import('./plugins/pages').UserConfig
    imports?: import('./plugins/imports').UserConfig
}
