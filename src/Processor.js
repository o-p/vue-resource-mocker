export default class Processor {
    /**
     * The order to search handlers, higher priority would be the prior.
     */
    static get priority() { return 100; }

    /**
     * Provide function name expect to be called in CamelCase,
     * Users invoke it like `mockNextTerm` or `mockAllTerms`.
     *
     * If function names are duplicated in different processors,
     * higher priority one would be used.
     */
    static get mapping() {
        return {
            one: 'NextTerm',
            all: 'AllTerms',
        };
    }

    registOneTimeHandler(handler) {}

    registAllTimeHandler(handler) {}

    getHandler(request) {}
}
