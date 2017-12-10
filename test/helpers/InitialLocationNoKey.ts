import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (location, _) => expect(location.key).toBeFalsy(),
    ];

    execSteps(steps, history, done);
};
