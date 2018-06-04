export default class Handler {
    constructor(response, options) {
        this.response = response;
        this.options = options;
    }

    invoke(request, next) {
        const result = typeof this.response === 'function'
            ? this.response({
                body: request.body,
                header: request.header,
                method: request.method,
                options: this.options,
                url: request.url,
            }, next)
            : this.response;

        const body = result && result.body
            ? result.body
            : result;

        const header = (result && result.header) || {};

        return {
            header: Object.assign({
                status: 200,
            }, header),
            body,
        }
    }
}
