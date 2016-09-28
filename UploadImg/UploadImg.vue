<style lang="less">
  @import './base-750.less';

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
    line-height: 0;
  }

  .clearfix:after {
    clear: both;
  }

 .upload-box {
    .padding-top(30);
    .font-size(0);
    border-bottom:1px solid #E6E6E6;
    overflow: hidden;
    background: #fff;

    >a {
      position: relative;
      float: left;
      .width(120);
      .height(120);
      .margin-right(30);
      .margin-bottom(30);
      border:1px solid #E6E6E6;
      .border-radius(5);
    }

    .picture-loading {

      > img {
        position: absolute;
        left: 50%;
        top: 50%;
        .width(28);
        .height(28);
        .margin-left(-14);
        .margin-top(-14);
      }
    }

    .picture-view {

      .picture-page {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .border-radius(5);

        > img {
          display: block;
          position: relative;
          left: 50%;
          top: 50%;
          width: 100%;
          -webkit-transform:translate(-50%, -50%);
          transform:translate(-50%, -50%);
        }
      }

      > span {
        position: absolute;
        right: 0;
        top: 0;
        .width(44);
        .height(44);
        .margin-right(-20);
        .margin-top(-20);
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAABEJJREFUWAntmc9LG0EUx19MLoJQgicFg4qiEk96sbUIFtRo1OBF+h8IHgpR7B+haKAHwf+geIsajXqT2nrxZvAnChHMsRQEPSSm75vuyu7O7OyuMYWAA5KZN2/e++Tty5vZkeitvUWguiPgKxd/dXU1+PDwEGU7Q8ViMeTz+Rq538j9Ivdz/HHHn1mW7dfW1qZmZ2d/l+PzxcArKyuxp6enL+x8gP8CLiHyrHdQU1PzbW5uLulyjUnNM3AikXjPoEscuX6TJY8Djvohgy/E4/FfXpa6Bl5fX/dns9klNh734sCFbiIUCi1MT08XXOiSK+C1tbV39/f33zmqETdGvepwtNN1dXWfZ2Zm/jitdQTWYA8ZNuxkrJx5hs4wdL8TdI3KCdJAi2xFYcGAgMAXfKqYlMDI2UqlgQwKvrTfiWy6JLNNCVSDQqHw03ZlBSc4Pfrn5+elvm0jjNJVQSYn04t2ClJgbAr8eJR1tr6+niKRCDU3N9vZFuQNDQ00ODhIwWBQmDMK4BsMRpnelwJrO5iuI/3s7e2lcDhMU1NT1NnZKdUxCvHFuNZST08P9fX1GaekfTsGARhnA7aA7VbZTk9PiXOceLei0dFRJXRLSwvFYjEKBAKoBnR5eam0rU0OaCwmXQFYO8g4ng1ub29pa2vLBN3R0WEyjkFra6sJdm9vj66urgQ9iSCgsZimBGCeHTJpKAZwDGh+fKVIj42NkRG6ra2NJicnye/3lyK7u7tLJycnCovClMAiAPMjCwnLFAI7aMCOj48/w+7s7FAmk1FYEqdkLMKj5xqIs6y4WiFBTiLSAEROI9Jo6CP66XSakPNeG1isa4QIs4KgZF0kG+vQenrosNvb2y+C1XwILAIwR9dbeA30gLS2Mswh7wUWwQM/hpzVqZtxV1dXKRX0yOqRjkaj1N7e7saEoCNjEYD5S90JKx0EgEUtBixq8+bmJqVSqefqgdx+CbSMRQDmb5V14DNNY7cDLK8rweLHh8pxcXFByF890oBG5fDSZCwCMBvcd2u0u7ubRkZGnmE3NjZMm8L5+bkJemJiwiu0wCIA41WcgfF2q2yI1vDwcAk2n89TMpmk6+trYY0VGpFuamoS9CSCvMZimhKAtXuDA5OWZICcRBrosDc3NxKtfyJAY+NAemDXQ867aAeyOwxh44Ah/vF8Y+OfVEaPjo7o8fGRzs7OKJdzLizQgz5OdsfHxyrTpTkwyJRs3ziWl5d/8K9UeSaWGXwNGT+5Q37j+CizJaSEQemrof9fuxzdBTuHtsDaO1XCbmEF5QnVbZAtMIBwI8OPJ11BOJNp+IJPk9AyUALj+gg3MmzI27nQ4sTNED7gy+nKSgkMR7iJwY1MJSMN225ufcBjWyUwaWxVdRloBOdy94HHi+WWPI5qZa9bjdDoV82FthXc7l8Gmt4djogczSyPX+VfBlb/b+O3CFRbBP4CN/TnaGPoTHIAAAAASUVORK5CYII=") center no-repeat;
        .background-size (44, 44);
      }
    }

    .upload-btn {
      background: url("data:image/png;base64,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") no-repeat center;
      .background-size (45, 34);
    }

    .add-btn {
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAAJxJREFUWAnt2DEOgzAUBNE4Z/YxfOdEdGhaxlEsDRVbsPo87AKPl3yttT73yjnnuOen9++nBb9+voF3iyecMARaEgDRY8I6KQoTBogeE9ZJUZgwQPSYsE6KwuOEB//B8EJ/F48TbuDda0g9M7iG5Z7oXGL3J7T723S2KPsSpoidE7ZF2ZcwReycsC3KvoQpYueEbVH2JUwROx8n/AVBhQr5Q57+GgAAAABJRU5ErkJggg==") center no-repeat;
      .background-size (44);
    }
  }
