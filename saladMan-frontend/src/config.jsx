import axios from "axios";
import { accessTokenAtom, refreshTokenAtom } from "./atoms";
import { getDefaultStore } from "jotai";

console.log("현재 Vite 모드:", import.meta.env.MODE);

const store = getDefaultStore();

export const API_BASE = import.meta.env.VITE_API_URL;
export const CF_BASE  = import.meta.env.VITE_CLOUDFRONT_URL || '';

export const myAxios = (token) => {
   var instance = axios.create({
      baseURL: API_BASE,
      timeout: 5000,
   })

   token && instance.interceptors.request.use((config) => {

      config.headers.Authorization = token;
      return config;
   });

   instance.interceptors.response.use(
      response => response,
      error => {
         const code = error.response?.status;

         if (code === 401 || code === 403) {
            alert("접근 권한이 없습니다.");

            store.set(accessTokenAtom, '');
            store.set(refreshTokenAtom, '');

            window.location.href = "/";
         }

         return Promise.reject(error);
      }
   );

    return instance;
}

export const themeObj = {
   bgColor: "", 			// 바탕 배경색
   searchBgColor: "", 		// 검색창 배경색
   contentBgColor: "", 		// 본문 배경색(검색결과,결과없음,첫화면,검색서제스트)
   pageBgColor: "", 		// 페이지 배경색
   textColor: "", 			// 기본 글자색
   queryTextColor: "", 		// 검색창 글자색
   postcodeTextColor: "", 	// 우편번호 글자색
   emphTextColor: "", 		// 강조 글자색
   outlineColor: "" 		// 테두리
};