---
title: IOS 的全屏旋转
date: 2017-04-07
category: ios
author: 李卓
---

![心无挂碍](http://upload-images.jianshu.io/upload_images/1612119-4d748c0bd32e0439.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 假如有这样的需求

如果我们的项目中有这样的需求，整个 app 的屏幕方向仅支持一种，比如 Portrait（如下图）。但是在某一个页面却需要可以支持多种方向，比如一个支持全屏观看的视频播放页面。有两张方式可以实现这样的需求，以下两种方式只是提供一个简单的实现。

![Portrait](http://upload-images.jianshu.io/upload_images/1612119-41e9797062d554e3.png)

---

### 第一种方式

第一种方式就是使用强制旋转屏幕、更改屏幕支持方向的方式来实现上述需求。

* AppDelegate.h 中增加一个属性

```
@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;
//
@property (nonatomic, assign) BOOL allowLandscapeRight;

@end

```

* AppDelegate.m 中添加 application:supportedInterfaceOrientationsForWindow: 方法监听。这个示例中仅仅支持屏幕向左旋转（即home键在右）的方式。

```
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window
{
    if (self.allowLandscapeRight) {
        return UIInterfaceOrientationMaskLandscapeRight;
    }

    return UIInterfaceOrientationMaskPortrait;
}

```

* 视频播放的ViewController中

```
- (void)updateOriention
{
    AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;

    if (self.isFullScreeen) {
        appDelegate.allowLandscapeRight = YES;

        // 强制旋转成全屏
        NSNumber *value = [NSNumber numberWithInt:UIDeviceOrientationLandscapeLeft];
        [[UIDevice currentDevice]setValue:value forKey:@"orientation"];
    } else {
        appDelegate.allowLandscapeRight = NO;

        // 强制旋转成竖屏
        NSNumber *value = [NSNumber numberWithInt:UIDeviceOrientationPortrait];
        [[UIDevice currentDevice]setValue:value forKey:@"orientation"];
    }
}
```

### 第二种方式

第二种方式则是在展示视频View中通过监听屏幕的旋转、对播放界面进行重新布局来实现。

* 监测设备方向

```
- (void)addNotifications {
    // 监测设备方向
    [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onDeviceOrientationChange)
                                                 name:UIDeviceOrientationDidChangeNotification
                                               object:nil];

name:UIApplicationDidChangeStatusBarOrientationNotification
                                               object:nil];
}

```

*  屏幕发生旋转后调用这里

```
- (void)onDeviceOrientationChange {
    UIDeviceOrientation orientation = [UIDevice currentDevice].orientation;
    UIInterfaceOrientation interfaceOrientation = (UIInterfaceOrientation)orientation;

    if (orientation == UIDeviceOrientationUnknown ||
        orientation == UIDeviceOrientationPortraitUpsideDown ||
        orientation == UIDeviceOrientationLandscapeRight ||
        orientation == UIDeviceOrientationFaceUp ||
        orientation == UIDeviceOrientationFaceDown){
        return;
    }

    switch (interfaceOrientation) {
        case UIInterfaceOrientationPortrait:{
            if (self.isFullScreen) {
                [self toOrientation:UIInterfaceOrientationPortrait];

            }
        }
            break;
        case UIInterfaceOrientationLandscapeLeft:{
            if (self.isFullScreen == NO) {
                [self toOrientation:UIInterfaceOrientationLandscapeLeft];
                self.isFullScreen = YES;
            } else {
                [self toOrientation:UIInterfaceOrientationLandscapeLeft];
            }

        }
            break;
        default:
            break;
    }
}
```

* 旋转代码

```
- (void)toOrientation:(UIInterfaceOrientation)orientation {

    UIInterfaceOrientation currentOrientation = [UIApplication sharedApplication].statusBarOrientation;
    // 判断如果当前方向和要旋转的方向一致,那么不做任何操作
    if (currentOrientation == orientation) { return; }

    if (orientation != UIInterfaceOrientationPortrait) {
        /*
            这里对子控件重新布局
         */
    }

    [[UIApplication sharedApplication] setStatusBarOrientation:orientation animated:NO];
    // 获取旋转状态条需要的时间:
    [UIView beginAnimations:nil context:nil];
    [UIView setAnimationDuration:0.3];
    self.transform = CGAffineTransformIdentity;
    self.transform = [self getTransformRotationAngle];

    [UIView commitAnimations];
}
```

---

### 总结
当然，上述两种方式仅仅提供了一些解决方案和思路。实际使用的时候，要根据需求来做一些跟全面的逻辑判断。
