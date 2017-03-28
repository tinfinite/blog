---
title: Pull Request 的正确姿势
date: 2017-03-28
category: ios
author: 张琦
---

![Pull Request](https://upload-images.jianshu.io/upload_images/3667125-04eaaa446017c619.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们现在的开发流程中添加了 review 的流程，目前是依赖 Pull Request 来进行 review。不得不说没有整理过的 Pull Request 在 review 的时候相当痛苦：

  1. 一个 Pull Request 中可能包含几十个 commit，内容非常多。
  2. 可能有多个 commit 修改同一个文件，按 commit 查看时难以读懂，例如早些的 commit 做了一处错误的修改，晚些的 commit 又修复了这个问题。
  3. 有很多无效的 commit，例如忘记修改版本号的补充，清理 log 代码的提交。
  4. 混乱的 commit，合并的时候产生冲突，解决冲突重新提交后就变成了一个 commit，完全不知道这个 commit 中包含了哪些改动。

我们应该有效的管理我们的提交，在开发期间 commit 自然越细碎越好，每个小功能点的修改做一个单独的提交对代码有助于代码合并。在合并时应该对 commit 节点进行整理，对同一个模块修改的多个 commit 应该合并成一个并写好描述，同一个分支的代码在合并时应该调整成顺序连续，方便回滚。

下面是几个有用的命令：

## git rebase
关于 rebase 命令的基本用法详见：<http://gitbook.liuhui998.com/4_2.html>
rebase 命令的主要作用是在合并的时候调整 commit 节点的顺序。
例如我们从  develop 分支拉出了一个 featureA 分支进行开发，等开发完毕时，develop 分支已经合并了其它 feature 分支的提交。如果直接使用merge命令，合并完之后的节点按时间顺序排列，很可能是混杂在一起的，假如需要回滚代码十分的不方便。使用rebase命令合并会使 featureA 分支的所有节点在合并后仍是连续的，对回滚代码十分方便。
rebase 还有交互模式，使用 rebase -i 可以进入交互模式。交互模式下可以灵活的对节点进行合并，在编辑界面中使用 squash 和 fixup 可以将节点合并到前一个 pick 的节点。交互模式的具体用法可以参考：<http://chuansong.me/n/447693>

## git merge --squash
如果当前开发分支 featureA 包含的内容很简单，比如修复了一个 bug，但是产生了多次提交。那么也可以在 merge 的时候添加 squash 参数，这是 rebase 的简单粗暴版，将 featureA 上产生的提交合并成一个节点。尽管效果上和 rebase 类似，但是原理并不一样，merge --squash 的时候是将 featureA 分支上的改动全部摘过来，需要自己重新 commit。