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
      formbuilder: {
        heading: "Create Tag",
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
        ],
        disabledSave: false,
        isLoading: false,
        buttonsavelabel: "Save",
        optionDisabled: false,
        reloadFormbuilder: true
      },
      tagToPost : {
        name: '',
        status: null
      }
    };
  },
  methods: {
    async save(params) {
      this.formbuilder.disabledSave = true;
      this.tagToPost ={
        name: params.name,
        status: true
      }
        const res = await this.$api.categories.createTag(this.tagToPost)
        if(res.status === 200) {
          this.$toasted.success("Category Created");
          this.$router.push({ name: "Category" });
        } else{
          this.$toasted.error(res.message);
        }
    }
  },
async mounted() {}
}
</script>