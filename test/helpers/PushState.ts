import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            history.push('/home?the=query#the-hash', { the: 'state' });
        },
        (location, action) => {
            expect(action).toBe('PUSH');
            expect(location).toMatchObject({
                pathname: '/home',
                search: '?the=query',
                hash: '#the-hash',
                state: { the: 'state' },
                query: { the: 'query' },
            });
        },
    ];

    execSteps(steps, history, done);
};
