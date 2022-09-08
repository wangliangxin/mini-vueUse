<script setup lang='ts'>
import { computed } from 'vue' 
import { useActiveElement } from './index';

const activeElment = useActiveElement({window})

const key = computed(()=>{
    return activeElment.value?.dataset?.id || 'null'
})
</script>

<template>
    <div class="w-[340px] mx-auto bg-slate-800 rounded-[10px] pt-3 pb-3">
        <div class="mb-[5px] text-white">
            Select the inputs below to see the changes  <span class="text-[#DC2626]">active-id: <span class="font-bold">{{ key }}</span></span>
        </div>
        <div class="shadow grid grid-cols-1 md:grid-cols-3 gap-2 w-80 mx-auto p-2">
            <input v-for="i in 6" :key="i" type="text" :data-id="i" class="!my-0 !min-w-0 rounded-[5px] outline-none px-1 py-1" :placeholder="`${i}`">
        </div>
    </div>
</template>
<style  scoped>
</style>