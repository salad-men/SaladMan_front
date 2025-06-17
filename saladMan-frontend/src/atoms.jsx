import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export const initStore = {
    username:'',
    id:'',
    name:''
}

export const userAtom = atomWithStorage("store", initStore, createJSONStorage(()=>sessionStorage));
export const tokenAtom = atomWithStorage("token", '', createJSONStorage(()=>sessionStorage));