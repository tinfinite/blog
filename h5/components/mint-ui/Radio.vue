<style>
  @import './mint-ui.css';

  .mint-radiolist .mint-cell-title {
    padding: 10px;
  }
  .mint-radio-label {
    line-height: 26px;
  }

  .mint-radiolist-title {
    margin: 0;
  }
</style>

<template>
  <div class="page-radio">
    <mt-radio
      align="right"
      class="page-part"
      :value.sync="value"
      :options="options">
    </mt-radio>
  </div>
</template>

<script>
import Vue from 'vue'
import MintUI from 'mint-ui'
import { MtRadio } from 'mint-ui'

Vue.use(MintUI)
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      required: false,
      twoWay: true
    }
  },
  component: {
    MtRadio
  }
}
</script>
