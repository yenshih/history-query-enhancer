import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            history.push('/home', { the: 'state' });
        },
        (location, action) => {
            expect(action).toBe('PUSH');
            expect(location).toMatchObject({
                pathname: '/home',
                state: undefined,
            });

            // We should see a warning message.
            expect(console.error).toBeCalledWith(
                'Hash history cannot push state; it is ignored',
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
