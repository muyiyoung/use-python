#!/usr/bin/env python3
# encoding: utf-8
"""
@file: MultiThreadLock.py
@user: muyi-macpro
@time: 2018/4/10 下午11:23
@desc: 
"""

# Python解释器由于设计时有GIL全局锁，导致了多线程无法利用多核。多线程的并发在Python中就是一个美丽的梦

if __name__ == '__main__':
    import time, threading

    # 假定这是你的银行存款:
    balance = 0
    lock = threading.Lock()


    def change_it(n):
        # 先存后取，结果应该为0:
        global balance
        balance = balance + n
        balance = balance - n


    def run_thread(n):
        for i in range(100000):
            # 先要获取锁
            lock.acquire()
            try:
                change_it(n)
            finally:
                lock.release()


    t1 = threading.Thread(target=run_thread, args=(5,))
    t2 = threading.Thread(target=run_thread, args=(8,))
    t1.start()
    t2.start()
    t1.join()
    t2.join()
    print(balance)
    pass