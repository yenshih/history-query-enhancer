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
            expect(action).toEqual('PUSH');
            expect(location).toMatchObject({
                pathname: '/home',
            });

            history.goBack();
        },
        (location, action) => {
            expect(action).toEqual('POP');
            expect(location).toMatchObject({
                pathname: '/',
            });

            history.goForward();
        },
        (location, action) => {
            expect(action).toEqual('POP');
            expect(location).toMatchObject({
                pathname: '/home',
            });
        },
    ];

    execSteps(steps, history, done);
};
