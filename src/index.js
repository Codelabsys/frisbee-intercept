
function FrisbeeAPIInterceptor(API) {
    var interceptors = [];
    var attachInterceptorsTo = function (API) {
        var APIInterceptableMethods = ['get', 'head', 'post', 'put', 'del', 'options', 'patch'];
        for (var key in API) {
            if (APIInterceptableMethods.includes(key)) {
                API[key] = (function (APIMethod) {
                    return function (...args) {
                        return interceptor(APIMethod, ...args);
                    };
                })(API[key]);
            }
        }
    }(API);

    var interceptor = function (APIMethod, ...args) {
        const reversedInterceptors = interceptors.reduce((array, interceptor) => [interceptor].concat(array), []);
        let promise = Promise.resolve(args);

        // Register request interceptors
        reversedInterceptors.forEach(({ request, requestError }) => {
            if (request || requestError) {
                promise = promise.then((path, ...args) => request(API.opts.baseURI + path, ...args), requestError);
            }
        });

        // Register APIMethod call
        promise = promise.then(args => APIMethod(...args));

        // Register response interceptors
        reversedInterceptors.forEach(({ response, responseError }) => {
            if (response || responseError) {
                promise = promise.then(response, responseError);
            }
        });

        return promise;
    }

    return {
        register: function (interceptor) {
            interceptors.push(interceptor);
            return () => {
                const index = interceptors.indexOf(interceptor);
                if (index >= 0) {
                    interceptors.splice(index, 1);
                }
            };
        },
        clear: function () {
            interceptors = [];
        }
    };
}


export default FrisbeeAPIInterceptor;