<style lang='less'>
  .upload-input {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <input type='file' class='upload-input' v-on:click="openCamreaForAndroid" v-on:change='upload' accept='image/*' multiple="multiple" />
</template>

<script>
  import Request from '../../utils/request'

  export default {
    props: {
      url: {
        type: String,
        required: true
      }
    },
    ready () {
      if (!window.tinfiniteBridge) {
        window.tinfiniteBridge = {}
      }
      window.tinfiniteBridge.uploadForAndroid = this.upload
    },
    methods: {
      openCamreaForAndroid () {
        if (/android/i.test(window.navigator.userAgent)) {
          window.tinfiniteBridge.openCamera()
        }
      },
      upload (d) {
        if (typeof d === 'string') {
          d = JSON.parse(d)

          let i = 0
          for (let key in d) {
            if (d.hasOwnProperty(key)) {
              i++
            }
          }

          this.$dispatch('uploadBefore', i)
          this.$dispatch('uploadCoverComplete', d)
          return
        }
        let self = this
        let file = self.$el.files
        let data = new FormData()
        let url = self.url

        for (let index in file) {
          data.append(index, file[index])
        }

        if (!self.$dispatch('uploadBefore', file.length)) {
          return
        }

        Request.post({
          url: url,
          data: data
        }, (res) => {
          self.$dispatch('uploadCoverComplete', res)
        }, (err) => {
          console.log(err)
          self.$dispatch('uploadFail', err)
        })
      }
    }
  }
</script>