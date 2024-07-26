import * as unconfig from 'unconfig'
import {Config} from "./options";

export interface ConfigOptionError {
    path: string;
    expectedType: string;
    value: any;
}

export type ConfigError = string | ConfigOptionError;


export const defineConfig = (config: Config) => config;

export const loadConfig = async (): Promise<Config> => {

    const {config} = await unconfig.loadConfig<Config>({
        sources: [
            {
                files: 'bump.config',
                extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs'],
            },
        ],
        merge: false,
    })

    return config
}