import JsEvalNode from './js-eval-node';
import Dimension from './dimension';
import Quoted from './quoted';
import Anonymous from './anonymous';
import Expression from './expression';

const JavaScript = function(string, escaped, index, currentFileInfo) {
    this.escaped = escaped;
    this.expression = string;
    this._index = index;
    this._fileInfo = currentFileInfo;
}

JavaScript.prototype = Object.assign(new JsEvalNode(), {
    type: 'JavaScript',

    eval(context) {
        const result = this.evaluateJavaScript(this.expression, context);
        const type = typeof result;

        if (type === 'number' && !isNaN(result)) {
            return new Dimension(result);
        } else if (type === 'string') {
            return new Quoted(`"${result}"`, result, this.escaped, this._index);
        } else if (Array.isArray(result)) {
            return new Expression(
                this.evalArray(result, this.escaped, this._index).map(function(e) {
                    return e;
                }),
                true
            );
        } else {
            return new Anonymous(result);
        }
    },
    evalArray(result, escaped, _index) {
        let resultArr = []
        for (let i = 0; i < result.length; i++) {
            const type = typeof result[i];
            if (type === 'number' && !isNaN(result[i])) {
                resultArr.push(new Dimension(result[i]));
                resultArr.push(new Anonymous(', ',_index));
            } else if (type === 'string') {
                resultArr.push(new Quoted(`"${result[i]}"`, result[i], escaped, _index));
                resultArr.push(new Anonymous(', ',_index));
            } else if (Array.isArray(result[i])) {
                resultArr.push(new Anonymous(result[i].join(', ')));
                resultArr.push(new Anonymous(', '),_index);
            } else {
                resultArr.push(new Anonymous(result[i]));
                resultArr.push(new Anonymous(', '),_index);
            }
        }
        resultArr.pop()
        return resultArr
        
    }
});

export default JavaScript;
