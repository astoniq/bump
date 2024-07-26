import {AsyncSeriesBailHook, AsyncSeriesHook, AsyncSeriesWaterfallHook} from "tapable";
import {Config} from "./options";

export interface Hooks {
    modifyConfig: AsyncSeriesWaterfallHook<[Config]>;
    beforeRun: AsyncSeriesHook<[Config]>;
    afterRun: AsyncSeriesHook<[Config]>;
    getPreviousVersion: AsyncSeriesBailHook<[], string>
    getVersion: AsyncSeriesBailHook<[], string>
}
