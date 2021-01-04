/* eslint-disable */
import axios from "axios";
import JwtService from "@/core/services/jwt.service";

/**
 * Service to call HTTP request via Axios
 */
const ApiServiceAuth = {
  axiosInstance: null,
  loginUrl: "http://10.56.16.50:8888/pod/authentication/true",
  init() {
    this.axiosInstance = axios.create({
      baseURL: "https://accounts.pod.ir/oauth2",
      timeout: 5000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic"
        //'X-Custom-Header': 'foobar'
      },
      validateStatus: (status) => {
        return true;
      },
    });

    this.axiosInstance.interceptors.response.use(response => {
      if(response.status >= 400) {
        if (response.status === 401) {
          console.log("User has been logged out! Redirecting back to login page ...");
          window.location.href = this.loginUrl;
        }

        if(response.data.unAuthorizedRequest) {
          window.location.href = this.loginUrl;
        }

        throw response;
      } else {
        return response;
      }
    }, (error) => {
      if (error.response.status === 401) {
        console.log("User has been logged out! Redirecting back to login page ...");
        window.location.href = this.loginUrl;
      }

      return error;
    });

    // Vue.use(VueAxios, axios);
    // Vue.axios.defaults.baseURL = "https://accounts.pod.ir/oauth2";
  },

  /**
   * Set the default HTTP request headers
   */
  setHeader() {
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Token ${JwtService.getToken()}`;
  },

  /**
   * Set the default HTTP request headers
   */
  addHeaders(headers) {
    this.axiosInstance.defaults.headers.common = {
      ...this.axiosInstance.defaults.headers.common,
      ...headers
    };
  },

  query(resource, params) {
    return this.axiosInstance.get(resource, params).catch(error => {
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
  get(resource, slug = "") {
    return this.axiosInstance.get(`${resource}/${slug}`).catch(error => {
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
    return this.axiosInstance.post(`${resource}`, params);
  },

  /**
   * Send the UPDATE HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  update(resource, slug, params) {
    return this.axiosInstance.put(`${resource}/${slug}`, params);
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params) {
    return this.axiosInstance.put(`${resource}`, params);
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */
  delete(resource) {
    return this.axiosInstance.delete(resource).catch(error => {
      // console.log(error);
      throw new Error(`[RWV] ApiService ${error}`);
    });
  }
};

export default ApiServiceAuth;
