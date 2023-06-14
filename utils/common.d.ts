declare interface ReloadOptions {
    reload: boolean | Function;
    formats: string[]
}

declare interface Error {
    message: string
}

export declare function getPackageInfo(path: string) : string;

export declare function pluginError(error: string | Error, server: import('vite').ViteDevServer, name: string) : boolean | Promise<string>;

export declare function pluginReload(config: import('vite').IndexHtmlTransformContext, options: ReloadOptions) : void;

export declare function processData(paths: string[] | string, data: object) : object;
