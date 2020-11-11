<template>
  <div>
    <custom-table :props="props" @cell-click="cellClick" :reload="reload"></custom-table>
  </div>
</template>

<script>

export default {
  name: "Orders",
  data() {
    return {
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
            label: "User",
            field: "user.username",
            type: 'string',
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
          {
            label: "Phone Number",
            field: "phonenumber",
            type: 'string',
            filterable: true
          },
          {
            label: "Address",
            field: "address",
            type: 'string',
            filterable: true
          },
        ],
        remoteURL: this.$settings.baseURL + "/orders",
        isLoading: false,
        searchParams: "id",
      },
      reload: false,
      filter: "id"
    };
  },
  methods: {
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
        this.$router.push({ name: "ProductDetail", params: params.row });
      }
    }
  },
};
</script>
