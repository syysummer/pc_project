<template>
    <div>
        <div class="v_title clearFloat">
            <div>&nbsp;</div>
            {{title}}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'v_title',
        data() {
            return {

            }
        },
        props: {
            title: {
                type: String,
                default: ""
            }
        },
    }
</script>

<style scoped>
    .v_title {
        padding: 8px 15px;
        border-bottom: 1px solid #EDEDED;
        display: flex;
        align-items: center;
        font-weight: bold;
        color: #474747
    }

    .v_title div {
        float: left;
        width: 5px;
        margin-right: 15px;
        background: #FF3633;
        border-radius: 5px;
    }
</style>