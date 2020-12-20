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
            label: "Mã đơn hàng",
            field: "id",
            type: 'string',
            filterable: true
          },
          {
            label: "Mã người mua",
            field: "userId",
            type: 'string',
            filterable: true
          },
          {
            label: "Mã người bán",
            field: "ownerId",
            type: 'string',
            filterable: true
          },
          {
            label: "Tiền hàng",
            field: "total",
            type: 'number',
            filterable: true
          },
          {
            label: "Tiền vận chuyển",
            field: "ship",
            type: 'number',
            filterable: true
          },
          {
            label: "Tổng tiền",
            field: this.total,
            type: 'number',
            filterable: true
          },
          {
            label: "Thanh toán",
            field: "payment.name",
            type: 'string',
            filterable: true
          },
          {
            label: "Trạng thái",
            field: "status.name",
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
    }
  },
};
</script>
