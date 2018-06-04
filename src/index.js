import Handler from './Handler';
import PatternProcessor from './PatternProcessor';
import Processor from './Processor';
import StepProcessor from './StepProcessor';

const MockInterface = {};

export function interceptorCreator(config) {
    const options = Object.assign({
        processors: [],
        priorities: {},
        processorSettings: {},
    }, config);

    function getPriority({ name, priority }) {
        return options.priorities[name] || priority;
    }

    const processors = [PatternProcessor, StepProcessor, ...options.processors]
        .sort((a, b) => getPriority(b) - getPriority(a))
        .filter(theClass => Processor.isPrototypeOf(theClass))
        .map((theClass) => {
            const processor = new theClass(options.processorSettings[theClass.name]);
            const { mapping } = theClass;
            const [one, all] = ['one', 'all'].map(key => `mock${mapping[key]}`);
            // regist { mockNext, ... } methods in MockInterface
            if (!MockInterface[one]) MockInterface[one] = processor.registOneTimeHandler.bind(processor);
            if (!MockInterface[all]) MockInterface[all] = processor.registAllTimeHandler.bind(processor);

            return processor;
        });

    return function interceptor(request, next) {
        const handler = processors.reduce((handler, current) => {
            return handler || current.getHandler(request);
        }, null);

        if (handler instanceof Handler) {
            const { body, header } = handler.invoke(request);
            return request.respondWith(body, header);
        }
        return next(request);
    };
}

export const mock = MockInterface;

export function plugin(config) {

    return function MockerVuePlugin(Vue) {
        const interceptor = interceptorCreator(config);
        if (Vue && Vue.http && Array.isArray(Vue.http.interceptors)) {
            return Vue.http.interceptors.unshift(interceptor);
        }
        console.error('Fail to install the plugin');
    };
}

export default MockInterface;
