declare interface ReloadOptions {
    reload?: boolean | Function
    formats?: string[]
}

declare interface Error {
    message: string
}

declare interface Package {
    name: string
    version: string
}

declare interface HmrContext {
    file: string
    timestamp?: number
    modules?: Array<import('vite').ModuleNode>
    read?: () => string | Promise<string>
    server: import('vite').ViteDevServer
}

declare interface ProcessDataOptions {
    paths: string[] | string
    root?: string
}

declare interface PluginOptions {
    formats?: string[]
    ignoredPaths?: string[]
}

declare interface PluginTransformCtx {
    filename?: string
    server?: import('vite').ViteDevServer
    resolvedConfig?: import('vite').ResolvedConfig
}

declare interface PluginTransformOptions {
    name?: string
    options?: PluginOptions
    resolvedConfig?: import('vite').ResolvedConfig
    renderTemplate: (ctx: PluginTransformCtx, html: string, options: PluginOptions) => Promise<{
        error: string
        content: string
    }>
}

export declare function deepMergeWith<
    T extends object,
    S extends object
>(
    object: T,
    sources: S
): T & S;

export declare function getPackageInfo(path: string) : Package

export declare function pluginError(error: Error | string, server: import('vite').ViteDevServer, name: string) : boolean | Promise<string>

export declare function pluginReload(config: HmrContext, options: ReloadOptions) : void

export declare function pluginTransform(html: string, ctx: import('vite').IndexHtmlTransformContext, options: PluginTransformOptions) : Promise<string | Object>

export declare function processData(paths: ProcessDataOptions, data: object) : object

export declare function pluginBundle(formats: string[], name?: string) : import('vite').Plugin

export declare function pluginMiddleware(name?: string, formats?: string[]) : import('vite').Plugin

export declare function normalizePath(path: string) : string
