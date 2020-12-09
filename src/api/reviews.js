import axios from "axios";
import Vue from "vue";
import api from ".";


export const reviews = {
  async get(id) {
    if (id) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/orders/" + id
      );
    } else {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/products",
        null
      );
    }
  },

  async getReviewByProduct(id) {
    return await axios.get(Vue.prototype.$settings.baseURL + "/reviews/product/" + id)
    .catch(err => {
      return api.response.error(err.response.data);
    })
  },

  async delete(id) {
    return await axios
      .delete(Vue.prototype.$settings.baseURL + "/reviews/" + id)
      .catch(error => {
        return api.response.error(error.response.data);
      });
  },
};
