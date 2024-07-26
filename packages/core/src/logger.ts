import * as signale from "signale";

export type LogLevel = undefined | "verbose" | "veryVerbose" | "quiet";

export interface Logger {
    logLevel?: LogLevel;
    log: signale.Signale<signale.DefaultMethods>;
    verbose: signale.Signale<signale.DefaultMethods>;
    veryVerbose: signale.Signale<signale.DefaultMethods>;
}

const logger: Logger = {
    log: new signale.Signale(),
    verbose: new signale.Signale(),
    veryVerbose: new signale.Signale()
}

function toggleLogs(
    options: Record<Exclude<keyof Logger, "logLevel">, boolean>
) {
    Object.entries(options).forEach(([level, enabled]) => {
        if (enabled) {
            logger[level].enable();
        } else {
            logger[level].disable();
        }
    });
}

export function setLogLevel(newLogLevel: LogLevel) {
    logger.logLevel = newLogLevel;

    if (logger.logLevel === "verbose") {
        toggleLogs({log: true, verbose: true, veryVerbose: false});
    } else if (logger.logLevel === "veryVerbose") {
        toggleLogs({log: true, verbose: true, veryVerbose: true});
    } else if (logger.logLevel === "quiet") {
        toggleLogs({log: false, verbose: false, veryVerbose: false});
    } else {
        toggleLogs({log: true, verbose: false, veryVerbose: false});
    }
}

export const createLog = (): Logger => {
    return logger
}
