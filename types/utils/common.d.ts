declare interface ReloadOptions {
    reload?: boolean | Function;
    formats?: string[]
}

declare interface Error {
    message: string
}

declare interface Package {
    name: string
    version: string
}

export declare interface HmrContext {
    file: string;
    timestamp?: number;
    modules?: Array<import('vite').ModuleNode>;
    read?: () => string | Promise<string>;
    server: import('vite').ViteDevServer;
}

export declare interface ProcessDataOptions {
    paths: string[] | string
    root?: string
}

export declare function getPackageInfo(path: string) : Package;

export declare function pluginError(error: Error | string, server: import('vite').ViteDevServer, name: string) : boolean | Promise<string>;

export declare function pluginReload(config: HmrContext, options: ReloadOptions) : void;

export declare function processData(paths: ProcessDataOptions, data: object) : object;
