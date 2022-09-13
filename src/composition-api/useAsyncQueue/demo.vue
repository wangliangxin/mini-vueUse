<!--  -->
<script setup lang='ts'>
import { useAsyncQueue } from './index'
function testAsync1(){
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve(1000)
        }, 1000); 
    })
}
function testAsync2(result: number){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            // resolve(1000 + result)
            reject('失败')
        },2000)
    })
}

const  { result, activeIndex } = useAsyncQueue([testAsync1,testAsync2])
</script>

<template>
  <div>{{ result }}</div>
  <div>{{ activeIndex }}</div>
</template>
<style  scoped>
</style>