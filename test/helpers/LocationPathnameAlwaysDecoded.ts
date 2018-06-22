import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        () => {
            // Encoded string
            const pathname = '/%E6%AD%B4%E5%8F%B2';

            history.replace(pathname);
        },
        (location) => {
            expect(location).toMatchObject({
                pathname: '/歴史',
            });

            // Encoded object
            const pathname = '/%E6%AD%B4%E5%8F%B2';

            history.replace({ pathname });
        },
        (location) => {
            expect(location).toMatchObject({
                pathname: '/歴史',
            });
            // Unencoded string
            const pathname = '/歴史';

            history.replace(pathname);
        },
        (location) => {
            expect(location).toMatchObject({
                pathname: '/歴史',
            });
            // Unencoded object
            const pathname = '/歴史';

            history.replace({ pathname });
        },
        (location, _) => {
            expect(location).toMatchObject({
                pathname: '/歴史',
            });
        },
    ];

    execSteps(steps, history, done);
};
