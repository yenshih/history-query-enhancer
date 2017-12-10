import { Action } from 'history';

import { EnhancedHistory, EnhancedLocationListener, EnhancedLocation } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    let hookLocation: EnhancedLocation<any>;
    let hookAction: Action;
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            history.push('/home');
        },
        (location, action) => {
            expect(hookAction).toBe(action);
            expect(hookLocation).toBe(location);
        },
    ];

    const unblock = history.block((location, action) => {
        hookLocation = location;
        hookAction = action;

        return 'Are you sure?';
    });

    execSteps(steps, history, () => {
        unblock();
        done();
    });
};
