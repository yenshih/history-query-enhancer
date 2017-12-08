import {
    History,
    Location,
    LocationDescriptorObject,
    LocationState,
    Action,
    UnregisterCallback,
    Path,
    Href,
} from 'history';

export interface EnhancedHistory extends History {
    location: EnhancedLocation<any>;
    push(path: Path, state?: LocationState): void;
    push<Q extends {}>(location: EnhancedLocationDescriptorObject<Q>): void;
    replace(path: Path, state?: LocationState): void;
    replace<Q extends {}>(location: EnhancedLocationDescriptorObject<Q>): void;
    block(prompt?: boolean | string | EnhancedTransitionPromptHook): UnregisterCallback;
    listen(listener: EnhancedLocationListener): UnregisterCallback;
    createHref<Q extends {}>(location: EnhancedLocationDescriptorObject<Q>): Href;
}

export interface EnhancedLocation<Q extends {}> extends Location {
    query: Partial<Q>;
}

export interface EnhancedLocationDescriptorObject<Q extends {}> extends LocationDescriptorObject {
    query?: Q;
}

export type EnhancedLocationDescriptor<Q extends {}> = Path | EnhancedLocationDescriptorObject<Q>;

export type EnhancedTransitionPromptHook = <Q extends {}>(
    location: EnhancedLocation<Q>,
    action: Action,
) => string | false | void;

export type EnhancedLocationListener = <Q extends {}>(location: EnhancedLocation<Q>, action: Action) => void;

export interface QueryTransformer {
    parse<Q extends {}>(str: string): Q;
    stringify<Q extends {}>(obj: Q): string;
}
