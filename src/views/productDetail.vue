<template>
    <div>
        <h4>Thông tin sản phẩm</h4>
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
            <h4>Đánh giá sản phẩm - {{rateToShow}}</h4>
            <custom-table :props="props" @cell-click="cellClick" :reload="reload"></custom-table>
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
            rateToShow: '',
            formbuilder: {
                heading: "Thông tin sản phẩm",
                columns: [
                {
                    label: "Mã sản phẩm",
                    field: "id",
                    value: "",
                    inputtype: true,
                    readonly: true
                },
                {
                    label: "Tên sản phẩm",
                    field: "name",
                    value: "",
                    inputtype: true,
                    readonly: true
                },
                {
                    label: "Phân loại",
                    field: "category",
                    value: "",
                    inputtype: true,
                    readonly: true
                },
                {
                    label: "Giá",
                    field: "price",
                    value: "",
                    inputtype: true,
                    readonly: true
                },
                {
                    label: "Đã bán",
                    field: "sold",
                    value: "",
                    inputtype: true,
                    readonly: true
                },
                {
                    label: "Mô tả",
                    field: "description",
                    value: "",
                    textarea: true,
                    readonly: true
                },
                {
                    label: "Kho",
                    field: "quantity",
                    value: "",
                    inputtype: true,
                    readonly: true
                },
                {
                    label: "Trạng thái",
                    field: "status",
                    value: "",
                    inputtype: true,
                    readonly: true
                },
                {
                    label: "Người bán",
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
                    label: "Mã đánh giá",
                    field: "id",
                    type: 'number',
                    filterable: true
                },
                {
                    label: "Mã người đánh giá",
                    field: "userId",
                    type: 'number',
                    filterable: true
                },
                {
                    label: "Điểm đánh giá",
                    field: "rate",
                    type: 'number',
                    filterable: true
                },
                {
                    label: "Nội dung đánh giá",
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
                    this.formbuilder.columns[item].value = 'Đang bán'
                    } else this.formbuilder.columns[item].value = 'Bị khóa'
                }
            }
        }

        this.$api.reviews.getReviewByProduct(this.$route.params.id)
        .then(res => {
            this.props.data = res.data.data.rows;
            this.reload = !this.reload
        })

        const rate = await this.$api.products.getRateProduct(this.id)
        this.rateToShow = rate.data.total
        if(this.rateToShow == "") {
            this.rateToShow = "Chưa có đánh giá"
        } else {
            this.rateToShow = this.rateToShow.substring(0,3) + " stars"
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