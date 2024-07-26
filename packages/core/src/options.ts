import {BumpPlugin} from "./plugins";

export type LogOptions = {
    verbose: boolean
};

export type GlobalOptions = {
    plugins: BumpPlugin[],
    noVersionPrefix: boolean;
}

export type Options = {};

export type Config = GlobalOptions & LogOptions;