import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            expect(window.location.hash).toBe('#/');

            history.push('/home?the=query#the-hash');
        },
        (location) => {
            expect(location).toMatchObject({
                pathname: '/home',
                search: '?the=query',
                hash: '#the-hash',
                query: { the: 'query' },
            });

            expect(window.location.hash).toBe('#/home?the=query#the-hash');

            history.goBack();
        },
        (location) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            expect(window.location.hash).toBe('#/');

            history.goForward();
        },
        (location, _) => {
            expect(location).toMatchObject({
                pathname: '/home',
                search: '?the=query',
                hash: '#the-hash',
                query: { the: 'query' },
            });

            expect(window.location.hash).toBe('#/home?the=query#the-hash');
        },
    ];

    execSteps(steps, history, done);
};
