<template>
    <div class="container">
        <div class="analyze">
            <div class="analyze-order analyze-item">
                <h4>Thống kê đơn hàng</h4>
                <h5>Tổng số đơn hàng: <span style="color: red">{{sumOrder}}</span></h5>
                <div class="items" style="display:flex; flex-direction:column">
                    <div class="items" style="margin-bottom: 10px">
                        <div class="item" style="border-right:1px solid gray">
                            <span class="number">{{dataOrder.cholayhang}}</span>
                            <span class="title">Chờ lấy hàng</span>
                        </div>
                        <div class="item" style="border-right:1px solid gray">
                            <span class="number">{{dataOrder.danggiao}}</span>
                            <span class="title">Đang giao</span>
                        </div>
                        <div class="item" style="border-right:1px solid gray">
                            <span class="number">{{dataOrder.dagiao}}</span>
                            <span class="title">Đã giao</span>
                        </div>
                        <div class="item" style="border-right:1px solid gray;background-color: chartreuse;">
                            <span class="number">{{dataOrder.hoanthanh}}</span>
                            <span class="title">Hoàn thành</span>
                        </div>
                    </div>
                    <div class="items">
                        <div class="item" style="border-right:1px solid gray; background-color:coral">
                            <span class="number">{{dataOrder.choxuly}}</span>
                            <span class="title">Chờ xử lý</span>
                        </div>
                        <div class="item" style="border-right:1px solid gray">
                            <span class="number">{{dataOrder.dangtrahang}}</span>
                            <span class="title">Đang trả hàng</span>
                        </div>
                        <div class="item" style="border-right:1px solid gray">
                            <span class="number">{{dataOrder.datrahang}}</span>
                            <span class="title">Đã trả hàng</span>
                        </div>
                        <div class="item" style="border-right:1px solid gray; background-color: #e0705e">
                            <span class="number">{{dataOrder.dahuy}}</span>
                            <span class="title">Đã hủy</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="analyze-product analyze-item">
                <h4>Thống kê sản phẩm</h4>
                <h5>Tổng số sản phẩm: <span style="color:red">{{sumProduct}}</span></h5>
                <div class="items">
                    <div class="item" style="border-right:1px solid gray">
                        <span class="number">{{dataProduct.active}}</span>
                        <span class="title">Đang bán</span>
                    </div>
                    <div class="item" style="border-right:1px solid gray; background-color: coral">
                        <span class="number">{{dataProduct.sold}}</span>
                        <span class="title">Hết hàng</span>
                    </div>
                    <div class="item" style="background-color: #e0705e">
                        <span class="number">{{dataProduct.locked}}</span>
                        <span class="title">Tạm khóa</span>
                    </div>
                </div>
            </div>
            <div class="analyze-user analyze-item">
                <h4>Thống kê người dùng</h4>
                <h5>Tổng số người dùng: <span style="color: red">{{dataUser.sum}}</span> </h5>
                <div class="items">
                    <div class="item" style="border-right:1px solid gray">
                        <span class="number">{{dataUser.day}}</span>
                        <span class="title">Trong ngày</span>
                    </div>
                    <div class="item" style="border-right:1px solid gray">
                        <span class="number">{{dataUser.week}}</span>
                        <span class="title">Trong tuần</span>
                    </div>
                    <div class="item">
                        <span class="number">{{dataUser.month}}</span>
                        <span class="title">Trong tháng</span>
                    </div>
                    <div class="item" style="background-color: #e0705e">
                        <span class="number">{{dataUser.lock}}</span>
                        <span class="title">Bi khoa</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            dataOrder:  {
                choxacnhan: 0,
                cholayhang: 0,
                danggiao: 0,
                dagiao: 0,
                dahuy: 0,
                choxuly: 0,
                dangtrahang: 0,
                datrahang: 0,
                hoanthanh: 0
            },
            dataProduct: {
                active:0,
                locked:0,
                sold: 0
            },
            dataUser: {
                day: 0,
                week: 0,
                month: 0,
                sum: 0,
                lock: 0
            }
        }
    },
    computed: {
        sumOrder() {
            var sum = 0
            for( var i in this.dataOrder) {
                sum += this.dataOrder[i]
            }
            return sum
        },
        sumProduct() {
            return this.dataProduct.active + this.dataProduct.locked + this.dataProduct.sold
        },
    },
    async mounted(){
        await this.$api.orders.getOrderAnalyze()
        .then(res => {
            console.log(res);
            res.data.data.forEach((item) => {
                var status = item.statusId
                switch(status) {
                    case 1:
                        this.dataOrder.choxacnhan = item.number
                        break
                    case 2:
                        this.dataOrder.cholayhang = item.number
                        break
                    case 3:
                        this.dataOrder.danggiao = item.number
                        break
                    case 4:
                        this.dataOrder.dagiao = item.number
                        break
                    case 5:
                        this.dataOrder.dahuy = item.number
                        break
                    case 6:
                        this.dataOrder.choxuly = item.number
                        break
                    case 7:
                        this.dataOrder.dangtrahang = item.number
                        break
                    case 8:
                        this.dataOrder.datrahang = item.number
                        break
                    case 9:
                        this.dataOrder.hoanthanh = item.number
                        break 
                }
            })
            console.log(this.dataOrder);
        })

        await this.$api.products.getProductAnalyze()
        .then(res => {
            res.data.data.forEach((item) => {
                var status = item.status
                switch(status) {
                    case true:
                        this.dataProduct.active = item.number
                        break
                    case false:
                        this.dataProduct.locked = item.number
                        break
                }
            })
            this.dataProduct.sold = res.data.sold
            this.dataProduct.active -= this.dataProduct.sold
        })

        await this.$api.users.getUserAnalyze()
        .then(res => {
            this.dataUser.day = res.data.data.day.length
            this.dataUser.month = res.data.data.month.length
            this.dataUser.week = res.data.data.week.length
            this.dataUser.sum = res.data.data.sum.length
            this.dataUser.lock = res.data.data.lock.length
            // if(res.data.data.day.length > 0) {
            //     res.data.data.day.forEach(item => {
            //         this.dataUser.day += Number(item.total)
            //     })
            // }
            // if(res.data.data.week.length > 0) {
            //     res.data.data.week.forEach(item => {
            //         this.dataUser.week += Number(item.total)
            //     })
            // }
            // if(res.data.data.month.length > 0) {
            //     res.data.data.month.forEach(item => {
            //         this.dataUser.month += Number(item.total)
            //     })
            // }
            // if(res.data.data.sum.length > 0) {
            //     res.data.data.sum.forEach(item => {
            //         this.dataUser.sum += Number(item.total)
            //     })
            // }
            // if(res.data.data.lock.length > 0) {
            //     res.data.data.lock.forEach(item => {
            //         this.dataUser.lock += Number(item.total)
            //     })
            // }
        })
    }
}
</script>
<style scoped>
.items {
    display: flex;
    justify-content: center;
}
.item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0px 20px;
    width: 25%;
    height: 70px;
    border-radius: 10px;
    background-color: #bdace4;
    justify-content: space-evenly;
}
.analyze-item {
    padding-top: 20px;
    margin-bottom: 20px;
}
h4{
    font-weight: bold;
}
</style>