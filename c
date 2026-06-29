/* ============================================
   우리 동네 신 키우기 v6.0 - 밝은 초원 테마
   Forager 영감: 밝고 따뜻하고 평화로운 판타지
   ============================================ */

/* ------ 전체 초기화 ------ */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', 'Malgun Gothic', '맑은 고딕', sans-serif;
    background: linear-gradient(180deg, #87CEEB 0%, #B0E0E6 30%, #98D982 60%, #7CCD7C 100%);
    color: #4a3728;
    min-height: 100vh;
    overflow-x: hidden;
}

/* ------ 화면 전환 ------ */
.screen {
    display: none;
    width: 100%;
    min-height: 100vh;
}

.screen.active {
    display: flex;
    flex-direction: column;
}

.hidden {
    display: none !important;
}

/* 로딩 화면 */
.loading-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(180deg, #87CEEB 0%, #98D982 100%);
    color: #8B7355;
}

/* ============================================
   시작 화면
   ============================================ */
#start-screen {
    justify-content: center;
    align-items: center;
    background: linear-gradient(180deg, #87CEEB 0%, #B0E0E6 20%, #98D982 50%, #7CCD7C 100%);
}

.start-container {
    text-align: center;
    padding: 40px;
    max-width: 600px;
}

.game-title {
    font-size: 3rem;
    background: linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(255, 215, 0, 0.2);
    margin-bottom: 15px;
    animation: titleGlow 2s ease-in-out infinite alternate;
}

@keyframes titleGlow {
    from { filter: brightness(1); }
    to { filter: brightness(1.2); }
}

.subtitle {
    font-size: 1rem;
    color: #6B5344;
    margin-bottom: 40px;
}

.god-info {
    background: rgba(255, 248, 240, 0.92);
    border: 2px solid #D4A868;
    border-radius: 20px;
    padding: 25px;
    margin: 20px 0;
    box-shadow: 0 4px 15px rgba(139, 115, 85, 0.2);
}

.god-name-display { margin-bottom: 15px; }

.god-name {
    font-size: 1.3rem;
    color: #B8860B;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(184, 134, 11, 0.2);
    line-height: 1.4;
    word-break: keep-all;
}

.god-detail {
    font-size: 0.95rem;
    color: #8B7355;
    margin: 5px 0;
}

/* ============================================
   버튼
   ============================================ */
.btn {
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin: 5px;
    box-shadow: 0 3px 6px rgba(139, 115, 85, 0.2);
}

.btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(139, 115, 85, 0.3);
}

