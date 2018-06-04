import Handler from './Handler';
import Processor from './Processor';

export default class StepProcessor extends Processor {
    static get priority() { return 500; }

    static get mapping() {
        return {
            one: 'Next',
            all: 'All',
        };
    }

    constructor(opt = {}) {
        super();

        this.all = null;
        this.steps = [];

        this.configs = Object.assign({
            first: 'all',
        }, opt);
    }

    registOneTimeHandler(res, options) {
        this.steps = [...this.steps, new Handler(res, options)];
    }

    registAllTimeHandler(res, options) {
        this.all = new Handler(res, options);
    }

    getHandler() {
        const order = this.first === 'all'
            ? [this.getAll, this.getNext]
            : [this.getNext, this.getAll];

        return order.reduce((input, fn) => {
            return input || fn.call(this);
        }, null);
    }

    getNext() {
        const [next, ...rest] = this.steps;
        this.steps = rest;
        return next;
    }

    getAll() {
        return this.all;
    }
}
