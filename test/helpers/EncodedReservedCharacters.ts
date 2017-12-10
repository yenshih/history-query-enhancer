import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        () => {
            // encoded string
            const pathname = '/view/%23abc';
            history.replace(pathname);
        },
        (location) => {
            expect(location).toMatchObject({
                pathname: '/view/%23abc',
            });

            // encoded object
            const pathname = '/view/%23abc';
            history.replace({ pathname });
        },
        (location) => {
            expect(location).toMatchObject({
                pathname: '/view/%23abc',
            });
            // unencoded string
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