.btn:disabled, .btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.btn-primary {
    background: linear-gradient(180deg, #6BB6FF 0%, #4A9FE0 100%);
    color: white;
    font-size: 1.2rem;
    padding: 15px 35px;
    box-shadow: 0 3px 8px rgba(74, 159, 224, 0.3);
}

.btn-gold {
    background: linear-gradient(180deg, #FFD700 0%, #FFA500 100%);
    color: #4a3728;
    font-size: 1.2rem;
    padding: 15px 35px;
    box-shadow: 0 3px 8px rgba(255, 165, 0, 0.3);
}

.btn-danger {
    background: linear-gradient(180deg, #E8826B 0%, #D46850 100%);
    color: white;
    font-size: 0.8rem;
    padding: 6px 12px;
}

.btn-share {
    background: linear-gradient(180deg, #6BB6FF 0%, #4A9FE0 100%);
    color: white; font-size: 0.8rem; padding: 8px 12px; width: 100%; margin: 3px 0;
}

.btn-twitter {
    background: linear-gradient(180deg, #555555 0%, #333333 100%);
    color: white; font-size: 0.8rem; padding: 8px 12px; width: 100%; margin: 3px 0;
}

.btn-link {
    background: linear-gradient(180deg, #6BBF6B 0%, #4A9F4A 100%);
    color: white; font-size: 0.8rem; padding: 8px 12px; width: 100%; margin: 3px 0;
}

.btn-image {
    background: linear-gradient(180deg, #D4A868 0%, #B8860B 100%);
    color: white; font-size: 0.8rem; padding: 8px 12px; width: 100%; margin: 3px 0;
}

.btn-kakao {
    background: linear-gradient(180deg, #FEE500 0%, #FFD600 100%);
    color: #3c1e1e; font-size: 0.8rem; padding: 8px 12px; width: 100%; margin: 3px 0; font-weight: bold;
}

.btn-instagram {
    background: linear-gradient(180deg, #E8826B 0%, #D4506B 50%, #D4A868 100%);
    color: white; font-size: 0.8rem; padding: 8px 12px; width: 100%; margin: 3px 0;
}

.btn-upgrade-small {
    background: linear-gradient(180deg, #D4A868 0%, #B8860B 100%);
    color: white; padding: 8px 16px; font-size: 0.85rem; border-radius: 8px;
}

/* ============================================
   게임 화면
   ============================================ */
#game-screen { height: 100vh; }

/* ------ 상단 상태창 ------ */
.status-bar {
    display: flex; flex-wrap: wrap; gap: 8px;
    padding: 8px 12px;
    background: rgba(255, 248, 240, 0.95);
    border-bottom: 2px solid #D4A868;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 8px rgba(139, 115, 85, 0.15);
}

.status-card {
    background: rgba(255, 252, 248, 0.9);
    border: 1px solid #E8D5B8;
    border-radius: 12px;
    padding: 6px 12px;
    min-width: 100px;
    text-align: center;
    display: flex; flex-direction: column; align-items: center;
    box-shadow: 0 1px 3px rgba(139, 115, 85, 0.1);
}

.status-label {
    font-size: 0.65rem; color: #A0856B; text-transform: uppercase; letter-spacing: 1px;
}

.status-value {
    font-size: 0.85rem; color: #B8860B; font-weight: bold; margin-top: 2px; word-break: keep-all;
}

.god-name-small { font-size: 0.7rem; color: #8B6914; }
.status-sub { font-size: 0.65rem; color: #6BBF6B; margin-top: 2px; }

/* 새 게임 버튼 카드 (우상단) */
.new-game-card {
    background: transparent;
    border: none;
    padding: 0;
    min-width: auto;
}

/* 믿음 수치 확대 */
.faith-card {
    min-width: 140px;
    background: rgba(255, 250, 235, 0.95);
    border: 2px solid #FFD700;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
}

.faith-value {
    font-size: 1.3rem;
    color: #B8860B;
    text-shadow: 0 1px 2px rgba(184, 134, 11, 0.2);
}

.faith-sub {
    font-size: 0.75rem;
    color: #6BBF6B;
    font-weight: bold;
}

/* ============================================
   신 비주얼 영역
   ============================================ */
.god-display-area {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding: 8px;
    background: rgba(255, 248, 240, 0.85);
    border-bottom: 1px solid #E8D5B8;
}

.god-emoji {
    font-size: 2.5rem;
    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
    animation: godPulse 3s ease-in-out infinite;
}

@keyframes godPulse {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.4)); }
    50% { filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.7)); }
}

.god-info-text {
    display: flex;
    flex-direction: column;
}

.god-display-name {
    font-size: 0.9rem;
    color: #B8860B;
    font-weight: bold;
}

.god-evolution-text {
    font-size: 0.75rem;
    color: #A0856B;
}

/* ============================================
   스테이지 진행도 바
   ============================================ */
.stage-progress-container {
    padding: 6px 20px;
    background: rgba(255, 248, 240, 0.85);
    display: flex;
    align-items: center;
    gap: 10px;
}

.stage-progress-bg {
    flex: 1;
    height: 10px;
    background: rgba(232, 213, 184, 0.6);
    border-radius: 5px;
    overflow: hidden;
}

.stage-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #FFD700, #FFA500);
    border-radius: 5px;
    transition: width 0.5s ease;
    box-shadow: 0 0 6px rgba(255, 215, 0, 0.4);
}

.stage-progress-text {
    font-size: 0.7rem;
    color: #8B7355;
    white-space: nowrap;
}

/* ============================================
   탭 메뉴
   ============================================ */
.tab-menu {
    display: flex;
    background: rgba(255, 248, 240, 0.95);
    border-bottom: 2px solid #D4A868;
    padding: 0 10px;
}

.tab-btn {
    flex: 1;
    max-width: 200px;
    padding: 10px 20px;
    background: transparent;
    border: none;
    color: #A0856B;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.2s ease;
}

.tab-btn:hover {
    color: #8B6914;
}

.tab-btn.active {
    color: #B8860B;
    border-bottom-color: #FFD700;
}

/* ============================================
   메인 영역
   ============================================ */
.main-area {
    flex: 1;
    display: flex;
    overflow: hidden;
    min-height: 0;
}

.side-panel {
    width: 220px;
    padding: 12px;
    background: rgba(255, 248, 240, 0.92);
    overflow-y: auto;
    flex-shrink: 0;
}

.right-panel { border-left: 2px solid #E8D5B8; }

.panel-title {
    font-size: 0.85rem;
    color: #8B7355;
    margin-bottom: 8px;
    text-align: center;
    border-bottom: 1px solid #E8D5B8;
    padding-bottom: 6px;
}

/* ============================================
   신의 초상화 (강화된 존재감)
   ============================================ */
.god-portrait-frame {
    background: linear-gradient(135deg, rgba(255, 250, 235, 0.95), rgba(255, 240, 215, 0.95));
    border: 3px solid #D4A868;
    border-radius: 20px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(139, 115, 85, 0.2), inset 0 0 10px rgba(255, 215, 0, 0.1);
    position: relative;
}

.god-portrait-frame::before {
    content: "";
    position: absolute;
    top: -2px; left: -2px; right: -2px; bottom: -2px;
    border: 2px solid rgba(255, 215, 0, 0.4);
    border-radius: 20px;
    pointer-events: none;
}

/* 후광 효과 */
.god-portrait-frame::after {
    content: "";
    position: absolute;
    top: 15px; left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%);
    pointer-events: none;
    animation: haloPulse 3s ease-in-out infinite;
}

@keyframes haloPulse {
    0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
    50% { opacity: 0.8; transform: translateX(-50%) scale(1.1); }
}

.god-portrait-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
}

.god-portrait-emoji {
    font-size: 4rem;
    filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.5));
    animation: godPulse 3s ease-in-out infinite;
    line-height: 1.2;
}

.god-portrait-name {
    font-size: 0.85rem;
    color: #B8860B;
    font-weight: bold;
    word-break: keep-all;
    line-height: 1.3;
}

.god-portrait-rank {
    font-size: 0.75rem;
    color: #8B7355;
    padding: 3px 10px;
    background: rgba(255, 215, 0, 0.15);
    border-radius: 10px;
    border: 1px solid rgba(212, 168, 104, 0.4);
}

.god-portrait-stage {
    font-size: 0.7rem;
    color: #A0856B;
}

/* ============================================
   정보 탭
   ============================================ */
.info-header {
    padding: 15px 20px;
    text-align: center;
    background: rgba(255, 248, 240, 0.9);
    border-bottom: 1px solid #E8D5B8;
}

.info-title {
    font-size: 1.3rem;
    color: #B8860B;
}

.info-content {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

/* ------ 공유 카드 ------ */
.share-card {
    background: rgba(255, 252, 248, 0.92);
    border: 1px solid #E8D5B8;
    border-radius: 15px;
    padding: 12px;
    margin-bottom: 0;
    width: 100%;
    max-width: 350px;
    box-shadow: 0 2px 8px rgba(139, 115, 85, 0.1);
}

.share-card-content { text-align: center; }
.share-card-label { font-size: 0.75rem; color: #A0856B; margin-bottom: 4px; }

.share-card-god-name {
    font-size: 0.9rem; color: #B8860B; font-weight: bold;
    margin-bottom: 8px; min-height: 35px; line-height: 1.3; word-break: keep-all;
}

.share-card-stats {
    text-align: left; font-size: 0.75rem; color: #6B5344; margin-bottom: 8px;
}

.share-card-stats p { margin: 2px 0; }
.share-card-hashtag { font-size: 0.65rem; color: #D4A868; font-style: italic; }

/* ------ 게임 정보 섹션 ------ */
.game-info-section {
    background: rgba(255, 252, 248, 0.92);
    border: 1px solid #E8D5B8;
    border-radius: 15px;
    padding: 12px;
    width: 100%;
    max-width: 350px;
    box-shadow: 0 2px 8px rgba(139, 115, 85, 0.1);
}

.game-info-content {
    font-size: 0.8rem;
    color: #6B5344;
    line-height: 1.8;
}

.game-info-content p {
    margin: 4px 0;
}

/* ------ 공유 섹션 ------ */
.share-section {
    background: rgba(255, 252, 248, 0.92);
    border: 1px solid #E8D5B8;
    border-radius: 15px;
    padding: 12px;
    width: 100%;
    max-width: 350px;
    box-shadow: 0 2px 8px rgba(139, 115, 85, 0.1);
}

.share-buttons { margin-top: 8px; }

/* ------ 콘텐츠 영역 ------ */
.content-area {
    flex: 1;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.view-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* ============================================
   플레이 영역 - 밝은 초원 배경
   ============================================ */
.play-area {
    flex: 1;
    position: relative;
    background: 
        repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 39px,
            rgba(124, 205, 124, 0.15) 39px,
            rgba(124, 205, 124, 0.15) 40px
        ),
        repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 39px,
            rgba(124, 205, 124, 0.15) 39px,
            rgba(124, 205, 124, 0.15) 40px
        ),
        linear-gradient(180deg, #A8D982 0%, #98D982 30%, #88CC72 60%, #7CCD7C 100%);
    overflow: hidden;
    cursor: crosshair;
    min-height: 300px;
    transition: transform 0.2s ease;
    transform-origin: center center;
}

/* 초원 장식 - 꽃, 돌, 나무 패턴 */
.play-area::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image:
        radial-gradient(circle at 15% 20%, rgba(255, 182, 193, 0.3) 2px, transparent 3px),
        radial-gradient(circle at 35% 60%, rgba(255, 215, 0, 0.2) 2px, transparent 3px),
        radial-gradient(circle at 65% 30%, rgba(255, 182, 193, 0.25) 2px, transparent 3px),
        radial-gradient(circle at 85% 70%, rgba(255, 215, 0, 0.2) 2px, transparent 3px),
        radial-gradient(circle at 25% 85%, rgba(255, 182, 193, 0.2) 2px, transparent 3px),
        radial-gradient(circle at 55% 15%, rgba(255, 215, 0, 0.15) 2px, transparent 3px),
        radial-gradient(circle at 75% 50%, rgba(255, 182, 193, 0.2) 2px, transparent 3px),
        radial-gradient(circle at 10% 75%, rgba(255, 215, 0, 0.15) 2px, transparent 3px);
    background-size: 200px 200px;
    pointer-events: none;
    z-index: 0;
}

/* 초원 장식2 - 작은 돌과 풀 */
.play-area::after {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image:
        radial-gradient(circle at 20% 40%, rgba(139, 115, 85, 0.12) 3px, transparent 4px),
        radial-gradient(circle at 50% 80%, rgba(139, 115, 85, 0.1) 3px, transparent 4px),
        radial-gradient(circle at 80% 25%, rgba(139, 115, 85, 0.12) 3px, transparent 4px),
        radial-gradient(circle at 40% 10%, rgba(139, 115, 85, 0.1) 2px, transparent 3px),
        radial-gradient(circle at 90% 90%, rgba(139, 115, 85, 0.1) 3px, transparent 4px);
    background-size: 250px 250px;
    pointer-events: none;
    z-index: 0;
}

/* ============================================
   사람 캐릭터
   ============================================ */
.person {
    position: absolute;
    width: 28px;
    height: 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: left 0.1s linear, top 0.1s linear;
    cursor: pointer;
    user-select: none;
    z-index: 10;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.15));
}

.person:hover {
    transform: scale(1.15);
    z-index: 20;
}

.hp-bar-bg {
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 26px;
    height: 3px;
    background: rgba(139, 115, 85, 0.3);
    border-radius: 2px;
    overflow: hidden;
}

.hp-bar {
    height: 100%;
    border-radius: 2px;
    transition: width 0.2s ease;
}

.grade-tag {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.5rem;
    font-weight: bold;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.person.hit {
    animation: hitShake 0.15s ease;
}

@keyframes hitShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px) scale(1.1); }
    50% { transform: translateX(2px) scale(1.1); }
    75% { transform: translateX(-1px) scale(1.05); }
}

.person.converting {
    animation: convertAway 0.3s ease forwards;
}

@keyframes convertAway {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.8); opacity: 0; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6)); }
}

