import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { myAxios } from "../../../config";
import { accessTokenAtom } from "/src/atoms";
import NoticeSidebar from "./NoticeSidebar";
import styles from "./HqNoticeWrite.module.css";

export default function HqNoticeModify() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAtomValue(accessTokenAtom);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [fileFile, setFileFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileOriginName, setFileOriginName] = useState("");

  // 상세 데이터 로딩
  useEffect(() => {
    myAxios(token).get("/hq/notice/detail", { params: { id } })
      .then(res => {
        const data = res.data.notice;
        setTitle(data.title || "");
        setContent(data.content || "");
        setImgUrl(data.imgFileName || "");
        setFileUrl(data.fileName || "");
        setFileOriginName(data.fileOriginName || "");
      })
      .catch(() => alert("공지 불러오기 실패!"));
  }, [id, token]);

  // 이미지 미리보기 변경
  const handleImageChange = e => {
    const file = e.target.files[0];
    setImgFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = e => setImgPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = e => setFileFile(e.target.files[0]);

  // 이미지 삭제
  const handleImgDelete = async () => {
    if (imgUrl) {
      await myAxios(token).delete("/hq/notice/img", { params: { url: imgUrl } });
      setImgUrl("");
      setImgPreview(null);
      setImgFile(null);
      alert("이미지 삭제 완료!");
    }
  };

  // 첨부파일 삭제
  const handleFileDelete = async () => {
    if (fileUrl) {
      await myAxios(token).delete("/hq/notice/file", { params: { url: fileUrl } });
      setFileUrl("");
      setFileOriginName("");
      setFileFile(null);
      alert("첨부파일 삭제 완료!");
    }
  };

  // URL에서 파일명 추출 (backup용)
  const getFileNameFromUrl = (url) => {
    if (!url) return "";
    return url.substring(url.lastIndexOf("/") + 1);
  };

  // 수정 제출
  const handleSubmit = async e => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", title);
    formData.append("content", content);
    if (imgFile) formData.append("img", imgFile);
    if (fileFile) formData.append("file", fileFile);

    try {
      await myAxios(token).post("/hq/notice/modify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("수정 완료!");
      navigate(`/hq/HqNoticeDetail/${id}`);
    } catch (err) {
      alert("수정 실패!");
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <NoticeSidebar />
      <main className={styles.content}>
        <h2>공지 수정</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <table>
            <tbody>
              <tr>
                <th>제목</th>
                <td>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className={styles.input}
                    required
                  />
                </td>
              </tr>
              <tr>
                <th>내용</th>
                <td>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={10}
                    className={styles.input}
                    required
                  />
                </td>
              </tr>
              <tr>
                <th>이미지</th>
                <td>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {(imgPreview || imgUrl) && (
                    <div>
                      <img
                        src={imgPreview || imgUrl}
                        alt="미리보기"
                        style={{ maxWidth: 200, margin: "10px 0" }}
                      />
                      {imgUrl && (
                        <button type="button" onClick={handleImgDelete}>
                          이미지 삭제
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <th>첨부파일</th>
                <td>
                  <input type="file" onChange={handleFileChange} />
                  {fileUrl && (
                    <div>
                      <a
                        href={fileUrl}
                        download
                        style={{ marginRight: 10 }}
                      >
                        {fileOriginName || getFileNameFromUrl(fileUrl)}
                      </a>
                      <button type="button" onClick={handleFileDelete}>
                        첨부파일 삭제
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <button type="submit">수정</button>
            <button type="button" onClick={() => navigate(`/hq/HqNoticeDetail/${id}`)}>
              취소
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
