import { EnhancedHistory, EnhancedLocation, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    let prevLocation: EnhancedLocation<any>;

    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            history.replace('/home');
        },
        (location, action) => {
            expect(action).toBe('REPLACE');
            expect(location).toMatchObject({
                pathname: '/home',
            });

            prevLocation = location;

            history.replace({
                pathname: '/home',
            });
        },
        (location, action) => {
            expect(action).toBe('REPLACE');
            expect(location).toMatchObject({
                pathname: '/home',
            });

            expect(location).not.toBe(prevLocation);
        },
    ];

    execSteps(steps, history, done);
};