/* ============================================
   이펙트 - 부드러운 빛, 금색 파티클
   ============================================ */
.click-effect {
    position: absolute;
    border-radius: 50%;
    border: 2px solid rgba(255, 215, 0, 0.6);
    background: radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%);
    animation: rippleExpand 0.6s ease-out forwards;
    pointer-events: none;
    z-index: 100;
    transform: translate(-50%, -50%);
}

@keyframes rippleExpand {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}

.damage-text {
    position: absolute;
    color: #B8860B;
    font-size: 14px;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
    animation: damageFloat 0.8s ease-out forwards;
    pointer-events: none;
    z-index: 101;
    transform: translate(-50%, 0);
}

.damage-text.crit {
    color: #FF8C00;
    font-size: 20px;
    text-shadow: 0 1px 3px rgba(255, 215, 0, 0.6);
}

.damage-text.chain {
    color: #4A9FE0;
    font-size: 12px;
}

@keyframes damageFloat {
    0% { transform: translate(-50%, 0); opacity: 1; }
    100% { transform: translate(-50%, -35px); opacity: 0; }
}

.convert-effect {
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid;
    animation: convertExplode 0.6s ease-out forwards;
    pointer-events: none;
    z-index: 102;
    transform: translate(-50%, -50%);
}

@keyframes convertExplode {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; }
    100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
}

