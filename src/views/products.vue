<template>
  <div>
    <custom-table :props="props" @cell-click="cellClick" :reload="reload"></custom-table>
  </div>
</template>

<script>

export default {
  name: "Users",
  data() {
    return {
      props: {
        norowsfound: "product",
        searchname: "Search for a product by name...",
        columns: [
          {
            label: "Mã sản phẩm",
            field: "id",
            type: 'string',
            filterable: true
          },
          {
            label: "Tên sản phẩm",
            field: "name",
            type: 'string',
            filterable: true
          },
          {
            label: "Phân loại",
            field: "category.name",
            type: 'string',
            filterable: true
          },
          {
            label: "Giá",
            field: "price",
            type: 'string',
            filterable: true
          },
          {
            label: "Kho",
            field: "quantity",
            type: 'string',
            filterable: true
          },
          {
            label: "Trạng thái",
            field: this.status,
            type: 'string',
            filterable: true
          },
          {
            label: "",
            field: "removebutton",
            sortable: false,
            page: "user"
          }
        ],
        remoteURL: this.$settings.baseURL + "/products",
        isLoading: false,
        searchParams: "name",
      },
      reload: false,
      filter: "name"
    };
  },
  methods: {
    status(rowObj) {
      if(rowObj.status === true){
        return "Đang bán"
      }
      if(rowObj.status === false){
        return "Bị khóa"
      }
    },
    async cellClick(params) {
      if (params.column.field == "removebutton") {
        var response = await this.$api.products.delete(params.row.id);
        if (response.status < 300) {
          this.$toasted.success("Deleted Product");
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
