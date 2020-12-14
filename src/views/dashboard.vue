<template>
    <div class="container">
        <div class="analyze">
            <div class="analyze-order analyze-item">
                <h5>Thống kê đơn hàng</h5>
                <span>Tổng số đơn hàng: {{sumOrder}}</span>
                <div class="items">
                    <div class="item" style="border-right:1px solid gray">
                        <span class="number">{{dataOrder.waiting}}</span>
                        <span class="title">Chờ xác nhận</span>
                    </div>
                    <div class="item" style="border-right:1px solid gray">
                        <span class="number">{{dataOrder.accept}}</span>
                        <span class="title">Chờ lấy hàng</span>
                    </div>
                    <div class="item" style="border-right:1px solid gray">
                        <span class="number">{{dataOrder.accept}}</span>
                        <span class="title">Đang giao</span>
                    </div>
                    <div class="item" style="border-right:1px solid gray">
                        <span class="number">{{dataOrder.reject}}</span>
                        <span class="title">Từ chối</span>
                    </div>
                    <div class="item" style="border-right:1px solid gray">
                        <span class="number">{{dataOrder.success}}</span>
                        <span class="title">Thành công</span>
                    </div>
                    <div class="item">
                        <span class="number">{{dataOrder.fail}}</span>
                        <span class="title">Thất bại</span>
                    </div>
                </div>
            </div>
            <div class="analyze-product analyze-item">
                <h5>Thống kê sản phẩm</h5>
                <span>Tổng số sản phẩm: {{sumProduct}}</span>
                <div class="items">
                    <div class="item" style="border-right:1px solid gray">
                        <span class="number">{{dataProduct.active}}</span>
                        <span class="title">Đang bán</span>
                    </div>
                    <div class="item" style="border-right:1px solid gray">
                        <span class="number">{{dataProduct.sold}}</span>
                        <span class="title">Hết hàng</span>
                    </div>
                    <div class="item">
                        <span class="number">{{dataProduct.locked}}</span>
                        <span class="title">Tạm khóa</span>
                    </div>
                </div>
            </div>
            <div class="analyze-user analyze-item">
                <h5>Thống kê người dùng</h5>
                <span>Tổng số người dùng: {{dataUser.sum}} </span>
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
                    <div class="item">
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
                waiting: 0,
                accept: 0,
                reject: 0,
                success: 0,
                fail: 0
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
                        this.dataOrder.waiting = item.number
                        break
                    case 2:
                        this.dataOrder.accept = item.number
                        break
                    case 3:
                        this.dataOrder.shipping = item.number
                        break
                    case 4:
                        this.dataOrder.reject = item.number
                        break
                    case 5:
                        this.dataOrder.success = item.number
                        break
                    case 6:
                        this.dataOrder.fail = item.number
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
    padding: 0px 20px;
}
.analyze-item {
    padding-top: 20px;
}
</style>