 import { ref,computed } from 'vue'
 import { defaultwindow } from '@/shared/index'
 interface ConfigurableWindow {
    window?: Window
 }

export function useActiveElement<T extends HTMLElement>(options: ConfigurableWindow = {}){
    const { window =  defaultwindow } = options
    const counter = ref(0)
    if(window){
        window.addEventListener('blur',()=>counter.value +=1, true)
        window.addEventListener('focus',()=>counter.value +=1, true)
    }
    return computed(()=>{
        counter.value
        return window?.document.activeElement as T | null | undefined
    })
}