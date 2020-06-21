<template>
    <div class="financial_management">
        <!-- <div class="title"><span></span>{{financial.financial_management}}</div> -->
        <!-- <vTitle :title="financial.financial_management"></vTitle> -->
        <div class="search">
            <div class="time">
                <div class="block">
                    <span class="demonstration">{{financial.Creation_time}}: </span>
                    <el-date-picker size="small" prefix-icon="el-icon-date" v-model="value1" type="datetime" :placeholder="financial.Select_time"></el-date-picker>
                </div>
                <div class="block">-</div>
                <div class="block">
                    <el-date-picker size="small" v-model="value2" prefix-icon="el-icon-date" type="datetime" :placeholder="financial.Select_time"></el-date-picker>
                </div>
            </div>
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item :label="financial.deliverer">
                    <el-input v-model="formInline.user" size="small" placeholder=""></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" @click="onSubmit" size="mini" icon="el-icon-search">{{financial.search}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" stripe style="width: 96%">
            <el-table-column prop="name" :label="financial.VendorName"></el-table-column>
            <el-table-column prop="address" :label="financial.income"></el-table-column>
            <el-table-column prop="address" :label="financial.name"></el-table-column>
            <el-table-column prop="address" :label="financial.delivery_fee"></el-table-column>
            <el-table-column prop="address" :label="financial.Reward_income"></el-table-column>
            <el-table-column prop="address" :label="financial.Paid_amount"></el-table-column>
            <el-table-column prop="address" :label="financial.Unrecorded_amount"></el-table-column>
            <el-table-column prop="address" :label="financial.Amount_account"></el-table-column>
            <el-table-column prop="address" :label="financial.Withdrawal_amount"></el-table-column>
            <el-table-column prop="address" :label="financial.Reserve_payment"></el-table-column>
            <el-table-column prop="address" :label="financial.surplus"></el-table-column>
        </el-table>
        <div class="page">
            <span>{{financial.the}}{{currentPage}}/0{{financial.page}}，{{financial.shows}}{{showCount}}{{financial.count}}，{{financial.total}}{{total}}{{financial.count}}</span>
            <div class="u-pagination" v-if="parseInt(total)>10 ">
                <el-pagination background layout="prev, pager, next" :total="total" :current-page="parseInt(currentPage)" @current-change="changePage"></el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
    import vTitle from '../components/v_title.vue'
    export default {
        name: 'financial_management',
        data() {
            return {
                value1: '',
                value2: '',
                formInline: {
                    region: '',
                    user: ''
                },
                tableData: [{
                    data: '124',
                    name: 'hsaidohf',
                    address: 'dsfjdslfkjdsf'
                },
                {
                    data: '124',
                    name: 'hsaidohf',
                    address: 'dsfjdslfkjdsf'
                }
                ],
                total: '',
                currentPage: 1,
                showCount: 7
            }
        },
        components: {
            vTitle
        },
        computed: {
            financial() {
                let financial = this.$t('financial')
                return financial
            }
        },
        methods: {
            onSubmit() {

            },
            handleClick(row) {
                console.log(row);
            },
            changePage(page) {
                this.currentPage = page
            }
        }
    }
</script>

<style scoped lang="scss">
    .financial_management {
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
        .search {
            float: left;
            margin-top: 25px;
            width: 100%;
            border-bottom: 1px solid #EDEDED;
        }
        .time {
            margin-left: 40px;
            float: left;
            margin-top: 4px;
            .block {
                display: inline-block;
                span {
                    color: #6D6D6D;
                    font-size: 14px;
                }
            }
        }
        .el-form {
            float: left;
            margin-left: 0.2rem;
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
</style>