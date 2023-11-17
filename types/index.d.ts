declare module 'vituum' {
    export interface UserConfig {
        input?: string[]
        formats?: string[]
        pages?: import('./plugins/pages').UserConfig
        imports?: import('./plugins/imports').UserConfig
    }

    export default function plugin(options?: UserConfig) : import('vite').Plugin[]
}
