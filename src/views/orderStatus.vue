<template>
  <div>
    <h4>{{text}}</h4>
    <custom-table :props="props" @cell-click="cellClick" :reload="reload"></custom-table>
  </div>
</template>

<script>

export default {
  name: "Orders",
  data() {
    return {
        text: '',
        // statusId: 0,
      props: {
        norowsfound: "orders",
        searchname: "Search for a order by id...",
        columns: [
          {
            label: "Id",
            field: "id",
            type: 'string',
            filterable: true
          },
          {
            label: "Ma Nguoi mua",
            field: "userId",
            type: 'string',
            filterable: true
          },
          {
            label: "Ma Nguoi ban",
            field: "ownerId",
            type: 'string',
            filterable: true
          },
          {
            label: "Tien hang",
            field: "total",
            type: 'number',
            filterable: true
          },
          {
            label: "Tien ship",
            field: "ship",
            type: 'number',
            filterable: true
          },
          {
            label: "Tong tien",
            field: this.total,
            type: 'number',
            filterable: true
          },
          {
            label: "Payment",
            field: "payment.name",
            type: 'string',
            filterable: true
          },
          {
            label: "Status",
            field: "status.name",
            type: 'string',
            filterable: true
          },
        ],
        // remoteURL: this.$settings.baseURL + "/orders/status/" + this.statusId,
        remoteURL : null,
        isLoading: false,
        searchParams: "id",
      },
      reload: false,
      filter: "id"
    };
  },
  computed: {
      statusId() {
          return this.$route.params.id
      }
  },
  watch: {
      "statusId"() {
          console.log("change");
          console.log("id comu",this.statusId);
          this.props.remoteURL = this.$settings.baseURL + "/orders/status/" + this.statusId
          this.reload = !this.reload
      }
  },
  methods: {
    total(rowObj) {
      return Number(rowObj.total) + Number(rowObj.ship)
    },
    async cellClick(params) {
      if (params.column.field == "removebutton") {
        var response = await this.$api.users.delete(params.row.id);
        if (response.status < 300) {
          this.$toasted.success("Deleted User");
          this.reload = !this.reload;
        } else {
          this.$toasted.error(response.message);
        }
      } else {
        this.$router.push({ name: "OrderDetail", params: params.row });
      }
    },
    fetch
  },
  mounted() {
      console.log("id", this.$route.params.id);
    //   this.statusId = this.$route.params.id
  }
};
</script>
