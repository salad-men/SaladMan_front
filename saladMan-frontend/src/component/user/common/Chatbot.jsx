import React, { useState, useEffect, useRef } from "react";
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
  const [activeMainOption, setActiveMainOption] = useState(null);

  const messagesEndRef = useRef(null);

  // 메시지 끝으로 스크롤 하는 코드
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  // 챗봇 킬 때 리셋 코드 받아오기
  useEffect(() => {
    if (isOpen && messages.length === 0 && showMenuButtons) {
      myAxios()
        .get("/user/chatbot/main-options")
        .then((res) => {
          addMessage(
            "bot",
            "신선한 채소로 하루를 책임지는 샐러드맨이에요!\n무엇을 도와드릴까요?"
          );
          addMessage("bot", {
            type: "buttons",
            buttons: res.data.map((opt) => ({
              label: opt.label,
              value: opt.valueKey,
            })),
          });
          setShowMenuButtons(false);
        })
        .catch((err) => console.error("❌ 메인 옵션 불러오기 실패:", err));
    }
  }, [isOpen, messages, showMenuButtons]);

  const addMessage = (from, content) => {
    if (typeof content === "string") {
      const text = content.trim();
      if (!text) {
        console.warn("⚠️ 빈 문자열이므로 메시지 추가 안 함");
        return;
      }
      setMessages((prev) => [...prev, { from, text }]);
    } else if (content && content.type === "buttons") {
      setMessages((prev) => [...prev, { from, ...content }]);
    } else {
      console.warn("⚠️ 알 수 없는 메시지 형식:", content);
    }
  };

  const resetChat = () => {
    setMode(null);
    setStep(1);
    setComplaintStore("");
    setComplaintText("");
    setWriterNickname("");
    setShowMenuButtons(true);
    setMessages([]);
  };
  //질문 목록 불러오는 코드
  const fetchQuestionsByMainOptionId = async (mainOptionId) => {
    try {
      const res = await myAxios().get("/user/chatbot/question", {
        params: { mainOptionId },
      });
      return res.data;
    } catch (err) {
      console.error("❌ 질문 목록 불러오기 실패:", err);
      return [];
    }
  };
  // 답변 불러오는 코드
  const fetchAnswerByValueKey = async (valueKey) => {
    try {
          const res = await myAxios().get("/user/chatbot/answer-by-value", {

        params: { valueKey }, // ✅ valueKey로 보냄
      });
      return res.data;
    } catch (err) {
      console.error("❌ 답변 불러오기 실패:", err);
      return "답변을 불러오는 데 실패했습니다.";
    }
  };
  // 매장 검색하는 코드
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
  // 운영시간 조회하는 코드
  const handleSend = () => {
    if (!input.trim()) return;
    addMessage("user", input);
    handleUserInput(input.trim());
    setInput("");
  };
  // 사용자 입력 처리 하는 코드
  const handleUserInput = async (text) => {
    const cleaned = typeof text === "string" ? text.toLowerCase() : text;
    // 콘솔 로그 확인 부분
    console.log("전달되는 questionId or 명령어:", cleaned);
    if (cleaned === "reset") {
      resetChat();
      return;
    }

    if (!mode) {
      switch (cleaned) {
        case "menu": {
          const questions = await fetchQuestionsByMainOptionId(1);
          if (questions.length > 0) {
            addMessage(
              "bot",
              "메뉴관련 질문들을 모아놨어요!\n아래 버튼 중 하나를 선택해주세요."
            );
            addMessage("bot", {
              type: "buttons",
              buttons: questions.map((q) => ({
                label: q.question,
                value: q.valueKey,
              })),
            });
            addMessage("bot", {
              type: "buttons",
              buttons: [{ label: "처음으로", value: "reset" }],
            });
          } else {
            addMessage("bot", "메뉴관련질문이 아직 등록되어 있지 않습니다.");
          }
          return;
        }

        case "store_time":
          setMode("store_time");
          setStep(1);
          addMessage(
            "bot",
            "샐러드맨의 매장 이용시간은 점포마다 다르며 원하시는 점포의 이용시간을 알고 싶으시다면 점포명을 입력해주세요!"
          );
          return;

        case "store":
          setMode("store");
          setStep(1);
          addMessage("bot", "찾고 싶은 지역을 입력해주세요.");
          return;

        case "complaint":
          setMode("complaint");
          setStep(1);
          addMessage("bot", "어느 지역 매장에 불편사항이 있었나요?");
          return;

        case "ingredient":
          setMode("ingredient");
          setStep(1);
          addMessage(
            "bot",
            "원하시는 재료명을 입력해주세요. \n예) 연어, 닭가슴살 등"
          );
          return;

        case "faq": {
          const questions = await fetchQuestionsByMainOptionId(3);
          if (questions.length > 0) {
            addMessage(
              "bot",
              "고객님들의 자주 묻는 질문들을 모아놨어요!\n아래 버튼 중 하나를 선택해주세요."
            );
            addMessage("bot", {
              type: "buttons",
              buttons: questions.map((q) => ({
                label: q.question,
                value: q.valueKey,
              })),
            });
            addMessage("bot", {
              type: "buttons",
              buttons: [{ label: "처음으로", value: "reset" }],
            });
          } else {
            addMessage("bot", "자주 묻는 질문이 아직 등록되어 있지 않습니다.");
          }
          return;
        }

        default: {
          const answer = await fetchAnswerByValueKey(cleaned);

          if (Array.isArray(answer)) {
            let title = "🥗 추천 샐러드 목록입니다:";
            if (cleaned === "vegan") title = "🌱 비건 샐러드 목록입니다:";
            if (cleaned === "quantity")
              title = "💪 양이 많은 샐러드 TOP3입니다:";

            const listText = answer
              .map((item) => {
                if (cleaned === "quantity") {
                  return `• ${item.name} (총 재료량: ${item.totalQuantity}g)`;
                }
                return `• ${item.name}\n${item.description ?? ""}`;
              })
              .join("\n\n");

            addMessage("bot", `${title}\n\n${listText}`);
          } else if (typeof answer === "string") {
            addMessage("bot", answer);
          } else {
            // 기타 객체 처리
            addMessage("bot", JSON.stringify(answer, null, 2));
          }

          addMessage("bot", {
            type: "buttons",
            buttons: [{ label: "처음으로", value: "reset" }],
          });

          return;
        }
      }
    }
    if (mode === "ingredient") handleIngredientFlow(cleaned);
    if (mode === "store") handleStoreFlow(cleaned);
    if (mode === "complaint") handleComplaintFlow(cleaned);
    if (mode === "store_time") handleStoreTimeFlow(cleaned);
  };

  // 메뉴 -> 재료 검색
  const handleIngredientFlow = async (text) => {
    try {
      const res = await myAxios().get("/user/chatbot/ingredient", {
        params: { keyword: text },
      });

      if (res.data.length === 0) {
        addMessage(
          "bot",
          `죄송해요. '${text}' 재료가 들어간 샐러드를 찾지 못했어요.`
        );
        addMessage("bot", {
          type: "buttons",
          buttons: [{ label: "처음으로", value: "reset" }],
        });
        return;
      }

      const listText = res.data
        .map((item) => `• ${item.name}\n${item.description ?? ""}`)
        .join("\n\n");

      addMessage(
        "bot",
        `🔍 '${text}' 재료가 들어간 샐러드입니다:\n\n${listText}`
      );
      addMessage("bot", {
        type: "buttons",
        buttons: [{ label: "처음으로", value: "reset" }],
      });
    } catch (err) {
      console.error("❌ 재료 검색 실패:", err);
      addMessage("bot", "검색 중 오류가 발생했습니다.");
    }
  };

  // 매장 검색
  const handleStoreFlow = async (text) => {
    if (step === 1) {
      const result = await fetchStoreByKeyword(text);
      if (!result || result.length === 0) {
        addMessage("bot", `'${text}' 지역의 매장을 찾을 수 없습니다.`);
        addMessage("bot", {
          type: "buttons",
          buttons: [{ label: "처음으로", value: "reset" }],
        });
        return;
      }
      const storeList = result
        .map((s) => `• ${s.name} (${s.address})`)
        .join("\n");
      addMessage(
        "bot",
        `'${text}' 지역의 매장은 아래와 같습니다:\n\n${storeList}`
      );
      addMessage("bot", {
        type: "buttons",
        buttons: [{ label: "처음으로", value: "reset" }],
      });
    }
  };
  // 운영시간 조회
  const handleStoreTimeFlow = async (text) => {
    try {
      const res = await myAxios().get("/user/chatbot/store-time", {
        params: { keyword: text },
      });

      const stores = res.data;

      if (!stores || stores.length === 0) {
        addMessage(
          "bot",
          `죄송합니다. '${text}' 매장의 운영 정보를 찾을 수 없습니다.`
        );
      } else {
        const listText = stores
          .map(
            (s) =>
              `✅ ${s.name}\n 주소: ${s.address}\n ${s.openTime} ~ ${s.closeTime}\n 정기휴무: ${s.breakDay}`
          )
          .join("\n\n");

        addMessage("bot", listText);
      }

      addMessage("bot", {
        type: "buttons",
        buttons: [{ label: "처음으로", value: "reset" }],
      });
    } catch (err) {
      console.error("❌ 운영시간 조회 실패:", err);
      addMessage("bot", "서버 오류로 운영 정보를 가져오지 못했습니다.");
      addMessage("bot", {
        type: "buttons",
        buttons: [{ label: "처음으로", value: "reset" }],
      });
    }
  };

  // 불편사항 접수
  const fetchStoreIdByName = async (storeName) => {
    try {
      const res = await myAxios().get("/user/chatbot/stores", {
        params: { keyword: storeName },
      });
      if (res.data && res.data.length > 0) {
        // 정확히 일치하는 store 먼저 찾고 없으면 첫 번째 store 사용
        const matched = res.data.find((s) => s.name === storeName);
        return (matched ?? res.data[0]).id;
      }
      return null;
    } catch (err) {
      console.error("❌ storeId 가져오기 실패:", err);
      return null;
    }
  };

  const handleComplaintFlow = async (text) => {
    if (step === 1) {
      setComplaintStore(text);

      const result = await fetchStoreByKeyword(text);
      if (!result || result.length === 0) {
        addMessage("bot", `'${text}' 지역의 매장을 찾을 수 없습니다.`);
        resetChat();
        return;
      }

      // 🔸 매장 리스트 텍스트 출력
      const storeList = result
        .map((s) => `• ${s.name} (${s.address})`)
        .join("\n");
      addMessage(
        "bot",
        `'${text}' 지역의 매장은 아래와 같습니다:\n\n${storeList} \n\n원하시는 매장을 선택해주세요.`
      );

      // 🔸 매장 선택 버튼도 제공
      const storeButtons = result.slice(0, 7).map((s) => ({
        label: s.name,
        value: s.name,
      }));

      addMessage("bot", {
        type: "buttons",
        buttons: storeButtons,
      });

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

      // 🔍 storeId 조회 먼저!
      const storeId = await fetchStoreIdByName(complaintStore);
      if (!storeId) {
        addMessage("bot", "죄송합니다. 매장을 찾을 수 없습니다.");
        resetChat();
        return;
      }

      const dto = {
        storeId,
        title: complaintText.slice(0, 20), // ✨ 간단한 제목 생성
        content: complaintText,
        writerDate: new Date().toISOString().split("T")[0],
        writerEmail: writerEmail,
        writerNickname: writerNickname,
      };

      try {
        const res = await myAxios().post("/user/chatbot/complaints", dto);
        if (res.status === 200 || res.status === 201) {
          addMessage(
            "bot",
            "📨 불편사항이 성공적으로 접수되었습니다. 감사합니다!"
          );
        } else {
          addMessage("bot", "⚠️ 접수에 실패했습니다. 다시 시도해주세요.");
        }
      } catch (err) {
        console.error("❌ 불편사항 전송 실패:", err);
        addMessage("bot", "🚨 서버 오류로 접수에 실패했습니다.");
      }

      addMessage("bot", {
        type: "buttons",
        buttons: [{ label: "처음으로", value: "reset" }],
      });
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
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeBtn}
            >
              ✖
            </button>
          </div>
          <div className={styles.messages}>
            {messages.map((msg, idx) => (
              <div key={idx} className={styles[msg.from]}>
                {msg.from === "bot" && msg.type !== "buttons" && (
                  <img
                    src="/saladman.png"
                    alt="bot"
                    className={styles.avatar}
                  />
                )}
                {msg.type === "buttons" ? (
                  <div className={styles.buttons}>
                    {msg.buttons.map((btn, i) => {
                      const mainOptions = [
                        "menu",
                        "store_time",
                        "store",
                        "complaint",
                        "ingredient",
                        "faq",
                      ];
                      const isReset = btn.value === "reset";

                      // "이 메시지가 메인 옵션 메시지인지?" 판단
                      const isMainOptionMessage =
                        msg.buttons.length > 0 &&
                        msg.buttons.every((b) => mainOptions.includes(b.value));

                      const isActive =
                        isMainOptionMessage && activeMainOption === btn.value;
                      const shouldDisable =
                        isMainOptionMessage &&
                        activeMainOption &&
                        activeMainOption !== btn.value;

                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (isReset) {
                              setActiveMainOption(null);
                              handleUserInput(btn.value);
                              return;
                            }

                            if (isMainOptionMessage && !activeMainOption) {
                              setActiveMainOption(btn.value);
                            }

                            if (
                              !shouldDisable ||
                              isReset ||
                              !isMainOptionMessage
                            ) {
                              handleUserInput(btn.value);
                            }
                          }}
                          className={isActive ? styles.activeBtn : ""}
                          disabled={shouldDisable}
                        >
                          {btn.label}
                        </button>
                      );
                    })}
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
