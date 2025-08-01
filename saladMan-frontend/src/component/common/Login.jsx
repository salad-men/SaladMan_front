import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { myAxios } from '/src/config.jsx';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAtom,accessTokenAtom,refreshTokenAtom,fcmTokenAtom } from "/src/atoms";
import './Login.css'

const Login = () => {
    const [login, setLogin] = useState({username:'',password:''})
    const setStore = useSetAtom(userAtom);
    const setAccessToken = useSetAtom(accessTokenAtom);
    const setRefreshToken = useSetAtom(refreshTokenAtom);
    const fcmToken = useAtomValue(fcmTokenAtom);

    const navigate = useNavigate();
    const edit = (e) => {
        setLogin({...login, [e.target.name]:e.target.value});
    }

    const loginForm = (e) => {
        const axios = myAxios();
        e.preventDefault();
        const loginData = { ...login, fcmToken };

        axios.post("/login", loginData)
            .then(res=>{
                const token = JSON.parse(res.headers.authorization);
                console.log(token);

                setAccessToken(token.access_token);
                setRefreshToken(token.refresh_token);

                const store = res.data;
                setStore({...store})
                navigate(store.role === "ROLE_HQ" ? "/hq/HqDashboard" : "/store/StoreDashboard");
            })
            .catch(err=> {
                console.log(err)
            })
    };

    return (
        <div className="login-background">
            <div className="login-blur">
                <div className='login-box'>
                    <h2>로그인</h2>
                    <form className='loginform' onSubmit={loginForm}>
                        <input type="text" onChange={edit} name='username' placeholder="아이디" />
                        <input type="password" onChange={edit} name='password' placeholder="비밀번호" />

                        <button className='login-button'>로그인</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { myAxios } from "/src/config.jsx";
// import { useAtomValue, useSetAtom } from "jotai";
// import {
//   userAtom,
//   accessTokenAtom,
//   refreshTokenAtom,
//   fcmTokenAtom,
// } from "/src/atoms";
// import "./Login.css";

// const Login = () => {
//   const [login, setLogin] = useState({ username: "", password: "" });
//   const setStore = useSetAtom(userAtom);
//   const setAccessToken = useSetAtom(accessTokenAtom);
//   const setRefreshToken = useSetAtom(refreshTokenAtom);
//   const fcmToken = useAtomValue(fcmTokenAtom);

//   const navigate = useNavigate();

//   const edit = (e) => {
//     setLogin({ ...login, [e.target.name]: e.target.value });
//   };

//   const loginForm = (e) => {
//     e.preventDefault();
//     const axios = myAxios();
//     const loginData = { ...login, fcmToken };

//     axios
//       .post("/login", loginData)
//       .then((res) => {
//         const token = JSON.parse(res.headers.authorization);

//         // jotai atom
//         setAccessToken(token.access_token);
//         setRefreshToken(token.refresh_token);

//         // sessionStorage 직접 저장
//         sessionStorage.setItem("access_token", token.access_token);
//         sessionStorage.setItem("refresh_token", token.refresh_token);

//         const store = res.data;
//         setStore({ ...store });
//         sessionStorage.setItem("store", JSON.stringify(store)); // 이 것도 추가

//         navigate(
//           store.role === "ROLE_HQ" ? "/hq/HqDashboard" : "/store/StoreDashboard"
//         );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   return (
//     <div className="login-background">
//       <div className="login-blur">
//         <div className="login-box">
//           <h2>로그인</h2>
//           <form className="loginform" onSubmit={loginForm}>
//             <input
//               type="text"
//               onChange={edit}
//               name="username"
//               placeholder="아이디"
//             />
//             <input
//               type="password"
//               onChange={edit}
//               name="password"
//               placeholder="비밀번호"
//             />
//             <button className="login-button">로그인</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
