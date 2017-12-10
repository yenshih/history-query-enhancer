import { EnhancedHistory, EnhancedLocationListener } from '../../src/index';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            history.push('/the/path?the=query#the-hash');
        },
        (location, action) => {
            expect(action).toBe('PUSH');
            expect(location).toMatchObject({
                pathname: '/the/path',
                search: '?the=query',
                hash: '#the-hash',
                query: { the: 'query' },
            });

            history.push('../other/path?another=query#another-hash');
        },
        (location, action) => {
            expect(action).toBe('PUSH');
            expect(location).toMatchObject({
                pathname: '/other/path',
                search: '?another=query',
                hash: '#another-hash',
                query: { another: 'query' },
            });
        },
    ];

    execSteps(steps, history, done);
};
