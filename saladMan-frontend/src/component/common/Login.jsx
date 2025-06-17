import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { myAxios } from '/src/config.jsx';
import { useSetAtom } from 'jotai';
import { userAtom,tokenAtom } from "/src/atoms";
import './Login.css'

const Login = () => {
    const [login, setLogin] = useState({username:'',password:''})
    const setStore = useSetAtom(userAtom);
    const setToken = useSetAtom(tokenAtom);
    const navigate = useNavigate();
    const edit = (e) => {
        setLogin({...login, [e.target.name]:e.target.value});
    }

    const loginForm = (e) => {
        const axios = myAxios();

        e.preventDefault();
        axios.post("/login", login)
            .then(res=>{
                console.log(res)
                console.log(res.headers.authorization)
                setToken(res.headers.authorization);
                const store = res.data;
                setStore({...store})
                navigate("/hq/totalMenu")
                // navigate(userInfo.role === "ROLE_HQ" ? `${url}/hq/totalMenu` : `${url}/store/totalMenu`);
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