/* 부드러운 금색 파티클 */
.particle {
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    animation: particleFly 0.7s ease-out forwards;
    pointer-events: none;
    z-index: 103;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 4px rgba(255, 215, 0, 0.5);
}

@keyframes particleFly {
    0% { transform: translate(-50%, -50%); opacity: 1; }
    100% {
        transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy)));
        opacity: 0;
    }
}

.explode-effect {
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid;
    animation: explodeExpand 0.5s ease-out forwards;
    pointer-events: none;
    z-index: 99;
    transform: translate(-50%, -50%);
}

@keyframes explodeExpand {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}

.smite-flash {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(255, 255, 255, 0.25);
    animation: smiteFlash 0.3s ease forwards;
    pointer-events: none;
    z-index: 200;
}

@keyframes smiteFlash {
    0% { opacity: 0.5; }
    100% { opacity: 0; }
}

/* ============================================
   신전 (업그레이드 트리)
   ============================================ */
.temple-header {
    padding: 15px 20px;
    text-align: center;
    background: rgba(255, 248, 240, 0.9);
    border-bottom: 1px solid #E8D5B8;
}

.temple-title {
    font-size: 1.3rem;
    color: #B8860B;
    margin-bottom: 5px;
}

.temple-desc {
    font-size: 0.8rem;
    color: #8B7355;
}

