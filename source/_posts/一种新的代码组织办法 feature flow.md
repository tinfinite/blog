---
title: 一种新的代码组织办法 feature flow
date: 2017-02-08
category: ios
tags: ios git flow
---
![ ](http://o4a7cbihz.qnssl.com/cover/a5cad079-8630-462f-98b6-6c634d535eb6)
当前大部分团队都使用git flow流程管理代码(不了解gitflow的朋友可以自行搜索)，以我们团队的状况来看，一个产品的开发初期是比较适合用git flow的，因为初期都是在做功能添加，而且人比较少，每个迭代只更新一个或几个完整的功能。到了后期的功能调整阶段，git flow就不太适用了，人员多了就可以做更多的事，可能有多个模块需要调整，多个版本同时在开发。

我们的前端组遇到过这样的情况，在同一个仓库中，三个人同时进行开发，做不同的功能，一个人配合客户端修改JSBridge，一个人给运营做活动页面，还有一个人在开发新功能。其中配合客户端的修改要和客户端一起上线，活动页面要按运营的时间表上线，新功能要等服务端部署上线，这就有三个上线时间点。按照gitflow的流程管理，开发完毕的feature都合并到develop，发布的时候我们遇到了困难，客户端准备上线了，需要将此仓库发布，但是活动页面还没到活动的日期，不能让用户提前看到。为了解决这个问题，我们只好在几个修改的地方都加上了版本号判断，类似的问题也在服务端和客户端的发布中出现过。

为了规避这种问题，我们制定了一种新的代码管理流程，我们称之为feature flow

### 主要分支
- master
- develop

<strong>master分支</strong>用于发布版本，在发布之前将已经测试完毕的feature和bugfix合并到master分支，不允许从develop分支直接合并到master

<strong>develop分支</strong>是众多feature和bugfix的合集，代码杂乱不可直接合并到develop，而且不允许在develop分支上commit代码

### feature
代码管理以feature为核心，例如开发一个feature A，则从master拉一个分支featureA出来，在featureA上开发完成后合并到develop分支，发测试包测试，如有问题则继续在featureA上修复，然后合并develop分支再发包测试，测试完毕后featureA放在那里等待发布。

当决定发布一个新版本时，会挑选多个feature，这些feature分支都是开发并测试完毕的，将它们合并到master之后删除，在master上发布。

这样做的原因是现在一般都是多个版本的开发同时进行，不能确定某个版本发布时会包含哪些feature，若像之前一样git flow管理的话，合并到develop的feature想摘出来会十分困难

### bugfix
bug修复分两种情况进行管理

- 简单bug，指修复后容易测试，可确认修复不会造成其它问题
- 复杂bug，修复后不容易测试，有隐患带来其它问题，需长时间测试或认真考虑在哪个版本发布的问题

简单bug修复不必遵循feature管理的原则，在develop分支测试完成后直接合并到master分支
复杂bug修复和feature管理做相同处理


### feature分支过多
如果feature本身小而数量多，可以将确定会一起发布的feature合并到一个存储分支，比如一个版本号分支2.0.6