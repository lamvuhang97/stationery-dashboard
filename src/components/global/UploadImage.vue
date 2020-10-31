<template>
  <div>
    <div>
       <div>
         <div >
           <button class="btn btn-primary" @click="click1">Choose photo</button>
           <input type="file" ref="input1"
            style="display: none"
            @change="previewImage" accept="image/*" >                
         </div>
       <div v-if="imageData!=null">                     
          <img class="preview" height="268" width="356" :src="img1">
       <br>
       </div>   
       </div>
    </div>
    <!-- <div>
        <button class="btn btn-primary" color="pink" @click="create">upload</button>
    </div> -->
  </div>
</template>


<script>
import firebase from 'firebase';
export default {
  data () {
    return {
      img1: '',
      imageData: null
    }
  },
  methods: {
    // create () {
    //   const post = {
    //     photo: this.img1,       
    //   }
    //   console.log("post", post);
    //   firebase.database().ref('PhotoGallery').push(post)
    //   .then((response) => {
    //     console.log(response)
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
    // },
    click1() {
        this.$refs.input1.click()   
    },
    previewImage(event) {
        console.log('1');
        this.uploadValue=0;
        this.img1=null;
        this.imageData = event.target.files[0];
        this.onUpload()
    },
    onUpload(){
        this.img1=null;
        const storageRef=firebase.storage().ref(`${this.imageData.name}`).put(this.imageData);
        storageRef.on(`state_changed`,snapshot=>{
            this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        }, error=>{console.log(error.message)},
        ()=>{
            this.uploadValue=100;
            storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                    this.img1 =url;
                    this.$emit('uploadImage', this.img1)
                });
            }      
        );
    },
  }
}
</script>