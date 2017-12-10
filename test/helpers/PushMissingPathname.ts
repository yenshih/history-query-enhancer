import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            history.push('/home?the=query#the-hash');
        },
        (location, action) => {
            expect(action).toBe('PUSH');
            expect(location).toMatchObject({
                pathname: '/home',
                search: '?the=query',
                hash: '#the-hash',
                query: { the: 'query' },
            });

            history.push('?another=query#another-hash');
        },
        (location, action) => {
            expect(action).toBe('PUSH');
            expect(location).toMatchObject({
                pathname: '/home',
                search: '?another=query',
                hash: '#another-hash',
                query: { another: 'query' },
            });
        },
    ];

    execSteps(steps, history, done);
};
