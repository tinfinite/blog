---
title: 纵览 Cocoa 的 Model-View-Controller 模式
date: 2017-03-13
author: 史江凯
category: ios
tags: Cocoa
---

**文章版权归 2016 Matt Gallagher, <https://cocoawithlove.com>. 原英文版点这里：[Looking at Model-View-Controller in Cocoa](https://www.cocoawithlove.com/blog/mvc-and-cocoa.html). 本文的翻译和发布经过原作者同意。**

# Looking at Model-View-Controller in Cocoa

##### February 28, 2017 by Matt Gallagher

##### Tags: cocoa, app design

依照 Apple 文档，Cocoa 应用的标准模式称为 Model-View-Controller。别管名字，这个模式跟 Smalltalk-80 中 Model-View-Controller 的原始定义的就大不一样。Cocoa 应用的设计模式实际上与 Taligent（1990 年代 Apple 参与合作开发的项目）开发时的想法有更多共同点，而不是同期的 Smalltalk。 
这篇文章我会回顾一点 Cocoa 开始时的应用设计模式背后的理论和历史，讨论 Model-View-Controller 的明显缺点，Apple 解决缺点的尝试，好奇下一次的大改进何时到来。

```
Contents
    1. Smalltalk-80
    2. Cocoa (AppKit/UIKit)
    3. Taligent
    4. The Controller Problem
    5. Bindings
    6. Something new?
    7. Conclusion
```

### Smalltalk-80

