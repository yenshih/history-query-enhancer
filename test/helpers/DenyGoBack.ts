import { UnregisterCallback } from 'history';

import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, , done: jest.DoneCallback) => {
    let unblock: UnregisterCallback;
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            history.push('/home');
        },
        (location, action) => {
            expect(action).toBe('PUSH');
            expect(location).toMatchObject({
                pathname: '/home',
            });

            unblock = history.block((nextLocation) => {
                expect(nextLocation).toMatchObject({
                    pathname: '/',
                });

                return 'Are you sure?';
            });

            history.goBack();
        },
        (location, action) => {
            expect(action).toBe('PUSH');
            expect(location).toMatchObject({
                pathname: '/home',
            });

            unblock();
        },
    ];

    execSteps(steps, history, done);
};
