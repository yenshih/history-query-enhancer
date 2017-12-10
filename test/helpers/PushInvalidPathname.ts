import { EnhancedHistory, EnhancedLocationListener } from '../../src';

import execSteps from './execSteps';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const steps: ReadonlyArray<EnhancedLocationListener> = [
        (_, __) => expect(() => {
            history.push('/hello%');
        }).toThrow(
            'Pathname "/hello%" could not be decoded. This is likely caused by an invalid percent-encoding.',
        ),
    ];

    execSteps(steps, history, done);
};
