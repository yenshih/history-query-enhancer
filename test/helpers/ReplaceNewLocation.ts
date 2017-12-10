import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            history.replace('/home?the=query#the-hash');
        },
        (location, action) => {
            expect(action).toBe('REPLACE');
            expect(location).toMatchObject({
                pathname: '/home',
                search: '?the=query',
                hash: '#the-hash',
                query: { the: 'query' },
            });
        },
    ];

    execSteps(steps, history, done);
};
