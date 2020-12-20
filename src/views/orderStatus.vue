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
          this.props.remoteURL = this.$settings.baseURL + "/orders/status/" + this.statusId
          this.reload = !this.reload
          console.log("change");
          switch (this.statusId) {
            case "1":
              this.text = "Chờ xác nhận"
              break;
            case "2":
              this.text = "Chờ lấy hàng"
              break;
            case "3":
              this.text = "Đang giao"
              break;
            case "4":
              this.text = "Đã giao"
              break;
            case "5":
              this.text = "Đã hủy"
              break;
            case "6":
              this.text = "Chờ xử lý"
              break;
            case "7":
              this.text = "Đang trả hàng"
              break;
            case "8":
              this.text = "Đã trả hàng"
              break;
            case "9":
              this.text = "Hoàn thành"
              break;
          }
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
