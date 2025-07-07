// src/stompClient.js
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { API_BASE } from './config'; 

// 1) Client 인스턴스 생성
const stompClient = new Client({
  
  // brokerURL 대신 webSocketFactory 사용!
  webSocketFactory: () => new SockJS(`${API_BASE}/connect`),  // ← 서버와 동일하게
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  debug: (msg) => console.log('[STOMP]', msg),
});

// 2) 연결되었을 때 할 일
stompClient.onConnect = (frame) => {
  console.log('STOMP Connected: ' + frame);
  // 토픽 구독
  stompClient.subscribe('/topic/chat', (message) => {
    const body = JSON.parse(message.body);
    console.log('▶ 받은 메시지:', body);
  });
};

// 3) 에러 처리
stompClient.onStompError = (err) => {
  console.error('STOMP Error', err);
};

// 4) 연결 시작
export function activateStomp() {
  if (!stompClient.active) {
    stompClient.activate();
  }
}

// 5) 필요 시 전송 함수
export function sendMessage(destination, payload) {
  stompClient.publish({
    destination,
    body: JSON.stringify(payload),
  });
}
