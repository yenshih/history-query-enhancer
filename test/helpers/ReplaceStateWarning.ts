import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            history.replace('/home', { the: 'state' });
        },
        (location, action) => {
            expect(action).toBe('REPLACE');
            expect(location).toMatchObject({
                pathname: '/home',
                /* eslint-disable-next-line no-undefined */
                state: undefined,
            });

            // We should see a warning message.
            /* eslint-disable-next-line no-console */
            expect(console.error).toBeCalledWith(
                'Hash history cannot replace state; it is ignored',
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
