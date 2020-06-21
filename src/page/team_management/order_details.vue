<template>
    <div class="public_box">
        <vTitle :title="order_details.title"></vTitle>
        <div class="order_details">
            <div class="context">
                <div class="infor">
                    <div class="title">{{order_details.info}}</div>
                    <div class="left">
                        <div>{{order_details.free}}: </div>
                        <div>123</div>
                    </div>
                    <div class="left">
                        <div>{{order_details.order_num}}: </div>
                        <div>1244757441</div>
                    </div>
                    <div class="left">
                        <div>{{order_details.order_time}}: </div>
                        <div>2018-3-4</div>
                    </div>
                    <div class="left">
                        <div>{{order_details.service_time}}: </div>
                        <div>2018-3-4</div>
                    </div>
                    <div class="left">
                        <div>{{order_details.set_time}}: </div>
                        <div>2018-3-4</div>
                    </div>
                </div>
            </div>
            <div class="context">
                <div class="contact">
                    <div class="title">{{order_details.phone}}</div>
                    <div class="left">
                        <div>{{order_details.contact}}: </div>
                        <div>dfj</div>
                    </div>
                    <div class="left">
                        <div>{{order_details.contact_tel}}: </div>
                        <div>12745754</div>
                    </div>
                    <div class="left">
                        <div>{{order_details.address}}: </div>
                        <div>24575242572425</div>
                    </div>
                    <div class="left">
                        <div>{{order_details.name}}: </div>
                        <div>2748</div>
                    </div>
                    <div class="left">
                        <div>{{order_details.name_tel}}: </div>
                        <div>5454646</div>
                    </div>
                    <div class="left">
                        <div>{{order_details.addr}}: </div>
                        <div>7457467876746</div>
                    </div>
                </div>
            </div>
            <div class="context">
                <div class="goods">
                    <div class="title">{{order_details.goods}}</div>
                    <div class="commodity">
                        <div class="left">
                            <img src="" alt="">
                        </div>
                        <div class="right">
                            <div>1243435</div>
                            <div>452433</div>
                            <div class="price">53645</div>
                        </div>
                        <div class="clear"></div>
                    </div>
                </div>
            </div>
            <div class="context">
                <div class="remark">
                    <div class="title">{{order_details.remark}}</div>
                    <div class="content">
                        代课老师附近开了大概花费的加快建设考核计划
                    </div>
                </div>
                <div class="btn">
                    <el-button type="primary" size="small">{{order_details.back}}</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import vTitle from '../../components/v_title.vue'
export default {
    name: 'order_details',
    data() {
        return {}
    },
    components: { vTitle },
    computed: {
        order_details () {
            let order_details = this.$t('order_details')
            return order_details
        }
    },
    methods: {

    }
}
</script>
<style scoped lang="scss">
    .order_details {
        .context {
            padding-left: 35px;
            padding-bottom: 10px;
            border-bottom: 1px solid #EDEDED;
            .title {
                margin: 20px 0;
                color: #474747;
                font-size: 16px;
            }
            .left {
                padding-left: 20px;
                div {
                    &:first-child {
                        float: left;
                        margin-right: 10px;
                    }
                    height: 30px;
                    line-height: 30px;
                    font-size: 14px;
                    color: #6D6D6D;
                }
            }
            .goods {
                padding-bottom: 15px;
                .commodity {
                    // height: 124px;
                    .left{
                        float: left;
                        margin-left: 20px;
                        width: 146px;
                        height: 104px;
                        background: red;
                    }
                    .right {
                        float: left;
                        margin-left: 17px;
                        div {
                            font-size: 14px;
                            color: #6D6D6D;
                            height: 30px;
                            line-height: 30px;
                        }
                        .price {
                            margin-top: 20px;
                            color: #FF3633;
                        }
                    }
                    .clear {
                        clear: both;
                    }
                }
            }
            .remark {
                .content {
                    margin-left: 20px;
                    font-size: 14px;
                    color: #6D6D6D;
                }
            }
            .btn {
                margin: 40px 0;
                .el-button--small {
                    padding: 8px 20px;
                }
            }
        }
    }
</style>
