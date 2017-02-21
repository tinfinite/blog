---
title: UIImageView 是如何显示出来的
date: 2017-02-21
author: 张永彬
category: ios
tags: UIImageView
---

![Pixels Software Stack](http://o4a7cbihz.qnssl.com/cover/e220d513-25ef-4c3e-9a55-1a6c9e01ff8d "pixels software stack")

### 概述

- UIImageView是用来在视图中显示一张或多张图片的UIKit控件
- UIImageView显示的最大的图片的尺寸为4096 x 4096(px)，某些老机型为2048x2048(px) 参见：[iOSRes](http://iosres.com)
- UIImageView的图片存储在其layer的contents变量中

### 显示一张图片的代码一般写法
1. 生成UIImageView
2. 配置UIImageView的显示方式
3. 生成UIImage，并赋值给UIImageView
4. 将UIImageView添加到父视图

```
UIImageView *imageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, 100, 100)];
imageView.contentMode = UIViewContentModeScaleAspectFill;
imageView.layer.masksToBounds = YES;
imageView.image = [UIImage imageWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"test" ofType:@"jpg"]];
[self.view addSubview:imageView];
```

### 视图显示过程

#### 必不可少的RunLoop

`视图的显示是需要RunLoop去触发的。`在iOS中，视图的显示、事件的触发、NSTimer等都离不开RunLoop，RunLoop是一个处理事件的循环。

- 一旦系统有任何事件需要发送给应用，就会发送一个mach_msg消息给当前的应用，RunLoop负责接收该消息，并转换为特定的事件进行处理。例如：用户触摸屏幕事件。
- 应用中有些事件并不是按照代码中写的那样直接执行的，而是需要等待RunLoop，在RunLoop开始或结束的时候统一执行所有相关的事件。例如：添加视图、performSelector。

总的来说，RunLoop做了两个层面的事情：
- 封装系统消息，将应用与系统进行隔离，系统以消息的方式将应用需要的事件发送出来。
- 收集应用本身产生的一些事件，等到特定时机再执行。

#### 视图显示的软件堆栈

![Pixels Software Stack](http://o4a7cbihz.qnssl.com/cover/a5bcec7f-09f8-4085-8d5f-ae424cc141df "pixels software stack")

从上图可以看出，iOS中若想要显示图像必须要经过GPU的处理，而在软件层面GPU是由OpenGL操作的。Core Animation中的CALayer作为UIView的视图显示图层，直接与OpenGL相对应。由此可知，UIView中的视觉元素都是需要处理为OpenGL相关的代码的，这也为我们进行视觉相关的优化给出了指导原则。

```
Core Graphics是一个底层的设备无关的二维图像生成框架，又称Quartz2D。
Core Graphics是CPU端的，若应用中存在大量的Core Graphics代码将会对CPU产生较大的压力，从而造成应用卡顿。
合理的使用Core Graphics在CPU使用频率比较低的时候进行一些操作，主动生成GPU需要的数据，也可以减轻GPU的负担，从而提升应用整理的流畅度。
Core Graphics是线程安全的，因此在后台线程是可以进行一些Core Graphics操作的。
```

### Core Animation显示过程

#### Core Animation管线

参考：[Advanced Graphics and Animations for iOS Apps](https://developer.apple.com/videos/play/wwdc2014/419/)

![Core Animation Pipline](http://o4a7cbihz.qnssl.com/cover/1cd5e690-179b-4d57-9cd8-aeb332f2a0d8 "Core Animation Pipline")

上图展示了Core Animation管线流程。

首先需要知道Core Animation是分为应用端和服务端两部分的。我们在应用中可以使用的部分为应用端，准备好CALayer图层树，并将图层树压缩发给服务端的Core Animation。服务端收到发送来的图层树后先解压，然后转换为OpenGL或Metal相关的代码（Shader），OpenGL或Metal将Shader代码发送给GPU执行绘制命令，绘制的结果最后保存到了帧缓存区（FrameBuffer）中，最后屏幕在固定的时间间隔后将帧缓冲区中的数据显示到屏幕上。

#### Core Animation应用端的流程

在整个Core Animation管线过程中，我们唯一能控制的过程是应用端的过程，因此着重介绍下应用端的流程，即Commit Transation过程。

![Commit Transation](http://o4a7cbihz.qnssl.com/cover/f49c8068-35a7-4251-a74d-4da08ec9de1e "Commit Transation")

`在调用addSubview:方法后，会将该CALayer标记为dirty，待下次RunLoop开始后会将所有标记为dirty的CALayer放入Core Animation Pipline中进行处理。`

1. Layout

 ![Commit Transation Layout](http://o4a7cbihz.qnssl.com/cover/d68c82e7-06bf-4275-a448-f5f37bd44d63 "Commit Transation Layout")

  在这个过程中，将会调用UIView的layoutSubviews方法。Core Animation将会把新增的图层添加到图层树中；根据情况给CALayer的contents分配空间；一些轻量的数据查询，例如获取UILabel的text字符串等。

2. Display

 ![Commit Transation Display](http://o4a7cbihz.qnssl.com/cover/d1de7418-7c9d-4d2c-a29c-7ddf70d947a8 "Commit Transation Display")

  若UIView实现了drawRect:方法，此时就会调用drawRect:方法。在drawRect:方法中，一般为Core Graphics方法。在执行drawRect:方式前，应用会提前申请一个与当前视图大小相对应的内存空间（width * height * 4 * contentsScale byte)。因为Core Graphics在CPU中执行，因此需要确保Core Graphics中的代码比较简单，否则将会大量消耗CPU。

3. Prepare

 ![Commit Transation Prepare](http://o4a7cbihz.qnssl.com/cover/d83d3eac-70b3-4446-81dc-7f8cc89f60eb "Commit Transation Prepare")

  如果图层树中包含了图片，并且图片并未解压，那么在这时将会对图片进行解压。（直接包含在iOS工程中的PNG图片在打包的过程中将会被优化，从而在解压的过程中有更快的速度。因此建议把应用中频繁使用的图片打包到应用中。）

  因为苹果设备中继承了JPEG的硬编码和硬解码，并且JPEG相对PNG所占内存比较小，因此苹果在JPEG的编解码上有一定的优势。

4. Commit

 ![Commit Transation Commit](http://o4a7cbihz.qnssl.com/cover/6315328b-2128-482b-b7dc-b7adc337ecea "Commit Transation Commit")

  打包图层数据，并将图层数据发送到Core Animation的服务端。若图层树中包含了大量的图层，将会延长打包的过程。

  另，由于CPU与GPU之间的带宽是有限的，若图层树中包含的图片或文本数据比较多，最终发送给GPU的纹理数量会很多，也可能会引起界面的卡顿。

### UIImageView是如何显示出来的
  1. UIImageView被添加到superView上后，会将自己标记为dirty，等待下次RunLoop循环。
  2. 执行UIImageView的layoutSubviews方法。UIImageView为layer的content变量分配空间。
     可以自定义layoutSubviews方法，从而为UIImageView添加遮罩或其他特效（通过shadowPath添加阴影等）。
  3. 执行UIImageView的drawRect:方法。通过Core Graphics为UIImageView添加不同的视觉效果。
  4. 解压UIImageView中UIImage变量对应的图片。
  5. 将UIImageView图层(CALayer)进行打包发送到Core AniAnimation的服务端。
  6. 服务端拿到UIImageView图层后先解压，然后根据图层的属性（position,bounds,contentsScale,contentsRect,contentsGravity等）生成vertex shader，然后结合UIImageView的图片，即图层对应的纹理，生成fragment shader。
  7. OpenGL将生成的vertex shader和fragment shader放入OpenGL Pipline中执行，GPU根据OpenGL发送过来的命令进行绘制，并将绘制的结果保存在FrameBuffer中。
  8. 显示器在下一个显示周期到来时将FrameBuffer中的数据显示到屏幕上。
以上就是UIImageView在iOS平台上显示出来的基本过程。

当然，具体的显示过程是非常复杂的，尤其是在涉及到一些特效或动画时。

参考：
- [绘制像素到屏幕上](https://objccn.io/issue-3-1/)
- [iOS 保持界面流畅的技巧](http://blog.ibireme.com/2015/11/12/smooth_user_interfaces_for_ios/)
- [iOS 处理图片的一些小 Tip](http://blog.ibireme.com/2015/11/02/ios_image_tips/)
- [移动端图片格式调研](http://blog.ibireme.com/2015/11/02/mobile_image_benchmark/)
- [iOS Resource](http://iosres.com )
- [Advanced Graphics and Animations for iOS Apps](https://developer.apple.com/videos/play/wwdc2014/419/)
- [iOS: is Core Graphics implemented on top of OpenGL?](http://stackoverflow.com/questions/7558636/ios-is-core-graphics-implemented-on-top-of-opengl)
- [学习OpenGL](https://learnopengl.com)

`文中若有不正确的地方，烦请大家指正。`
