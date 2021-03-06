import createBrowserHistory from 'history/createBrowserHistory';
import createHashHistory from 'history/createHashHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import { compose } from 'redux';
import queryString from 'query-string';

import withQuery, { EnhancedHistory } from '../src';

const createEnhancedBrowserHistory = compose(withQuery(queryString), createBrowserHistory);
const createEnhancedHashHistory = compose(withQuery(queryString), createHashHistory);
const createEnhancedMemoryHistory = compose(withQuery(queryString), createMemoryHistory);

describe('a browser history', () => {
    describe('with no basename', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createEnhancedBrowserHistory();
        });

        it('knows how to create hrefs', () => {
            let href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                hash: '#the-hash',
            });

            expect(href).toEqual('/the/path?the=query#the-hash');

            href = history.createHref({
                pathname: '/the/path',
                hash: '#the-hash',
                query: { the: 'query' },
            });

            expect(href).toEqual('/the/path?the=query#the-hash');

            href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                hash: '#the-hash',
                query: { another: 'query' },
            });

            expect(href).toEqual('/the/path?another=query#the-hash');
        });
    });

    describe('with a basename', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createEnhancedBrowserHistory({ basename: '/the/base' });
        });

        it('knows how to create hrefs', () => {
            let href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                hash: '#the-hash',
            });

            expect(href).toEqual('/the/base/the/path?the=query#the-hash');

            href = history.createHref({
                pathname: '/the/path',
                hash: '#the-hash',
                query: { the: 'query' },
            });

            expect(href).toEqual('/the/base/the/path?the=query#the-hash');

            href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                hash: '#the-hash',
                query: { another: 'query' },
            });

            expect(href).toEqual('/the/base/the/path?another=query#the-hash');
        });
    });

    describe('with a bad basename', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createEnhancedBrowserHistory({ basename: '/the/bad/base/' });
        });

        it('knows how to create hrefs', () => {
            let href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                hash: '#the-hash',
            });

            expect(href).toEqual('/the/bad/base/the/path?the=query#the-hash');

            href = history.createHref({
                pathname: '/the/path',
                hash: '#the-hash',
                query: { the: 'query' },
            });

            expect(href).toEqual('/the/bad/base/the/path?the=query#the-hash');

            href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                hash: '#the-hash',
                query: { another: 'query' },
            });

            expect(href).toEqual('/the/bad/base/the/path?another=query#the-hash');
        });
    });

    describe('with a slash basename', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createEnhancedBrowserHistory({ basename: '/' });
        });

        it('knows how to create hrefs', () => {
            let href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                hash: '#the-hash',
            });

            expect(href).toEqual('/the/path?the=query#the-hash');

            href = history.createHref({
                pathname: '/the/path',
                hash: '#the-hash',
                query: { the: 'query' },
            });

            expect(href).toEqual('/the/path?the=query#the-hash');

            href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                hash: '#the-hash',
                query: { another: 'query' },
            });

            expect(href).toEqual('/the/path?another=query#the-hash');
        });
    });

    describe('encoding', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createEnhancedBrowserHistory();
        });

        it('does not encode the generated path', () => {
            // Encoded
            const encodedHref = history.createHref({
                pathname: '/%23abc',
            });
            // Unencoded
            const unencodedHref = history.createHref({
                pathname: '/#abc',
            });

            expect(encodedHref).toEqual('/%23abc');
            expect(unencodedHref).toEqual('/#abc');
        });
    });
});

