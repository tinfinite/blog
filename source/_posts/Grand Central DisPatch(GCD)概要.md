---
title: Grand Central DisPatch(GCD)概要
date: 2017-03-08
author: 李卓
category: ios
tags: GCD
---
![ ](http://o4a7cbihz.qnssl.com/cover/4c85c625-6cfe-4c6d-a40d-a04defe0705f)

### CGD简要介绍

有人把GCD翻译成大中枢派发（《Effective Object-C 2.0》的中文版），我觉得还是不要翻译好了。以下是来自于苹果官方文档的介绍

> Grand Central Dispatch is a low-level framework in OS X that manages concurrent and asynchronous execution of tasks across the operating system. Essentially, tasks are queued and scheduled for execution as processor cores become available. By allowing the system to control the allocation of threads to tasks, GCD uses resources more effectively, which help the system and apps run faster, efficiently, and responsively.


### 多线程介绍
当用户启动app的时候，首先会将程序中的CPU命令序列保存在内存中。这一个完整的命令序列可以被称之为一个线程。当有多个这样的序列的时候，就被称之为多线程。

虽然多线程会出现一些问题。比如多线程对临界资源的访问造成的数据不一致、不同的线程对对方拥有的资源的持续依赖而造成的死锁、使用太多的线程会消耗内存等。

但是，为了保证应用程序的响应性能，我们还是会使用多线程编程。比如网络请求数据的时候，如果放在主线程去做就会影响主线程中RunLoop的执行，从而导致界面不能更新或者长时间停滞的现象，这样用户会疯的。

为了解决上述问题的话，需要编写十分复杂的代码。但是GCD在做了很好的封装，一定程度上简化了解决上述问题的过程。

---

## GCD中一些基本API

### Dispatch Queue

在开发者文档中有这么一段话，我不太会翻译，自己体会吧。

> You define tasks by placing the corresponding code inside either a function or a block object and adding it to a dispatch queue.

Dispatch Queue有两种队列，一种是Serial Dispatch Queue(串行队列，下文中就这么写了)，一种是Concurrent Dispatch Queue（并行队列，下文中就这么写了）。

### 两种队列的区别

- 串行队列会等待现在**正在执行的任务**完成，才会处理队里中其他的任务。并行队列中**正在执行的任务**不会相互等待。

- 串行队列使用**一个线程**去处理，串行队列使用**多个线程**去处理。为了避免上文中提到的问题『多线程对临界资源的访问造成的数据不一致』，需要的情况下，最好使用串行队列，因为一个线程数据更安全。


### 队列的创建

创建队列的第一种方式dispatch_create。使用生成串行队列的时候需要将dispatch_create第二个参数设置为NULL,生成并行队列的时候需要将dipatch_create的第二个参数设置为DISPATCH_QUEUE_CONCURRENT。

```
dispatch_queue_t serialQueue = dispatch_queue_create("com.tinfinite.ryeagleSerialQueue", NULL);

dispatch_queue_t concurentQueue = dispatch_queue_create("com.tinfinite.ryeagleConcurrentQueue", DISPATCH_QUEUE_CONCURRENT);

```

但是还要几个问题要说，每当创建一个串行队列的时候就会新增一个线程，那么多个串行队列上的任务将会并行执行。如果创建1000个串行队列，就会有1000个线程生成。就会出现了上文中提到的多线程问题『使用太多的线程会消耗内存』。

当然除了这种手动创建的方式，系统还提供了两种队列。一种就是Main Dispatch Queue，另外一种就是Global Dispatch Queue。代码如下：

```
    dispatch_queue_t mainDispatchQueue = dispatch_get_main_queue();

    /*第一个参数决定了不同的优先级*/
    dispatch_queue_t globalDispatchQueue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);

```

### dispatch_sync 与 dispatch_sync_async

dispatch_async意味着『非同步』，也就是将指定的任务『非同步地』追加到Dispatch Queue中。dipatch_sync意味着『同步地』追加到指定的Dispatch Queue中。

区别就是dispatch_async会不等待任务的完成，这个方法就会返回。而dispatch_sync则会等到任务完成了，这个方法才会返回。

但是dispatch_sync使用的时候应该谨慎，因为稍加不慎，就会出现上文中多线程的第三个问题『死锁』。比如下面的两端代码：

```
    dispatch_async(dispatch_get_main_queue(), ^{
        dispatch_sync(dispatch_get_main_queue(), ^{
            /*
             Task
             */
        });
    });

```

```
    dispatch_queue_t serialQueue = dispatch_queue_create("com.tinfinite.ryeagleSerialQueue", NULL);

    dispatch_async(serialQueue, ^{
        dispatch_sync(serialQueue, ^{
            /*
             Task
             */
        });
    });

```

### dispatch_group

有时候会有这样的需求，任务队列中意系列任务完成后，在做一个收尾工作。如果在串行队里中，这样做很容。但是在并行队列中这么做就不太容易了。所以就需要系统提供的dispatch_group方法了。

假如现在有这么一个需求，需要异步地执行Task1、Task2、Task3。等三个任务执行完成后再执行TaskOver。使用dispatch_group的代码如下：

```
    dispatch_queue_t concurentQueue = dispatch_queue_create("com.tinfinite.ryeagleConcurrentQueue", DISPATCH_QUEUE_CONCURRENT);

    dispatch_group_t group = dispatch_group_create();

    dispatch_group_async(group, concurentQueue, ^{
        /*Task 1*/
    });
    dispatch_group_async(group, concurentQueue, ^{
        /*Task 2*/
    });
    dispatch_group_async(group, concurentQueue, ^{
        /*Task 3*/
    });

    dispatch_group_notify(group, dispatch_get_main_queue(), ^{
        /*Task Over*/
    });

```

当然还有另外一种方式就是使用    dispatch_group_wait(dispatch_group_t  _Nonnull group, dispatch_time_t timeout)。一般情况下使用上述方式就足够了。

### dispatch_barrier_async

如果现在有这样的需求，对一个数据库现有三个读取操作readTask1、readTask2、readTask3，然后再有一个写入操作writeTask，写入操作完成后再进行写入完成后的三个读取操作readTask4、readTask5、readTask6。

当然如果使用串行队列，就可以避免了上文的那个『多线程对临界资源的访问造成的数据不一致』的问题，但这样效率就不高了，因为读取操作不涉及对数据的访问。

为了解决这个问题，并且写出简单的代码，系统提供了一种简单的方式那就是dispatch_barrier_async方法。代码如下：

```
    dispatch_async(concurentQueue, ^{
        /*Read Task 1*/
    });
    dispatch_async(concurentQueue, ^{
        /*Read Task 2*/
    });
    dispatch_async(concurentQueue, ^{
        /*Read Task 3*/
    });
    dispatch_barrier_sync(concurentQueue, ^{
       /*Write Task*/
    });
    dispatch_async(concurentQueue, ^{
        /*Read Task 4*/
    });
    dispatch_async(concurentQueue, ^{
        /*Read Task 5*/
    });
    dispatch_async(concurentQueue, ^{
        /*Read Task 6*/
    });
```
