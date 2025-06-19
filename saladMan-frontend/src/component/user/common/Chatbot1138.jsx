import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Chatbot.module.css";
import { myAxios } from "../../../config";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState(1);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showMenuButtons, setShowMenuButtons] = useState(true);
  const [complaintStore, setComplaintStore] = useState("");
  const [complaintText, setComplaintText] = useState("");
  const [writerNickname, setWriterNickname] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && showMenuButtons) {
      addMessage("bot", "신선한 채소로 하루를 책임지는 샐러드맨이에요!\n무엇을 도와드릴까요?");
      addMessage("bot", {
        type: "buttons",
        buttons: ["메뉴 🥗", "매장 🏪", "자주 묻는 질문 🤔", "불편사항 😥", "새로운 소식 🥳"],
      });
      setShowMenuButtons(false);
    }
  }, [isOpen, messages, showMenuButtons]);

  const addMessage = (from, content) => {
    if (typeof content === "string") {
      setMessages((prev) => [...prev, { from, text: content }]);
    } else {
      setMessages((prev) => [...prev, { from, ...content }]);
    }
  };

  const resetChat = () => {
    setMode(null);
    setStep(1);
    setComplaintStore("");
    setComplaintText("");
    setWriterNickname("");
    setShowMenuButtons(true); // 초기 버튼 다시 보이게
    setMessages([]);
  };

  const fetchStoreByKeyword = async (keyword) => {
    try {
      const res = await myAxios().get("/user/chatbot/stores", {
        params: { keyword },
      });
      return res.data;
    } catch (err) {
      console.error("❌ 매장 검색 실패:", err);
      return [];
    }
  };

  const fetchMenusByKeyword = async (keyword) => {
    try {
      const res = await myAxios().get("/user/chatbot/menus", {
        params: { keyword },
      });
      return res.data;
    } catch (err) {
      console.error("❌ 메뉴 검색 실패:", err);
      return null;
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage("user", input);
    handleUserInput(input.trim());
    setInput("");
  };

  const handleUserInput = (text) => {
    const cleaned = text.toLowerCase();

    if (!mode) {
      if (cleaned.includes("메뉴")) {
        setMode("menu");
        setStep(1);
        addMessage("bot", "샐러드맨의 메뉴를 알려드릴게요!");
      } else if (cleaned.includes("매장")) {
        setMode("store");
        setStep(1);
        addMessage("bot", "찾고 싶은 지역을 입력해주세요.");
      } else if (cleaned.includes("불편") || cleaned.includes("신고")) {
        setMode("complaint");
        setStep(1);
        addMessage("bot", "어느 지역 매장에 불편사항이 있었나요?");
      } else {
        addMessage("bot", "‘메뉴’, ‘매장’, ‘불편사항’ 중 하나를 입력해주세요 😊");
      }
      return;
    }

    if (mode === "menu") handleMenuFlow(text);
    if (mode === "store") handleStoreFlow(text);
    if (mode === "complaint") handleComplaintFlow(text);
  };

  const handleMenuFlow = async (text) => {
    if (step === 1) {
      const result = await fetchMenusByKeyword(text);
      if (!result || result.length === 0) {
        addMessage("bot", `'${text}' 관련 샐러드 메뉴를 찾을 수 없습니다.`);
        resetChat();
        return;
      }
      const menuList = result
        .map((menu) => `- ${menu.name} (${menu.salePrice.toLocaleString()}원)`)
        .join("\n");
      addMessage("bot", `'${text}' 관련 추천 메뉴입니다:\n${menuList}`);
      resetChat();
    }
  };

  const handleStoreFlow = async (text) => {
    if (step === 1) {
      const result = await fetchStoreByKeyword(text);
      if (!result || result.length === 0) {
        addMessage("bot", `'${text}' 지역의 매장을 찾을 수 없습니다.`);
        resetChat();
        return;
      }
      const storeList = result.map((s) => `• ${s.name} (${s.address})`).join("\n");
      addMessage("bot", `'${text}' 지역의 매장은 아래와 같습니다:\n\n${storeList}`);
    }
  };

  const handleComplaintFlow = async (text) => {
    if (step === 1) {
      setComplaintStore(text);
      addMessage("bot", `${text} 관련 매장을 선택해주세요 (예: 독산역점)`);
      setStep(2);
    } else if (step === 2) {
      setComplaintStore(text);
      addMessage("bot", `${text} 매장의 어떤 점이 불편하셨나요?`);
      setStep(3);
    } else if (step === 3) {
      setComplaintText(text);
      addMessage("bot", "작성자 이름을 입력해주세요.");
      setStep(4);
    } else if (step === 4) {
      setWriterNickname(text);
      addMessage("bot", "작성자 이메일을 입력해주세요.");
      setStep(5);
    } else if (step === 5) {
      const writerEmail = text;
      const dto = {
        storeId: 1,
        title: complaintText.slice(0, 20),
        content: complaintText,
        writerDate: new Date().toISOString().split("T")[0],
        writerEmail: writerEmail,
        writerNickname: writerNickname,
      };

      try {
        const res = await axios.post("/user/chatbot/complaints", dto, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.status === 200 || res.status === 201) {
          addMessage("bot", "접수되었습니다. 감사합니다!");
        } else {
          addMessage("bot", "접수에 실패했습니다. 다시 시도해주세요.");
        }
      } catch (err) {
        console.error("❌ 불편사항 접수 실패:", err);
        addMessage("bot", "서버 오류로 접수에 실패했습니다.");
      }

      resetChat();
    }
  };

  return (
    <>
      <button className={styles.toggleBtn} onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>
      {isOpen && (
        <div className={styles.chatbox}>
          <div className={styles.header}>
            샐러드맨 챗봇
            <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
              ✖
            </button>
          </div>
          <div className={styles.messages}>
            {messages.map((msg, idx) => (
              <div key={idx} className={styles[msg.from]}>
                {msg.from === "bot" && msg.type !== "buttons" && (
                  <img src="/saladman.png" alt="bot" className={styles.avatar} />
                )}
                {msg.type === "buttons" ? (
                  <div className={styles.buttons}>
                    {msg.buttons.map((btn, i) => (
                      <button key={i} onClick={() => handleUserInput(btn)}>
                        {btn}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={styles.bubble}>{msg.text}</div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.inputBox}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="메시지를 입력하세요..."
            />
            <button onClick={handleSend}>전송</button>
          </div>
        </div>
      )}
    </>
  );
}
