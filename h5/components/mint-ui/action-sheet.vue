<style lang="css">
  @import './mint-ui.css';

  .mint-actionsheet-list {
    padding: 0;
    margin: 0;
  }
</style>

<template>
  <div class="page-actionsheet">
    <mt-actionsheet
      :actions="actions"
      :visible.sync="visible"></mt-actionsheet>
  </div>
</template>

<script>
import Vue from 'vue'
import MintUI from 'mint-ui'
import { MtActionsheet } from 'mint-ui'

Vue.use(MintUI)
export default {
  props: {
    actions: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  component: {
    MtActionsheet
  }
}
</script>
