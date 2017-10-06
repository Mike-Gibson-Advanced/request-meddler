import * as http from "http";

interface IState {
    [ urlPattern: string ]: IPatternState | undefined;
}

interface IPatternState {
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
}

const hitIdToHit = new Map<number, IHit>();
const state: IState = {};
let hitIdCounter = 0;

export const getState = () => {
    // TODO: Make immutable?
    return state;
};

export function addHitRequest(urlPattern: string, request: http.ServerRequest): number {
    let patternState = state[urlPattern];

    if (!patternState) {
        patternState = { hits: [] };
        state[urlPattern] = patternState;
    }

    const hit: IHit = {
        id: hitIdCounter++,
        url: request.url || "",
        request: {
            time: new Date(),
            body: "todo", // request.
        },
    };

    patternState.hits.push(hit);
    hitIdToHit.set(hit.id, hit);

    return hit.id;
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
