class AsyncIterator {
    constructor(promiseList = [], concurrencyCount = 1) {
        if (!promiseList.length) {
            throw new Error('not a list');
        }
        // 要迭代的异步对象
        this._iterableList = promiseList;
        // 支持并发处理
        this._concurrencyCount = concurrencyCount;
    }
    _splitIterableList() {
        const result = [];
        let taskList = []
        for (const iterable of this._iterableList) {
            // 当 taskList 小于限制数时，直接添加
            if (taskList.length < this._concurrencyCount) {
                taskList.push(iterable);
            }
            // 当 taskList 等于限制数时，整个 taskList 添加到 result 中，并将 taskList 置为空
            if (taskList.length === this._concurrencyCount) {
                result.push(taskList);
                taskList = [];
            }
        }
        return result;
    }
    async *[Symbol.asyncIterator] () {
        const splitedIterableList = this._splitIterableList();
        for (let taskList of splitedIterableList) {
            yield await Promise.all(taskList)
        }
    }
}

module.exports = AsyncIterator;
