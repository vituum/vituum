interface ExtnamePattern {
    [key: string]: RegExp;
}

interface FilenamePattern {
    [key: string]: string | string[]
}

export interface UserConfig {
    filenamePattern?: FilenamePattern
    extnamePattern?: ExtnamePattern
    paths?: string[]
}
