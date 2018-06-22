import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        () => {
            // Encoded string
            const pathname = '/view/%23abc';

            history.replace(pathname);
        },
        (location) => {
            expect(location).toMatchObject({
                pathname: '/view/%23abc',
            });

            // Encoded object
            const pathname = '/view/%23abc';

            history.replace({ pathname });
        },
        (location) => {
            expect(location).toMatchObject({
                pathname: '/view/%23abc',
            });
            // Unencoded string
            const pathname = '/view/#abc';

            history.replace(pathname);
        },
        (location, _) => {
            expect(location).toMatchObject({
                pathname: '/view/',
                hash: '#abc',
            });
        },
    ];

    execSteps(steps, history, done);
};
