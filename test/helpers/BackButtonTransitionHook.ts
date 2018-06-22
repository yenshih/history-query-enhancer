import { UnregisterCallback } from 'history';

import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    let unblock: UnregisterCallback = null;
    let hookWasCalled = false;

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

            unblock = history.block(() => {
                hookWasCalled = true;
            });

            window.history.go(-1);
        },
        (location, action) => {
            expect(action).toBe('POP');
            expect(location).toMatchObject({
                pathname: '/',
            });

            expect(hookWasCalled).toBe(true);

            unblock();
        },
    ];

    execSteps(steps, history, done);
};
