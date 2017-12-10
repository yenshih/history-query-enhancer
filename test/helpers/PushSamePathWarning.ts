import { EnhancedHistory, EnhancedLocation, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    let prevLocation: EnhancedLocation<any>;

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

            prevLocation = location;

            history.push('/home');
        },
        (location, action) => {
            expect(action).toBe('PUSH');
            expect(location).toMatchObject({
                pathname: '/home',
            });

            // We should get the SAME location object. Nothing
            // new was added to the history stack.
            expect(location).toBe(prevLocation);

            // We should see a warning message.
            expect(console.error).toBeCalledWith(
                'Hash history cannot PUSH the same path; a new entry will not be added to the history stack',
            );
        },
    ];

    const consoleError = console.error; // tslint:disable-line no-console

    console.error = jest.fn();

    execSteps(steps, history, () => {
        console.error = consoleError; // tslint:disable-line no-console
        done();
    });
};
