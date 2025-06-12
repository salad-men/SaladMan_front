console.log("현재 Vite 모드:", import.meta.env.MODE);

export const url = import.meta.env.VITE_API_ENV === "prod"
  ? import.meta.env.VITE_API_URL
  : "http://localhost:5173";
