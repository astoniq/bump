import {createLog, Logger} from "./logger";
import {createHooks} from "./hooks";
import {Hooks} from "./types";
import {Options, Config} from "./options";
import {loadConfig} from './config'
import {BumpPlugin} from "./plugins";
import {execPromise} from "./exec";
import {execSync} from "child_process";

export class Bump {

    hooks: Hooks;
    logger: Logger;
    options: Options;
    config: Config

    constructor(options: Options) {
        this.options = options;
        this.logger = createLog()
        this.hooks = createHooks()
    }

    async init() {

        const config = await loadConfig()

        this.logger.verbose.success('Loaded `bump` with config');

        this.config = config;

        this.loadPlugins(this.config)
        this.loadHooks()

        this.config = await this.hooks.modifyConfig.promise(this.config);
        await this.hooks.beforeRun.promise(this.config);
    }

    private loadHooks() {
        this.hooks.getPreviousVersion.tap("default", () => {
            this.logger.veryVerbose.info(
                "No previous release found, using 0.0.0 as previous version"
            )
            return this.prefixRelease("0.0.0")
        })
    }

    async teardown() {
        await this.hooks.afterRun.promise(this.config)
    }

    /**
     * Рассчитать изменение версии для текущего состояния
     */
    async version() {
        const bump = await this.getVersion();
        console.log(bump)
    }

    async release() {
    }

    public async getCurrentVersion() {
        return await this.hooks.getPreviousVersion.promise()
    }

    public async getVersion() {
        return this.hooks.getVersion.promise()
    }

    readonly prefixRelease = (release: string) => {
        return this.config.noVersionPrefix || release.startsWith("v") ? release : `v${release}`
    }

    public hasBranch(branch: string) {
        try {
            const branches = execSync("git branch --list --all", {
                encoding: "utf-8",
            }).split("\n");

            return branches.some((b) => {
                const parts = b.split("/");

                return b === branch || parts[parts.length - 1] === branch;
            })
        } catch (error) {
            return false
        }
    }

    public checkEnv(pluginName: string, key: string) {
        if (!process.env[key]) {
            this.logger.log.warn(`${pluginName}: No ${key} found in environment`)
        }
    }

    readonly checkClean = async () => {
        const status = await execPromise("git", ['status', '--porcelain']);

        if (!status) {
            return;
        }

        this.logger.log.error('Changed Files:\n', status);

        throw new Error(
            "Working directory is not clean, make sure all files are committed"
        )
    }

    private loadPlugins(config: Config) {
        config.plugins
            .filter((plugin): plugin is BumpPlugin => Boolean(plugin))
            .forEach((plugin) => {
                this.logger.verbose.info(`Using ${plugin.name} Plugin...`);
                plugin.apply(this)
            })
    }
}