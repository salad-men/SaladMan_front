import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";
import { myAxios } from "/src/config";


export default function PaymentFail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = useAtomValue(accessTokenAtom);

    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    return(
        <>
            <h1>결제실패</h1>
            <h2>매장 직원에게 문의하세요</h2>
            <button onClick={()=>{navigate("/kiosk/main")}}>홈으로</button>
        </>
    )

}
