<style lang="less">
  .choice_btn {
    position: relative;
    display: table;
    width: 100%;
    height: 100%;
    background: #F9F9F9;
    border: 1px solid #E6E6E6;
    padding-right: 15px;
    text-align: center;

    .down {
      position: absolute;
      top: 0;
      right: 8px;
      width: 20px;
      height: 100%;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAAAXNSR0IArs4c6QAAAIVJREFUOBG91UsKgDAMBFDHw/RYgicTPFYPY226KEX7SaLNQMjs3i5BCGH13h9xb4tBAJzOuR1kWeEZBa4EW+AlSl6GZ+JP9AXPwGtoFf4Tb6FN+A+8h3bhL/gIHcIanIOyYAnORdkwB5egIriHS1ExXMM1qAoucerp4MfbS90k9FhotNgNvT6pDIwRxJwAAAAASUVORK5CYII=") no-repeat #F9F9F9 center;
      background-size: 10px;
    }

    .placeholder {
      display: table-cell;
      color: #333333;
      font-size: 0.4rem;
      vertical-align: middle;
    }
  }

  .choice_list_con {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.65);
    z-index: 1000;

    .choice_list {
      width: 80%;
      max-height: 8.4rem;
      background: #FFF;
      margin: 3rem auto 0;
      border-radius: 4px;
      list-style: none;
      overflow-y: auto;

      > li {
        height: 1.4rem;
        line-height: 1.4rem;
        color: #333333;
        font-size: 0.4rem;
        padding-left: 30px;
        border-bottom: 1px solid #D9D9D9;
        -webkit-tap-highlight-color: #F9F9F9;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
</style>

<template>
  <div class="choice_btn" @click="showChoiceList = true">
    <i class="down"></i>
    <span class="placeholder">{{ model }}</span>
  </div>
  <div v-if="showChoiceList" class="choice_list_con" @click="showChoiceList = false">
    <ul class="choice_list" @click='getContent($event)'>
      <li v-for="item in options">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      model: {
        type: String,
        default: '请选择'
      },
      options: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        showChoiceList: false
      }
    },
    methods: {
      getContent (event) {
        let target = event.target
        this.model = target.innerHTML
      }
    }
  }
</script>
