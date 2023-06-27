import { EmittedFile } from "rollup"

export declare function transformPath(file: EmittedFile["fileName"]) : string

export interface renameGenerateBundleOptions {
    files: string[]
    root: string
    formats?: string[]
    normalizeBasePath?: boolean
}

export interface resolveInputPathsOptions {
    paths: import('rollup').InputOption
    root: string
}
