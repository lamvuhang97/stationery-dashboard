<template>
    <div class="product-detail">
        <carousel :perPage="1" :autoplayHoverPause="true" :paginationEnabled="false" class="images">
            <slide v-for="img in images" :key="img">
                 <img :src="img.url.url" alt="...">
            </slide>
        </carousel>
        <div class="information">
            <custom-form :formbuilder="formbuilder"></custom-form>
        </div>
    </div>
</template>
<script>
import { Carousel, Slide } from 'vue-carousel';
export default {
    name: "ProductDetail",
    components: {
        Carousel,
        Slide
    },
    data() {
        return {
            images: [],
            formbuilder: {
                heading: "Product Detail",
                columns: [
                {
                    label: "Name",
                    field: "name",
                    value: "",
                    inputtype: true,
                    readonly: true
                },
                {
                    label: "Category",
                    field: "category",
                    value: "",
                    inputtype: true,
                    readonly: true
                },
                {
                    label: "Price",
                    field: "price",
                    value: "",
                    inputtype: true,
                    readonly: true
                },
                {
                    label: "Description",
                    field: "description",
                    value: "",
                    textarea: true,
                    readonly: true
                },
                {
                    label: "Quantity",
                    field: "quantity",
                    value: "",
                    inputtype: true,
                    readonly: true
                },
                {
                    label: "Status",
                    field: "status",
                    value: "",
                    inputtype: true,
                    readonly: true
                },
                {
                    label: "Owner",
                    field: "owner",
                    value: "",
                    inputtype: true,
                    readonly: true
                },
                ],
                hiddenSave: true,
                isLoading: false,
                buttonsavelabel: "Save",
                reloadFormbuilder: true
            },
        }
    },
    async mounted() {
        this.id = this.$route.params.id;
        this.formbuilder.optionDisabled = true;
        var response = await this.$api.products.get(this.$route.params.id);
        console.log("res", response);
        var data = response.data.product;
        if(data.images.length >0) {
            this.images = data.images
        } else {
            this.images = [
                {
                    url: {
                        url: "/assets/img/default_images/product.png"
                    }
                }
            ]
        }
        if (data) {
            for (var item in this.formbuilder.columns) {
                var field = this.formbuilder.columns[item].field;
                this.formbuilder.columns[item].value = data[field];
                if(field == 'status') {
                    if(data[field] == true) {
                    this.formbuilder.columns[item].value = 'Active'
                    } else this.formbuilder.columns[item].value = 'Locked'
                }
            }
        }
    
    }
}
</script>
<style scoped>
    img {
        width: 100%;
        height: 300px;
        object-fit: cover;
    }
    .product-detail{
        display: flex;
        align-items: center;
    }
    .product-detail .images {
        width: 40%;
        padding: 10px;
    }
    .product-detail .information {
        width: 60%;
    }
</style>