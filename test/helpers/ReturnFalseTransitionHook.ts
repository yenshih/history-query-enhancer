import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location, _) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            const unblock = history.block((nextLocation) => {
                expect(nextLocation).toMatchObject({
                    pathname: '/home',
                });

                // Cancel the transition.
                return false;
            });

            history.push('/home');

            expect(history.location).toMatchObject({
                pathname: '/',
            });

            unblock();
        },
    ];

    execSteps(steps, history, done);
};