describe('a hash history', () => {
    describe('with default encoding', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createEnhancedHashHistory();
        });

        it('knows how to create hrefs', () => {
            let href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                hash: '#the-hash',
            });

            expect(href).toEqual('#/the/path?the=query#the-hash');

            href = history.createHref({
                pathname: '/the/path',
                hash: '#the-hash',
                query: { the: 'query' },
            });

            expect(href).toEqual('#/the/path?the=query#the-hash');

            href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                hash: '#the-hash',
                query: { another: 'query' },
            });

            expect(href).toEqual('#/the/path?another=query#the-hash');
        });
    });

    describe('with hashType="noslash"', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createEnhancedHashHistory({ hashType: 'noslash' });
        });

        it('knows how to create hrefs', () => {
            let href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                hash: '#the-hash',
            });

            expect(href).toEqual('#the/path?the=query#the-hash');

            href = history.createHref({
                pathname: '/the/path',
                hash: '#the-hash',
                query: { the: 'query' },
            });

            expect(href).toEqual('#the/path?the=query#the-hash');

            href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                hash: '#the-hash',
                query: { another: 'query' },
            });

            expect(href).toEqual('#the/path?another=query#the-hash');
        });
    });

    describe('with hashType="hashbang"', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createEnhancedHashHistory({ hashType: 'hashbang' });
        });

        it('knows how to create hrefs', () => {
            let href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                hash: '#the-hash',
            });

            expect(href).toEqual('#!/the/path?the=query#the-hash');

            href = history.createHref({
                pathname: '/the/path',
                hash: '#the-hash',
                query: { the: 'query' },
            });

            expect(href).toEqual('#!/the/path?the=query#the-hash');

            href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                hash: '#the-hash',
                query: { another: 'query' },
            });

            expect(href).toEqual('#!/the/path?another=query#the-hash');
        });
    });

    describe('with a basename', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createEnhancedHashHistory({ basename: '/the/base' });
        });

        it('knows how to create hrefs', () => {
            let href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
            });

            expect(href).toEqual('#/the/base/the/path?the=query');

            href = history.createHref({
                pathname: '/the/path',
                query: { the: 'query' },
            });

            expect(href).toEqual('#/the/base/the/path?the=query');

            href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                query: { another: 'query' },
            });

            expect(href).toEqual('#/the/base/the/path?another=query');
        });
    });

    describe('with a bad basename', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createEnhancedHashHistory({ basename: '/the/bad/base/' });
        });

        it('knows how to create hrefs', () => {
            let href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
            });

            expect(href).toEqual('#/the/bad/base/the/path?the=query');

            href = history.createHref({
                pathname: '/the/path',
                query: { the: 'query' },
            });

            expect(href).toEqual('#/the/bad/base/the/path?the=query');

            href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                query: { another: 'query' },
            });

            expect(href).toEqual('#/the/bad/base/the/path?another=query');
        });
    });

    describe('with a slash basename', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createEnhancedHashHistory({ basename: '/' });
        });

        it('knows how to create hrefs', () => {
            let href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
            });

            expect(href).toEqual('#/the/path?the=query');

            href = history.createHref({
                pathname: '/the/path',
                query: { the: 'query' },
            });

            expect(href).toEqual('#/the/path?the=query');

            href = history.createHref({
                pathname: '/the/path',
                search: '?the=query',
                query: { another: 'query' },
            });

            expect(href).toEqual('#/the/path?another=query');
        });
    });

    describe('encoding', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createEnhancedHashHistory();
        });

        it('does not encode the generated path', () => {
            // Encoded
            const encodedHref = history.createHref({
                pathname: '/%23abc',
            });
            // Unencoded
            const unencodedHref = history.createHref({
                pathname: '/#abc',
            });

            expect(encodedHref).toEqual('#/%23abc');
            expect(unencodedHref).toEqual('#/#abc');
        });
    });
});

describe('a memory history', () => {
    let history: EnhancedHistory = null;

    beforeEach(() => {
        history = createEnhancedMemoryHistory();
    });

    it('knows how to create hrefs', () => {
        let href = history.createHref({
            pathname: '/the/path',
            search: '?the=query',
            hash: '#the-hash',
        });

        expect(href).toEqual('/the/path?the=query#the-hash');

        href = history.createHref({
            pathname: '/the/path',
            hash: '#the-hash',
            query: { the: 'query' },
        });

        expect(href).toEqual('/the/path?the=query#the-hash');

        href = history.createHref({
            pathname: '/the/path',
            search: '?the=query',
            hash: '#the-hash',
            query: { another: 'query' },
        });

        expect(href).toEqual('/the/path?another=query#the-hash');
    });

    describe('encoding', () => {
        let history: EnhancedHistory = null;

        beforeEach(() => {
            history = createEnhancedMemoryHistory();
        });

        it('does not encode the generated path', () => {
            // Encoded
            const encodedHref = history.createHref({
                pathname: '/%23abc',
            });
            // Unencoded
            const unencodedHref = history.createHref({
                pathname: '/#abc',
            });

            expect(encodedHref).toEqual('/%23abc');
            expect(unencodedHref).toEqual('/#abc');
        });
    });
});
