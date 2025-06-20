import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export const accessTokenAtom = atomWithStorage("access_token", '', createJSONStorage(() => sessionStorage));
export const refreshTokenAtom = atomWithStorage("refresh_token", '', createJSONStorage(() => sessionStorage));

export const initStore = {
    username:'',
    id:'',
    name:'',
    role:''
}

export const userAtom = atomWithStorage("store", initStore, createJSONStorage(()=>sessionStorage));