import { EmittedFile } from "rollup"

export declare function transformPath(file: EmittedFile["fileName"]) : string

export interface renameGenerateBundleOptions {
    formats: string[]
    root: string
    files: string[]
}

export interface resolveInputPathsOptions {
    paths: import('rollup').InputOption
    root: string
}
