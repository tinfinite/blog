---
title: 直播音频小库 voiceLive.js
date: 2016-12-05
category: frontend
tags: javascript audio live howlerjs voice
---

最近接到做微信公众号语音直播（[一块听听](http://live.tinfinite.com/)）的需求。需求大概是这样的：我们使用 socket 接收语音消息，语音消息其实就是一条一条音频地址，然后需要支持**切换**、**（连续）播放**、**暂停**、**进度**、**显示时间**各种交互。如图：

![语音直播](http://o4a7cbihz.qnssl.com/cover/c93bfd19-45a2-43b7-86bf-3edfcd6c9160)

前期，没有考虑太多，直接操作 dom，各种修改 audio 属性，操作他的方法。虽然这样也可以满足需求达到目的，但是**频繁的操作 dom**，**兼容性问题**，**高级特性不易用上**等一系列问题，让代码可维护性和可读性都不会太好。

待需求稳定以后，我们打算重构**语音直播**。最终打算使用 howler.js 进行封装成 voiceLive.js 的小库 <https://github.com/lzwaiwai/voiceLive.js>。如图：
![voiceLive.js](http://o3b126ie1.qnssl.com/cover/5e403295-31fb-4173-b88a-46f868c612ac)

### 用法：
1、首先我们需要约定待初始化的音频数据结构：
   ```javascript
      var datas = [{
        id: 'mmm', // 音频的唯一标识
        src: 'xxxxx', // 音频地址
        time: 16, // 总时间展示
        currentTime: 0 // 当前的播放时间
      }, {
        id: 'nnn',
        src: 'yyyyy',
        time: 25,
        currentTime: 0
      }];
   ```
    
2、初始化直播音频播放：
    **datas** 为1中的数据； **step** 为一个类似定时器的执行函数，在直播过程中，不断执行该函数； **onload, onloaderror, onplay, onpause, onstop, onend** 为当前正在播放音频的监听回调函数。
    ```javascript
      var vl = new LiveAudio({
        datas: datas, 
        step: function (itemId, currentTime, progress) { // for live process, and like a timer 
          console.log('step');
        },
        events: { // events for current voice
          onload: function () {
            console.log('onload');
          },
          onloaderror: function () {
            console.log('onloaderror');
          },
          onplay: function () {
            console.log('onplay');
          },
          onpause: function () {
            console.log('onpause');
          },
          onstop: function () {
            console.log('onstop');
          },
          onend: function () {
            console.log('onend');
          }
        }
      });
    ```

3、其他功能：

1) 我们可以在 step 函数增加如下方法进行进度和时间的变化展示：(进度方面，数字不可能非常准确达到100%，所以需要人为变通一下)
    ```javascript
        progress = (progress * 100).toFixed(2) // for to 100
        if (progress > 99) {
            progress = 100.00
        }
        $('#currentTime-' + itemId).text(Math.floor(currentTime) + 's');
        $('#progress-' + itemId).text(progress + '%')
    ```
    
2) 连续播放：只需要在音频停止的时候，执行播放下一条即可。
    ```javascript
        onend: function () {
            this.playNext(); // for auto play next item
            console.log('onend');
        }
    ```

3) 当有新的音频加入的时候，需要 `vl.addVoice(data)` 添加即可。

最后欢迎提issue: <https://github.com/lzwaiwai/voiceLive.js/issues>