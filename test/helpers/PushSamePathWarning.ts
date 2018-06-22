import { EnhancedHistory, EnhancedLocation, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    let prevLocation: EnhancedLocation<any> = null;

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

            /*
             * We should get the SAME location object. Nothing
             * new was added to the history stack.
             */
            expect(location).toBe(prevLocation);

            // We should see a warning message.
            /* eslint-disable-next-line no-console */
            expect(console.error).toBeCalledWith(
                'Hash history cannot PUSH the same path; a new entry will not be added to the history stack',
            );
        },
    ];
    /* eslint-disable-next-line no-console */
    const consoleError = console.error;

    /* eslint-disable-next-line no-console */
    console.error = jest.fn();

    execSteps(steps, history, () => {
        /* eslint-disable-next-line no-console */
        console.error = consoleError;
        done();
    });
};
