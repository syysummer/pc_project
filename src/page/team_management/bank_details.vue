<template>
    <div class="bank_details">
        <div class="title"><span></span>配送员详情</div>
        <div class="context">
            <div class="left">
                <div>姓名: </div>
                <div>用户名: </div>
                <div>电话号码: </div>
                <div>邮箱: </div>
                <div>交备付金: </div>
                <div>证件号码: </div>
            </div>
            <div class="right">
                <div>张三</div>
                <div>zhangsan</div>
                <div>1524541545: </div>
                <div>1564524124</div>
                <div>45674</div>
                <div>21454654</div>
            </div>
            <div class="images">
                <div>
                    <span>证件正面: </span>
                    <img src="" alt="">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style scoped lang="scss">
    .bank_details {
        background: #fff;
        .title {
            font-size: 16px;
            color: #474747;
            font-weight: bold;
            padding: 15px 0 12px 20px;
            border-bottom: 1px solid #EDEDED;
            span {
                display: inline-block;
                width: 5px;
                height: 16px;
                border-radius: 2px;
                background: #FF3633;
                margin-bottom: -2px;
                margin-right: 18px;
            }
        }
    }
</style>
