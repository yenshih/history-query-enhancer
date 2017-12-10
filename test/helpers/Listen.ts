import { EnhancedHistory } from '../../src';

export default (history: EnhancedHistory, done: jest.DoneCallback) => {
    const spy = jest.fn();
    const unlisten = history.listen(spy);

    expect(spy).not.toHaveBeenCalled();

    unlisten();
    done();
};
