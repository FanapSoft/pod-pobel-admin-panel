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
    },
    /**
     * Returns toFixed of numbers
     * @param value
     * @param number
     * @returns {null|*|string|string}
     */
    toFixed(value, number) {
        if(!value)
            return '0';
        let num = number? number : 2;

        if(number) {
            num = number
        }

        return value.toFixed(num);
    },
    /**
     * Formats the value like iran money
     * @param value
     * @param number
     * @returns {null|*|string|string}
     */
    formatNumber (value, number) {
        if(!value)
            return '0';
        let num = number ? number : 3;
        let re = new RegExp("\\B(?=(\\d{" + num + "})+(?!\\d))", "g");
        return value.toString().replace(re, ",");
    },
}

export default Utils

