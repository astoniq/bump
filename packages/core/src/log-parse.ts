import {AsyncSeriesBailHook, AsyncSeriesWaterfallHook} from "tapable";
import {makeLogParseHooks} from "./hooks";

export interface Commit {
    hash: string;
    subject: string;
}

export interface LogParseHooks {
    parseCommit: AsyncSeriesWaterfallHook<[Commit]>;
    omitCommit: AsyncSeriesBailHook<[Commit], boolean | void>
}

export class LogParse {
    hooks: LogParseHooks;

    constructor() {
        this.hooks = makeLogParseHooks();

        this.loadHooks()
    }

    private loadHooks() {
        this.hooks.parseCommit.tap(('Strip consecutive white-space in title'), (commit) => {
            const [firstLine, ...lines] = commit.subject.split("\n");

            commit.subject = [
                firstLine.replace(/[^\S\r\n]{2,}/g, " "),
                ...lines,
            ].join("\n");

            return commit;
        })
    }

    async normalizeCommits(commits: Commit[]): Promise<Commit[]> {
        const normalizeCommits = await Promise.all(
            commits.map(async (commit) => this.normalizeCommit(commit))
        )

        return normalizeCommits.filter(Boolean)
    }

    async normalizeCommit(commit: Commit): Promise<Commit | undefined> {
        const omitCommit = await this.hooks.omitCommit.promise(commit)

        if (omitCommit) {
            return;
        }

        return commit;
    }
}