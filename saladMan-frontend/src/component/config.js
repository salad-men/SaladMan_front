// 예: 환경변수 REACT_APP_API_ENV가 'prod'이면 S3 주소, 아니면 localhost

const localUrl = "http://localhost:5173";
const prodUrl = "http://saladman-web.s3-website.ap-northeast-2.amazonaws.com";

export const url = process.env.REACT_APP_API_ENV === "prod" ? prodUrl : localUrl;
