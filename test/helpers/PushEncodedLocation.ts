import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            const pathname = '/%E6%AD%B4%E5%8F%B2';
            const search = '?%E3%82%AD%E3%83%BC=%E5%80%A4';
            const hash = '#%E3%83%8F%E3%83%83%E3%82%B7%E3%83%A5';

            history.push(pathname + search + hash);
        },
        (location, action) => {
            expect(action).toBe('PUSH');
            expect(location).toMatchObject({
                pathname: '/歴史',
                search: '?%E3%82%AD%E3%83%BC=%E5%80%A4',
                hash: '#%E3%83%8F%E3%83%83%E3%82%B7%E3%83%A5',
                query: { キー: '値' },
            });
        },
    ];

    execSteps(steps, history, done);
};
