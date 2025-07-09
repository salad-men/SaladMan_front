// ModalPortal.jsx
import { createPortal } from 'react-dom';

const ModalPortal = ({ children }) => {
    const el = document.getElementById('modal-root');
    if (!el) {
        console.error("❗ modal-root 요소가 없습니다. index.html에 <div id='modal-root'></div> 추가해주세요.");
        return null;
    }
    return createPortal(children, el);
};

export default ModalPortal;
