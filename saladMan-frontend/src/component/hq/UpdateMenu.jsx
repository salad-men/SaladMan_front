import './UpdateMenu.css'
import SidebarMenus from './SidebarMenus'

const AllMenus = () => {
    return (
        <>
            <div className="wrapper">
                <SidebarMenus />
                <div className="content">
                    <header className="page-header">
                        <h2> 메뉴 등록</h2>
                    </header>
                    <form>
                        <table>
                            <tbody>
                            <tr>
                                <td className="label-cell">메뉴 사진</td>
                                <td><input type="file" id="image" accept="image/*"/></td>
                            </tr>
                            <tr>
                                <td className="label-cell">메뉴 이름</td>
                                <td><input type="text" id="name" required/></td>
                            </tr>
                            <tr>
                            </tr>
                            <tr>
                                <td className="label-cell">메뉴 재료</td>
                                <td>
                                    {/* 버튼 */}
                                    <button type="button">
                                        재료 선택
                                    </button>
                                    <table className="ingredient-table">
                                        <thead>
                                            <tr>
                                                <th>품명</th>
                                                <th>구분</th>
                                                <th>단위</th>
                                                <th>용량</th>
                                                <th>단위가격</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>로메인</td>
                                                <td>야채</td>
                                                <td>g</td>
                                                <td><input type="text"/></td>
                                                <td>500</td>
                                            </tr>
                                            <tr>
                                                <td>닭가슴살</td>
                                                <td>단백질</td>
                                                <td>g</td>
                                                <td><input type="text"/></td>
                                                <td>200</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">판매가 / 원가</td>
                                <td>
                                    <div className="flex-row">
                                        <div><input type="number" id="price" placeholder="판매가 (₩)" min="0"/></div>
                                        <div><input type="number" id="cost" placeholder="원가 (₩)" min="0"/></div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">레시피</td>
                                <td><textarea id="recipe"></textarea></td>
                            </tr>
                            </tbody>
                        </table>
                        <div>
                            <button type="submit">저장</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 재료선택 모달 */}
            <div id="ingredientModal" className="modal">
                <div className="modal-content">
                    <h3>재료 선택</h3>
                    <div className="ingredient-grid">
                        <label><input type="radio" name="ingredient" value="로메인"/> 로메인</label>
                        <label><input type="radio" name="ingredient" value="케일"/> 케일</label>
                        <label><input type="radio" name="ingredient" value="양상추"/> 양상추</label>
                        <label><input type="radio" name="ingredient" value="치커리"/> 치커리</label>
                        <label><input type="radio" name="ingredient" value="적근대"/> 적근대</label>
                        <label><input type="radio" name="ingredient" value="믹스채소"/> 믹스채소</label>
                        <label><input type="radio" name="ingredient" value="닭가슴살"/> 닭가슴살</label>
                        <label><input type="radio" name="ingredient" value="두부"/> 두부</label>
                        <label><input type="radio" name="ingredient" value="훈제 오리"/> 훈제 오리</label>
                        <label><input type="radio" name="ingredient" value="훈제 연어"/> 훈제 연어</label>
                    </div>
                    <div>
                        <button type="button">확인</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AllMenus;