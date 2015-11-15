var runLazy = function () {
    var runQueue = [];
    var isRunning = false;

    var run = function () {
        if (isRunning) {
            return;
        }
        if (runQueue.length === 0) {
            isRunning = false;
            return;
        }

        isRunning = true;
        setTimeout(function () {
            var cur = runQueue.shift();
            cur.fn.apply(cur.context, cur.args || []);
            isRunning = false;
            run();
        }, 50);
    };

    /**
     * runLazy 函数调用
     *
     * @param {object} opt 参数列表
     * @param {Function} opt.fn 需要调用的函数
     * @param {*} opt.context 调用fn的时候的 this
     * @param {Array} opt.args 调用fn时传入的参数列表
     * @param {string} [opt.info] 此次调用的描述信息，可选
     */
    return function (opt) {
        runQueue.push(opt);
        run();
    };
}();

module.exports = {
    getInitialState: function () {
        return {
            blocks: [],
            _curIndex: -1
        };
    },
    _renderBlock: function (data, index, isSetState, callback) {
        if (this.state.blocks) {
            this.state.blocks.push(this.renderItem(data, index));
            isSetState && this.setState({
                blocks: this.state.blocks,
                _curIndex: index
            });
        }
        callback && callback();
    },
    renderByLines: function (dataList, callback) {
        var me = this;
        var max = dataList.length - 1;
        dataList.forEach(function (data, index) {
            if (index < 1) {
                me._renderBlock(data, index);
            } else {
                runLazy({
                    fn: me._renderBlock,
                    context: me,
                    args: [data, index, true, index === max ? callback : null],
                    info: index
                });
            }
        });
    },
    renderAll: function (dataList, callback) {
        var me = this;
        this.state.blocks = dataList.map(function (data, index) {
            return me.renderItem(data, index);
        });
        callback && callback();
    }
};