import axios from "axios";

export const transactions = {
  async postTransaction(payload) {
    return await axios.post("transactions", payload)
      .catch(error => {
        // return api.response.error(error.response.data);
        console.log("not found", error);
        return
    });
  },
}