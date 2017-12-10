import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            const pathname = '/歴史';
            const search = '?キー=値';
            const hash = '#ハッシュ';
            history.push(pathname + search + hash);
        },
        (location, action) => {
            expect(action).toBe('PUSH');
            expect(location).toMatchObject({
                pathname: '/歴史',
                search: '?キー=値',
                hash: '#ハッシュ',
                query: { キー: '値' },
            });
        },
    ];

    execSteps(steps, history, done);
};
