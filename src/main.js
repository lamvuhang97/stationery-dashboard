import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import moment from "moment";
import VueNotification from 'vue-notification'
import Sortable from 'sortablejs'
import VueLocalStorage from 'vue-localstorage'



Vue.directive('sortable', {
  inserted(el, binding) {
    new Sortable(el, binding.value || {})
  },
})

Vue.mixin({
  methods: {
    sortableSelect(element) {
      Sortable.utils.select(element)
    },
    sortableDeselect(element) {
      Sortable.utils.deselect(element)
    },
  },
})

Vue.use(VueLocalStorage)

// Vue.use(NotiServer)
Vue.use(VueNotification)

Vue.config.productionTip = false;

Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(String(value)).format("MM/DD/YYYY hh:mm A");
  }
});
Vue.filter("utcDate", function(value) {
  if (value) {
    return value.substring(0, 10);
  }
});
Vue.filter("expirationDate", function(value) {
  if (value) {
    var eventdate = moment(String(value.substring(0, 10)));
    var todaysdate = moment();
    var daysleft = eventdate.diff(todaysdate, "days");
    var days;
    if (daysleft == 1) {
      days =
        value.substring(0, 10) + " Expires Today";
    } else if (daysleft > 1) {
      days =
        value.substring(0, 10) +
        "(" +
        daysleft +
        " Days)";
    } else if (daysleft == 0 ) {
      var hoursleft = eventdate.diff(todaysdate, "hours");
      days =
        value.substring(0, 10) +
        "(" +
        hoursleft +
        " Hours)";
    } else {
      days = value.substring(0, 10) + " Expired";
    }
    return days;
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
