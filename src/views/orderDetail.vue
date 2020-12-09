<template>
    <div class="order-detail container">
        <div class="infor1">
            <div class="left">
                <h4>Thong tin nguoi mua</h4>
                <span>UserId: {{dataOrder.userId}}</span>
                <span>Username: {{dataOrder.user.username}}</span>
                <span>Email: {{dataOrder.user.email}}</span>
                <span>PhoneNumber: {{dataOrder.phonenumber}}</span>
                <span>Address: {{dataOrder.address}}</span>
            </div>
            <div class="right">
                <h4>Thong tin nguoi ban</h4>
                <span>UserId: {{dataOrder.ownerId}}</span>
                <span>Username: {{dataOrder.owner.username}}</span>
                <span>Email: {{dataOrder.owner.email}}</span>
                <span>PhoneNumber: {{dataOrder.ownerPhone}}</span>
                <span>Address: {{dataOrder.ownerAdd}}</span>
            </div>
        </div>
        <div class="infor2">
            <div class="left">
                <h4>Thong tin thanh toan</h4>
                <span>Hinh thuc thanh toan:{{dataOrder.payment.name}}</span>
                <span>Tien hang: {{dataOrder.total}}</span>
                <span>Tien ship: {{dataOrder.ship}}</span>
                <span>Tong tien: {{Number(dataOrder.total) + Number(dataOrder.ship)}}</span>
            </div>
            <div class="right">
                <h4>Thong tin don hang</h4>
                <span>Ma don hang:{{dataOrder.id}}</span>
                <span>Trang thai don hang: {{dataOrder.status.name}}</span>
                <span>Dia chi lay hang:{{dataOrder.ownerAdd}}</span>
            </div>
        </div>
        <div class="action" v-if="dataOrder.statusId == 3 && show">
            <button class="btn btn-primary" @click="confirmSuccess">Thanh cong</button>
            <button class="btn btn-danger" @click="confirmFail">That bai</button>
        </div>
        <div class="action" v-if="dataOrder.statusId == 2 && show">
            <button class="btn btn-primary" @click="confirmGet">Da lay hang</button>
        </div>
        <div class="product">
            <h4>San pham</h4>
            <custom-table :props="props"  :reload="reload"></custom-table>
        </div>
        <are-you-sure :text="textModel" v-if="showModel" @yes="action" @no="showModel = false"></are-you-sure>
        
        
    </div>
</template>
<script>
import AreYouSure from '../components/global/AreYouSure.vue';
export default {
  components: { AreYouSure },
    data() {
        return {
            orderId: '',
            dataOrder: {},
            showModel: false,
            isSuccess: false,
            isGet: false,
            textModel: '',
            show: true,
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
                    label: "ProductId",
                    field: "productId",
                    type: 'number',
                    filterable: true
                },
                {
                    label: "Product Name",
                    field: "product.name",
                    type: 'number',
                    filterable: true
                },
                {
                    label: "ProductAmount",
                    field: "productAmount",
                    type: 'number',
                    filterable: true
                },
                {
                    label: "Price",
                    field: "productPrice",
                    type: 'string',
                    filterable: true
                },
                {
                    label: "Thanh tien",
                    field: this.totalProduct,
                    type: 'string',
                    filterable: true
                },
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
        confirmSuccess() {
            this.showModel = true
            this.textModel = "Ban muon xac nhan don hang thanh cong?"
            this.isSuccess = true
        },
        confirmFail() {
            this.showModel = true
            this.textModel = "Ban muon xac nhan don hang that bai?"
            this.isSuccess = false
        },
        confirmGet() {
            this.showModel = true
            this.textModel = "Ban muon xac nhan da lay hang tu nguoi ban?"
            this.isGet = true
        },
        async action() {
            if(this.isGet != true) {
                if(this.isSuccess == true) {
                    await this.$api.orders.update(this.dataOrder.id, {statusId: 5})
                    .then(res => {
                        console.log(res);
                    })
                    var total = Number(this.dataOrder.total)
                    var wallet = 0
                    await this.$api.users.get(this.dataOrder.ownerId)
                    .then(async res => {
                        if(res.data.data.wallet == null) {
                            wallet = 0
                        } else Number(res.data.data.wallet)
                        await this.$api.users.updateWallet(this.dataOrder.ownerId, {wallet: wallet + total})
                    })
                    
                } else {
                    await this.$api.orders.update(this.dataOrder.id, {statusId: 6})
                    .then(res => {
                        console.log(res);
                    })
                    total = Number(this.dataOrder.total)
                    var ship = Number(this.dataOrder.ship)
                    wallet = 0
                    if(this.dataOrder.paymentId == 3) {
                        await this.$api.users.get(this.dataOrder.userId)
                        .then(async res => {
                            if(res.data.data.wallet == null) {
                                wallet = 0
                            } else Number(res.data.data.wallet)
                            await this.$api.users.updateWallet(this.dataOrder.userId, {wallet: wallet + total + ship})
                        })
                    }
                }
            } else {
                await this.$api.orders.update(this.dataOrder.id, {statusId: 3})
                    .then(res => {
                        console.log(res);
                    })
            }
            this.show= false
            this.showModel = false 
        },
        totalProduct(rowObj) {
            return rowObj.productAmount * rowObj.productPrice
        }
    },
    async mounted() {
        this.orderId = this.$route.params.id;
        var response = await this.$api.orders.get(this.$route.params.id);
        this.dataOrder = response.data.data

        var res = await this.$api.orders.getOrderdetailByOrder(this.$route.params.id);
        console.log("res", res)
        this.props.data = res.data.data
        this.reload = !this.reload
    }
}
</script>
<style scoped>
.infor1, .infor2 {
    display: flex;
    
}
.infor1 .left,.infor1 .right {
    width: 50%;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid gray;
    padding: 20px 0px;
    margin-right: 20px;
}

.infor2 .left,.infor2 .right{
     width: 50%;
    display: flex;
    flex-direction: column;
    padding: 20px 0px;
    margin-right: 20px;
} 
.payment {
    display: flex;
    flex-direction: column;
}
.action {
    display: flex;
    justify-content: flex-end;
}
.action button {
    margin-right: 10px;
}
</style>