# react-progressive
react-progressive 是一个自动处理渐进式渲染的mixin，能很好的帮你处理模块的渐进式渲染，以提升体验。

## 怎么使用

    var progressive = reauire('@ali/react-progressive');
    var MyComponent = React.createClass({
        mixins: [progressive],
        /**
         * renderItem 这个函数必须实现，用于渲染数据中的单行元素
         *
         * @param {*} data 单条数据
         * @param {number} index 数据索引
         * @return {ReactElement} 返回渲染的React元素
         */
        renderItem: function (data, index) {
            return <View key={index}><Text>{data}</Text></View>;
        },
        componentWillMount: function () {
            this.data = [
                '数据1',
                '数据2',
                '数据2',
                '数据4',
                '数据5',
                '数据6'
            ];
            // renderByLines 这个函数就是 progressive mixin 的，
            // 这个函数执行后会通过渐进式渲染的方式将每行数据渲染结果添加到 this.state.blocks 中
            this.renderByLines(this.data, function () {
                console.log('All data is render done!');
            });

            // 如果这里需要改为非渐进式渲染，而是一次性渲染的话，可以使用
            // this.renderAll(this.data);
        },
        render: function () {
            // this.state.blocks 和 this.state._curIndex 是progressive mixin 的模块数组
            // 这里注意 cur 这个属性，因为如果View的属性没有变更的话，
            // 会导致其不更新内部元素，所以这里强制其能检测到已经更新了
            return <View cur={this.state._curIndex}>{this.state.blocks}</View>;

            // 如果你需要对每个列添加ref，需要对列做一次包装，如下
            // 这样就能通过 this.refs.item_0 来访问到第一个元素了
            return (
                <View>
                    {this.data.map((d, i) => <View key={i} ref={"item_" + i}>{this.state.blocks[i]}</View>)}
                </View>
            );
        }
    });
