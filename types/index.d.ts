export interface UserConfig {
    input?: string[];
    pages?: import('./plugins/pages').UserConfig;
    imports?: import('./plugins/imports').UserConfig;
}
