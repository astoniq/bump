import {Bump} from "./bump";

export interface BumpPlugin {
    name: string;

    apply(bump: Bump): void
}