.upgrade-tree-container {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* ============================================
   스킬트리 노드 시각화
   ============================================ */
.skill-tree-wrapper {
    position: relative;
    margin: 0 auto;
    padding: 20px;
}

.skill-branch-header {
    position: absolute;
    font-size: 0.9rem;
    font-weight: bold;
    text-align: center;
    width: 100px;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
    z-index: 5;
}

.skill-node {
    position: absolute;
    width: 90px;
    height: 90px;
    background: rgba(255, 252, 248, 0.92);
    border: 2px solid #E8D5B8;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
    text-align: center;
    box-shadow: 0 2px 6px rgba(139, 115, 85, 0.15);
}

.skill-node:hover {
    border-color: #FFD700;
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
    transform: scale(1.1);
    z-index: 20;
}

.skill-node.learned {
    border-color: #FFD700;
    background: rgba(255, 245, 220, 0.95);
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.25);
}

.skill-node.maxed {
    border-color: #FF8C00;
    background: rgba(255, 240, 215, 0.95);
    box-shadow: 0 2px 10px rgba(255, 140, 0, 0.3);
}

.skill-node.locked {
    opacity: 0.4;
    cursor: not-allowed;
}

.skill-node.available {
    border-color: #6BBF6B;
    box-shadow: 0 2px 10px rgba(107, 191, 107, 0.35);
    animation: availablePulse 2s ease-in-out infinite;
}

