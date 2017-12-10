import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location) => {
            expect(location).toMatchObject({
                pathname: '/',
            });

            history.push('/home');
        },
        (location, action) => {
            expect(action).toBe('PUSH');
            expect(location).toMatchObject({
                pathname: '/home',
            });

            history.push({
                pathname: '/home',
            });
        },
        (location, action) => {
            expect(action).toBe('PUSH');
            expect(location).toMatchObject({
                pathname: '/home',
            });

            history.goBack();
        },
        (location, action) => {
            expect(action).toBe('POP');
            expect(location).toMatchObject({
                pathname: '/home',
            });
        },
    ];

    execSteps(steps, history, done);
};
