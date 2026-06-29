"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="loading-screen">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      {/* ====== 시작 화면 ====== */}
      <div id="start-screen" className="screen active">
        <div className="start-container">
          <h1 className="game-title">우리 동네 신 키우기</h1>
          <p className="subtitle">
            지엽적이고 하찮은 동네신으로 시작해 유일신이 되어보세요
          </p>

          <button id="generate-btn" className="btn btn-primary">
            이번 생의 신 생성
          </button>

          <div id="god-info" className="god-info hidden">
            <div className="god-name-display">
              <span id="generated-god-name" className="god-name" />
            </div>
            <p className="god-detail">
              시작 신도: <span id="start-followers">0</span>명
            </p>
            <p className="god-detail">
              시작 권능: <span id="start-power" />
            </p>
          </div>

          <button id="start-game-btn" className="btn btn-gold hidden">
            게임 시작
          </button>
        </div>
      </div>

      {/* ====== 게임 화면 ====== */}
      <div id="game-screen" className="screen">
        {/* 상단 상태창 */}
        <div className="status-bar">
          {/* 새 게임 버튼 - 우상단 배치 (오클릭 방지) */}
          <div className="status-card new-game-card">
            <button id="new-game-btn" className="btn btn-danger">🔄 새 게임</button>
          </div>
          <div className="status-card">
            <span className="status-label">신 이름</span>
            <span id="current-god-name" className="status-value god-name-small" />
          </div>
          <div className="status-card">
            <span className="status-label">등급</span>
            <span id="current-rank" className="status-value" />
          </div>
          {/* 믿음 수치 - 확대 개선 */}
          <div className="status-card faith-card">
            <span className="status-label">믿음</span>
            <span id="current-faith" className="status-value faith-value" />
            <span id="faith-per-second" className="status-sub faith-sub" />
          </div>
          <div className="status-card">
            <span className="status-label">신도</span>
            <span id="current-followers" className="status-value" />
          </div>
          <div className="status-card">
            <span className="status-label">스테이지</span>
            <span id="current-stage" className="status-value" />
          </div>
          <div className="status-card">
            <span className="status-label">공격력</span>
            <span id="current-attack" className="status-value" />
          </div>
          <div className="status-card">
            <span className="status-label">공격속도</span>
            <span id="current-speed" className="status-value" />
          </div>
          <div className="status-card">
            <span className="status-label">범위</span>
            <span id="current-radius" className="status-value" />
          </div>
        </div>

        {/* 신 비주얼 영역 */}
        <div className="god-display-area">
          <div className="god-emoji" id="god-emoji">✨</div>
          <div className="god-info-text">
            <span id="god-name-display" className="god-display-name" />
            <span id="god-evolution-name" className="god-evolution-text" />
          </div>
        </div>

        {/* 스테이지 진행도 바 */}
        <div className="stage-progress-container">
          <div className="stage-progress-bg">
            <div id="stage-progress-bar" className="stage-progress-bar" />
          </div>
          <span id="stage-progress-text" className="stage-progress-text" />
        </div>

        {/* 탭 메뉴 - 정보 탭 신설 */}
        <div className="tab-menu">
          <button id="tab-play" className="tab-btn active">⚔️ 포섭</button>
          <button id="tab-temple" className="tab-btn">🏯 신전</button>
          <button id="tab-info" className="tab-btn">📜 정보</button>
        </div>

        {/* 메인 영역 */}
        <div className="main-area">
          {/* 중앙: 플레이/신전/정보 영역 */}
          <div className="content-area">
            {/* 플레이 뷰 */}
            <div id="play-view" className="view-container">
              <div className="play-area" id="play-area" />
            </div>

            {/* 신전 뷰 */}
            <div id="temple-view" className="view-container hidden">
              <div className="temple-header">
                <h2 className="temple-title">🏯 신전</h2>
                <p className="temple-desc">믿음을 사용하여 신의 힘을 강화하세요</p>
              </div>
              <div id="upgrade-tree-container" className="upgrade-tree-container" />
            </div>

            {/* 정보 뷰 (신규) */}
            <div id="info-view" className="view-container hidden">
              <div className="info-header">
                <h2 className="info-title">📜 정보</h2>
              </div>
              <div className="info-content">
                {/* 공유 카드 */}
                <div className="share-card">
                  <h3 className="panel-title">공유 카드</h3>
                  <div className="share-card-content">
                    <p className="share-card-label">나의 신</p>
                    <p id="card-god-name" className="share-card-god-name" />
                    <div className="share-card-stats">
                      <p>신도: <span id="card-followers" /></p>
                      <p>믿음: <span id="card-faith" /></p>
                      <p>등급: <span id="card-rank" /></p>
                      <p>스테이지: <span id="card-stage" /></p>
                      <p>형태: <span id="card-evolution" /></p>
                    </div>
                    <p className="share-card-hashtag">#우리동네신키우기</p>
                  </div>
                </div>

                {/* 게임 정보 */}
                <div className="game-info-section">
                  <h3 className="panel-title">게임 정보</h3>
                  <div className="game-info-content">
                    <p>🎯 목표: 동네신에서 유일신으로 성장</p>
                    <p>🖱️ 조작: 마우스 꾹 누르기로 기적 발동</p>
                    <p>🔍 확대/축소: Ctrl + 마우스 휠</p>
                    <p>💾 자동 저장: 5초마다 자동 저장</p>
                  </div>
                </div>

                {/* 공유 기능 */}
                <div className="share-section">
                  <h3 className="panel-title">공유하기</h3>
                  <div className="share-buttons">
                    <button id="share-copy-btn" className="btn btn-share">📋 내 신 공유하기</button>
                    <button id="share-twitter-btn" className="btn btn-twitter">𝕏 X에 공유하기</button>
                    <button id="share-link-btn" className="btn btn-link">🔗 같은 신 링크 복사</button>
                    <button id="share-image-btn" className="btn btn-image">💾 이미지 저장</button>
                    <button id="share-kakao-btn" className="btn btn-kakao">💛 카카오톡 공유</button>
                    <button id="share-instagram-btn" className="btn btn-instagram">📷 인스타그램 공유</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 신의 초상화 (이벤트 로그 대체) */}
          <div className="side-panel right-panel">
            <div className="god-portrait-frame">
              <div className="god-portrait-inner">
                <div className="god-portrait-emoji" id="portrait-god-emoji">✨</div>
                <div className="god-portrait-name" id="portrait-god-name" />
                <div className="god-portrait-rank" id="portrait-god-rank" />
                <div className="god-portrait-stage" id="portrait-god-stage" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== 엔딩 화면 ====== */}
      <div id="ending-screen" className="screen">
        <div className="ending-container">
          <h1 className="ending-title">🌟 유일신 등극 🌟</h1>
          <p className="ending-subtitle">
            당신은 존재하는 모든 지성체의 유일한 신이 되었습니다.
          </p>
          <div className="ending-stats">
            <p>최종 신도 수: <span id="ending-followers" />명</p>
            <p>누적 믿음: <span id="ending-total-faith" /></p>
          </div>
          <div className="ending-buttons">
            <button id="ending-continue-btn" className="btn btn-primary">계속 플레이</button>
            <button id="ending-share-btn" className="btn btn-share">결과 공유하기</button>
            <button id="ending-new-game-btn" className="btn btn-gold">새 게임 시작</button>
          </div>
        </div>
      </div>

      {/* 진화 연출 모달 */}
      <div id="evolution-modal" className="evolution-modal hidden">
        <div className="evolution-modal-content">
          <div className="evolution-stars" />
          <div className="evolution-emoji" id="evolution-emoji">✨</div>
          <h2 className="evolution-title">✨ 신의 이름이 진화했습니다! ✨</h2>
          <p className="evolution-old-name" id="evolution-old-name" />
          <div className="evolution-arrow">▼</div>
          <p className="evolution-new-name" id="evolution-new-name" />
          <button id="evolution-close-btn" className="btn btn-gold">확인</button>
        </div>
      </div>

      {/* 토스트 */}
      <div id="toast" className="toast hidden" />

      {/* 게임 스크립트 로드 (클라이언트 마운트 후) */}
      <ScriptLoader />
    </>
  );
}

/**
 * 스크립트 로더 컴포넌트
 * useEffect를 사용해 클라이언트에서만 스크립트를 동적 로드한다.
 * 스크립트 로드 완료 후 initGame 함수를 명시적으로 호출한다.
 */
function ScriptLoader() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/script.js";
    script.async = false;

    script.onload = () => {
      if (typeof window.initGame === "function") {
        window.initGame();
      } else {
        console.error("initGame 함수를 찾을 수 없습니다.");
      }
    };

    script.onerror = () => {
      console.error("스크립트 로드 실패: /script.js");
    };

    document.body.appendChild(script);

    return () => {};
  }, []);

  return null;
}