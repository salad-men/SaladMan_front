import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export const accessTokenAtom = atomWithStorage("access_token", '', createJSONStorage(() => sessionStorage));
export const refreshTokenAtom = atomWithStorage("refresh_token", '', createJSONStorage(() => sessionStorage));
export const fcmTokenAtom = atomWithStorage("fcmToken",'',createJSONStorage(()=>sessionStorage));
export const alarmsTokenAtom = atomWithStorage("alarms",[],createJSONStorage(()=>sessionStorage));

export const initStore = {
    username:'',
    id:'',
    name:'',
    role:'',
    storeId: null,
    storeName: '',
}

export const userAtom = atomWithStorage("store", initStore, createJSONStorage(()=>sessionStorage));