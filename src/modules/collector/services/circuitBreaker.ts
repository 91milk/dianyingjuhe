/**
 * 采集站自适应熔断器 (Circuit Breaker)
 * 作用：在高频并发或上游资源站故障时，自动熔断持续超时的坏站，杜绝死等与连接池耗尽
 */

export interface CircuitState {
  failureCount: number;
  lastFailureTime: number;
  lastFailureReason?: string;
  isOpen: boolean;
  trippedUntil: number;
}

class SiteCircuitBreaker {
  private stateMap = new Map<string, CircuitState>();
  // 连续失败 3 次触发熔断
  private readonly threshold: number = 3;
  // 熔断冷却时间：3 分钟 (180,000 ms)
  private readonly coolDownMs: number = 3 * 60 * 1000;

  /**
   * 检查指定采集站当前是否可用
   * - 若未熔断：返回 true
   * - 若已熔断但冷却时间已过：返回 true (Half-Open 状态，放行单次试探)
   * - 若仍在冷却期：返回 false (熔断拦截，0 毫秒跳过)
   */
  public isAvailable(siteId: string): boolean {
    const state = this.stateMap.get(siteId);
    if (!state || !state.isOpen) return true;

    const now = Date.now();
    if (now >= state.trippedUntil) {
      // 冷却期满，转为半开试探
      return true;
    }

    // 熔断保护中
    return false;
  }

  /**
   * 记录站点请求成功 (重置失败计数并解除熔断)
   */
  public recordSuccess(siteId: string): void {
    const state = this.stateMap.get(siteId);
    if (state && (state.failureCount > 0 || state.isOpen)) {
      this.stateMap.set(siteId, {
        failureCount: 0,
        lastFailureTime: 0,
        isOpen: false,
        trippedUntil: 0,
      });
    }
  }

  /**
   * 记录站点请求失败 (累计失败次数，达到阈值后触发熔断)
   */
  public recordFailure(siteId: string, reason?: string): void {
    const now = Date.now();
    const current = this.stateMap.get(siteId) || {
      failureCount: 0,
      lastFailureTime: 0,
      isOpen: false,
      trippedUntil: 0,
    };

    const newFailureCount = current.failureCount + 1;
    const shouldTrip = newFailureCount >= this.threshold;

    this.stateMap.set(siteId, {
      failureCount: newFailureCount,
      lastFailureTime: now,
      lastFailureReason: reason,
      isOpen: shouldTrip,
      trippedUntil: shouldTrip ? now + this.coolDownMs : current.trippedUntil,
    });

    if (shouldTrip) {
      console.warn(
        `[CircuitBreaker] 采集站 [${siteId}] 连续失败 ${newFailureCount} 次，触发熔断降级！冷却时间 3 分钟。原因: ${
          reason || "连接超时或上游报错"
        }`
      );
    }
  }

  /**
   * 获取指定站点当前熔断状态
   */
  public getStatus(siteId: string): CircuitState | null {
    return this.stateMap.get(siteId) || null;
  }

  /**
   * 获取所有站点的熔断状态表
   */
  public getAllStatus(): Record<string, CircuitState> {
    const result: Record<string, CircuitState> = {};
    this.stateMap.forEach((val, key) => {
      result[key] = { ...val };
    });
    return result;
  }

  /**
   * 手动重置熔断状态 (支持单个或全部)
   */
  public reset(siteId?: string): void {
    if (siteId) {
      this.stateMap.delete(siteId);
    } else {
      this.stateMap.clear();
    }
  }
}

export const siteCircuitBreaker = new SiteCircuitBreaker();
