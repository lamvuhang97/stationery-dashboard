import axios from "axios";
import Vue from "vue";
import api from ".";


export const orders = {
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

  async getOrderdetailByOrder(id) {
    return await axios.get(Vue.prototype.$settings.baseURL + "/orderdetails/order/" + id)
    .catch(err => {
      return api.response.error(err.response.data);
    })
  },

  async getOrderByStatus(id) {
    return await axios.get(Vue.prototype.$settings.baseURL + "/orders/status/" + id)
    .catch(err => {
      return api.response.error(err.response.data);
    })
  },

  async getOrderAnalyze() {
    return await axios.get("orders/analyze")
    .catch(error => {
      // return api.response.error(error.response.data);
      console.log("err", error);
      return
    });
  },

  async update(id, payload) {
    return await axios
      .put(Vue.prototype.$settings.baseURL + "/orders/" + id, payload)
      .catch(error => {
        return api.response.error(error.response.data);
      });
  },
};
