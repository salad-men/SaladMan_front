import React, { useState } from "react";
import axios from "axios";

export default function TestUploader() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("파일을 선택하세요!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8090/test/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUrl(res.data);
    } catch (err) {
      alert("업로드 실패!");
    }
  };

  return (
    <div>
      <h2>테스트 파일 업로드</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
        />
        <button type="submit">업로드</button>
      </form>
      {url && (
        <div>
          <p>CloudFront URL:</p>
          <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
          <br />
          {url.match(/\.(jpg|jpeg|png|gif)$/i) && <img src={url} alt="미리보기" style={{maxWidth:300}} />}
        </div>
      )}
    </div>
  );
}
