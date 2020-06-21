<template>
  <div>
    {{select_language_title}}
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {

      }
    },
    computed: {
      select_language_title() {
        let select_language_title = this.$t('select_language_title');
        return select_language_title;
      }
    },
    created() {
      console.log('md5-test:::' + this.$md5('hello'));
    }
  }
</script>

<style scoped>
</style>