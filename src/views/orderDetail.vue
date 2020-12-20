<template>
    <div class="order-detail container">
        <div class="infor1">
            <div class="left">
                <h4>Thông tin người mua</h4>
                <span>Mã người mua: {{dataOrder.userId}}</span>
                <span>Tên người mua: {{dataOrder.user.username}}</span>
                <span>Email: {{dataOrder.user.email}}</span>
                <span>Số điện thoại: {{dataOrder.phonenumber}}</span>
                <span>Địa chỉ nhận hàng: {{dataOrder.address}}</span>
            </div>
            <div class="right">
                <h4>Thông tin người bán</h4>
                <span>Mã người bán: {{dataOrder.ownerId}}</span>
                <span>Tên người bán: {{dataOrder.owner.username}}</span>
                <span>Email: {{dataOrder.owner.email}}</span>
                <span>Số điện thoại: {{dataOrder.ownerPhone}}</span>
                <span>Địa chỉ lấy hàng: {{dataOrder.ownerAdd}}</span>
            </div>
        </div>
        <div class="infor2">
            <div class="left">
                <h4>Thông tin thanh toán</h4>
                <span>Hình thức thanh toán:{{dataOrder.payment.name}}</span>
                <span>Tiền hàng: {{dataOrder.total}}</span>
                <span>Tiền vận chuyển: {{dataOrder.ship}}</span>
                <span>Tổng tiền: {{Number(dataOrder.total) + Number(dataOrder.ship)}}</span>
            </div>
            <div class="right">
                <h4>Thông tin đơn hàng</h4>
                <span>Mã đơn hàng:{{dataOrder.id}}</span>
                <span>Trạng thái đơn hàng: {{dataOrder.status.name}}</span>
                <span v-if="dataOrder.statusId == 6 || dataOrder.statusId == 7">Lý do trả hàng: {{reason}}</span>
                <span v-if="dataOrder.statusId == 5">Lý do hủy: {{reason}}</span>
                <span>Ghi chú: {{dataOrder.note}}</span>
            </div>
        </div>
        <div class="action" v-if="dataOrder.statusId == 2">
            <button class="btn btn-primary" @click="confirmGet">Đã lấy hàng</button>
            <button class="btn btn-primary" @click="confirmGetFail">Lấy hàng không thành công</button>
        </div>

        <div class="action" v-if="dataOrder.statusId == 3 && show1">
            <button class="btn btn-danger" @click="confirmShip1">Đã rời kho {{dataOrder.ownerAdd.split(",")[2]}}</button>
        </div>
        <div class="action" v-if="dataOrder.statusId == 3 && !show1 && show2">
            <button class="btn btn-danger" @click="confirmShip2">Đã đến kho {{dataOrder.address.split(",")[2]}}</button>
        </div>
        <div class="action" v-if="dataOrder.statusId == 3 && !show2">
            <button class="btn btn-primary" @click="confirmSuccess">Đã giao</button>
            <button class="btn btn-danger" @click="confirmFail">Thất bại</button>
        </div>
        <div class="action" v-if="dataOrder.statusId == 4 && dataOrder.statusId != 9">
            <button class="btn btn-primary" :disabled="!validTime" @click="confirmDone">Hoàn thành</button>
        </div>
         <div class="action" v-if="dataOrder.statusId == 6">
            <button class="btn btn-primary"  @click="confirmAcceptReturn">Đồng ý trả hàng</button>
            <button class="btn btn-primary"  @click="confirmDone">Từ chối trả hàng</button>
        </div>
        <div class="action" v-if="dataOrder.statusId == 7">
            <button class="btn btn-primary"  @click="confirmReturnDone">Trả hàng thành công</button>
        </div>
        
        <div class="product" style="margin-top:10px">
            <h4>Sản phẩm</h4>
            <custom-table :props="props"  :reload="reload"></custom-table>
        </div>
        <div class="ship" style="margin-top:10px">
            <h4>Thông tin vận chuyển </h4>
            <div v-for="(item, i) in dataHistory" :key="i" style="margin: 10px 0px; display:flex" class="his-item">
                <span>{{new Date(item.createdAt).toString().substring(0, 25)}}</span>
                <div style="display:flex; flex-direction:column;">
                    <i class="fas fa-dot-circle" style="margin:0px 20px"></i>
                    <div style="border-right:2px solid; height: 25px; width: 25%; margin: 10px 0px 0px 15px">  </div>
                </div>
                <div style="display:flex; flex-direction: column">
                    <span>{{item.status.name}}</span>
                    <span style="display:block;">{{item.detail}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            orderId: '',
            dataOrder: {},
            history: [],
            showModel: false,
            isSuccess: false,
            isGet: false,
            textModel: '',
            show1: true,
            show2: true,
            returnMoney: null,
            dataHistory: [],
            props: {
                norowsfound: "orders",
                searchname: "Search for a order by id...",
                columns: [
                {
                    label: "Mã sản phẩm",
                    field: "productId",
                    type: 'number',
                    filterable: true
                },
                {
                    label: "Tên sản phẩm",
                    field: "product.name",
                    type: 'number',
                    filterable: true
                },
                {
                    label: "Số lượng",
                    field: "productAmount",
                    type: 'number',
                    filterable: true
                },
                {
                    label: "Giá",
                    field: "productPrice",
                    type: 'string',
                    filterable: true
                },
                {
                    label: "Thành tiền",
                    field: this.totalProduct,
                    type: 'string',
                    filterable: true
                },
                ],
                // remoteURL: this.$settings.baseURL + "/orders",
                data: null,
                isLoading: false,
                searchParams: "name",
            },
            reload: false,
            filter: "id"
        }
    },
    computed: {
        validTime() {
            var now = new Date()
            var date = new Date(this.dataOrder.updateAt)
            if((now - date) / 3600000 >= 72 && this.dataOrder.statusId != 6) {
                return true
            } else return false
        },
        reason() {
            var text = ''
            this.history.forEach(item => {
                if(item.statusId == 6) {
                    if(item.detail) {
                        text = item.detail
                    }
                } 
            })
            return text
        }
    },
    methods: {
        async confirmGet() {
            await this.$api.orders.update(this.dataOrder.id, {statusId: 3})
            .then(async res => {
                console.log(res);
                await this.$api.history.createHistory({
                    orderId: this.dataOrder.id,
                    statusId: 3,
                }).then(rr => {console.log(rr);})
            })
            this.dataOrder.statusId = 3
            this.fetchData()
        },
        async confirmGetFail() {
            await this.$api.orders.update(this.dataOrder.id, {statusId: 5})
            .then(async res => {
                console.log(res);
                await this.$api.history.createHistory({
                    orderId: this.dataOrder.id,
                    statusId: 5,
                    detail: "Admin huy do lay hang khong thanh cong"
                }).then(rr => {console.log(rr);})
            })
            this.dataOrder.statusId = 5
            this.fetchData()
            if(this.dataOrder.paymentId == 3) {
                var total = Number(this.dataOrder.total) + Number(this.dataOrder.ship)
                var wallet = 0
                await this.$api.users.get(this.dataOrder.userId)
                .then(async res => {
                    if(res.data.data.wallet == null) {
                        wallet = 0
                    } else  {wallet = Number(res.data.data.wallet)}
                    await this.$api.users.updateWallet(this.dataOrder.userId, {wallet: wallet + total})
                })

                var tranToPost = {
                    userId: this.dataOrder.userId,
                    orderId: this.dataOrder.id,
                    amount: total,
                    type: "Hoan tien",
                    status: "Success"
                }
                await this.$api.transactions.postTransaction(tranToPost)
                .then(r => {
                    console.log(r);
                })
            }
            // thay doi so luong san pham neu don hang khong thanh cong
            this.props.data.forEach(async p => {
                await this.$api.products.updateProduct(p.productId, {quantity: p.product.quantity + p.productAmount, sold: p.product.sold - p.productAmount})
            })
            this.reload = !this.reload
        },
        async confirmShip1() {
            await this.$api.history.createHistory({
                orderId: this.dataOrder.id,
                statusId: 3,
                detail: 'Đã rời kho ' + this.dataOrder.ownerAdd.split(",")[2]
            }).then(rr => {console.log(rr);})
            this.show1 = false
        }, 
        async confirmShip2() {
            await this.$api.history.createHistory({
                orderId: this.dataOrder.id,
                statusId: 3,
                detail: 'Đã đến kho ' + this.dataOrder.address.split(",")[2]
            }).then(rr => {console.log(rr);})
            this.show2 = false
        },
        async confirmSuccess() {
            await this.$api.orders.update(this.dataOrder.id, {statusId: 4})
            .then(async res => {
                console.log(res);
                await this.$api.history.createHistory({
                    orderId: this.dataOrder.id,
                    statusId: 4,
                }).then(rr => {console.log(rr);})
            })
            this.dataOrder.statusId = 4
            this.fetchData()
        }, 
        async confirmFail() {
            await this.$api.orders.update(this.dataOrder.id, {statusId: 7})
            .then(async res => {
                console.log(res);
                await this.$api.history.createHistory({
                    orderId: this.dataOrder.id,
                    statusId: 7,
                    detail:"Nguoi mua khong nhan hang"
                }).then(rr => {console.log(rr);})
            })
            this.returnMoney = false
            this.dataOrder.statusId = 7
            this.fetchData()
        },
        async confirmDone() {
            await this.$api.orders.update(this.dataOrder.id, {statusId: 9})
            .then(async res => {
                console.log(res);
                await this.$api.history.createHistory({
                    orderId: this.dataOrder.id,
                    statusId: 9,
                }).then(rr => {console.log(rr);})
            })
            this.dataOrder.statusId = 9
            this.fetchData()

            var total = Number(this.dataOrder.total)
            var wallet = 0
            await this.$api.users.get(this.dataOrder.ownerId)
            .then(async res => {
                if(res.data.data.wallet == null) {
                    wallet = 0
                } else  {wallet = Number(res.data.data.wallet)}
                await this.$api.users.updateWallet(this.dataOrder.ownerId, {wallet: wallet + total})
            })

            var tranToPost = {
                userId: this.dataOrder.ownerId,
                orderId: this.dataOrder.id,
                amount: Number(this.dataOrder.total),
                type: "Cong Tien",
                status: "Success"
            }
            await this.$api.transactions.postTransaction(tranToPost)
            .then(r => {
                console.log(r);
            })
        },
        async confirmAcceptReturn() {
            await this.$api.orders.update(this.dataOrder.id, {statusId: 7})
            .then(async res => {
                console.log(res);
                await this.$api.history.createHistory({
                    orderId: this.dataOrder.id,
                    statusId: 7,
                }).then(rr => {console.log(rr);})
            })
            this.dataOrder.statusId = 7
            this.fetchData()
            this.returnMoney = true
        },
        async confirmReturnDone() {
            await this.$api.orders.update(this.dataOrder.id, {statusId: 8})
            .then(async res => {
                console.log(res);
                await this.$api.history.createHistory({
                    orderId: this.dataOrder.id,
                    statusId: 8,
                }).then(rr => {console.log(rr);})
            })
            this.dataOrder.statusId = 8
            this.fetchData()
            if(this.returnMoney || this.dataOrder.paymentId == 3) {
                var total = Number(this.dataOrder.total)
                var wallet = 0
                await this.$api.users.get(this.dataOrder.userId)
                .then(async res => {
                    if(res.data.data.wallet == null) {
                        wallet = 0
                    } else  {wallet = Number(res.data.data.wallet)}
                    await this.$api.users.updateWallet(this.dataOrder.userId, {wallet: wallet + total})
                })

                var tranToPost = {
                    userId: this.dataOrder.userId,
                    orderId: this.dataOrder.id,
                    amount: Number(this.dataOrder.total),
                    type: "Hoan tien",
                    status: "Success"
                }
                await this.$api.transactions.postTransaction(tranToPost)
                .then(r => {
                    console.log(r);
                })
            }

            // thay doi so luong san pham neu don hang khong thanh cong
            this.props.data.forEach(async p => {
                await this.$api.products.updateProduct(p.productId, {quantity: p.product.quantity, sold: p.product.sold - p.productAmount})
            })
            this.reload = !this.reload
        },
        async fetchData() {
            var response = await this.$api.orders.get(this.$route.params.id);
            this.dataOrder = response.data.data
            
            var res = await this.$api.history.getHistoryByOrder(this.$route.params.id)
            this.history = res.data.data
            console.log("history", this.history);

            await this.$api.history.getHistoryByOrder(this.$route.params.id)
            .then(res => {
                console.log("history",res);
                this.dataHistory = res.data.data
                console.log(this.dataHistory);
            })
        },
        totalProduct(rowObj) {
            return rowObj.productAmount * rowObj.productPrice
        }
    },
    async mounted() {
        this.orderId = this.$route.params.id;
        var response = await this.$api.orders.get(this.$route.params.id);
        this.dataOrder = response.data.data
        
        var r = await this.$api.history.getHistoryByOrder(this.$route.params.id)
        this.history = r.data.data
        console.log("history", this.history);

        var res = await this.$api.orders.getOrderdetailByOrder(this.$route.params.id);
        console.log("res", res)
        this.props.data = res.data.data
        console.log("props data", this.props.data);
        this.reload = !this.reload

        await this.$api.history.getHistoryByOrder(this.$route.params.id)
            .then(res => {
                console.log("history",res);
                this.dataHistory = res.data.data
                console.log(this.dataHistory);
            })
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
    border: 1px solid;
    border-radius: 10px;
    padding: 10px;
    background-color: #bdace4ab;
    margin-bottom: 20px;
}

.infor2 .left,.infor2 .right{
     width: 50%;
    display: flex;
    flex-direction: column;
    padding: 20px 0px;
    margin-right: 20px;
    border: 1px solid;
    border-radius: 10px;
    padding: 10px;
    background-color: #bdace4ab;
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
.his-item:last-child div{
        display: none;
    }
</style>