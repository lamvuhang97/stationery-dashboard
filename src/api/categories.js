import axios from "axios";
import Vue from "vue";
import api from ".";
import { settings } from "@/library/variables";

export const categories = {
    async get(id) {
      if (id) {
        return await axios.get(
          Vue.prototype.$settings.baseURL + "/categories/" + id
        );
      } else {
        return await axios.get(
          Vue.prototype.$settings.baseURL + "/categories",
          null
        );
      }
    },

    async getCategorysum() {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/categorysum",
        null
      );
    },
  
    async update(id, payload) {
      return await axios
        .put(Vue.prototype.$settings.baseURL + "/categories/" + id, payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async delete(id) {
      return await axios
        .delete(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/documents/" + id, null)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async create(payload) {
      return await axios
        .post(Vue.prototype.$settings.baseURL + "/categories", payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    }
  };
  