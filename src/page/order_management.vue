<template>
    <div class="order_management">
        <!-- <div class="title">
            <span></span>{{order_manager.order_management}}</div> -->
        <!-- <vTitle :title="order_manager.order_management"></vTitle> -->
        <div class="time">
            <div class="block">
                <span class="demonstration">{{order_manager.Creation_time}}: </span>
                <el-date-picker size="small" prefix-icon="el-icon-date" v-model="value1" type="datetime" :placeholder="order_manager.Select_time"></el-date-picker>
            </div>
            <div class="block">-</div>
            <div class="block">
                <el-date-picker size="small" v-model="value2" prefix-icon="el-icon-date" type="datetime" :placeholder="order_manager.Select_time"></el-date-picker>
            </div>
        </div>
        <el-form :inline="true" :model="formInline" class="demo-form-inlines">
            <el-form-item>
                <el-select v-model="formInline.region" size="small" :placeholder="order_manager.All_state">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="order_manager.order_number">
                <el-input v-model="formInline.user" size="small" placeholder=""></el-input>
            </el-form-item>
            <el-form-item :label="order_manager.Vendor_name">
                <el-input v-model="formInline.user" size="small" placeholder=""></el-input>
            </el-form-item>
            <el-form-item :label="order_manager.deliverer">
                <el-input v-model="formInline.user" size="small" placeholder=""></el-input>
            </el-form-item>
            <el-form-item :label="order_manager.tel">
                <el-input v-model="formInline.user" size="small" placeholder=""></el-input>
            </el-form-item>
            <el-form-item class="right_btn">
                <el-button type="warning" @click="onSubmit" size="mini" icon="el-icon-search">{{order_manager.search}}</el-button>
            </el-form-item>
        </el-form>
        <div class="todoBtn">
            <el-button type="primary" size="mini">{{order_manager.refresh}}</el-button>
            <el-button type="primary" size="mini">{{order_manager.Export}}</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 96%">
            <el-table-column prop="date" :label="order_manager.orderNumber" width="120"></el-table-column>
            <el-table-column prop="name" :label="order_manager.VendorName" width="80"></el-table-column>
            <el-table-column prop="address" :label="order_manager.price_payment" width="180"></el-table-column>
            <el-table-column prop="address" :label="order_manager.delivery_fee"></el-table-column>
            <el-table-column prop="address" :label="order_manager.order"></el-table-column>
            <el-table-column prop="address" :label="order_manager.StoreAddress"></el-table-column>
            <el-table-column prop="address" :label="order_manager.delivery"></el-table-column>
            <el-table-column prop="address" :label="order_manager.way"></el-table-column>
            <el-table-column prop="address" :label="order_manager.order_time"></el-table-column>
            <el-table-column prop="address" :label="order_manager.deliMan"></el-table-column>
            <el-table-column prop="address" :label="order_manager.tel"></el-table-column>
            <el-table-column prop="address" :label="order_manager.state"></el-table-column>
            <el-table-column prop="address" :label="order_manager.time"></el-table-column>
            <el-table-column prop="address" :label="order_manager.timeout"></el-table-column>
        </el-table>
        <div class="page">
            <span>{{order_manager.the}}{{currentPage}}/0{{order_manager.page}}，{{order_manager.shows}}{{showCount}}{{order_manager.count}}，{{order_manager.total}}{{total}}{{order_manager.count}}</span>
            <div class="u-pagination" v-if="parseInt(total)>10 ">
                <el-pagination background layout="prev, pager, next" :total="total" :current-page="parseInt(currentPage)" @current-change="changePage"></el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
    import vTitle from '../components/v_title.vue'
    export default {
        name: 'order_management',
        data() {
            return {
                value1: '',
                value2: '',
                formInline: {
                    region: '',
                    user: ''
                },
                tableData: [{
                    data: '',
                    name: '',
                    address: ''
                }],
                total: '',
                currentPage: 1,
                showCount: 10
            }
        },
        components: {
            vTitle
        },
        computed: {
            order_manager() {
                let order_manager = this.$t('order_manager')
                return order_manager
            }
        },
        methods: {
            onSubmit() {
            },
            changePage(page) {
                this.currentPage = page
            }
        }
    }
</script>

<style scoped lang="scss">
    .order_management {
        background: #fff;
        /* .title {
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
        } */
        .time {
            margin: 25px 40px;
            .block {
                display: inline-block;
                span {
                    color: #6D6D6D;
                    font-size: 14px;
                }
            }
        }
        .el-form {
            margin: 23px 0 23px 0;
            padding-left: 40px;
            border-bottom: 1px solid #EDEDED; // .right_btn {
            //     position: absolute;
            //     // right: 0;
            // }
        }
        .page {
            height: 29px;
            line-height: 29px;
            margin: 20px 0 0 40px;
            padding-bottom: 65px;
            span {
                font-size: 14px;
                color: #666666;
            }
        }
        .todoBtn {
            float: right;
            margin-right: 34px;
        }
        .u-pagination {
            display: inline-block;
            float: right;
        }
    }

    @media (min-width: 992px) and (max-width: 1400px) {}
</style>