<template>
    <div>
        <h4>Thong tin san pham</h4>
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
        <div class="review">
            <h4>Danh gia san pham</h4>
            <custom-table :props="props" @cell-click="cellClick"  :reload="reload"></custom-table>
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
                    label: "Sold",
                    field: "sold",
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
            props: {
                norowsfound: "orders",
                searchname: "Search for a order by id...",
                columns: [
                {
                    label: "Id",
                    field: "id",
                    type: 'number',
                    filterable: true
                },
                {
                    label: "Ma nguoi dung",
                    field: "userId",
                    type: 'number',
                    filterable: true
                },
                {
                    label: "Diem danh gia",
                    field: "rate",
                    type: 'number',
                    filterable: true
                },
                {
                    label: "Noi dung danh gia",
                    field: "content",
                    type: 'number',
                    filterable: true
                },
                {
                    label: "",
                    field: "removebutton",
                    sortable: false,
                    page: "user"
                }
                ],
                // remoteURL: this.$settings.baseURL + "/orders",
                data: null,
                isLoading: false,
                searchParams: "id",
            },
            reload: false,
            filter: "id"
        }
    },
    methods: {
        async cellClick(params) {
        if (params.column.field == "removebutton") {
            var response = await this.$api.reviews.delete(params.row.id);
            if (response.status < 300) {
            this.$toasted.success("Deleted Product");
            this.reload = !this.reload;
            } else {
            this.$toasted.error(response.message);
            }
        }
        }
    },
    async mounted() {
        this.id = this.$route.params.id;
        this.formbuilder.optionDisabled = true;
        var response = await this.$api.products.get(this.$route.params.id);
        console.log("res", response);
        var data = response.data.data;
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

        this.$api.reviews.getReviewByProduct(this.$route.params.id)
        .then(res => {
            this.props.data = res.data.data.rows;
            this.reload = !this.reload
        })
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