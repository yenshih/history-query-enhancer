import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location, _) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            const unblock = history.block();

            history.push('/home');

            expect(history.location).toMatchObject({
                pathname: '/',
            });

            unblock();
        },
    ];

    execSteps(steps, history, done);
};