</style>

<template>
  <div class="upload-box clearfix">
    <a href="javascript:;" class="picture-view" v-for='item in photos' track-by="$index">
      <div class="picture-page"><img :src='item + "?imageMogr2/thumbnail/x70"' alt=""></div>
      <span @click="removePhoto($index)"></span>
    </a>
    <a href="javascript:;" class="upload-btn" v-show="showUploadBtn" v-on:click="openCamrea"></a>
    <a href="javascript:;" class="picture-loading" v-show="Showpictureload"  v-for='item in loading_num'>
        <img src='//static.tinfinite.com/img/loading.gif' alt=''>
    </a>
    <a href="javascript:;" class="add-btn" v-show="showAddBtn" v-on:click="openCamrea"></a>
  </div>
</template>

<script>
  import ImgLoad from './imgLoad'

  export default {
    props: {
      maxNum: {
        type: Number,
        required: true
      },
      photos: {
        type: Array,
        required: true,
        twoWay: true
      },
      status: {
        type: Boolean,
        required: true,
        twoWay: true
      }
    },
    data () {
      return {
        showUploadBtn: true,
        Showpictureload: false,
        showAddBtn: false,
        loading_num: 0
      }
    },
    ready () {
      if (!window.tinfiniteListener) {
        window.tinfiniteListener = {}
      }
      window.tinfiniteListener.uploadCallback = this.upload
    },
    events: {
      commitPhoto () {
        this.photos = []
        this.showUploadBtn = true
        this.Showpictureload = false
        this.showAddBtn = false
      }
    },
    methods: {
      openCamrea () {
        if (window.tinfiniteBridge.openCamera) {
          let currentNum = this.photos.length
          window.tinfiniteBridge.openCamera(currentNum, this.maxNum)
        }
      },
      upload (d) {
        d = JSON.parse(d)

        let i = 0
        for (let key in d) {
          if (d.hasOwnProperty(key)) {
            i++
          }
        }
        if (this._uploadBefore(i)) {
          this._uploadCoverComplete(d)
        }
      },
      _uploadBefore (num) {
        this.status = false
        let currentNum = this.photos.length
        let loadingNum = this.loading_num
        let maxNum = this.maxNum
        let uploadNum = num

        if (currentNum + uploadNum > maxNum) {
          uploadNum = maxNum - currentNum
        }

        let loading = loadingNum + uploadNum

        if (loading >= maxNum) {
          this.loading_num = maxNum
        } else {
          this.loading_num = loading
        }

        this.showUploadBtn = false
        this.Showpictureload = true

        if (currentNum + this.loading_num >= maxNum) {
          this.showAddBtn = false
        } else {
          this.showAddBtn = true
        }
        return true
      },
      _uploadCoverComplete (data) {
        let self = this
        let params = []
        for (let i in data) {
          params.push(data[i] + '?imageMogr2/thumbnail/x70')
        }

        ImgLoad.load({
          url: params,
          afterAll: () => {
            self.Showpictureload = false
            self.showUploadBtn = false
            self.showAddBtn = true
            self.loading_num = 0

            for (let i in data) {
              self.photos.push(data[i])
            }

            if (self.photos.length >= this.maxNum) {
              self.showAddBtn = false
              self.photos.length = this.maxNum
            }
            this.status = true
          }
        })
      },
      _uploadFail (err) {
        console && console.log(JSON.stringify(err))
      },
      removePhoto (item) {
        this.photos.splice(item, 1)
        let photoLen = this.photos.length

        if (photoLen === 0) {
          this.showAddBtn = false
          this.showUploadBtn = true
        } else if (photoLen < this.maxNum) {
          this.showAddBtn = true
        }
        this.current_len = photoLen
      }
    }
  }
</script>