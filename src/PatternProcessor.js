import Handler from './Handler';
import Processor from './Processor';

const ALL_METHODS = Symbol('ALL');

export default class PatternProcessor extends Processor {
    static get ALL() {
        return ALL_METHODS;
    }

    static get mapping() {
        return {
            // mockRequest(response, method, urlPattern, option)
            one: 'Request',
            // mockAllRequest(response, urlPattern, option)
            all: 'AllRequest',
        };
    }

    constructor() {
        super();

        this.ruls = [];
    }

    registOneTimeHandler(res, method = 'GET', pattern = '', options) {
        this.ruls = this.ruls.concat({
            method: typeof method === 'string' ? method.toUpperCase() : method,
            pattern,
            handler: new Handler(res, options),
        })
    }

    registAllTimeHandler(res, pattern, options) {
        return this.registOneTimeHandler(res, PatternProcessor.ALL, pattern, options);
    }

    getHandler({ method, url }) {
        return this.ruls.reduce((matched, rule) => {
            return matched || this.testRule(rule, method, url);
        }, null);
    }

    /**
     * @return {Handler|null}
     */
    testRule(rule, method, url) {
        // check method
        if (rule.method !== ALL_METHODS && rule.method !== method.toUpperCase()) return null;

        const valid = rule.pattern instanceof RegExp
            ? rule.pattern.test(url)
            : url.indexOf(rule.pattern) !== -1;

        return valid ? rule.handler : null;
    }
}
