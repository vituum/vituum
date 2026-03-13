import { Rolldown } from "vite"

export declare function transformPath(file: Rolldown.EmittedFile["fileName"]) : string

export interface renameGenerateBundleOptions {
    files: string[]
    root: string
    formats?: string[]
    normalizeBasePath?: boolean
}

export interface resolveInputPathsOptions {
    paths: Rolldown.InputOption
    root: string
}

export declare function resolveInputPaths(options: resolveInputPathsOptions, formats: string[]) : string[]

export declare function renameBuildStart(files: string[], formats: string[]) : Promise<void>

export declare function renameBuildEnd(files: string[], formats: string[]) : Promise<void>

export declare function renameGenerateBundle(bundle: Rolldown.OutputBundle, options: renameGenerateBundleOptions, transformPath?: (file: Rolldown.EmittedFile["fileName"]) => string) : Promise<void>
