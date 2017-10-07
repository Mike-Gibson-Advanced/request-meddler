import * as http from "http";
import { IRule } from "../rules/config";

interface IState {
    hits: IHit[];
}

interface IHit {
    id: number;
    url: string;
    request: {
        time: Date;
        body: string;
    };
    response?: {
        time: Date;
        body: string;
    };
    appliedRules: IRule[];
}

const hitIdToHit = new Map<number, IHit>();
const state: IState = { hits: [] };
let hitIdCounter = 0;

export const getState = () => {
    // TODO: Make immutable?
    return state;
};

export function addHitRequest(request: http.ServerRequest): number {
    const hit: IHit = {
        id: hitIdCounter++,
        url: request.url || "",
        request: {
            time: new Date(),
            body: "todo", // request.
        },
        appliedRules: [],
    };

    state.hits.push(hit);
    hitIdToHit.set(hit.id, hit);

    return hit.id;
}

export function linkRulesTohit(hitId: number, rules: IRule[]): void {
    const hit = hitIdToHit.get(hitId);

    if (!hit) {
        throw new Error(`Could not find state for hit ID '${hitId}'`);
    }

    if (hit.appliedRules.length) {
        throw new Error(`Already set applied rules for hit ID '${hitId}'`);
    }

    hit.appliedRules = rules;
}

export function addHitResponse(hitId: number, responseBody: string): void {
    const hit = hitIdToHit.get(hitId);

    if (!hit) {
        throw new Error(`Could not find state for hit ID '${hitId}'`);
    }

    if (hit.response) {
        throw new Error(`Already set response state for hit ID '${hitId}'`);
    }

    hit.response = {
        time: new Date(),
        body: responseBody,
    };
}
