import { EmittedFile } from "rolldown"

export declare function transformPath(file: EmittedFile["fileName"]) : string

export interface renameGenerateBundleOptions {
    files: string[]
    root: string
    formats?: string[]
    normalizeBasePath?: boolean
}

export interface resolveInputPathsOptions {
    paths: import('rolldown').InputOption
    root: string
}
