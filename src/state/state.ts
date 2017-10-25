import * as http from "http";
import { IRequest } from "requests";
import { IRule } from "../rules/config";
import { emitter } from "./emitter";

interface IState {
    hits: IHit[];
}

interface IHit {
    id: number;
    url: string;
    request: {
        time: Date;
        body: string;
        headers: {
            contentType: string | null,
        };
    };
    response?: {
        time: Date;
        headers: {
            contentType: string | null,
        };
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
            headers: {
                contentType: getContentTypeHeader(request.headers),
            },
            body: "todo", // request.
        },
        appliedRules: [],
    };

    state.hits.push(hit);
    hitIdToHit.set(hit.id, hit);

    emitter.emit("newRequest", mapToRequest(hit));

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

export function addHitResponse(hitId: number, responseBody: string, response: http.ServerResponse): void {
    const hit = hitIdToHit.get(hitId);

    if (!hit) {
        throw new Error(`Could not find state for hit ID '${hitId}'`);
    }

    if (hit.response) {
        throw new Error(`Already set response state for hit ID '${hitId}'`);
    }

    hit.response = {
        time: new Date(),
        headers: {
            contentType: getContentTypeHeader(response.getHeaders()),
        },
        body: responseBody,
    };

    emitter.emit("newResponse", {
        id: hitId,
        response: hit.response,
        appliedRules: hit.appliedRules.map((rule) => rule.id), // TODO: Could emit another event
    });
}

const mapToRequest = (hit: IHit): IRequest => ({
    id: hit.id,
    url: hit.url,
    request: hit.request,
    response: hit.response,
    appliedRules: hit.appliedRules.map((rule) => rule.id),
});

function getContentTypeHeader(headers: { [key: string]: number | string | string[] | undefined }): string | null {
    const value = headers["content-type"];
    if (!value) {
        return null;
    }

    if (value instanceof Array) {
        return value.join(", ");
    }

    return value.toString();
}
