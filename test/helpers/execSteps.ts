import { UnregisterCallback } from 'history';

import { EnhancedHistory, EnhancedLocationListener } from '../../src';

export default (
    steps: ReadonlyArray<EnhancedLocationListener>,
    history: EnhancedHistory,
    done: (...args: any[]) => any,
) => {
    let index = 0;
    let unlisten: UnregisterCallback;
    let cleandUp = false;

    const cleanup = (err?: Error) => {
        if (!cleandUp) {
            cleandUp = true;
            unlisten();
            done(err);
        }
    };

    const execNextStep: EnhancedLocationListener = (location, action) => {
        try {
            const nextStep = steps[index];
            if (typeof nextStep !== 'function') {
                throw new Error(`Test is missing step ${index}.`);
            }
            index = index + 1;
            nextStep(location, action);
            index === steps.length && cleanup();
        } catch (err) {
            cleanup(err);
        }
    };

    if (!steps.length) {
        done();
        return;
    }

    unlisten = history.listen(execNextStep);
    execNextStep(history.location, history.action);
};
