import { EventEmitter } from "events";
import { IQuestion } from "questions";
import { IAppliedRulesChanged, IRequest, IResponseDetails } from "requests";

interface IEventType {
    "newRequest": IRequest;
    "newResponse": IResponseDetails;
    "appliedRulesChanged": IAppliedRulesChanged;
    "askUser": IQuestion;
    "cancelAskUser": { id: number };
    "userResponse": { id: number, response: any };
}

type eventType = keyof IEventType;

interface IEmitter {
    on<TEvent extends eventType>(event: TEvent, listener: (payload: IEventType[TEvent]) => void): this;
    emit<TEvent extends eventType>(event: TEvent, payload: IEventType[TEvent] ): boolean;
    removeListener<TEvent extends eventType>(event: TEvent, listener: (payload: IEventType[TEvent]) => void): this;
}

export const emitter: IEmitter = new EventEmitter();
