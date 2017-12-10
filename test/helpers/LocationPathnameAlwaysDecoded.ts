import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        () => {
            // encoded string
            const pathname = '/%E6%AD%B4%E5%8F%B2';
            history.replace(pathname);
        },
        (location) => {
            expect(location).toMatchObject({
                pathname: '/歴史',
            });

            // encoded object
            const pathname = '/%E6%AD%B4%E5%8F%B2';
            history.replace({ pathname });
        },
        (location) => {
            expect(location).toMatchObject({
                pathname: '/歴史',
            });
            // unencoded string
            const pathname = '/歴史';
            history.replace(pathname);
        },
        (location) => {
            expect(location).toMatchObject({
                pathname: '/歴史',
            });
            // unencoded object
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
