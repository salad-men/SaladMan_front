import { useAtom, useAtomValue } from 'jotai';
import { useState } from "react";
import { userAtom, initStore, accessTokenAtom } from "/src/atoms";
import { useNavigate } from "react-router";
import './StoreHeader.css';
import ChatSidebar from "@components/Chat/ChatSidebar";


const StoreHeader = () => {
    const [store,SetStore] = useAtom(userAtom);
    const [token, SetAccessToken] = useAtom(accessTokenAtom);
    const [user, SetUser] = useAtom(userAtom);
    const navigate = useNavigate();


    const logout = (e) => {
        e.preventDefault();
        sessionStorage.clear();
        SetStore(initStore);      // jotai 상태까지 초기화
        SetUser(null);
        SetAccessToken('');
        navigate("/");
    }
    
    return (
        <>
            <div className="storeHeader">
                <div className="storeNav">
                    <div className="storeDropdownContainer">
                        <a href="#">재고</a>
                        <div className="storeDropdown">
                            <ul>
                                <li><a href="/store/StoreInventoryList">전체 재고 조회</a></li>
                                <li><a href="/store/StoreInventoryRecord">재고 입출고 내역</a></li>
                                <li><a href="/store/StoreInventoryExpiration">유통기한 조회</a></li>
                                <li><a href="/store/StoreDisposalList">폐기 목록 조회</a></li>
                                <li><a href="/store/StoreIngredientSetting">매장별 재료 설정</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="storeDropdownContainer">
                        <a href="#">발주</a>
                        <div className="storeDropdown">
                            <ul>
                                <li><a href="/store/orderList">발주목록조회</a></li>
                                <li><a href="/store/orderApply">발주신청</a></li>
                                <li><a href="/store/stockInspection">발주입고검수</a></li>
                                <li><a href="/store/orderSettings">발주설정</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="storeDropdownContainer">
                        <a href="#">메뉴</a>
                        <div className="storeDropdown">
                            <ul>
                                <li><a href="/store/totalMenu">전메뉴 조회</a></li>
                                <li><a href="/store/menuStatus">판매 메뉴 관리</a></li>
                                <li><a href="/store/recipe">레시피 조회</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="storeDropdownContainer">
                        <a href="#">매장관리</a>
                        <div className="storeDropdown">
                            <ul>
                                <li><a href="storeSales">매출 조회</a></li>
                                <li><a href="paymentList">주문내역 조회</a></li>
                                <li><a href="/store/empSchedule">직원일정관리</a></li>
                                <li><a href="#">직원조회</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="storeDropdownContainer">
                        <a href="#">점포 조회</a>
                        <div className="storeDropdown">
                            <ul>
                                <li><a href="/store/otherStoreInven">타매장 재고조회</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="storeDropdownContainer">
                        <a href="#">공지사항</a>
                        <div className="storeDropdown">
                            <ul>
                                <li><a href="/store/StoreNoticeList">공지사항 조회</a></li>
                                <li><a href="/store/StoreComplaintList">불편사항 조회</a></li>
                                <li><a href="#">쪽지</a></li>
                                <li><a href="/store/notification">알림 목록</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="user-info">
                {store && store.name ? (
                    <>
                        {store.name} | <a onClick={logout}>로그아웃</a>
                    </>
                ) : null}
            </div>
            </div>
        </>
    );
};

export default StoreHeader;
