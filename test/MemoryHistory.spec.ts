import createMemoryHistory from 'history/createMemoryHistory';
import { getConfirmation } from 'history/DOMUtils';
import { compose } from 'redux';
import queryString from 'query-string';

import withQuery, { EnhancedHistory } from '../src';

import * as TestSequences from './helpers';

describe('a memory history', () => {
    const createHistory = compose(withQuery(queryString), createMemoryHistory);

    describe('by default', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createHistory();
        });

        describe('length', () => {
            it('should work', () => expect(history.length).toBe(1));
        });

        describe('listen', () => {
            it('does not immediately call listeners', (done) => {
                TestSequences.listen(history, done);
            });
        });

        describe('the initial location', () => {
            it('has a key', (done) => {
                TestSequences.initialLocationHasKey(history, done);
            });
        });

        describe('push a new path', () => {
            it('calls change listeners with the new location', (done) => {
                TestSequences.pushNewLocation(history, done);
            });
        });

        describe('push the same path', () => {
            it('calls change listeners with the new location', (done) => {
                TestSequences.pushSamePath(history, done);
            });
        });

        describe('push state', () => {
            it('calls change listeners with the new location', (done) => {
                TestSequences.pushState(history, done);
            });
        });

        describe('push with no pathname', () => {
            it('calls change listeners with the normalized location', (done) => {
                TestSequences.pushMissingPathname(history, done);
            });
        });

        describe('push with a relative pathname', () => {
            it('calls change listeners with the normalized location', (done) => {
                TestSequences.pushRelativePathname(history, done);
            });
        });

        describe('push with a unicode path string', () => {
            it('creates a location with decoded properties', (done) => {
                TestSequences.pushUnicodeLocation(history, done);
            });
        });

        describe('push with an encoded path string', () => {
            it('creates a location object with decoded pathname', (done) => {
                TestSequences.pushEncodedLocation(history, done);
            });
        });

        describe('push with an invalid path string (bad percent-encoding)', () => {
            it('throws an error', (done) => {
                TestSequences.pushInvalidPathname(history, done);
            });
        });

        describe('replace a new path', () => {
            it('calls change listeners with the new location', (done) => {
                TestSequences.replaceNewLocation(history, done);
            });
        });

        describe('replace the same path', () => {
            it('calls change listeners with the new location', (done) => {
                TestSequences.replaceSamePath(history, done);
            });
        });

        describe('replace state', () => {
            it('calls change listeners with the new location', (done) => {
                TestSequences.replaceState(history, done);
            });
        });

        describe('replace  with an invalid path string (bad percent-encoding)', () => {
            it('throws an error', (done) => {
                TestSequences.replaceInvalidPathname(history, done);
            });
        });

        describe('location created by encoded and unencoded pathname', () => {
            it('produces the same location.pathname', (done) => {
                TestSequences.locationPathnameAlwaysDecoded(history, done);
            });
        });

        describe('location created with encoded/unencoded reserved characters', () => {
            it('produces different location objects', (done) => {
                TestSequences.encodedReservedCharacters(history, done);
            });
        });

        describe('goBack', () => {
            it('calls change listeners with the previous location', (done) => {
                TestSequences.goBack(history, done);
            });
        });

        describe('goForward', () => {
            it('calls change listeners with the next location', (done) => {
                TestSequences.goForward(history, done);
            });
        });

        describe('block', () => {
            it('blocks all transitions', (done) => {
                TestSequences.blockEverything(history, done);
            });
        });

        describe('block a POP without listening', () => {
            it('receives the next location and action as arguments', (done) => {
                TestSequences.blockPopWithoutListening(history, done);
            });
        });
    });

    describe('that denies all transitions', () => {
        const getUserConfirmation: typeof getConfirmation = (_, callback) => callback(false);

        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createHistory({
                getUserConfirmation,
            });
        });

        describe('push', () => {
            it('does not update the location', (done) => {
                TestSequences.denyPush(history, done);
            });
        });

        describe('goBack', () => {
            it('does not update the location', (done) => {
                TestSequences.denyGoBack(history, done);
            });
        });

        describe('goForward', () => {
            it('does not update the location', (done) => {
                TestSequences.denyGoForward(history, done);
            });
        });
    });

    describe('a transition hook', () => {
        const getUserConfirmation: typeof getConfirmation = (_, callback) => callback(true);

        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createHistory({
                getUserConfirmation,
            });
        });

        it('receives the next location and action as arguments', (done) => {
            TestSequences.transitionHookArgs(history, done);
        });

        it('cancels the transition when it returns false', (done) => {
            TestSequences.returnFalseTransitionHook(history, done);
        });
    });
});
