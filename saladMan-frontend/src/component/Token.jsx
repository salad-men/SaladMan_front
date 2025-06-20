import { useEffect } from "react";
import {useSetAtom} from "jotai";
import {accessTokenAtom,refreshTokenAtom, userAtom} from "../atoms";
import axios from "axios";
import { url } from "../config";
import { useNavigate } from "react-router";

export default function Token() {
    let params = new URL(window.location.href).searchParams;
    const token = JSON.parse(params.get("token"));

    const setAccessToken = useSetAtom(accessTokenAtom);
    const setRefreshToken = useSetAtom(refreshTokenAtom);
    const setUser = useSetAtom(userAtom);
    const navigate = useNavigate();
    // 각각 저장
    setAccessToken(token.access_token);
    setRefreshToken(token.refresh_token);

    useEffect(()=> {
        axios.post(`${url}/user`,null,{
            headers: {
                Authorization: token.access_token
            }
        })
        .then(res=> {
            console.log(res);
            setUser(res.data);
            navigate("/");
        })
    },[token.access_token])
    return(<></>)
}