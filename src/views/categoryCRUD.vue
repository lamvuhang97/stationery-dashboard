<template>
  <div>
    <custom-form :formbuilder="formbuilder" :recordId="id" @form-save-click="save"></custom-form>
    <div class="product-list" v-if="!isNew">
      <h4>Sản phẩm</h4>
      <custom-table :props="props" @cell-click="cellClick" :reload="reload"></custom-table>
    </div>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
export default {
  name: "CategoryCRUD",
  data() {
    return {
      id: "",
      categorysumList: [],
      isNew: true,
      formbuilder: {
        heading: "Create Category",
        columns: [
          {
            label: "Tên phân loại",
            field: "name",
            value: "",
            inputtype: true,
            validate: {
              required
            }
          },
          // {
          //   label: "Tag",
          //   multiselecttype: true,
          //   field: "tag",
          //   placeholder: "Choose a tag",
          //   options: [],
          // },
        ],
        disabledSave: false,
        isLoading: false,
        buttonsavelabel: "Save",
        optionDisabled: false,
        reloadFormbuilder: true
      },
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
            label: "Giá ",
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
        remoteURL: this.$settings.baseURL + "/products/category/" + this.$route.params.id,
        isLoading: false,
        searchParams: "name",
      },
      categoryPost : {
        name: '',
        status: null
      }
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
    async save(params) {
      this.formbuilder.disabledSave = true;
      this.categoryPost ={
        name: params.name,
        status: true
      }
      if (this.$route.params.id) {
        this.categoryPost.id = this.$route.params.id
        const res = await this.$api.categories.update(this.$route.params.id, this.categoryPost)
        if(res.status === 200) {
          this.$toasted.success("Category Updated");
          this.$router.push({ name: "Category" });
        } else{
          this.$toasted.error(res.message);
        }
      } 
      else {
        const res = await this.$api.categories.create(this.categoryPost)
        if(res.status === 200) {
          this.$toasted.success("Category Created");
          this.$router.push({ name: "Category" });
        } else{
          this.$toasted.error(res.message);
        }
      }
    }
  },
async mounted() {
    this.id = this.$route.params.id;
    if (this.$route.params.id) {
      this.formbuilder.heading = "Thông tin phân loại";
      this.isNew = false

      this.formbuilder.optionDisabled = true;
      var response = await this.$api.categories.get(this.$route.params.id);
      var data = response.data.data;
      if (data) {
        for (var item in this.formbuilder.columns) {
          var field = this.formbuilder.columns[item].field;
          this.formbuilder.columns[item].value = data[field];
        }
      }
      
    }
  }
}
</script>
<style  scoped>
.product-list {
  margin: 20px;
}
</style>