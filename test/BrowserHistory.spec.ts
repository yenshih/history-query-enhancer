import createBrowserHistory from 'history/createBrowserHistory';
import { getConfirmation } from 'history/DOMUtils';
import { compose } from 'redux';
import queryString from 'query-string';

import { withQuery, EnhancedHistory } from '../src';

import * as TestSequences from './helpers';

describe('a browser history', () => {
    const createHistory = compose(withQuery(queryString), createBrowserHistory);

    beforeEach(() => {
        window.history.replaceState(null, '', '/');
    });

    describe('by default', () => {
        let history: EnhancedHistory;

        beforeEach(() => {
            history = createHistory(undefined);
        });

        describe('length', () => {
            it('should work', () => expect(history.length).toBe(1));
        });

        describe('listen', () => {
            it('does not immediately call listeners', (done) => {
                TestSequences.Listen(history, done);
            });
        });

        describe('the initial location', () => {
            it('does not have a key', (done) => {
                TestSequences.InitialLocationNoKey(history, done);
            });
        });

        describe('push a new path', () => {
            it('calls change listeners with the new location', (done) => {
                TestSequences.PushNewLocation(history, done);
            });
        });

        describe('push the same path', () => {
            it('calls change listeners with the new location', (done) => {
                TestSequences.PushSamePath(history, done);
            });
        });

        describe('push state', () => {
            it('calls change listeners with the new location', (done) => {
                TestSequences.PushState(history, done);
            });
        });

        describe('push with no pathname', () => {
            it('calls change listeners with the normalized location', (done) => {
                TestSequences.PushMissingPathname(history, done);
            });
        });

        describe('push with a relative pathname', () => {
            it('calls change listeners with the normalized location', (done) => {
                TestSequences.PushRelativePathname(history, done);
            });
        });

        describe('push with a unicode path string', () => {
            it('creates a location with decoded properties', (done) => {
                TestSequences.PushUnicodeLocation(history, done);
            });
        });

        describe('push with an encoded path string', () => {
            it('creates a location object with decoded pathname', (done) => {
                TestSequences.PushEncodedLocation(history, done);
            });
        });

        describe('push with an invalid path string (bad percent-encoding)', () => {
            it('throws an error', (done) => {
                TestSequences.PushInvalidPathname(history, done);
            });
        });

        describe('replace a new path', () => {
            it('calls change listeners with the new location', (done) => {
                TestSequences.ReplaceNewLocation(history, done);
            });
        });

        describe('replace the same path', () => {
            it('calls change listeners with the new location', (done) => {
                TestSequences.ReplaceSamePath(history, done);
            });
        });

        describe('replace state', () => {
            it('calls change listeners with the new location', (done) => {
                TestSequences.ReplaceState(history, done);
            });
        });

        describe('replace  with an invalid path string (bad percent-encoding)', () => {
            it('throws an error', (done) => {
                TestSequences.ReplaceInvalidPathname(history, done);
            });
        });

        describe('location created by encoded and unencoded pathname', () => {
            it('produces the same location.pathname', (done) => {
                TestSequences.LocationPathnameAlwaysDecoded(history, done);
            });
        });

        describe('location created with encoded/unencoded reserved characters', () => {
            it('produces different location objects', (done) => {
                TestSequences.EncodedReservedCharacters(history, done);
            });
        });

        describe('goBack', () => {
            it('calls change listeners with the previous location', (done) => {
                TestSequences.GoBack(history, done);
            });
        });

        describe('goForward', () => {
            it('calls change listeners with the next location', (done) => {
                TestSequences.GoForward(history, done);
            });
        });

        describe('block', () => {
            it('blocks all transitions', (done) => {
                TestSequences.BlockEverything(history, done);
            });
        });

        describe('block a POP without listening', () => {
            it('receives the next location and action as arguments', (done) => {
                TestSequences.BlockPopWithoutListening(history, done);
            });
        });
    });

    describe('that denies all transitions', () => {
        const getUserConfirmation: typeof getConfirmation = (_, callback) => callback(false);

        let history: EnhancedHistory;

        beforeEach(() => {
            history = createHistory({
                getUserConfirmation,
            });
        });

        describe('clicking on a link (push)', () => {
            it('does not update the location', (done) => {
                TestSequences.DenyPush(history, done);
            });
        });

        describe('clicking the back button (goBack)', () => {
            it('does not update the location', (done) => {
                TestSequences.DenyGoBack(history, done);
            });
        });

        describe('clicking the forward button (goForward)', () => {
            it('does not update the location', (done) => {
                TestSequences.DenyGoForward(history, done);
            });
        });
    });

    describe('a transition hook', () => {
        const getUserConfirmation: typeof getConfirmation = (_, callback) => callback(true);

        let history: EnhancedHistory;

        beforeEach(() => {
            history = createHistory({
                getUserConfirmation,
            });
        });

        it('receives the next location and action as arguments', (done) => {
            TestSequences.TransitionHookArgs(history, done);
        });

        it('cancels the transition when it returns false', (done) => {
            TestSequences.ReturnFalseTransitionHook(history, done);
        });

        it('is called when the back button is clicked', (done) => {
            TestSequences.BackButtonTransitionHook(history, done);
        });
    });

    describe('basename', () => {
        it('strips the basename from the pathname', () => {
            window.history.replaceState(null, '', '/prefix/pathname');
            const history = createHistory({ basename: '/prefix' });
            expect(history.location.pathname).toEqual('/pathname');
        });

        it('is not case-sensitive', () => {
            window.history.replaceState(null, '', '/PREFIX/pathname');
            const history = createHistory({ basename: '/prefix' });
            expect(history.location.pathname).toEqual('/pathname');
        });

        it('does not strip partial prefix matches', () => {
            window.history.replaceState(null, '', '/prefixed/pathname');
            const history = createHistory({ basename: '/prefix' });
            expect(history.location.pathname).toEqual('/prefixed/pathname');
        });

        it('strips when path is only the prefix', () => {
            window.history.replaceState(null, '', '/prefix');
            const history = createHistory({ basename: '/prefix' });
            expect(history.location.pathname).toEqual('/');
        });

        it('strips with no pathname, but with a search string', () => {
            window.history.replaceState(null, '', '/prefix?a=b');
            const history = createHistory({ basename: '/prefix' });
            expect(history.location.pathname).toEqual('/');
        });

        it('strips with no pathname, but with a hash string', () => {
            window.history.replaceState(null, '', '/prefix#rest');
            const history = createHistory({ basename: '/prefix' });
            expect(history.location.pathname).toEqual('/');
        });
    });
});
