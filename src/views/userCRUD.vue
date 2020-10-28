<template>
  <custom-form :formbuilder="formbuilder" @form-save-click="save" @add-role="addRole"></custom-form>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { isEmail } from "../library/validators";
export default {
  name: "UserCrud",
  data() {
    return {
      id: 0,
      formbuilder: {
        heading: "Create User",
        columns: [
          {
            label: "Email",
            field: "email",
            value: "",
            filterable: true,
            inputemail: true,
            placeholder: "Email of user",
            validate: {
              required,
              isEmail
            }
          },
          {
            label: "Password",
            field: "password",
            value: "",
            filterable: true,
            inputpassword: true,
            placeholder: "**************",
          }
        ],
        disabledSave: false,
        isLoading: false,
        buttonsavelabel: "Save",
        reloadFormbuilder: true
      },
      roles: [],
      properties: [],
      rolesSelected: [],
    };
  },
  methods: {
    async save(params) {
      this.formbuilder.disabledSave = true;
      var response;
      let roleData = []
        for (var i = 0; i < this.rolesSelected.length; i++) {
          roleData.push({
            id: this.rolesSelected[i].role,
            type: "user_role",
            meta: {
              property_id: this.rolesSelected[i].property
            }
          })
        }
      if (this.$route.params.id) {
        const patchData = {
          attributes: {
            email: params.email,
          },
          relationships: {
            roles: {
              data: roleData,
            },
          },
          id: this.$route.params.id,
          type: 'user',
        }
        if (params.password.length > 0) {
          patchData.attributes.password = params.password
        }
        response = await this.$api.users.update(this.$route.params.id, {
          data: patchData
        });
        if (response != null) {
          this.formbuilder.disabledSave = true;
        }
        if (response.status < 300) {
          this.$toasted.success("User updated");
          this.formbuilder.disabledSave = false;
          this.$router.push({ name: "Users" });
        } else {
          this.$toasted.error(response.message);
          this.formbuilder.disabledSave = false;
        }
      } else {
        response = await this.$api.users.create({
          data: {
            attributes: {
              email: params.email,
              password: params.password,
            },
            relationships: {
              roles: {
                data: roleData,
              },
            },
            id: '',
            type: 'user',
          }
        });
        if (response != null) {
          this.formbuilder.disabledSave = true;
        }
        if (response.status < 300) {
          this.$toasted.success("User created");
          this.formbuilder.disabledSave = false;
          this.$router.push({ name: "Users" });
        } else {
          this.formbuilder.disabledSave = false;
          if (response.status === 409) {
            this.$toasted.error("Email already existed");
          } else {
            this.$toasted.error(response.message);
          }
        }
      }
    },
    addRole(params) {
      this.formbuilder.reloadFormbuilder = false
      this.rolesSelected.push(params)
    },
    removeRole(params) {
      this.formbuilder.reloadFormbuilder = false
      const id = this.rolesSelected.findIndex(item => item.role === params.row.role && item.property === params.row.property)
      this.rolesSelected.splice(id, 1)
    }
  },
  async mounted() {
    this.id = this.$route.params.ID;
    var roleResp = await this.$api.users.getRoles();
    var roleData = roleResp.data.data;
    roleData.forEach(item => {
      this.roles.push({
        label: item.id,
        value: item.id
      })
    })
    var propResp = await this.$api.users.getProperties();
    var propData = propResp.data.data;
    propData.forEach(item => {
      this.properties.push({
        label: item.id,
        value: item.id
      })
    })
    this.formbuilder.columns.push(
      {
        tabletype: true,
        field: "current_role",
        props: {
          columns: [
            {
              label: "Role",
              field: "role",
              sortable: false
            },
            {
              label: "Property",
              field: "property",
              sortable: false
            },
            {
              label: "",
              field: "removebutton",
              sortable: false,
              page: "user",
            }
          ],
          action: this.removeRole,
          norowsfound: "role",
          header: "Current roles",
          searchname: "",
          data: this.rolesSelected
        }
      },
      {
        groupingtype: true,
        field: "property_role",
        formbuilder: {
          heading: "",
          columns: [
            {
              label: "Property",
              field: "property",
              options: this.properties,
              booltype: true,
            },
            {
              label: "Role",
              field: "role",
              options: this.roles,
              booltype: true,
            }
          ],
          disabledSave: false,
          buttonsavelabel: "Add",
          action: "add-role",
          id: "add-role"
        }
      }
    )
    if (this.$route.params.id) {
      this.formbuilder.heading = "Update User";
      const response = await this.$api.users.get(this.$route.params.id);
      const data = response.data.data;
      if (data) {
        for (var item in this.formbuilder.columns) {
          const field = this.formbuilder.columns[item].field;
          const roles = data.relationships.roles.data;
          switch (field) {
            case "email": 
              this.formbuilder.columns[item].value = data.attributes.email
              break
            case "password":
              this.formbuilder.columns[item].value = ""
              break
            case "current_role":
              for (var i = 0; i < roles.length; i++) {
                this.rolesSelected.push({
                  role: roles[i].id,
                  property: roles[i].meta.property_id
                })
              }
          }
        }
      }
    }
  }
};
</script>
