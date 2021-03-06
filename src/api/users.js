import axios from "axios";
import Vue from "vue";
import api from ".";

export const users = {
  async get(id) {
    if (id) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/users/" + id
      );
    } else {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/users",
        null
      );
    }
  },

  async getUserAnalyze() {
    return await axios.get("users/analyze")
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
  async updateWallet(id, payload) {
    return await axios
      .put(Vue.prototype.$settings.baseURL + "/users/wallet/" + id, payload)
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
    return await axios
      .delete(Vue.prototype.$settings.baseURL + "/users/" + id)
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
