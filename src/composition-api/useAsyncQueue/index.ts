import { noop } from '@/shared/index'
import { reactive,ref } from 'vue'
export type UseAsyncQueueTask<T> = (...args: any[]) => T | Promise<T>
export interface UseAsyncQueueOptions{
    interrupt?: boolean
    onError?: () => void
    onFinished?: ()=>void
}
export interface UseAsyncQueueResult<T> {
  state: 'pending' | 'fulfilled' | 'rejected'
  data: T | null
}

/**
 * @description: 顺序执行每个异步任务，并将当前任务结果传递给下一个任务
 * @return {*}
 */
export function useAsyncQueue<T = any>(tasks: UseAsyncQueueTask<any>[],options:UseAsyncQueueOptions={}){
    const { 
        interrupt= true,
        onError = noop,
        onFinished = noop,
    } = options

    // 一个 Promise 必然处于以下几种状态之一：
        // 待定（pending）：初始状态，既没有被兑现，也没有被拒绝。
        // 已兑现（fulfilled）：意味着操作成功完成。
        // 已拒绝（rejected）：意味着操作失败。
    const promiseState: Record<UseAsyncQueueResult<T>['state'], UseAsyncQueueResult<T>['state']> = {
        pending: 'pending',
        rejected: 'rejected',
        fulfilled: 'fulfilled',
    }
    // 初始状态
    const initialResult = Array.from(new Array(tasks.length), ()=>({ state: promiseState.pending, data:null }))

    // 执行结果集
    const result = reactive(initialResult)  as UseAsyncQueueResult<T>[]

    const activeIndex = ref<number>(-1)

    if(!tasks || tasks.length === 0){
        onFinished()
        return {
            result,
            activeIndex
        }
    }
    function updateResult(state: UseAsyncQueueResult<T>['state'], res: unknown){
        activeIndex.value++
        result[activeIndex.value].data = res as T
        result[activeIndex.value].state = state
    }
    tasks.reduce((prev,curr)=>{
        return prev.then(
            prevRes=>{
                if(result[activeIndex.value]?.state === promiseState.rejected && interrupt){
                    onFinished()
                    return
                }
                return curr(prevRes).then((currentRes: any)=>{
                    updateResult(promiseState.fulfilled, currentRes)
                    activeIndex.value === tasks.length - 1 && onFinished()
                    return currentRes
                })
            }
        ).catch((e)=>{
            updateResult(promiseState.rejected, e)
            onError()
            return e
        })
    }, Promise.resolve())
    return {
        activeIndex,
        result
    }
}

/**
 * 1. new Array(tasks.length)
 * 
 */