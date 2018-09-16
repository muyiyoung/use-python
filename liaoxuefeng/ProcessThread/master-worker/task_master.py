#!/usr/bin/env python3
# encoding: utf-8
"""
@file: task_master.py
@user: muyi-macpro
@time: 2018/4/10 下午11:38
@desc:
"""
import random
import time
import queue

from multiprocessing.managers import BaseManager

# 发送任务的队列
task_queue = queue.Queue()

# 接受结果的队列
result_queue = queue.Queue()


# 从BaseManager继承的QueueManager:
class QueueManager(BaseManager):
    pass


# 把两个Queue都注册到网络上, callable参数关联了Queue对象:
QueueManager.register('get_task_queue', callable=lambda: task_queue)
QueueManager.register('get_result_queue', callable=lambda: result_queue)

# 绑定端口5000 验证码'abc'
manager = QueueManager(address=('', 5000), authkey=b'abc')

# 启动queue
manager.start()

# 通过网络访问的Queue对象
task = manager.get_task_queue()
result = manager.get_result_queue()

# 放几个任务进去:
for i in range(10):
    n = random.randint(0, 10000)
    print('Put task %d...' % n)
    task.put(n)
# 从result队列读取结果:
print('Try get results...')
for i in range(10):
    r = result.get(timeout=10)
    print('Result: %s' % r)
# 关闭:
manager.shutdown()
print('master exit.')