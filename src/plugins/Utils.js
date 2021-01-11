const Utils = {
    install(Vue, options) {
        Vue.$utils = Utils;
        Vue.prototype.$utils = Utils;
    },

    addParamsToUrl(url, params) {
        if(!url)
            throw Error('Url is required');

        let isNotFirstParam = false
        if(params && Object.keys(params).length) {
            url += '?';
            Object.keys(params).forEach(item => {
                if(params[item]){
                    if(isNotFirstParam)
                        url += '&';
                    url += `${item}=${params[item]}`;
                }
                if(!isNotFirstParam) {
                    isNotFirstParam = true;
                }
            });
        }

        return url;
    }
}

export default Utils

