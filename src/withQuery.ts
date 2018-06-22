import { History, Location, LocationDescriptorObject, LocationState, Path } from 'history';

import {
    EnhancedHistory,
    EnhancedLocation,
    EnhancedLocationDescriptorObject,
    EnhancedTransitionPromptHook,
    EnhancedLocationListener,
    QueryTransformer,
} from '.';

const withQuery = ({ parse, stringify }: QueryTransformer) => (history: History) => {
    const enhance = <Q extends {}>(location: Location): EnhancedLocation<Q> => ({
        ...location,
        query: parse(location.search),
    });

    const diminish = <Q extends {}>({
        query,
        ...location
    }: EnhancedLocationDescriptorObject<Q>): LocationDescriptorObject => ({
        ...location,
        search: query && typeof query === 'object' ? stringify(query) : location.search,
    });

    const enhancedHistory: EnhancedHistory = {
        ...history,
        location: enhance(history.location),
        push<Q extends {}>(path: Path | EnhancedLocationDescriptorObject<Q>, state?: LocationState) {
            if (typeof path !== 'object') {
                return history.push(path, state);
            }

            return history.push(diminish(path));
        },
        replace<Q extends {}>(path: Path | EnhancedLocationDescriptorObject<Q>, state?: LocationState) {
            if (typeof path !== 'object') {
                return history.replace(path, state);
            }

            return history.replace(diminish(path));
        },
        block(prompt?: boolean | string | EnhancedTransitionPromptHook) {
            if (typeof prompt !== 'function') {
                return history.block(prompt);
            }

            return history.block((location, action) => prompt(enhance(location), action));
        },
        listen(listener: EnhancedLocationListener) {
            return history.listen((location, action) => listener(enhance(location), action));
        },
        createHref<Q extends {}>(location: EnhancedLocationDescriptorObject<Q>) {
            return history.createHref(diminish(location));
        },
    };

    Object.defineProperties(enhancedHistory, {
        length: {
            get() {
                return history.length;
            },
        },
        action: {
            get() {
                return history.action;
            },
        },
        location: {
            get() {
                return enhance(history.location);
            },
        },
    });

    return enhancedHistory;
};

export default withQuery;
