<style lang='less'>
  @import '../../common/base-750.less';

  .tooltips-container {
    position: fixed;
    z-index: 9999;
    .top(440);
    .height(80);
    width: 100%;
    .line-height(80);
    text-align: center;
  }
  .tooltips {
    display: inline-block;
    .height(80);
    .font-size(32);
    color: #fff;
    background: #000;
    opacity: 0.65;
    .padding(0, 40);
    .border-radius(5);
  }
</style>

<template>
  <div class="tooltips-container" v-show="show">
    <span id="tooltips" class="tooltips">{{ content }}</div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        t: null
      }
    },
    props: {
      content: {
        type: String,
        required: true,
        twoWay: true
      },
      show: {
        type: Boolean,
        required: true,
        twoWay: true
      },
      hideTime: {
        type: Number,
        default: 2000
      }
    },
    events: {
      setTooltips () {
        let self = this
        let target = document.getElementById('tooltips')
        target.innerHTML = self.content

        if (!self.show) {
          this.t = setTimeout(function () {
            self.show = false
            clearTimeout(this.t)
          }, self.hideTime)
        }
      },
      hideTooltips () {
        clearTimeout(this.t)
        this.show = false
      },
      showTooltips () {
        clearTimeout(this.t)
        this.show = true
      }
    }
  }
</script>
