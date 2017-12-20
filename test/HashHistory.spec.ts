import createHashHistory from 'history/createHashHistory';
import { getConfirmation } from 'history/DOMUtils';
import { compose } from 'redux';
import queryString from 'query-string';

import withQuery, { EnhancedHistory } from '../src';

import * as TestSequences from './helpers';

describe('a hash history', () => {
    const createHistory = compose(withQuery(queryString), createHashHistory);

    beforeEach(() => {
        window.location.hash !== '' && (window.location.hash = '');
    });

    describe('by default', () => {
        let history: EnhancedHistory;

        beforeEach(() => {
            history = createHistory();
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
            it('calls change listeners with the same location and emits a warning', (done) => {
                TestSequences.PushSamePathWarning(history, done);
            });
        });

        describe('push state', () => {
            it('calls change listeners with the new location and emits a warning', (done) => {
                TestSequences.PushStateWarning(history, done);
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
            it('calls change listeners with the new location and emits a warning', (done) => {
                TestSequences.ReplaceStateWarning(history, done);
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

        it('is called when the back button is clicked', (done) => {
            TestSequences.BackButtonTransitionHook(history, done);
        });

        it('cancels the transition when it returns false', (done) => {
            TestSequences.ReturnFalseTransitionHook(history, done);
        });
    });

    describe('"hashbang" hash path coding', () => {
        let history: EnhancedHistory;

        beforeEach(() => {
            history = createHistory({
                hashType: 'hashbang',
            });
        });

        it('properly encodes and decodes window.location.hash', (done) => {
            TestSequences.HashbangHashPathCoding(history, done);
        });
    });

    describe('"noslash" hash path coding', () => {
        let history: EnhancedHistory;

        beforeEach(() => {
            history = createHistory({
                hashType: 'noslash',
            });
        });

        it('properly encodes and decodes window.location.hash', (done) => {
            TestSequences.NoslashHashPathCoding(history, done);
        });
    });

    describe('"slash" hash path coding', () => {
        let history: EnhancedHistory;

        beforeEach(() => {
            history = createHistory({
                hashType: 'slash',
            });
        });

        it('properly encodes and decodes window.location.hash', (done) => {
            TestSequences.SlashHashPathCoding(history, done);
        });
    });

    describe('basename', () => {
        it('strips the basename from the pathname', () => {
            window.location.hash = '#/prefix/pathname';
            const history = createHistory({ basename: '/prefix' });
            expect(history.location.pathname).toEqual('/pathname');
        });

        it('is not case-sensitive', () => {
            window.location.hash = '#/PREFIX/pathname';
            const history = createHistory({ basename: '/prefix' });
            expect(history.location.pathname).toEqual('/pathname');
        });

        it('does not strip partial prefix matches', () => {
            window.location.hash = '#/prefixed/pathname';
            const history = createHistory({ basename: '/prefix' });
            expect(history.location.pathname).toEqual('/prefixed/pathname');
        });

        it('strips when path is only the prefix', () => {
            window.location.hash = '#/prefix';
            const history = createHistory({ basename: '/prefix' });
            expect(history.location.pathname).toEqual('/');
        });

        it('strips with no pathname, but with a search string', () => {
            window.location.hash = '#/prefix?a=b';
            const history = createHistory({ basename: '/prefix' });
            expect(history.location.pathname).toEqual('/');
        });

        it('strips with no pathname, but with a hash string', () => {
            window.location.hash = '#/prefix#rest';
            const history = createHistory({ basename: '/prefix' });
            expect(history.location.pathname).toEqual('/');
        });
    });
});
