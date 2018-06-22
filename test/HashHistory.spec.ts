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
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createHistory();
        });

        describe('listen', () => {
            it('does not immediately call listeners', (done) => {
                TestSequences.listen(history, done);
            });
        });

        describe('the initial location', () => {
            it('does not have a key', (done) => {
                TestSequences.initialLocationNoKey(history, done);
            });
        });

        describe('push a new path', () => {
            it('calls change listeners with the new location', (done) => {
                TestSequences.pushNewLocation(history, done);
            });
        });

        describe('push the same path', () => {
            it('calls change listeners with the same location and emits a warning', (done) => {
                TestSequences.pushSamePathWarning(history, done);
            });
        });

        describe('push state', () => {
            it('calls change listeners with the new location and emits a warning', (done) => {
                TestSequences.pushStateWarning(history, done);
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
            it('calls change listeners with the new location and emits a warning', (done) => {
                TestSequences.replaceStateWarning(history, done);
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

        describe('clicking on a link (push)', () => {
            it('does not update the location', (done) => {
                TestSequences.denyPush(history, done);
            });
        });

        describe('clicking the back button (goBack)', () => {
            it('does not update the location', (done) => {
                TestSequences.denyGoBack(history, done);
            });
        });

        describe('clicking the forward button (goForward)', () => {
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

        it('is called when the back button is clicked', (done) => {
            TestSequences.backButtonTransitionHook(history, done);
        });

        it('cancels the transition when it returns false', (done) => {
            TestSequences.returnFalseTransitionHook(history, done);
        });
    });

    describe('"hashbang" hash path coding', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createHistory({
                hashType: 'hashbang',
            });
        });

        it('properly encodes and decodes window.location.hash', (done) => {
            TestSequences.hashbangHashPathCoding(history, done);
        });
    });

    describe('"noslash" hash path coding', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createHistory({
                hashType: 'noslash',
            });
        });

        it('properly encodes and decodes window.location.hash', (done) => {
            TestSequences.noslashHashPathCoding(history, done);
        });
    });

    describe('"slash" hash path coding', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createHistory({
                hashType: 'slash',
            });
        });

        it('properly encodes and decodes window.location.hash', (done) => {
            TestSequences.slashHashPathCoding(history, done);
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
