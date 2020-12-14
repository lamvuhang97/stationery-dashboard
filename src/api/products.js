import axios from "axios";
import Vue from "vue";
import api from ".";


export const products = {
  async get(id) {
    if (id) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/products/" + id
      );
    } else {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/products",
        null
      );
    }
  },

  async getProductAnalyze() {
    return await axios.get("products/analyze")
    .catch(error => {
      // return api.response.error(error.response.data);
      console.log("err", error);
      return
    });
  }, 

  async update(id, payload) {
    return await axios
      .put(Vue.prototype.$settings.baseURL + "/users/" + id, payload)
      .catch(error => {
        return api.response.error(error.response.data);
      });
  },
  async create(payload) {
    return await axios
      .post(Vue.prototype.$settings.baseURL + "/users", payload)
      .catch(error => {
        return api.response.error(error.response.data);
      });
  },
  async delete(id) {
    console.log(Vue.prototype.$settings.baseURL);
    return await axios
      .delete(Vue.prototype.$settings.baseURL + "/products/" + id)
      .catch(error=> {
        return api.response.error(error.response.data);
      })
  },
  async getRoles() {
    return await axios
      .get(Vue.prototype.$settings.baseURL + "/roles")
      .catch(error => {
        return api.response.error(error.response.data);
      })
  },
  async getProperties() {
    return await axios
      .get(Vue.prototype.$settings.baseURL + "/properties")
      .catch(error => {
        return api.response.error(error.response.data);
      })
  }
};
