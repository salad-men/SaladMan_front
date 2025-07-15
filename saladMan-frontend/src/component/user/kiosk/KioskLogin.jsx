import React from "react";
import styles from "./KioskLogin.module.css";
import { useNavigate } from "react-router-dom";
import { myAxios } from '/src/config.jsx';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAtom, accessTokenAtom, refreshTokenAtom, fcmTokenAtom } from "/src/atoms";
import { useState } from "react";

export default function KioskLogin() {
    const [login, setLogin] = useState({ username: '', password: '' })
    const setStore = useSetAtom(userAtom);
    const setAccessToken = useSetAtom(accessTokenAtom);
    const setRefreshToken = useSetAtom(refreshTokenAtom);

    const navigate = useNavigate();
    const edit = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    }
    const kioskLoginForm = (e) => {
        const axios = myAxios();
        e.preventDefault();
        const loginData = { ...login };
        console.log(loginData);

        axios.post("/kiosk/login", loginData)
            .then(res => {
                const token = JSON.parse(res.headers.authorization);
                console.log(token);

                setAccessToken(token.access_token);
                setRefreshToken(token.refresh_token);

                const store = res.data;
                setStore({ ...store });

                navigate("/kiosk/main");
            })
            .catch(err => {
                console.log(err);
            });
    };
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBlur}>
                <div className={styles.loginBox}>

                    <h2 className={styles.title}>키오스크 로그인</h2>
                    <form
                        onSubmit={kioskLoginForm}
                        className={styles.loginForm}
                    >
                        <div className={styles.inputGroup}>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="아이디"
                                required
                                onChange={edit}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="비밀번호"
                                required
                                onChange={edit}
                            />
                        </div>
                        <button type="submit" className={styles.loginButton}>
                            로그인
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}