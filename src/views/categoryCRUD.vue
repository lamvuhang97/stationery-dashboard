<template>
  <div>
    <custom-form :formbuilder="formbuilder" :recordId="id" @form-save-click="save"></custom-form>
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
      formbuilder: {
        heading: "Create Category",
        columns: [
          {
            label: "Name",
            field: "name",
            value: "",
            inputtype: true,
            validate: {
              required
            }
          },
          {
            label: "Tag",
            multiselecttype: true,
            field: "tag",
            placeholder: "Choose a tag",
            options: [],
          },
        ],
        disabledSave: false,
        isLoading: false,
        buttonsavelabel: "Save",
        optionDisabled: false,
        reloadFormbuilder: true
      },
      categoryPost : {
        name: '',
        categorysumId: 0,
        status: null
      }
    };
  },
  methods: {
    async save(params) {
      this.formbuilder.disabledSave = true;
      var categorysumId;
      this.categorysumList.forEach((item, ind) => {
        if(item == params.tag){
          categorysumId = ind + 1
        }
      })
      this.categoryPost ={
        name: params.name,
        categorysumId: categorysumId,
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
async beforeMount() {
    var res = await this.$api.categories.getCategorysum()
    res.data.data.forEach((item) => {
      this.categorysumList.push(item.name)
    })
},
async mounted() {
    this.id = this.$route.params.id;
    this.formbuilder.columns[1].options = this.categorysumList
    if (this.$route.params.id) {
      this.formbuilder.heading = "Update Category";

      this.formbuilder.optionDisabled = true;
      var response = await this.$api.categories.get(this.$route.params.id);
      var data = response.data.data;
      if (data) {
        for (var item in this.formbuilder.columns) {
          var field = this.formbuilder.columns[item].field;
          this.formbuilder.columns[item].value = data[field];
        }
      }
      
      this.formbuilder.columns[1].value = data.categorysum.name
    }
  }
}
</script>