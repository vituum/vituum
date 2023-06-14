interface ExtnamePattern {
    [key: string]: RegExp;
}

interface FilenamePattern {
    [key: string]: string | String[];
}

export interface UserConfig {
    filenamePattern: FilenamePattern;
    extnamePattern: ExtnamePattern;
    paths: String[]
}
