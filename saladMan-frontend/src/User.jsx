import React, { useEffect, useState } from "react";
import { url } from "./config";

export default function User() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${url}/api/users`)
      .then(res => {
        if (!res.ok) throw new Error("네트워크 응답 오류");
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(() => setMsg("사용자 목록 불러오기 실패"));
  }, []);

  const addUser = () => {
    if (!name.trim()) return alert("이름을 입력하세요");

    fetch(`${url}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Date.now(), name: name.trim() }),
    })
      .then(res => {
        if (!res.ok) throw new Error("등록 실패");
        return res.json();
      })
      .then(newUser => {
        setUsers(prev => [...prev, newUser]);
        setName("");
        setMsg("");
      })
      .catch(() => setMsg("사용자 등록 실패"));
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1>DB 연동 사용자 목록</h1>

      <input
        type="text"
        placeholder="이름 입력"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ padding: 8, fontSize: 16, width: "70%", marginRight: 8 }}
      />
      <button onClick={addUser} style={{ padding: "8px 16px", fontSize: 16 }}>
        등록
      </button>

      {msg && <p style={{ color: "red", marginTop: 10 }}>{msg}</p>}

      <ul style={{ marginTop: 20, fontSize: 18 }}>
        {users.map(user => (
          <li key={user.id}>
            {user.id} - {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
