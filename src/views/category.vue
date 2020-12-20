<template>
  <div>
    <div class="form-group">
      <button class="btn btn-primary" @click="createCategory">
        Thêm loại sản phẩm
      </button>
    </div>
    <custom-table :props="props" @cell-click="cellClick" :reload="reload"></custom-table>
  </div>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      props: {
        norowsfound: "category",
        searchname: "Search for a category by name...",
        columns: [
          {
            label: "Mã loại sản phẩm",
            field: "id",
            filterable: true
          },
          {
            label: "Loại sản phẩm",
            field: "name",
            type: 'string',
            filterable: true
          },
          // {
          //   label: "Status",
          //   field: this.status,
          //   type: 'string',
          //   filterable: true
          // },
          {
            label: "Số lượng sản phẩm",
            field: this.numOfProducts,
            type: 'string',
            filterable: true
          },
        ],
        remoteURL: this.$settings.baseURL + "/categories",
        isLoading: false,
        searchParams: "name",
      },
      reload: false,
      filter: "name"
    };
  },
  methods: {
    numOfProducts(rowObj) {
      return rowObj.products.length
    },
    status(rowObj) {
      if(rowObj.status === true){
        return "Enable"
      }
      if(rowObj.status === false){
        return "Disable"
      }
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
        this.$router.push({ name: "CategoryUpdate", params: params.row });
      }
    },
    createCategory() {
      this.$router.push({ name: "CategoryCreate" });
    },
    createTag() {
      this.$router.push({ name: "CreateTag" });
    }
  },
};
</script>
