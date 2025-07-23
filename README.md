# 🥗 샐러드맨(SaladMan)
**샐러드 매장 통합 관리 플랫폼**

> **본사-매장-고객**을 하나로 연결하는 재고/발주/매출/인사/소통/키오스크 통합 관리 서비스

---
## 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [아키텍처](#아키텍처)
3. [기술스택](#%EF%B8%8F-기술스택)
4. [액터별 서비스](#-액터별-서비스-기능)
5. [주요 프로세스](#주요-프로세스)
6. [기술적 요소](#기술적-요소)
7. [트러블슈팅](#트러블슈팅)
9. [프로젝트 설계 및 관리](#프로젝트-설계-및-관리)

---

## 프로젝트 개요

- **샐러드 시장 연 8.4% 성장**  
- **재고/발주/매출/인사** 등 매장 운영 전반 통합관리
- **본사-직영점 단일 시스템**으로 업무 효율화
- **입고-소진-폐기-발주 자동화 및 실시간 모니터링**

---

## 아키텍처
<img width="1631" height="918" alt="image" src="https://github.com/user-attachments/assets/ed7789b5-16d3-42a8-95c9-360530795bfe" />

---

## 🛠️ 기술스택

### FrontEnd
<div>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
</div>

### BackEnd
<div>
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring_Data_JPA-007396?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/QueryDSL-003B57?style=for-the-badge"/>
</div>

### 설계/협업 Tool
<div>
  <img src="https://img.shields.io/badge/ERD_Cloud-5A29E4?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Google_Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white"/>
  <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"/>
  <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white"/>
</div>

### Infra / Cloud
<div>
  <img src="https://img.shields.io/badge/Amazon_EC2-FF9900?style=for-the-badge&logo=amazon-ec2&logoColor=white"/>
  <img src="https://img.shields.io/badge/AWS_CloudFront-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white"/>
  <img src="https://img.shields.io/badge/AWS_S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white"/>
</div>

### 외부 API & 기타
<div>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"/>
  <img src="https://img.shields.io/badge/toss%20payments-0064FF?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/KakaoMap-FFCD00?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/ZXING%20QR코드-4285F4?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white"/>
</div>

### 개발환경/IDE
<div>
  <img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white"/>
  <img src="https://img.shields.io/badge/STS-6DB33F?style=for-the-badge"/>
</div>

### CI/CD & 형상관리
<div>
  <img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=github&logoColor=white"/>
  <img src="https://img.shields.io/badge/Github_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white"/>
</div>

### Database
<div>
  <img src="https://img.shields.io/badge/HeidiSQL-0055A4?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Amazon_RDS-527FFF?style=for-the-badge&logo=amazon-rds&logoColor=white"/>
</div>



---
## 📦 액터별 서비스 기능


## 🏢 본사(관리자)

<details>
<summary><strong>재고</strong></summary>

  <details>
  <summary>재고관리</summary>
    
  ![본사- 매장관리](https://github.com/user-attachments/assets/ccce7ff7-c044-4f56-8d34-8fb2b01ef059)


  </details>

  <details>
  <summary>유통기한 관리</summary>

  ![본사- 유통기한 관리](https://github.com/user-attachments/assets/11e6679b-48a9-4862-9496-c7fdc1bf7b5e)

  </details>

  <details>
  <summary>폐기요청재료</summary>
    
  ![본사- 폐기 요청 재료](https://github.com/user-attachments/assets/afb0b25b-368f-4752-9388-1e43830a1a35)
  
  </details>

  <details>
  <summary>재료설정</summary>
    
  ![본사- 재료 설정](https://github.com/user-attachments/assets/217a9de0-4249-4e87-aad6-e353f8c9be1b)

  </details>

  <details>
  <summary>입/출고내역</summary>
    
  ![본사- 입출고내역](https://github.com/user-attachments/assets/d9e45bba-4ca8-421a-8691-02249a72c464)

  </details>

  <details>
  <summary>카테고리/재료관리</summary>
    
  ![본사- 카테고리재료관리](https://github.com/user-attachments/assets/def51971-85a5-4905-aa56-545bc5b1b667)

  </details>

</details>

<details>
<summary><strong>수주</strong></summary>

  <details>
  <summary>수주목록</summary>
  
  ![본사- 수주목록, 승인](https://github.com/user-attachments/assets/abe5d690-874a-4575-be20-305c39a77906)

  </details>

  <details>
  <summary>발주서 출력</summary>
  
  ![본사-발주서출력](https://github.com/user-attachments/assets/a071fa60-8906-4fbf-9a6e-d1a60c8b96db)


  </details>

  <details>
  <summary>재료별 수주 가능여부 설정</summary>
    
  ![본사- 재료별 수주가능여부 설정](https://github.com/user-attachments/assets/e161c082-e8a8-43a3-a8bb-5714fcea3a3f)


  </details>

</details>

<details>
<summary><strong>메뉴</strong></summary>

  <details>
  <summary>전체메뉴/레시피</summary>

  ![본사- 전체메뉴 조회,레시피조회](https://github.com/user-attachments/assets/7c87973e-20d9-4e61-8386-ced19ade6269)

  </details>

  <details>
  <summary>메뉴등록</summary>
  
  ![본사- 메뉴등록](https://github.com/user-attachments/assets/071fc28f-b9d3-4702-9bef-225e8f439b3f)


  </details>


</details>

<details>
<summary><strong>매출</strong></summary>

  <details>
  <summary>매출조회(전사)</summary>
    
  ![본사- 매출조회(전사)](https://github.com/user-attachments/assets/18b2c16a-94b2-4b32-bb4f-d9c1e17ad6f3)

 

  </details>

  <details>
  <summary>매출조회(지점)</summary>
    
  ![본사- 매출조회(지점)](https://github.com/user-attachments/assets/57ab762a-9ca0-49c3-85a3-600ef41bd1b3)

  </details>

</details>

<details>
<summary><strong>매장관리</strong></summary>

  <details>
  <summary>매장관리(목록/상세/수정/등록)</summary>
  
  ![본사- 매장관리](https://github.com/user-attachments/assets/5a716ff2-bd7d-47c8-bd79-bead8dbae523)

  </details>


  <details>
  <summary>직원관리(목록/상세/수정/등록)</summary>
    
  ![본사- 직원관리](https://github.com/user-attachments/assets/017e2719-6fc5-40c1-9166-e289b814891c)

  </details>

</details>

<details>
<summary><strong>공지사항/불편사항</strong></summary>

![본사-공지사항,불편사항](https://github.com/user-attachments/assets/7bd62556-1a95-41f5-b3c4-313d9ec85e63)

</details>

<details>
<summary><strong>대시보드</strong></summary>
  
![본사- 대시보드](https://github.com/user-attachments/assets/4f21e5b0-24d0-4390-8806-dd2dd23417e5)

</details>

---

## 🏬 매장

<details>
<summary><strong>재고</strong></summary>

  <details>
  <summary>재고관리</summary>
    
  ![매장-재고관리](https://github.com/user-attachments/assets/e9810ba0-1380-4ea2-9a93-78d05be285f9)

  </details>

  <details>
  <summary>유통기한 관리</summary>
    
  ![매장-유통기한 관리](https://github.com/user-attachments/assets/84324348-23f6-44af-8064-e08b5c2571c2)

  </details>

  <details>
  <summary>폐기신청 목록</summary>
    
  <img width="2542" height="1261" alt="매장-폐기신청목록" src="https://github.com/user-attachments/assets/3198ceb8-9fa5-44ef-a51e-d93de8b1fe31" />

  </details>

  <details>
  <summary>재료 입고/사용내역</summary>
  ![매장-입고,사용내역](https://github.com/user-attachments/assets/40c213c4-f7d7-4cad-ad89-81d7a9dc37dd)

  ![재료입고내역 이미지/영상](경로/매장-재료입고내역.gif)

  </details>

  <details>
  <summary>재료설정</summary>
    
  ![매장-재료설정](https://github.com/user-attachments/assets/c28b95ec-db4f-4d34-811e-8267e6347cbf)

  </details>

</details>

<details>
<summary><strong>발주</strong></summary>

  <details>
  <summary>발주신청</summary>
    
  ![매장- 발주신청](https://github.com/user-attachments/assets/7243248c-603f-47f8-a93b-95fbdfd967d9)

  </details>

  <details>
  <summary>자동발주설정</summary>
  
  ![매장- 자동발주설정](https://github.com/user-attachments/assets/530bbd6a-4127-4be9-985e-30cf6f961fb2)

  </details>

</details>

<details>
<summary><strong>메뉴</strong></summary>

  <details>
  <summary>전체메뉴조회</summary>
    
  ![매장- 전체메뉴조회](https://github.com/user-attachments/assets/9e46bdd6-a046-4d4b-b3b6-8b403d89ae7f)


  </details>

  <details>
  <summary>점포메뉴관리</summary>
    
  ![매장- 점포메뉴관리](https://github.com/user-attachments/assets/e4cdd7c2-459d-4e3a-a787-e303b6cdb570)

  </details>

  <details>
  <summary>레시피조회</summary>
    
  ![매장- 레시피 조회](https://github.com/user-attachments/assets/83d4211d-ecb5-4731-b5af-0eb48c25ce73)

  </details>

</details>

  <details>
  <summary><strong>매장관리</strong></summary>

  <details>
  <summary>매출조회</summary>
    
  ![매장- 매출조회](https://github.com/user-attachments/assets/0ed6abd6-c184-46c9-9ab7-e8b62738cc24)


  </details>

  <details>
  <summary>주문 및 환불 내역 조회</summary>
    
  ![매장- 주문내역](https://github.com/user-attachments/assets/70eae0cf-6ba2-4502-9b25-30855bdeeb55)

  </details>

  <details>
  <summary>직원목록</summary>
    
  ![매장- 직원 목록](https://github.com/user-attachments/assets/3e2f881a-bfc6-4fdf-8f83-c67d94ae0c66)

  </details>
  
  <details>
  <summary>직원 일정관리</summary>
    
  ![매장- 직원 일정관리](https://github.com/user-attachments/assets/16a29586-9472-47c5-b13c-0916806d78cf)

  </details>
  </details>
  
  <details>
  <summary><strong>점포조회</strong></summary>

  </details>
  
  <details>
  <summary>타 매장 재고 조회</summary>
    
  ![매장- 타매장 재고 조회](https://github.com/user-attachments/assets/9ca71695-4936-42f5-bb07-0b3ab653f5bc)

  </details>

  </details>

  <details>
  <summary><strong>공지사항</strong></summary>

  <details>
  <summary>공지사항</summary>
    
  ![매장- 공지사항 조회](https://github.com/user-attachments/assets/1f45a8c3-474a-49d2-b537-67e8002789bf)


  </details>

  <details>
  <summary>불편사항</summary>
  ![매장-불편사항](https://github.com/user-attachments/assets/e4f958c4-2b7e-448f-8a37-150fd34282d2)

 

  </details>


  </details>
  
  <details>
  <summary><strong>대시보드</strong></summary>
    
  ![매장- 대시보드](https://github.com/user-attachments/assets/8cb6ffc8-deda-4e92-8cd3-a441de85ba63)
  
  
  </details>



## 🏢 본사 & 🏬 매장 공통

<details>
<summary><strong>로그인</strong></summary>

 <img width="1123" height="910" alt="image" src="https://github.com/user-attachments/assets/46745444-130c-4f7a-a442-02ddd444e06c" />


</details>

<details>
<summary><strong>채팅</strong></summary>
  
![채팅](https://github.com/user-attachments/assets/2ae09daa-a620-46ce-8dce-a5c9cf32f18a)

</details>

<details>
<summary><strong>알림</strong></summary>

![매장- 알림 확인](https://github.com/user-attachments/assets/0a57ffe4-a229-4845-bca1-065416536a14)


</details>



## 👤 사용자

<details>
<summary><strong>메인 페이지</strong></summary>


https://github.com/user-attachments/assets/eb2bd76b-e447-42cb-9d5d-5fb618188fc9

<img width="2535" height="1285" alt="image" src="https://github.com/user-attachments/assets/80c52c35-aec0-4a35-a1b2-8601ee168e00" />
<img width="1501" height="1168" alt="image" src="https://github.com/user-attachments/assets/71f9d6f3-0ee6-4904-9d24-3d9ad938ec77" />



</details>

<details>
<summary><strong>브랜드 소개메뉴</strong></summary>
  
<img width="905" height="1236" alt="image" src="https://github.com/user-attachments/assets/275d4933-431a-412a-9530-333a76961154" />


</details>

<details>
<summary><strong>영양표</strong></summary>

<img width="862" height="825" alt="image" src="https://github.com/user-attachments/assets/d4b8f1a6-33fe-4d08-baa2-28714d87bbc2" />

</details>

<details>
<summary><strong>매장찾기</strong></summary>

![사용자-매장찾기](https://github.com/user-attachments/assets/a3cb6937-b7ed-4df8-97f9-e3cbfd6b63a2)


</details>

<details>
<summary><strong>새소식(공지사항, 이벤트, 칭찬매장)</strong></summary>

<img width="558" height="1176" alt="image" src="https://github.com/user-attachments/assets/8a9a0b21-0e27-48d8-a47a-bc5183ae46be" />
 
<img width="546" height="852" alt="image" src="https://github.com/user-attachments/assets/d4baf247-a639-445f-8577-58ee0db2ae1c" />



</details>

<details>
<summary><strong>챗봇(메뉴, 매장찾기, 불편사항, 자주묻는질문)</strong></summary>


![사용자-챗봇](https://github.com/user-attachments/assets/e46f9f3b-48f6-41d0-b242-9ebbf197d63a)

</details>

<details>
<summary><strong>배너 및 이미지 수정 화면(본사 로그인 시)</strong></summary>

![홈페이지 수정](https://github.com/user-attachments/assets/740d37a0-b5f9-4ceb-b9dc-f12a303662c1)



</details>



## 🖥️ 키오스크

<details>
<summary><strong>키오스크</strong></summary>
  
![키오스크](https://github.com/user-attachments/assets/dd7a3d93-8a27-4b7d-abbd-309f20b55325)


</details>

---

## 주요 프로세스

<details>
<summary><strong>🍱 매장 발주 프로세스</strong></summary>

![매장발주프로세스](https://github.com/user-attachments/assets/cdd599af-a957-4571-adc1-3606024aa53b)

</details>



<details>
<summary><strong>♻️ 폐기 프로세스</strong></summary>

![폐기프로세스](https://github.com/user-attachments/assets/810c6d71-7282-474f-8990-863db517801d)

</details>



<details>
<summary><strong>🥗 메뉴 등록/설정 프로세스</strong></summary>

![메뉴등록,설정프로세스](https://github.com/user-attachments/assets/eb9f71af-84f4-4bcc-af19-2a3ffaba60aa)

</details>



<details>
<summary><strong>🏬 고객 이용 프로세스</strong></summary>

![고객이용프로세스](https://github.com/user-attachments/assets/776ec966-ada8-4efd-86ea-9a86f6efd831)

</details>

---

## 기술적 요소

<details>
<summary><strong>💬 채팅 서비스</strong></summary>
<img width="1853" height="924" alt="image" src="https://github.com/user-attachments/assets/cc2b01fe-252d-4181-8975-9106e058043d" />

</details>

<details>
<summary><strong>📷 QR코드</strong></summary>
<img width="1696" height="765" alt="image" src="https://github.com/user-attachments/assets/9da72f00-043c-4dcc-9ec5-cab76597dbfd" />

</details>

<details>
<summary><strong>🔔 알림 (FCM)</strong></summary>
<img width="1695" height="951" alt="image" src="https://github.com/user-attachments/assets/a7c8081b-aac5-4975-a32d-9dda0c52f1ac" />

</details>

<details>
<summary><strong>🔐 스프링 시큐리티 (Spring Security)</strong></summary>
<img width="1809" height="813" alt="image" src="https://github.com/user-attachments/assets/22ee11b2-e5d4-4038-b400-16edf7b92650" />

</details>

<details>
<summary><strong>💬 챗봇</strong></summary>
<img width="1815" height="748" alt="image" src="https://github.com/user-attachments/assets/3f4f4de6-16b8-4a77-9f1f-cb321a6a2166" />

</details>

<details>
<summary><strong>결제</strong></summary>
<img width="1824" height="817" alt="image" src="https://github.com/user-attachments/assets/aef85846-9f03-47e3-896e-76be092ea9e9" />

</details>


---

## 트러블슈팅

| 🏷️ 이슈 |   문제 & 원인   |   해결 방법 & 결과   |
|:--------|:---------------|:---------------------|
| **AWS 무중단 배포** | <br>배포 시 트래픽 단절·다운타임 발생<br> | <br>**Docker Blue/Green** 컨테이너 병렬 운영, <br>**AWS CodeDeploy + Nginx** 트래픽 스위칭 적용<br> |
| **실시간 채팅 성능** | <br>HTTP 폴링 기반 채팅 TPS 급증/부하<br> | <br>**WebSocket+STOMP** 전환, Persistent Connection, 메시지 브로커 구독/발행<br> |
| **배포 자동화/CI-CD** | <br>배포 자동화 중 환경변수/권한/빌드 오류<br> | <br>**Github Actions → S3/ECR → CodeDeploy EC2**<br> 환경 분리, 빌드상태 슬랙/이메일 실시간 알림<br> |
| **재고/주문 트랜잭션** | <br>결제 승인 중 재고 부족 예외 발생시 품절처리까지 롤백<br> | <br>품절처리 로직 `@Transactional(REQUIRES_NEW)`로 분리, <br>트랜잭션 독립적 처리, 데이터 정합성 보장<br> |
| **알림 발송 구조** | <br>발신자/수신자 수동 입력, 템플릿 미사용<br> | <br>**알림 템플릿/자동 발송 구조**로 리팩토링<br> |
| **시큐리티/인증 동기화** | <br>토큰 만료·탈취·불일치 시 자동 만료 처리 안됨<br> | <br>**Axios 인터셉터 401시 자동 로그아웃/재인증,**<br> Refresh 토큰 동기화, 변조 시 즉시 만료<br> |

---


## 프로젝트 설계 및 관리

<details>
<summary><strong>요구사항 정의서 </strong></summary>
<img width="773" height="568" alt="image" src="https://github.com/user-attachments/assets/06bc2196-0119-4c5c-a0ac-857865d975a5" />

</details>

<details>
<summary><strong>화면 설계 </strong></summary>
<img width="956" height="692" alt="image" src="https://github.com/user-attachments/assets/58c95ed5-dc4e-4ce9-9852-b8d395b45c05" />

</details>

<details>
<summary><strong>데이터베이스 설계 </strong></summary>
<img width="1023" height="690" alt="image" src="https://github.com/user-attachments/assets/4d5cb5bb-00dd-4dde-9084-ff017479f6b9" />

</details>

<details>
<summary><strong>컴퍼넌트 정의서 </strong></summary>
<img width="1198" height="697" alt="image" src="https://github.com/user-attachments/assets/26aed9b6-e61f-44b0-8251-67126cd5383d" />

</details>

<details>
<summary><strong>노션 협업툴 활용 </strong></summary>
<img width="417" height="521" alt="image" src="https://github.com/user-attachments/assets/dd6aeb2b-f670-47c5-a886-b5d4a35cf2c9" />
<img width="928" height="693" alt="image" src="https://github.com/user-attachments/assets/e72f1d70-42dc-44bb-925e-3aa081d647f6" />

</details>

---
