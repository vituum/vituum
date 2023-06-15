export interface UserConfig {
    input?: string[];
    pages?: import('./plugins/pages.d.ts').UserConfig;
    imports?: import('./plugins/imports.d.ts').UserConfig;
}
