import './OtherStoreInven.css'

const OtherStoreInven = () => {
    return (
        <>
            <div class="sidebar">
                <h2>지점 목록</h2>
                <div class="search-box">
                    <input type="text" id="storeSearch" placeholder="메뉴 검색창" oninput="renderStoreList()"/>
                        <button onclick="renderStoreList()">검색</button>
                </div>
                <table class="store-table">
                    <thead>
                        <tr><th>점포명</th><th>거리</th></tr>
                    </thead>
                    <tbody id="storeTableBody"></tbody>
                </table>
            </div>

            <div class="main">
                <div class="filters">
                    <input type="text" id="productSearch" placeholder="재고명 검색..." oninput="filterByProduct()"/>
                </div>
                <h2 id="sectionTitle">점포 재고 조회</h2>
                <table>
                    <thead>
                        <tr>
                            <th>지점명</th>
                            <th>제품명</th>
                            <th>카테고리</th>
                            <th>재고 수량</th>
                            <th>단가</th>
                            <th>총액</th>
                        </tr>
                    </thead>
                    <tbody id="stockTableBody"></tbody>
                </table>
            </div>
        </>
    )
}

export default OtherStoreInven;