@keyframes availablePulse {
    0%, 100% { box-shadow: 0 2px 10px rgba(107, 191, 107, 0.35); }
    50% { box-shadow: 0 2px 16px rgba(107, 191, 107, 0.6); }
}

.skill-node-icon {
    font-size: 1.6rem;
    line-height: 1;
}

.skill-node-name {
    font-size: 0.6rem;
    color: #4a3728;
    margin-top: 2px;
    line-height: 1.1;
    word-break: keep-all;
    font-weight: bold;
}

.skill-node-progress {
    font-size: 0.5rem;
    color: #B8860B;
    margin-top: 1px;
    letter-spacing: -1px;
    line-height: 1;
}

.skill-node-level {
    font-size: 0.55rem;
    color: #B8860B;
    margin-top: 1px;
    font-weight: bold;
}

.skill-node-cost {
    font-size: 0.5rem;
    margin-top: 1px;
    font-weight: bold;
}

.skill-node-cost.can-buy {
    color: #6BBF6B;
}

.skill-node-cost.cant-buy {
    color: #E8826B;
}

.skill-node-maxed {
    font-size: 0.55rem;
    color: #FF8C00;
    font-weight: bold;
    margin-top: 1px;
}

.skill-node-locked {
    font-size: 0.8rem;
    margin-top: 1px;
}

.skill-tooltip {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 252, 248, 0.97);
    border: 1px solid #E8D5B8;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 0.7rem;
    color: #4a3728;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(139, 115, 85, 0.2);
}

.skill-node:hover .skill-tooltip {
    opacity: 1;
}

/* ============================================
   진화 연출 모달
   ============================================ */
.evolution-modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(255, 248, 240, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
}

.evolution-modal-content {
    background: linear-gradient(135deg, rgba(255, 250, 235, 0.97), rgba(255, 240, 215, 0.97));
    border: 3px solid #FFD700;
    border-radius: 20px;
    padding: 40px 50px;
    text-align: center;
    box-shadow: 0 8px 30px rgba(255, 215, 0, 0.3);
    position: relative;
    max-width: 90%;
    animation: evolutionPop 0.5s ease;
}

@keyframes evolutionPop {
    0% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
}

.evolution-stars {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    overflow: hidden;
    pointer-events: none;
    border-radius: 20px;
}

.evolution-star {
    position: absolute;
    font-size: 1.5rem;
    animation: starFloat 2s ease-in-out infinite;
}

@keyframes starFloat {
    0% { transform: translateY(0) scale(0); opacity: 0; }
    50% { transform: translateY(-20px) scale(1); opacity: 1; }
    100% { transform: translateY(-40px) scale(0.5); opacity: 0; }
}

.evolution-emoji {
    font-size: 5rem;
    margin-bottom: 15px;
    animation: emojiBounce 0.6s ease;
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
}

@keyframes emojiBounce {
    0% { transform: scale(0) rotate(-180deg); }
    50% { transform: scale(1.3) rotate(10deg); }
    100% { transform: scale(1) rotate(0); }
}

