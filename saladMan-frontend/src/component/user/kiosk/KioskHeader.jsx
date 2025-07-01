import { useAtomValue } from 'jotai';
import { useState } from "react";
import { userAtom } from "/src/atoms";
import { useNavigate } from "react-router";
import './KioskHeader.css';

const KioskHeader = () => {
    const store = useAtomValue(userAtom);
    const navigate = useNavigate();
    const [logoutVisible, setLogoutVisible] = useState(false);

    const logout = (e) => {
        e.preventDefault();
        sessionStorage.clear();
        navigate("/kiosk/login");
    }

    return (
        <>
            <div className="storeHeader">
                <div className="storeNav"></div>
                <div className="kioskUserInfo" onClick={() => setLogoutVisible(!logoutVisible)}>
                    <span
                        className="store-name"
                        onClick={() => setLogoutVisible(!logoutVisible)}
                    >
                        {store.name}
                    </span>
                    {logoutVisible && (
                        <div className="logoutBox">
                            <a onClick={logout}>로그아웃</a>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
};

export default KioskHeader;
