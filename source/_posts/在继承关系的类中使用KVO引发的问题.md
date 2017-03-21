---
title: 几种典型的耦合与解决方法
date: 2017-03-21
category: ios
author: 张永彬
---

![](http://o4a7cbihz.qnssl.com/cover/cb780468-9cf4-4472-8035-7d11041a9dcc)

如下面的代码，类 AA 继承自 A，若 A 中也使用了 KVO，实现了`observeValueForKeyPath:ofObject:change:context:`方法，就需要在类 AA 中通过调用`[super observeValueForKeyPath:keyPath ofObject:object change:change context:context];`方法执行 A 中的实现的`observeValueForKeyPath:ofObject:change:context:`方法，但若类A中没有实现则会因为调用`[super observeValueForKeyPath:keyPath ofObject:object change:change context:context];`引发崩溃（虽然 NSObject 类的 NSKeyValueObserving 的扩展中定义了`observeValueForKeyPath:ofObject:change:context:`方法，但是却没有实现这个方法）。因此，在使用 KVO 时要注意在继承关系中使用 KVO。

```
@interface AA: A
@end

@implementation AA
- (void)dealloc
{
    [self.xx removeObserver:self forKeyPath:@"xxxx"];
}

- (void)addObserver {
    [self.xx addObserver:self forKeyPath:@"xxxx" options:NSKeyValueObservingOptionInitial|NSKeyValueObservingOptionNew context:NULL];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context
{
    if ([super respondsToSelector:@selector(observeValueForKeyPath:ofObject:change:context:)]) {
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }

    if ([object isEqual:self.xx] && [keyPath isEqualToString:@"xxxx"]) {
        //  TODO
    }
}
@endif
```

### 解决方法：
1.添加一个 NSObject 的扩展，实现`observeValueForKeyPath:ofObject:change:context:`空方法。这样通过`[super observeValueForKeyPath:keyPath ofObject:object change:change context:context];`的方式调用就不会出问题了。

2.添加一个单独的 KVO 的 Observer 类。
    (1)在 Observer 类中实现`observeValueForKeyPath:ofObject:change:context:`方法，
    (2)通过 Block 的方式将`处理KVO通知的代码`在具体业务逻辑中实现，然后传给Observer类，
    (3)Observer 类收到KVO通知调用 object 对应的 block(s) 就可以了。这样的好处是只用在 Observer 类中实现`observeValueForKeyPath:ofObject:change:context:`方法，具体的业务中只负责实现`处理KVO通知的代码`，实现了代码分离；同一个 object 可以有多个 block。

 另：可以把 Observer 实现为一个单例([FBKVOController](http://github.com/facebook/KVOController))，也可以以 runtime 的方式为 NSObject 增加一个字典变量，以 KVO 的 keyPath 为key，Observer 对象为 value，实现一个简单实用的 KVO 自定义方案([YYKit](https://github.com/ibireme/YYKit))。

### KVO注意事项：
  由于 KVO 天生的娇惯特质（1. 必须先 addObserver，再 removeObserver；2. 在 receiver 释放后必须同时 remove 掉其对应的所有 Observers），在多线程（异步）的情况下可能不能保证 add 与 remove 的顺序，以及开发者忘记在写 removeObserver 方法等原因造成 App 崩溃。因此在编写 KVO 代码时需要十分小心。

  可参考 [FBKVOController](http://github.com/facebook/KVOController) 中对 KVO 的处理。
