<template>
  <div>
    <div class="information">
        <div class="avatar">
          <div class="img" style="border-radius: 50%">
            <img class="preview" height="268" width="356" :src="imgUrl">
          </div>
          <div class="update-img">
            <button class="btn btn-primary" @click="click1">Chọn ảnh</button>
            <!-- <button class="btn btn-success" @click="create">Upload</button> -->
            <input type="file" ref="input1"
              style="display: none"
              @change="previewImage" accept="image/*" >
          </div>
        </div>
        <div class="profile">
          <custom-form :formbuilder="formbuilder" @form-save-click="save"></custom-form>
        </div>
    </div>
    <div class="products" v-if="!isNew">
      <h5>Sản phẩm</h5> 
      <custom-table :props="propsProduct" @cell-click="cellClickProduct"></custom-table>
    </div>
    <div class="transactions" v-if="!isNew">
      <h5>Giao dịch</h5> 
      <custom-table :props="propsTransaction"></custom-table>
    </div>
    <!-- <div class="orders" v-if="!isNew">
      <h5>Products</h5> 
      <custom-table :props="propsProduct" @cell-click="cellClickProduct"></custom-table>
    </div> -->
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { isEmail } from "../library/validators";
import firebase from 'firebase';
export default {
  name: "UsersCrud",
  data() {
    return {
      id: 0,
      isNew: true,
      imgUrl: "/assets/img/logo.jpg",
      imageData: null,
      imgUrlToPost: '',
      propsProduct: {
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
        remoteURL: this.$settings.baseURL + "/products/user/" + this.$route.params.id,
        isLoading: false,
        searchParams: "name",
      },
      propsTransaction: {
        norowsfound: "transaction ",
        searchname: "Search for a transaction by name...",
        columns: [
        {
            label: "Mã giao dịch",
            field: "id",
            type: 'number',
            filterable: true
        },
        {
            label: "Mã đơn hàng",
            field: "orderId",
            type: 'number',
            filterable: true
        },
        {
            label: "Email giao dịch",
            field: "email",
            type: 'string',
            filterable: true
        },
        {
            label: "Loại giao dịch",
            field: "type",
            type: 'string',
            filterable: true
        },
        {
            label: "Số tiền",
            field: "amount",
            type: 'string',
            filterable: true
        },
        {
            label: "Trạng thái giao dịch",
            field: "status",
            type: 'string',
            filterable: true
        },
        ],
        remoteURL: this.$settings.baseURL + "/transactions/user/" + this.$route.params.id,
        isLoading: false,
        reload: false,
        searchParams: "name",
      },
      formbuilder: {
        heading: "Create User",
        columns: [
          {
            label: "Tên người dùng",
            field: "username",
            value: "",
            filterable: true,
            inputtype: true,
            placeholder: "Username of user",
            validate: {
              required
            }
          },
          {
            label: "Password",
            field: "password",
            value: "",
            filterable: true,
            inputpassword: true,
            placeholder: "Password of user",
            validate: {
              required
            }
          },
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
            label: "Ví",
            field: "wallet",
            value: "",
            inputtype: true,
            readonly: true,
            filterable: true,
            placeholder: "Wallet of user",
            validate: {
              required
            }
          },
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
      console.log("params", params);
      this.formbuilder.disabledSave = true;
      var response;
      if (this.$route.params.id) {
        if(this.imageData != null){
          this.create()
        } 
        const patchData = {
          email: params.email,
          address: params.address,
          phonenumber: params.phonenumber,
          avatar: this.imgUrlToPost
        }
        response = await this.$api.users.update(this.$route.params.id, patchData);
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
        if(this.imageData != null){
          this.create()
        }
        response = await this.$api.users.create({
          username: params.username,
          password: params.password,
          email: params.email,
          address: params.address,
          phonenumber: params.phonenumber,
          avatar: this.imgUrlToPost
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
    click1() {
        this.$refs.input1.click()   
    },
    previewImage(event) {
        this.uploadValue=0;
        this.imgUrl=null;
        this.imageData = event.target.files[0];
        this.onUpload()
    },
    onUpload(){
        this.imgUrl=null;
        const storageRef=firebase.storage().ref(`${this.imageData.name}`).put(this.imageData);
        storageRef.on(`state_changed`,snapshot=>{
            this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        }, error=>{console.log(error.message)},
        ()=>{
            this.uploadValue=100;
            storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                    this.imgUrl =url;
                });
            }      
        );
    },
    create() {
        const post = {
          photo: this.imgUrl,        
        }
        console.log(post);
        this.imgUrlToPost = post.photo
        console.log(this.imgUrlToPost);
        firebase.database().ref('PhotoGallery').push(post)
        .then((response) => {
          console.log(response);
        })
        .catch(err => {
          console.log(err)
        })
    },
    status(rowObj) {
      if(rowObj.status === true){
        return "Đang bán"
      }
      if(rowObj.status === false){
        return "Bị khóa"
      }
    },
    async cellClickProduct(params) {
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
    },
  },
  async mounted() {
    this.id = this.$route.params.id;
    if (this.$route.params.id) {

      // delete field password 
      var pos
      this.formbuilder.columns.forEach((element, index) => {
        if(element.field == 'password') {
          pos = index
        }
      });

      //add field status 
      this.formbuilder.columns.push(
        {
          label: "Trạng thái",
          field: "status",
          value: "",
          readonly: true,
          filterable: true,
          inputtype: true,
          placeholder: "Status of user"
        }
      )

      this.formbuilder.columns.splice(pos,1)
      this.isNew = false
      this.formbuilder.heading = "Thông tin người dùng";
      this.formbuilder.optionDisabled = true;
      var response = await this.$api.users.get(this.$route.params.id);
      console.log("res", response);
      var data = response.data.data;
      if(data.avatar != ''){
        this.imgUrl = data.avatar
      }
      if (data) {
        for (var item in this.formbuilder.columns) {
          var field = this.formbuilder.columns[item].field;
          this.formbuilder.columns[item].value = data[field];
          if(field == 'status') {
            if(data[field] == true) {
              this.formbuilder.columns[item].value = 'Hoạt động'
            } else this.formbuilder.columns[item].value = 'Bị khóa'
          }
        }
      }
    }
  }
};
</script>
<style scoped>
img {
  border-radius: 50%;
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
}
.information {
    display: flex;
    justify-content: space-around;
    margin-left: 40px;
}
.avatar {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile {
  width: 70%;
}
.products, .transactions{
  margin: 20px;
}
</style>
