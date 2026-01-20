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

export declare function resolveInputPaths(options: resolveInputPathsOptions, formats: string[]) : string[]

export declare function renameBuildStart(files: string[], formats: string[]) : Promise<void>

export declare function renameBuildEnd(files: string[], formats: string[]) : Promise<void>

export declare function renameGenerateBundle(bundle: import('rolldown').OutputBundle, options: renameGenerateBundleOptions, transformPath?: (file: EmittedFile["fileName"]) => string) : Promise<void>
