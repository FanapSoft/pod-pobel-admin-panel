/* eslint-disable */
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/jwt.service";

/**
 * Service to call HTTP request via Axios
 */
const ApiService = {
  //loginUrl: `http://10.56.16.50:8888/pod/authentication${(process.env.NODE_ENV !== 'production'? "/true" : '')}`,
  loginUrl: `http://10.56.16.50:8888/pod/authentication?host=${(process.env.NODE_ENV === 'production' ? encodeURI('http://10.56.16.50') : encodeURI('http://localhost:8080'))}`,
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = "http://10.56.16.50:8888";
    Vue.axios.defaults.validateStatus = () => {//status
      return true;
    };

    Vue.axios.interceptors.request.use(req => {
      req.headers.Authorization = `Bearer ${JwtService.getToken()}`;
      return req;
    });

    Vue.axios.interceptors.response.use(response => {
      //return response;
      if(response.status >= 400) {
        if (response.status === 401) {
          console.log("User has been logged out! Redirecting back to login page ...");
          window.location.href = this.loginUrl;
        }

        if(response.data && response.data.unAuthorizedRequest) {
          window.location.href = this.loginUrl;
        }

        throw response;
      } else {
        return response;
      }
    }, (error) => {
      console.log(error)
      if (error.response && error.response.status === 401) {
        console.log("User has been logged out! Redirecting back to login page ...");
        window.location.href = this.loginUrl;
      }

      return error;
    });
  },

  /**
   * Set the default HTTP request headers
   */
  setHeader() {
    Vue.axios.defaults.headers.common["Authorization"] = `Bearer ${JwtService.getToken()}`;
  },

  query(resource, params) {
    return Vue.axios.get(resource, params).catch(error => {
      // console.log(error);
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @returns {*}
   */
  get(resource) {
    return Vue.axios.get(`${resource}`).catch(error => {
      // console.log(error);
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */
  post(resource, params) {
    return Vue.axios.post(`${resource}`, params);
  },

  /**
   * Send the UPDATE HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  update(resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params);
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params) {
    return Vue.axios.put(`${resource}`, params);
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */
  delete(resource) {
    return Vue.axios.delete(resource).catch(error => {
      // console.log(error);
      throw new Error(`[RWV] ApiService ${error}`);
    });
  }
};

export default ApiService;