.evolution-title {
    font-size: 1.5rem;
    color: #B8860B;
    margin-bottom: 20px;
    text-shadow: 0 1px 3px rgba(255, 215, 0, 0.3);
}

.evolution-old-name {
    font-size: 1rem;
    color: #A0856B;
    text-decoration: line-through;
    opacity: 0.7;
}

.evolution-arrow {
    font-size: 1.5rem;
    color: #FFD700;
    margin: 10px 0;
    animation: arrowBounce 1s ease infinite;
}

@keyframes arrowBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(5px); }
}

.evolution-new-name {
    font-size: 1.3rem;
    color: #B8860B;
    font-weight: bold;
    margin-bottom: 25px;
    text-shadow: 0 1px 3px rgba(255, 215, 0, 0.3);
    animation: newNameGlow 1.5s ease-in-out infinite alternate;
}

@keyframes newNameGlow {
    from { text-shadow: 0 1px 3px rgba(255, 215, 0, 0.3); }
    to { text-shadow: 0 1px 6px rgba(255, 215, 0, 0.6); }
}

/* ============================================
   엔딩 화면
   ============================================ */
#ending-screen {
    justify-content: center;
    align-items: center;
    background: linear-gradient(180deg, #87CEEB 0%, #B0E0E6 20%, #98D982 50%, #7CCD7C 100%);
}

.ending-container {
    text-align: center;
    padding: 40px;
    max-width: 500px;
}

.ending-title {
    font-size: 2.5rem;
    color: #B8860B;
    margin-bottom: 15px;
    text-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
    animation: titleGlow 2s ease-in-out infinite alternate;
}

.ending-subtitle {
    font-size: 1.1rem;
    color: #6B5344;
    margin-bottom: 30px;
}

.ending-stats {
    background: rgba(255, 248, 240, 0.92);
    border: 2px solid #D4A868;
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 4px 15px rgba(139, 115, 85, 0.2);
}

.ending-stats p {
    font-size: 1rem;
    color: #4a3728;
    margin: 8px 0;
}

.ending-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
}

/* ============================================
   토스트
   ============================================ */
.toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 250, 235, 0.97);
    border: 2px solid #FFD700;
    border-radius: 12px;
    padding: 12px 25px;
    color: #B8860B;
    font-size: 0.9rem;
    font-weight: bold;
    z-index: 9999;
    animation: toastSlide 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
}

@keyframes toastSlide {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* ============================================
   반응형
   ============================================ */
@media (max-width: 900px) {
    .main-area { flex-direction: column; }

    .side-panel {
        width: 100%;
        max-height: 200px;
        border: none;
        border-bottom: 1px solid #E8D5B8;
    }

    .play-area { min-height: 250px; }

    .status-bar { padding: 4px; gap: 4px; }
    .status-card { min-width: 70px; padding: 4px 6px; }
    .status-label { font-size: 0.55rem; }
    .status-value { font-size: 0.7rem; }
    
    .faith-card { min-width: 100px; }
    .faith-value { font-size: 1rem; }

    .game-title { font-size: 2rem; }
    .subtitle { font-size: 0.8rem; }

    .god-portrait-emoji { font-size: 3rem; }
    .god-portrait-frame { padding: 15px; }
    
    .info-content { padding: 10px; }
    .share-card, .game-info-section, .share-section { max-width: 100%; }
}

@media (max-width: 500px) {
    .god-emoji { font-size: 1.8rem; }
    .god-display-name { font-size: 0.75rem; }
    .god-evolution-text { font-size: 0.65rem; }

    .status-card { min-width: 60px; }
    
    .tab-btn { font-size: 0.85rem; padding: 8px 10px; }

    .evolution-modal-content { padding: 25px 30px; }
    .evolution-title { font-size: 1.2rem; }
    .evolution-emoji { font-size: 4rem; }
    .evolution-new-name { font-size: 1.1rem; }
    
    .new-game-card .btn { font-size: 0.7rem; padding: 4px 8px; }
}