> UI 开发中引用最多的模式可能就是 Model View Controller（MVC），也是错误引用最多的。我数不清有多少次，别人把一些别的当 MVC 描述给我，结果却一点都不像。 - Martin Fowler<sup>[1](#Fowler)</sup>, [GUI Architectures](https://www.martinfowler.com/eaaDev/uiArchs.html)

我想快点指出上面的引用中 Martin Fowler 的意思，他用的定义，即 Smalltalk-80 起初用到的定义，Cocoa 开发的通用做法不是 Model-View-Controller。 
在 Smalltalk-80 中，能交互的 views 被分离成了两个完全隔离的对象：View 对象和 Controller 对象。View 负责展示，但是任何点击或交互不由 View 处理，而是交给了 Controller。要理解的关键在于 Controller 既不加载，设置或管理 View，一个 Controller 也不处理多个 View 的 action。起初在 Model-View-Controller 的定义里，View 和 Controller 只是简单的对屏幕上单一控件的展示和动作处理。

![](https://www.cocoawithlove.com/assets/blog/smalltalk_mvc.svg)

*Smalltalk-80 版本的 Model-View-Controller*

Smalltalk-80 的 Model-View-Controller 表明 model 是上面对象图中的中心节点，view 或 controller 与 model 的基本通信都很直接。<br>
这种模式反映出 Smalltalk-80 是如何处理用户输入的，现代的程序很少会用到这种模式。从这个意义上来看，要么现代的框架不是真正的 Model-View-Controller，要么这个术语已经变成别的意思了。

### Cocoa (AppKit/UIKit)

Cocoa 表示 Model-View-Controller 要尽可能的唤起程序设计中[呈现与内容相分离](https://en.wikipedia.org/wiki/Separation_of_presentation_and_content)这个概念（意思是 model 和 view 之间应该解耦，联系松散）。公平点儿说，不光 Cocoa 这么用，现在绝大多数情况下这个术语想表达的也跟起初 Smalltalk-80 的定义不一样了。 
看一下 Cocoa 真正用的，Apple 的 Cocoa 指南里用到的 [Model-View-Controller](https://developer.apple.com/library/content/documentation/General/Conceptual/DevPedia-CocoaCore/MVC.html) 定义看起来像下面这样：

![](https://www.cocoawithlove.com/assets/blog/cocoa_mvc.svg)

*Cocoa 版本的 Model-View-Controller*

关键在于 controller 在对象图的中心，绝大多数通信靠 controller 传递，区别于 Smalltalk-80 版本的 model 在对象图的中心。

Cocoa 没有强迫 app 都用这个模式，但它隐含在所有的应用模版里。从 NIB 里加载文件就强烈鼓励使用 `NSWindowController` / `UIViewController`。`NSTableView` / `UITableView`的代理相关类意味着有一个协调类能够理解整个呈现 tableView 的责任。`UITabBarController` 和`UINavigationController`这样的类就明确要求 `UIViewController`能协调它们要滑进或划出的 view。

### Taligent

在学术讨论中，Cocoa 的 Model-View-Controller 通常被成为 Model-View-Presenter。这两个是相同的，除了 Cocoa 里叫 Controllers 而不是 Presenters。"Presenter" 通过设置场景，调度动作体现它们的角色。某些情况下，Presenter 可能称为 Supervising Controller，你可以把 Model-View-Supervising Controller 简单地理解成 Model-View-Controller。 
Model-View-Presenter 起源于 [Taligent](https://en.wikipedia.org/wiki/Taligent) 项目。[MVP: Model-View-Presenter, The Taligent Programming Model for C++ and Java](http://www.wildcrest.com/Potel/Portfolio/mvp.pdf)，这个引用最多的论文，成文于 1997 年。但[文档显示](https://root.cern.ch/TaligentDocs/TaligentOnline/DocumentRoot/1.0/Docs/classes/TGUIPresenter.html)，至少早在 1995 年，Taligent 中的某些类就实现这个模式了。 
Taligent 起初是苹果内部以"pink"为代号的项目，目的是为了开发一个操作系统以代替 [System 7](https://en.wikipedia.org/wiki/System_7)。 这个项目有一系列有名的开发、管理问题，和苹果同期撤掉的 [Copland](https://en.wikipedia.org/wiki/Copland_(operating_system)) 是难兄难弟。Taligent 后来得以在 IBM 延续，推出了 CommonPoint 应用框架，而不是一个操作系统，并于 1998 年被关掉。 

*[This Wired article from 1993](https://www.wired.com/1993/02/taligent/) 给出了一个有意思的见解，Taligent 的明显膨胀和内讧导致了它的失败。*

尽管 NeXTStep 早于 Taligent，AppKit 中的众多控制器类（定义在 AppKit 的 Model-View-Presenter 设计模式下的），直到 1996 年 NeXTStep 4 才出现（ NeXTStep 的一个重要的重新设计版本，第一个保留`NS`前缀直今）。我不知道 NeXTStep 是否借鉴了 Taligent，可能这是持续发展的结果，也可能几家公司雇佣了相同团队里的成员。站在 2017 年，我能说的就是 Taligent 是第一个发行的。 

*1995 年的 [Taligent documentation](https://root.cern.ch/TaligentDocs/TaligentOnline/DocumentRoot/1.0/Docs/books/index.html) 读起来令人着迷。[Guide to Designing Programs](https://root.cern.ch/TaligentDocs/TaligentOnline/DocumentRoot/1.0/Docs/books/WM/WM_3.html) 讨论了许多有关应用程序设计的想法。但是，[Programming with the Presentation Framework 指南](https://root.cern.ch/TaligentDocs/TaligentOnline/DocumentRoot/1.0/Docs/books/PF/PF_1.html) 却很烂：它令人困惑、过于技术化、难以实现。*

### The Controller Problem

理解 Cocoa 的 Model-View-Controller 作为 Model-View-Presenter 的变种（Presenter 或者 Supervising Controller，要负责其下所有 view 的生命周期，动作和变化的通知）很重要，因为它导致了这种模式里的最大问题："The Controller Problem"。 
The Controller Problem，也叫做"Massive/Huge/Giant View Controllers"，是指：Cocoa 里的 controllers 有着强烈变大的倾向，要负责和 view 相关的事情，虽然跟功能和数据的独立性无关。大多数大项目有许多超过 2000 行的 controller 类。 
说明白点，问题不在于 controller 代码的多少，而是它们增大的方式：Cocoa 的控制器聚合了许多跟它们有关或无关的事情。一个控制器可能负责几个或多个 view，每个 view 有自己的结构，配置，数据展示，数据更新，布局，动画跟动作，和其他要交给父控制器维护的状态。 
独立和依赖大规模得混合在一起是维护的噩梦。大量代码使得实际的依赖和无关的功能难以区分。 Controller 通常难以测试（由于 app 和 包状态管理难以分离），规模和半独立的结合使得问题更糟。 
Controller Problem 的解决办法是持续地将大的 controller 重构成小的、简单的 controller。这可能需要重新设计、重新思考数据结构，以解开、排除 controller 间的依赖，并设计出在几个 controller 间通信的可行实现。这能做到，不过有许多工作量，也有风险：带来新的 bug，依然难以测试，除此之外，交给用户的也不会有新的功能。

### Bindings

Apple 早就知道 Controller Problem 了，因为 Mac OS X 10.3 推出了 Cocoa Bindings。 
绑定是两个组件间建立路径，通常是数据源和数据的观察者。绑定允许组件间不通过额外的代码实现交流。Cocoa bindings 里两个组件间建立的路径称为"key-path"。指明了 controller 至 model 的属性（管理 view 状态）的 key-path，绑定就能显著改善或消除 Controller Problem。

![](https://www.cocoawithlove.com/assets/blog/cocoa_bindings_mvc.svg)

*Code paths through the Controller are replaced by Bindings*

推出十多年后，Cocoa Bindings 都被人忘了。AppKit 你仍然可以用到，它们也没被废弃。不过它们从没被引入到 UIKit，反映出在使界面编程更简单这点上，它们不够成功。 
我认为 Bindings 能解决问题，某些情况下解决得挺好，特别是`NSArrayController`驱动一个`NSTableView`。我也能理解它们为什么没能征服 Mac 编程。 
Cocoa Bindings 的优势（试图控制器更少的代码）被 Interface Builder 的检查面板里的众多设置项做到了。可这令人有些困惑：代码里找不到，难以搜索（虽然 Xcode 也能搜索 XIB 文件了），很难 debug（数据变化没有堆栈跟踪），不容易教给新人（不愿意在检查面板里找），比起代码来更隐秘（XIB 里不能加注释），也会导致 Interface Builder 的本地化和版本控制合并的问题。 
我觉得 Cocoa Bindings 的失败依然保留了添加自定义转换和自定义属性的困难。这些本来都能解决，但是注册转换和暴露 bindings 字典却令人厌倦。不用 bindings 在 controller 传数据更简单 ，也就是说 Bindings 想解决最简单的问题（本来也不用解决），却没有触及到更难的问题。

### Something new?

自 Cocoa Bindings 开始于 Mac OS X 10.3 以后，Apple 也没有再明确的尝试改变 Cocoa 的设计模式。 
Storyboards 开始于 iOS 5 和 Mac OS X 10.10，不过 storyboards 也不是对设计模式的更换和改进。Storyboards 鼓励使用`NS`/`UIViewController`，加强了 Model-View-Presenter 模式。Storyboards 确实鼓励更小，更专注的 view controller，也减少了一点 "Presentation" 带来的页面设置和过渡的负担。但是，既然能通过 Interface Builder 配置，也就表现出了一系列 Cocoa Bindings 想解决的问题。 
对想要设计模式更给力的某些人来说，Storyboards 没有提供新东西。 
现在确实有些应用设计的新想法。Apple 之外，有 [Reactive Programming](https://www.cocoawithlove.com/blog/reactive-programming-what-and-why.html)（能实现 Bindings 的大部分功能），[Model-View-ViewModel](https://www.objc.io/issues/13-architecture/mvvm/)（把 controller 减少的功能转移到了跟 view 接近的 model 上），[unidirectional dataflow](http://reswift.github.io/ReSwift/master/)（减少 binding 需求，在整个 app 间广播所有的数据变化），这些在不同圈子都广受欢迎。 
有些框架做得完全不一样，像 [React Native](https://facebook.github.io/react-native/) 或 [Swift-Elm](https://github.com/salutis/swift-elm)，舍弃了 Swift 或 Cocoa，也带来了无法忽视的不足。
这些能否影响到官方的 Cocoa app 开发，暂时还不清晰。Swift 表明 Apple 偶尔想改些东西，也有争论说 Swift 增加了设计模式的需求或利用 Swift 语言优势的 view 框架。不过，苹果开发一个仅 Swift 的框架，还需要时间。

### Conclusion

如果我们以 NeXTStep 4 作为 Cocoa 现在 Model-View-Controller 模式的开端，那到现在就 20 年了。它还可用，虽然有它的缺点，也不像曾经那么令人激动或高效了。 
Apple 很早就尝试过 Cocoa Bindings，这唯一的对设计模式的改进了。人们对它的接纳程度不一，它也不会带至 Apple 的新平台了。 
我没有任何 AppKit 或 UIKit 团队的内部尝试的消息，未来 Apple 也不是随时都想做一些激动人心的改动。许多第三方框架想改进 Cocoa 整个设计模式，但还没有哪个能达成一致。我觉得这些努力反映出了人们对某些改进上的关注。

***

<span id="Fowler">马丁·福勒，软件工程师，也是一个软件开发方面的著作者和国际知名演说家，专注于面向对象分析与设计，统一建模语言，领域建模，以及敏捷软件开发方法，包括极限编程。《重构---改善既有代码的设计》的作者，ThoughtWorks 的首席科学家。来自[维基百科](https://zh.wikipedia.org/wiki/%E9%A9%AC%E4%B8%81%C2%B7%E7%A6%8F%E5%8B%92)。</span>

