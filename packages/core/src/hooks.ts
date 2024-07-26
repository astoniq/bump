import {Hooks} from "./types";
import {AsyncSeriesBailHook, AsyncSeriesHook, AsyncSeriesWaterfallHook} from "tapable";
import {LogParseHooks} from "./log-parse";

export const createHooks = (): Hooks => ({
    modifyConfig: new AsyncSeriesWaterfallHook(['config']),
    beforeRun: new AsyncSeriesHook(["config"]),
    afterRun: new AsyncSeriesHook(["config"]),
    getPreviousVersion: new AsyncSeriesBailHook(),
    getVersion: new AsyncSeriesBailHook(),
})

export const makeLogParseHooks = (): LogParseHooks => ({
    parseCommit: new AsyncSeriesWaterfallHook(['commit']),
    omitCommit: new AsyncSeriesBailHook(['commit'])
})