/**
 * Singleflight 并发请求单飞合并器
 * 作用：在瞬时高并发或刷量场景下，对相同的资源 Key 仅向底层发起一次真实请求，其余并发请求直接共享该 Promise 结果，
 * 彻底消除连接池耗尽、Goroutine/任务堆积与上游 429 限流问题。
 */
export class Singleflight<T = unknown> {
  private inFlight = new Map<string, Promise<T>>();

  /**
   * 执行带有防抖单飞保护的异步函数
   * @param key 唯一请求特征键 (如片名、搜索词、采集站请求标识)
   * @param fn 真实异步执行函数
   */
  async do(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = this.inFlight.get(key);
    if (existing) {
      return existing;
    }

    const promise = (async () => {
      try {
        return await fn();
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }

  /**
   * 当前在飞等待的请求分组数量
   */
  get size(): number {
    return this.inFlight.size;
  }
}
