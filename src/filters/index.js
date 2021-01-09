import Vue from 'vue'

Vue.filter('firstChar', value => {
    if(!value || !value.length)
        return '';
    return value.charAt(0);
})
