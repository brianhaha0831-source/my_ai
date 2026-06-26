/* ============================================
   우리 동네 신 키우기 - 게임 로직 v4.0
   ============================================
   
   v4.0 업데이트:
   - 게임 시작 시 기본 NPC 배치 (5-8명)
   - 스킬트리 3계열 재구성 (능력치/특수/자원)
   - 지역 계층 구조 (동→구→시→국가→대륙→행성→우주→모든존재)
   - 스킬 노드 UI 개선 (진행도 바, 크기 확대)
   ============================================ */


// ============================================
// 1. 데이터 배열 및 상수
// ============================================

// ============================================
// 지역 계층 구조 데이터 (v4.0)
// ============================================
// 각 시작 지역은 동 → 구 → 시/도 → 국가 → 대륙 → 행성 → 우주 → 모든존재
// 계층 구조로 관리하여 항상 상위 행정구역으로 확장됨

const AREA_HIERARCHY = [
    // [동, 구, 시/도, 국가, 대륙, 행성, 우주, 모든존재]
    ["서울특별시 구로구 신도림동", "구로구", "서울특별시", "대한민국", "아시아", "지구", "우주", "모든 존재"],
    ["서울특별시 마포구 망원동", "마포구", "서울특별시", "대한민국", "아시아", "지구", "우주", "모든 존재"],
    ["서울특별시 성동구 성수동", "성동구", "서울특별시", "대한민국", "아시아", "지구", "우주", "모든 존재"],
    ["경기도 안양시 평촌동", "안양시", "경기도", "대한민국", "아시아", "지구", "우주", "모든 존재"],
    ["부산광역시 해운대구", "해운대구", "부산광역시", "대한민국", "아시아", "지구", "우주", "모든 존재"],
    ["제주특별자치도 서귀포시", "서귀포시", "제주특별자치도", "대한민국", "아시아", "지구", "우주", "모든 존재"],
    ["전라남도 목포시", "목포시", "전라남도", "대한민국", "아시아", "지구", "우주", "모든 존재"],
    ["경상북도 김천시", "김천시", "경상북도", "대한민국", "아시아", "지구", "우주", "모든 존재"],
    ["대구광역시 수성구", "수성구", "대구광역시", "대한민국", "아시아", "지구", "우주", "모든 존재"],
    ["인천광역시 부평구", "부평구", "인천광역시", "대한민국", "아시아", "지구", "우주", "모든 존재"]
];

// 기존 호환용 (첫 번째 열 = 동 단위)
const AREA_CANDIDATES = AREA_HIERARCHY.map(h => h[0]);

const TARGET_CANDIDATES = [
    "고등학생", "중학생", "취준생", "직장인", "자영업자",
    "대학생", "소개팅 초보자", "야식 참는 사람", "운전면허 응시자", "발표 공포증 보유자"
];

const POWER_CANDIDATES = [
    "기말고사 수학 80점 이상 획득 담당",
    "수행평가 발표 안 떨림 담당",
    "최종면접 합격 담당",
    "소개팅 첫 만남 어색함 방지 담당",
    "야식 참기 성공 담당",
    "운전면허 기능시험 합격 담당",
    "배달앱 리뷰 4.8점 유지 담당",
    "고백 성공 담당",
    "다이어트 3일차 포기 방지 담당",
    "복권 5등 당첨 담당"
];

// --- 사람 등급 시스템 ---

const PERSON_GRADES = [
    { name: "일반", hp: 5, reward: 5, autoFaith: 0.05, spawnWeight: 100, color: "#c0c0c0", emoji: "🧑" },
    { name: "희귀", hp: 20, reward: 30, autoFaith: 0.3, spawnWeight: 30, color: "#4a9eff", emoji: "👨‍🎓" },
    { name: "영웅", hp: 80, reward: 150, autoFaith: 1.5, spawnWeight: 8, color: "#aa44ff", emoji: "👨‍🏫" },
    { name: "전설", hp: 300, reward: 800, autoFaith: 8, spawnWeight: 2, color: "#ffaa00", emoji: "👨‍💼" },
    { name: "신화", hp: 1000, reward: 5000, autoFaith: 50, spawnWeight: 0.3, color: "#ff4444", emoji: "👤" }
];

const PERSON_JOBS = {
    0: ["시민", "학생", "행인", "주부", "배달원", "알바생", "어린이", "노인"],
    1: ["대학생", "직장인", "공무원", "간호사", "개발자", "디자이너"],
    2: ["교수", "의사", "변호사", "사업가", "작가", "예술가"],
    3: ["유명인", "CEO", "정치인", "스타", "발명가"],
    4: ["성인", "현자", "예언자", "구도자"]
};

// --- 스테이지 설정 ---
// v4.0: 스테이지 이름은 동적 생성 (지역 계층 기반)
// targetFaith, maxPeople, spawnInterval, gradeBonus만 관리

const STAGE_CONFIG = [
    { targetFaith: 200, maxPeople: 5, spawnInterval: 2000, gradeBonus: 0 },
    { targetFaith: 1000, maxPeople: 8, spawnInterval: 1800, gradeBonus: 0.5 },
    { targetFaith: 5000, maxPeople: 12, spawnInterval: 1500, gradeBonus: 1.0 },
    { targetFaith: 25000, maxPeople: 18, spawnInterval: 1200, gradeBonus: 1.5 },
    { targetFaith: 100000, maxPeople: 25, spawnInterval: 1000, gradeBonus: 2.0 },
    { targetFaith: 500000, maxPeople: 35, spawnInterval: 800, gradeBonus: 3.0 },
    { targetFaith: 2000000, maxPeople: 45, spawnInterval: 700, gradeBonus: 4.0 },
    { targetFaith: Infinity, maxPeople: 50, spawnInterval: 600, gradeBonus: 5.0 }
];

// 스테이지 배경 (인덱스별)
const STAGE_BACKGROUNDS = [
    "linear-gradient(180deg, #0d0d20 0%, #15102a 50%, #0d0d20 100%)",
    "linear-gradient(180deg, #0d1020 0%, #15152a 50%, #0d1020 100%)",
    "linear-gradient(180deg, #100d20 0%, #1a152a 50%, #100d20 100%)",
    "linear-gradient(180deg, #120d20 0%, #20152a 50%, #120d20 100%)",
    "linear-gradient(180deg, #151020 0%, #251530 50%, #151020 100%)",
    "linear-gradient(180deg, #181025 0%, #2a1540 50%, #181025 100%)",
    "linear-gradient(180deg, #1a1030 0%, #301550 50%, #1a1030 100%)",
    "radial-gradient(ellipse at center, #3a1a5e 0%, #0a0a1a 70%)"
];

// --- 신 진화 단계 ---

const GOD_EVOLUTIONS = [
    { name: "빛의 구체", emoji: "✨", description: "작은 빛의 존재", stageReq: 0 },
    { name: "작은 석상", emoji: "🗿", description: "형태를 갖추기 시작함", stageReq: 1 },
    { name: "천사", emoji: "👼", description: "날개가 돋아남", stageReq: 2 },
    { name: "후광을 가진 신", emoji: "🔆", description: "빛의 후광이 생김", stageReq: 3 },
    { name: "거대한 신", emoji: "🌟", description: "거대한 존재로 성장", stageReq: 4 },
    { name: "우주를 감싼 존재", emoji: "🌌", description: "우주를 품음", stageReq: 5 },
    { name: "형태가 없는 빛", emoji: "⚪", description: "형태를 초월함", stageReq: 6 },
    { name: "유일신", emoji: "♾️", description: "모든 것의 근원", stageReq: 7 }
];

// ============================================
// 스킬 트리 데이터 (v4.0: 3계열 재구성)
// ============================================
// 3개 계열로 분류:
// ① 능력치 계열 (좌측): 공격력 → 공격속도 → 범위 → 치명타 → 치명타 피해
// ② 특수 능력 계열 (중앙): 기적 폭발 → 천벌 → 연쇄 축복 → 예언 → 계시
// ③ 자원 계열 (우측): 소명 → 인연 → 자동 믿음 → 축복 강화 → 광신도 → 성직자
//
// 좌표 체계: x=150(좌), 300(중), 450(우), 600(우측 확장)
//            y=80(최상단)부터 130px 간격

const SKILL_TREE = [
    // === ① 능력치 계열 (좌측: x=150) ===
    { id: "atk_power", name: "기적 공격력", desc: "공격당 데미지 증가", icon: "⚔️", x: 150, y: 80, parent: null, branch: "stat", maxLevel: 20, costBase: 50, costGrowth: 1.5, type: "attack", value: 2 },
    { id: "atk_speed", name: "공격 속도", desc: "초당 공격 횟수 증가", icon: "💨", x: 150, y: 210, parent: "atk_power", branch: "stat", maxLevel: 10, costBase: 300, costGrowth: 1.8, type: "attackSpeed", value: 1 },
    { id: "area_radius", name: "신의 손길", desc: "공격 범위 증가", icon: "🙌", x: 150, y: 340, parent: "atk_speed", branch: "stat", maxLevel: 10, costBase: 100, costGrowth: 1.5, type: "radius", value: 5 },
    { id: "atk_crit", name: "기적 치명타", desc: "일정 확률로 5배 피해", icon: "💥", x: 150, y: 470, parent: "area_radius", branch: "stat", maxLevel: 5, costBase: 800, costGrowth: 2, type: "crit", value: 0.1 },
    { id: "atk_critdmg", name: "치명타 피해", desc: "치명타 배율 증가 (+2배씩)", icon: "💢", x: 150, y: 600, parent: "atk_crit", branch: "stat", maxLevel: 5, costBase: 3000, costGrowth: 2.5, type: "critDmg", value: 2 },

    // === ② 특수 능력 계열 (중앙: x=300) ===
    { id: "area_explode", name: "기적 폭발", desc: "포섭 성공 시 주변 피해", icon: "🎆", x: 300, y: 80, parent: null, branch: "special", maxLevel: 5, costBase: 1000, costGrowth: 2, type: "explode", value: 0.5 },
    { id: "atk_smite", name: "천벌", desc: "일정 확률로 광역 피해", icon: "⚡", x: 300, y: 210, parent: "area_explode", branch: "special", maxLevel: 3, costBase: 3000, costGrowth: 2.5, type: "smite", value: 0.05 },
    { id: "atk_chain", name: "연쇄 축복", desc: "공격이 주변으로 전파", icon: "🔗", x: 300, y: 340, parent: "atk_smite", branch: "special", maxLevel: 5, costBase: 2000, costGrowth: 2, type: "chain", value: 0.3 },
    { id: "auto_prophecy", name: "예언", desc: "일정 시간마다 무작위 피해", icon: "🔮", x: 300, y: 470, parent: "atk_chain", branch: "special", maxLevel: 5, costBase: 2000, costGrowth: 2, type: "prophecy", value: 10 },
    { id: "atk_reveal", name: "계시", desc: "일정 확률로 즉시 포섭", icon: "👁️", x: 300, y: 600, parent: "auto_prophecy", branch: "special", maxLevel: 3, costBase: 5000, costGrowth: 3, type: "reveal", value: 0.02 },

    // === ③ 자원 계열 (우측: x=450~600) ===
    // 스타터 스킬 (소명, 인연)은 가장 앞에 배치
    { id: "sp_spawn", name: "소명", desc: "사람 스폰 속도 증가", icon: "📢", x: 450, y: 80, parent: null, branch: "resource", maxLevel: 10, costBase: 200, costGrowth: 1.5, type: "spawnSpeed", value: 0.1 },
    { id: "sp_rare", name: "인연", desc: "희귀한 사람 등장률 증가", icon: "🍀", x: 600, y: 80, parent: "sp_spawn", branch: "resource", maxLevel: 10, costBase: 500, costGrowth: 1.8, type: "rareBonus", value: 0.1 },
    { id: "auto_faith", name: "축복", desc: "자동 믿음 생산 증가", icon: "🙏", x: 450, y: 210, parent: "sp_spawn", branch: "resource", maxLevel: 20, costBase: 80, costGrowth: 1.5, type: "autoMult", value: 0.2 },
    { id: "auto_pray", name: "기도 강화", desc: "자동 믿음 배율 추가 증가", icon: "📿", x: 450, y: 340, parent: "auto_faith", branch: "resource", maxLevel: 10, costBase: 2000, costGrowth: 2, type: "autoMult", value: 0.5 },
    { id: "auto_zealot", name: "광신도", desc: "신도당 자동 믿음 대폭 증가", icon: "🔥", x: 450, y: 470, parent: "auto_pray", branch: "resource", maxLevel: 5, costBase: 10000, costGrowth: 2.5, type: "autoMult", value: 1.0 },
    { id: "auto_priest", name: "성직자", desc: "모든 자동 믿음 2배", icon: "⛪", x: 450, y: 600, parent: "auto_zealot", branch: "resource", maxLevel: 3, costBase: 50000, costGrowth: 3, type: "autoMult", value: 2.0 },
];

// 기존 호환용
const UPGRADE_TREE = SKILL_TREE;

// 스킬 계열 정보 (UI 표시용)
const SKILL_BRANCHES = [
    { id: "stat", name: "능력치", icon: "⚔️", color: "#ff8844", x: 150 },
    { id: "special", name: "특수 능력", icon: "✨", color: "#aa44ff", x: 300 },
    { id: "resource", name: "자원", icon: "💰", color: "#44ff88", x: 450 }
];

const RANK_NAMES = ["하급 동네신", "동네신", "지역신", "국가신", "대륙신", "인류신", "우주신", "유일신"];

const SAVE_KEY = "ourNeighborhoodGod_v4_saveData";

// --- 공격 속도 설정 ---
const BASE_ATTACK_SPEED = 3; // 초당 공격 횟수

// --- v4.0: 게임 시작 시 기본 NPC 수 ---
const INITIAL_NPC_COUNT = 6;


// ============================================
// 2. Seed 기반 랜덤 함수
// ============================================

function createSeededRandom(seed) {
    let state = seed | 0 || 1;
    return function() {
        state ^= state << 13;
        state ^= state >> 17;
        state ^= state << 5;
        return ((state >>> 0) / 4294967296);
    };
}


// ============================================
// 3. 게임 상태 관리
// ============================================

let currentSeed = 0;
let seededRandom = null;

let gameState = {
    faith: 0,
    totalFaith: 0,
    followers: 0,
    currentFollowers: 0,
    attackPower: 1,
    attackSpeed: BASE_ATTACK_SPEED,
    clickRadius: 30,
    critChance: 0,
    critMult: 5,
    stageIndex: 0,
    godEvolution: 0,
    upgrades: {},
    originalArea: "",
    originalTarget: "",
    originalPower: "",
    originalAreaIndex: 0,  // v4.0: 지역 계층 인덱스
    currentGodName: "",
    currentSkin: "default",
    people: [],
    eventLogs: [],
    isEnding: false,
    currentScreen: "play"
};

// 타이머 ID들
let moveIntervalId = null;
let spawnIntervalId = null;
let autoFaithIntervalId = null;
let saveIntervalId = null;
let prophecyIntervalId = null;

// 자동 연사 공격 관련 변수
let isMouseDown = false;
let mouseClientX = 0;
let mouseClientY = 0;
let attackIntervalId = null;

// 플레이 영역 크기
let playAreaWidth = 0;
let playAreaHeight = 0;


// ============================================
// 4. 사람 시스템 (HP, 등급, 포섭, 화면 밖 스폰)
// ============================================

function getRandomGrade() {
    const stageBonus = STAGE_CONFIG[gameState.stageIndex].gradeBonus;
    const rareBonus = (gameState.upgrades["sp_rare"] || 0) * SKILL_TREE.find(u => u.id === "sp_rare").value;
    const totalBonus = stageBonus + rareBonus;
    
    const weights = PERSON_GRADES.map((g, i) => {
        return g.spawnWeight * (1 + totalBonus * i * 0.5);
    });
    
    const total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    
    for (let i = 0; i < weights.length; i++) {
        rand -= weights[i];
        if (rand <= 0) return i;
    }
    return 0;
}

/**
 * 사람 객체를 생성한다.
 * @param {boolean} fromOutside - true면 화면 밖에서 스폰, false면 화면 안에서 스폰
 */
function createPerson(fromOutside = true) {
    const grade = getRandomGrade();
    const gradeData = PERSON_GRADES[grade];
    const jobs = PERSON_JOBS[grade];
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    
    const w = Math.max(playAreaWidth, 100);
    const h = Math.max(playAreaHeight, 100);
    const centerX = w / 2;
    const centerY = h / 2;
    
    let x, y;
    let isEntering = false;
    
    if (fromOutside) {
        // 화면 밖 가장자리에서 스폰
        const edge = Math.floor(Math.random() * 4);
        const margin = 40;
        
        if (edge === 0) { x = -margin; y = Math.random() * h; }
        else if (edge === 1) { x = w + margin; y = Math.random() * h; }
        else if (edge === 2) { x = Math.random() * w; y = -margin; }
        else { x = Math.random() * w; y = h + margin; }
        
        isEntering = true;
        
        // 중앙 방향으로 이동
        const speed = 0.3 + Math.random() * 0.2;
        const dx = centerX - x;
        const dy = centerY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        return {
            id: Date.now() + Math.random(),
            x, y,
            dx: (dx / dist) * speed,
            dy: (dy / dist) * speed,
            speed: speed,
            isEntering: isEntering,
            grade, gradeName: gradeData.name,
            hp: gradeData.hp, maxHp: gradeData.hp,
            reward: gradeData.reward, autoFaith: gradeData.autoFaith,
            emoji: gradeData.emoji, color: gradeData.color,
            job: job, element: null, hpBarElement: null
        };
    } else {
        // v4.0: 화면 안에서 바로 스폰 (게임 시작용)
        x = Math.random() * (w - 40) + 20;
        y = Math.random() * (h - 40) + 20;
        
        const speed = 0.15 + Math.random() * 0.2;
        const angle = Math.random() * Math.PI * 2;
        
        return {
            id: Date.now() + Math.random(),
            x, y,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            speed: speed,
            isEntering: false,
            grade, gradeName: gradeData.name,
            hp: gradeData.hp, maxHp: gradeData.hp,
            reward: gradeData.reward, autoFaith: gradeData.autoFaith,
            emoji: gradeData.emoji, color: gradeData.color,
            job: job, element: null, hpBarElement: null
        };
    }
}

function addPersonToDOM(person) {
    const playArea = document.getElementById("play-area");
    
    const el = document.createElement("div");
    el.className = "person grade-" + person.grade;
    el.dataset.personId = person.id;
    el.style.left = person.x + "px";
    el.style.top = person.y + "px";
    el.style.borderColor = person.color;
    el.style.boxShadow = `0 0 8px ${person.color}66`;
    el.textContent = person.emoji;
    
    // HP 바
    const hpBarBg = document.createElement("div");
    hpBarBg.className = "hp-bar-bg";
    
    const hpBar = document.createElement("div");
    hpBar.className = "hp-bar";
    hpBar.style.width = "100%";
    hpBar.style.backgroundColor = person.color;
    
    hpBarBg.appendChild(hpBar);
    el.appendChild(hpBarBg);
    
    // 등급 표시
    if (person.grade > 0) {
        const gradeTag = document.createElement("div");
        gradeTag.className = "grade-tag";
        gradeTag.textContent = person.gradeName;
        gradeTag.style.color = person.color;
        el.appendChild(gradeTag);
    }
    
    playArea.appendChild(el);
    person.element = el;
    person.hpBarElement = hpBar;
}

function updatePersonHP(person) {
    if (person.hpBarElement) {
        const percent = Math.max(0, (person.hp / person.maxHp) * 100);
        person.hpBarElement.style.width = percent + "%";
    }
}

function measurePlayArea() {
    const playArea = document.getElementById("play-area");
    if (!playArea) return;
    const rect = playArea.getBoundingClientRect();
    playAreaWidth = rect.width;
    playAreaHeight = rect.height;
}

/**
 * v4.0: 게임 시작 시 기본 NPC를 화면 안에 배치한다.
 */
function spawnInitialPeople() {
    for (let i = 0; i < INITIAL_NPC_COUNT; i++) {
        const person = createPerson(false); // 화면 안에서 스폰
        gameState.people.push(person);
        addPersonToDOM(person);
    }
}

function adjustPeopleCount() {
    const config = STAGE_CONFIG[gameState.stageIndex];
    const target = config.maxPeople;
    const currentCount = gameState.people.length;
    
    if (currentCount < target) {
        // 한 번에 1명씩만 스폰 (자연스러운 등장)
        const person = createPerson(true); // 화면 밖에서 스폰
        gameState.people.push(person);
        addPersonToDOM(person);
    } else if (currentCount > target) {
        const toRemove = gameState.people.splice(target);
        toRemove.forEach(p => {
            if (p.element) p.element.remove();
        });
    }
}

function movePeople() {
    gameState.people.forEach(person => {
        person.x += person.dx;
        person.y += person.dy;
        
        if (person.isEntering) {
            if (person.x > 10 && person.x < playAreaWidth - 30 && person.y > 10 && person.y < playAreaHeight - 30) {
                person.isEntering = false;
                const angle = Math.random() * Math.PI * 2;
                person.dx = Math.cos(angle) * person.speed * 0.5;
                person.dy = Math.sin(angle) * person.speed * 0.5;
            }
        } else {
            const maxX = Math.max(playAreaWidth - 32, 10);
            const maxY = Math.max(playAreaHeight - 32, 10);
            
            if (person.x <= 0 || person.x >= maxX) {
                person.dx *= -1;
                person.x = Math.max(0, Math.min(person.x, maxX));
            }
            if (person.y <= 0 || person.y >= maxY) {
                person.dy *= -1;
                person.y = Math.max(0, Math.min(person.y, maxY));
            }
        }
        
        if (person.element) {
            person.element.style.left = person.x + "px";
            person.element.style.top = person.y + "px";
        }
    });
}

function clearAllPeople() {
    gameState.people.forEach(p => {
        if (p.element) p.element.remove();
    });
    gameState.people = [];
}


// ============================================
// 5. 자동 연사 공격 및 이펙트
// ============================================

function startAutoAttack(clientX, clientY) {
    isMouseDown = true;
    mouseClientX = clientX;
    mouseClientY = clientY;
    
    doAutoAttack();
    
    const intervalMs = 1000 / gameState.attackSpeed;
    if (attackIntervalId) clearInterval(attackIntervalId);
    attackIntervalId = setInterval(doAutoAttack, intervalMs);
}

function stopAutoAttack() {
    isMouseDown = false;
    if (attackIntervalId) {
        clearInterval(attackIntervalId);
        attackIntervalId = null;
    }
}

function doAutoAttack() {
    if (!isMouseDown) return;
    handleClickEmpty(mouseClientX, mouseClientY);
}

function handleAttack(clientX, clientY, targetPerson) {
    const playArea = document.getElementById("play-area");
    const rect = playArea.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;
    
    let damage = gameState.attackPower;
    
    // 치명타 체크
    const critLevel = gameState.upgrades["atk_crit"] || 0;
    let isCrit = false;
    if (critLevel > 0) {
        const critChance = critLevel * SKILL_TREE.find(u => u.id === "atk_crit").value;
        if (Math.random() < critChance) {
            damage *= gameState.critMult;
            isCrit = true;
        }
    }
    
    // 계시 체크 (즉시 포섭)
    const revealLevel = gameState.upgrades["atk_reveal"] || 0;
    let isReveal = false;
    if (revealLevel > 0) {
        const revealChance = revealLevel * SKILL_TREE.find(u => u.id === "atk_reveal").value;
        if (Math.random() < revealChance) {
            damage = targetPerson.hp;
            isReveal = true;
        }
    }
    
    applyDamage(targetPerson, damage, clickX, clickY, isCrit, isReveal);
    
    // v4.0: 연쇄 축복 체크
    const chainLevel = gameState.upgrades["atk_chain"] || 0;
    if (chainLevel > 0) {
        const chainRatio = SKILL_TREE.find(u => u.id === "atk_chain").value;
        const chainDamage = Math.floor(damage * chainRatio * chainLevel);
        const chainRadius = gameState.clickRadius;
        
        gameState.people.forEach(person => {
            if (person.id === targetPerson.id) return;
            const px = person.x + 12;
            const py = person.y + 12;
            const dist = Math.sqrt((clickX - px) ** 2 + (clickY - py) ** 2);
            if (dist <= chainRadius) {
                applyDamage(person, chainDamage, px, py, false, false, true);
            }
        });
    }
    
    // 천벌 체크 (광역 피해)
    const smiteLevel = gameState.upgrades["atk_smite"] || 0;
    if (smiteLevel > 0) {
        const smiteChance = smiteLevel * SKILL_TREE.find(u => u.id === "atk_smite").value;
        if (Math.random() < smiteChance) {
            const smiteDamage = Math.floor(damage * 0.5);
            gameState.people.forEach(person => {
                if (person.id !== targetPerson.id) {
                    applyDamage(person, smiteDamage, person.x + 12, person.y + 12, false, false, true);
                }
            });
            createSmiteEffect();
            addEventLog("⚡ 천벌이 내려쳤습니다!");
        }
    }
    
    createClickEffect(clickX, clickY, gameState.clickRadius);
    shakeScreen();
    updateAllUI();
}

function applyDamage(person, damage, x, y, isCrit, isReveal, isChain) {
    if (!person || person.hp <= 0) return;
    
    person.hp -= damage;
    updatePersonHP(person);
    
    createDamageText(x, y, damage, isCrit, isChain);
    
    if (person.element && !isChain) {
        person.element.classList.remove("hit");
        void person.element.offsetWidth;
        person.element.classList.add("hit");
    }
    
    if (person.hp <= 0) {
        convertPerson(person, isReveal);
    }
}

function convertPerson(person, isReveal) {
    const faithGained = person.reward;
    gameState.faith += faithGained;
    gameState.totalFaith += faithGained;
    gameState.followers++;
    gameState.currentFollowers++;
    
    createConvertEffect(person.x + 12, person.y + 12, person.color);
    
    const prefix = isReveal ? "🌟 계시로 " : "";
    addEventLog(`${prefix}${person.job}(${person.gradeName})이(가) 당신을 믿기 시작했습니다! 믿음 +${faithGained.toLocaleString()}`);
    
    // 기적 폭발 업그레이드 체크
    const explodeLevel = gameState.upgrades["area_explode"] || 0;
    if (explodeLevel > 0) {
        const explodeDamage = Math.floor(person.maxHp * SKILL_TREE.find(u => u.id === "area_explode").value * explodeLevel);
        const explodeRadius = gameState.clickRadius * 1.5;
        const px = person.x + 12;
        const py = person.y + 12;
        
        gameState.people.forEach(other => {
            if (other.id === person.id || other.hp <= 0) return;
            const ox = other.x + 12;
            const oy = other.y + 12;
            const dist = Math.sqrt((px - ox) ** 2 + (py - oy) ** 2);
            if (dist <= explodeRadius) {
                applyDamage(other, explodeDamage, ox, oy, false, false, true);
            }
        });
        
        createExplodeEffect(px, py, person.color);
    }
    
    const idx = gameState.people.indexOf(person);
    if (idx >= 0) {
        gameState.people.splice(idx, 1);
    }
    
    if (person.element) {
        person.element.classList.add("converting");
        setTimeout(() => {
            if (person.element) person.element.remove();
        }, 300);
    }
    
    checkStageProgress();
}

// --- 이펙트 함수들 ---

function createClickEffect(x, y, radius) {
    const playArea = document.getElementById("play-area");
    if (!playArea) return;
    
    const effect = document.createElement("div");
    effect.className = "click-effect";
    const size = radius * 2;
    effect.style.width = size + "px";
    effect.style.height = size + "px";
    effect.style.left = x + "px";
    effect.style.top = y + "px";
    playArea.appendChild(effect);
    setTimeout(() => effect.remove(), 600);
}

function createDamageText(x, y, damage, isCrit, isChain) {
    const playArea = document.getElementById("play-area");
    if (!playArea) return;
    
    const text = document.createElement("div");
    text.className = "damage-text";
    if (isCrit) text.classList.add("crit");
    if (isChain) text.classList.add("chain");
    text.textContent = isCrit ? `${damage}!` : `${damage}`;
    text.style.left = (x + (Math.random() - 0.5) * 20) + "px";
    text.style.top = (y - 5) + "px";
    
    playArea.appendChild(text);
    setTimeout(() => text.remove(), 800);
}

function createConvertEffect(x, y, color) {
    const playArea = document.getElementById("play-area");
    if (!playArea) return;
    
    const explode = document.createElement("div");
    explode.className = "convert-effect";
    explode.style.left = x + "px";
    explode.style.top = y + "px";
    explode.style.borderColor = color;
    playArea.appendChild(explode);
    setTimeout(() => explode.remove(), 600);
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = x + "px";
        particle.style.top = y + "px";
        const angle = (Math.PI * 2 / 8) * i;
        const dist = 40 + Math.random() * 30;
        particle.style.setProperty("--dx", Math.cos(angle) * dist + "px");
        particle.style.setProperty("--dy", Math.sin(angle) * dist + "px");
        particle.style.backgroundColor = i % 2 === 0 ? "#ffd700" : color;
        playArea.appendChild(particle);
        setTimeout(() => particle.remove(), 700);
    }
}

function createExplodeEffect(x, y, color) {
    const playArea = document.getElementById("play-area");
    if (!playArea) return;
    
    const effect = document.createElement("div");
    effect.className = "explode-effect";
    effect.style.left = x + "px";
    effect.style.top = y + "px";
    effect.style.borderColor = color;
    playArea.appendChild(effect);
    setTimeout(() => effect.remove(), 500);
}

function createSmiteEffect() {
    const playArea = document.getElementById("play-area");
    if (!playArea) return;
    
    const flash = document.createElement("div");
    flash.className = "smite-flash";
    playArea.appendChild(flash);
    setTimeout(() => flash.remove(), 300);
}

function shakeScreen() {
    const playArea = document.getElementById("play-area");
    if (playArea) {
        playArea.classList.remove("shake");
        void playArea.offsetWidth;
        playArea.classList.add("shake");
        setTimeout(() => playArea.classList.remove("shake"), 200);
    }
}


// ============================================
// 6. 스킬트리 (신전, 좌표 기반)
// ============================================

function getUpgradeCost(upgradeId) {
    const upgrade = SKILL_TREE.find(u => u.id === upgradeId);
    if (!upgrade) return Infinity;
    
    const currentLevel = gameState.upgrades[upgradeId] || 0;
    if (currentLevel >= upgrade.maxLevel) return Infinity;
    
    return Math.floor(upgrade.costBase * Math.pow(upgrade.costGrowth, currentLevel));
}

function canBuyUpgrade(upgradeId) {
    const upgrade = SKILL_TREE.find(u => u.id === upgradeId);
    if (!upgrade) return false;
    
    const currentLevel = gameState.upgrades[upgradeId] || 0;
    if (currentLevel >= upgrade.maxLevel) return false;
    
    if (upgrade.parent) {
        const parentLevel = gameState.upgrades[upgrade.parent] || 0;
        if (parentLevel < 1) return false;
    }
    
    const cost = getUpgradeCost(upgradeId);
    return gameState.faith >= cost;
}

function buyUpgrade(upgradeId) {
    if (!canBuyUpgrade(upgradeId)) return;
    
    const upgrade = SKILL_TREE.find(u => u.id === upgradeId);
    const cost = getUpgradeCost(upgradeId);
    
    gameState.faith -= cost;
    gameState.upgrades[upgradeId] = (gameState.upgrades[upgradeId] || 0) + 1;
    
    applyUpgradeEffects();
    
    addEventLog(`✨ ${upgrade.name}이(가) 강화되었습니다. (Lv.${gameState.upgrades[upgradeId]})`);
    
    updateAllUI();
}

function applyUpgradeEffects() {
    // 공격력
    const atkPowerLv = gameState.upgrades["atk_power"] || 0;
    const atkPowerUpgrade = SKILL_TREE.find(u => u.id === "atk_power");
    gameState.attackPower = 1 + atkPowerLv * atkPowerUpgrade.value;
    
    // 공격 속도
    const atkSpeedLv = gameState.upgrades["atk_speed"] || 0;
    const atkSpeedUpgrade = SKILL_TREE.find(u => u.id === "atk_speed");
    gameState.attackSpeed = BASE_ATTACK_SPEED + atkSpeedLv * atkSpeedUpgrade.value;
    
    // 클릭 범위
    const radiusLv = gameState.upgrades["area_radius"] || 0;
    const radiusUpgrade = SKILL_TREE.find(u => u.id === "area_radius");
    gameState.clickRadius = 30 + radiusLv * radiusUpgrade.value;
    
    // 치명타 확률
    const critLv = gameState.upgrades["atk_crit"] || 0;
    gameState.critChance = critLv * SKILL_TREE.find(u => u.id === "atk_crit").value;
    
    // 치명타 배율
    const critDmgLv = gameState.upgrades["atk_critdmg"] || 0;
    gameState.critMult = 5 + critDmgLv * SKILL_TREE.find(u => u.id === "atk_critdmg").value;
    
    updateGodName();
}


// ============================================
// 7. 스테이지 시스템 (v4.0: 지역 계층 기반)
// ============================================

/**
 * v4.0: 현재 스테이지의 지역명을 계층 구조에서 가져온다.
 */
function getStageAreaName(stageIndex) {
    const hierarchy = AREA_HIERARCHY[gameState.originalAreaIndex];
    if (!hierarchy) return "알 수 없음";
    
    // stageIndex가 계층 길이를 넘으면 마지막 값 사용
    const idx = Math.min(stageIndex, hierarchy.length - 1);
    return hierarchy[idx];
}

/**
 * v4.0: 현재 스테이지의 설정을 가져온다.
 */
function getStageConfig(stageIndex) {
    return STAGE_CONFIG[Math.min(stageIndex, STAGE_CONFIG.length - 1)];
}

function checkStageProgress() {
    const config = getStageConfig(gameState.stageIndex);
    
    if (gameState.totalFaith >= config.targetFaith && gameState.stageIndex < STAGE_CONFIG.length - 1) {
        gameState.stageIndex++;
        updateGodEvolution();
        applyStageBackground();
        adjustPeopleCount();
        restartSpawnTimer();
        
        const areaName = getStageAreaName(gameState.stageIndex);
        addEventLog(`🗺️ 영역이 "${areaName}"(으)로 확장되었습니다!`);
        updateGodName();
        
        if (gameState.stageIndex >= STAGE_CONFIG.length - 1) {
            checkEnding();
        }
    }
}

function updateGodEvolution() {
    for (let i = GOD_EVOLUTIONS.length - 1; i >= 0; i--) {
        if (gameState.stageIndex >= GOD_EVOLUTIONS[i].stageReq) {
            gameState.godEvolution = i;
            break;
        }
    }
}

function applyStageBackground() {
    const bgIndex = Math.min(gameState.stageIndex, STAGE_BACKGROUNDS.length - 1);
    const playArea = document.getElementById("play-area");
    if (playArea) {
        playArea.style.background = STAGE_BACKGROUNDS[bgIndex];
    }
}

function restartSpawnTimer() {
    if (spawnIntervalId) clearInterval(spawnIntervalId);
    
    const config = getStageConfig(gameState.stageIndex);
    let interval = config.spawnInterval;
    
    const spawnSpeedLv = gameState.upgrades["sp_spawn"] || 0;
    if (spawnSpeedLv > 0) {
        const speedBonus = SKILL_TREE.find(u => u.id === "sp_spawn").value * spawnSpeedLv;
        interval = Math.max(300, interval / (1 + speedBonus));
    }
    
    spawnIntervalId = setInterval(() => {
        adjustPeopleCount();
    }, interval);
}


// ============================================
// 8. 신 비주얼 시스템
// ============================================

function updateGodVisual() {
    const evolution = GOD_EVOLUTIONS[gameState.godEvolution];
    const godEmoji = document.getElementById("god-emoji");
    const godName = document.getElementById("god-evolution-name");
    
    if (godEmoji) godEmoji.textContent = evolution.emoji;
    if (godName) godName.textContent = evolution.name;
}


// ============================================
// 9. 신 이름 생성 및 갱신 (v4.0: 계층 기반)
// ============================================

function generateGodName() {
    seededRandom = createSeededRandom(currentSeed);
    const areaIndex = Math.floor(seededRandom() * AREA_CANDIDATES.length);
    const area = AREA_CANDIDATES[areaIndex];
    const target = TARGET_CANDIDATES[Math.floor(seededRandom() * TARGET_CANDIDATES.length)];
    const power = POWER_CANDIDATES[Math.floor(seededRandom() * POWER_CANDIDATES.length)];
    
    gameState.originalArea = area;
    gameState.originalAreaIndex = areaIndex;  // v4.0: 계층 인덱스 저장
    gameState.originalTarget = target;
    gameState.originalPower = power;
    gameState.currentGodName = `${area} ${target} ${power}의 신`;
}

function updateGodName() {
    const stage = gameState.stageIndex;
    const evo = gameState.godEvolution;
    
    // 최종 단계: 유일신
    if (stage >= 7 && evo >= 7) {
        gameState.currentGodName = "유일신";
        return;
    }
    
    // v4.0: 계층 구조에서 지역명 가져오기
    const areaName = getStageAreaName(stage);
    
    // 진화별 권능명
    const powerNames = ["작은 기적", "축복", "기적", "성공", "운명", "인과율", "초월", "유일"];
    const powerName = powerNames[Math.min(evo, powerNames.length - 1)];
    
    gameState.currentGodName = `${areaName} ${powerName}의 신`;
}

function getRankName() {
    const stage = gameState.stageIndex;
    if (stage >= RANK_NAMES.length - 1) return RANK_NAMES[RANK_NAMES.length - 1];
    return RANK_NAMES[Math.min(stage, RANK_NAMES.length - 1)];
}


// ============================================
// 10. 자동 믿음 생산
// ============================================

function produceAutoFaith() {
    let autoMult = 1;
    const autoUpgrades = ["auto_faith", "auto_pray", "auto_zealot", "auto_priest"];
    autoUpgrades.forEach(id => {
        const lv = gameState.upgrades[id] || 0;
        if (lv > 0) {
            const upgrade = SKILL_TREE.find(u => u.id === id);
            if (id === "auto_priest") {
                autoMult *= (1 + lv * upgrade.value);
            } else {
                autoMult += lv * upgrade.value;
            }
        }
    });
    
    const baseAuto = gameState.currentFollowers * 0.1 * autoMult;
    
    if (baseAuto > 0) {
        gameState.faith += baseAuto;
        gameState.totalFaith += baseAuto;
    }
    
    updateAllUI();
}

function prophecyAttack() {
    const prophecyLevel = gameState.upgrades["auto_prophecy"] || 0;
    if (prophecyLevel === 0) return;
    if (gameState.people.length === 0) return;
    
    const damage = prophecyLevel * SKILL_TREE.find(u => u.id === "auto_prophecy").value;
    
    const count = Math.min(gameState.people.length, 1 + Math.floor(prophecyLevel / 2));
    for (let i = 0; i < count; i++) {
        if (gameState.people.length === 0) break;
        const idx = Math.floor(Math.random() * gameState.people.length);
        const person = gameState.people[idx];
        applyDamage(person, damage, person.x + 12, person.y + 12, false, false, true);
    }
}


// ============================================
// 11. 이벤트 로그, 엔딩
// ============================================

function addEventLog(message) {
    gameState.eventLogs.unshift(message);
    if (gameState.eventLogs.length > 5) {
        gameState.eventLogs = gameState.eventLogs.slice(0, 5);
    }
    updateEventLogUI();
}

function checkEnding() {
    if (gameState.stageIndex >= STAGE_CONFIG.length - 1 && gameState.godEvolution >= 7) {
        gameState.isEnding = true;
        showEndingScreen();
    }
}

function showEndingScreen() {
    stopGameLoops();
    document.getElementById("ending-followers").textContent = gameState.followers.toLocaleString();
    document.getElementById("ending-total-faith").textContent = Math.floor(gameState.totalFaith).toLocaleString();
    showScreen("ending-screen");
}


// ============================================
// 12. 화면 전환 (플레이 ↔ 신전)
// ============================================

function switchScreen(screenName) {
    gameState.currentScreen = screenName;
    
    const playScreen = document.getElementById("play-view");
    const templeScreen = document.getElementById("temple-view");
    const tabPlay = document.getElementById("tab-play");
    const tabTemple = document.getElementById("tab-temple");
    
    if (screenName === "temple") {
        playScreen.classList.add("hidden");
        templeScreen.classList.remove("hidden");
        tabPlay.classList.remove("active");
        tabTemple.classList.add("active");
        renderSkillTree();
    } else {
        templeScreen.classList.add("hidden");
        playScreen.classList.remove("hidden");
        tabTemple.classList.remove("active");
        tabPlay.classList.add("active");
    }
}

/**
 * v4.0: 스킬트리를 시각적으로 렌더링한다.
 * 3계열로 분류되며, 노드 크기가 크고 진행도 바가 표시된다.
 */
function renderSkillTree() {
    const container = document.getElementById("upgrade-tree-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    // 트리 전체 크기 계산
    const maxX = Math.max(...SKILL_TREE.map(s => s.x)) + 100;
    const maxY = Math.max(...SKILL_TREE.map(s => s.y)) + 100;
    
    // 스크롤 가능한 컨테이너
    const treeWrapper = document.createElement("div");
    treeWrapper.className = "skill-tree-wrapper";
    treeWrapper.style.width = maxX + "px";
    treeWrapper.style.height = maxY + "px";
    treeWrapper.style.position = "relative";
    
    // v4.0: 계열 헤더 추가
    SKILL_BRANCHES.forEach(branch => {
        const header = document.createElement("div");
        header.className = "skill-branch-header";
        header.style.left = (branch.x - 50) + "px";
        header.style.top = "10px";
        header.style.color = branch.color;
        header.innerHTML = `${branch.icon} ${branch.name}`;
        treeWrapper.appendChild(header);
    });
    
    // SVG로 연결선 그리기
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", maxX);
    svg.setAttribute("height", maxY);
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.pointerEvents = "none";
    
    SKILL_TREE.forEach(node => {
        if (node.parent) {
            const parent = SKILL_TREE.find(s => s.id === node.parent);
            if (parent) {
                const parentLevel = gameState.upgrades[parent.id] || 0;
                const isUnlocked = parentLevel >= 1;
                
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", parent.x);
                line.setAttribute("y1", parent.y);
                line.setAttribute("x2", node.x);
                line.setAttribute("y2", node.y);
                line.setAttribute("stroke", isUnlocked ? "#ffd700" : "#3a2a5a");
                line.setAttribute("stroke-width", isUnlocked ? "3" : "2");
                line.setAttribute("stroke-dasharray", isUnlocked ? "none" : "5,5");
                line.setAttribute("opacity", isUnlocked ? "0.8" : "0.4");
                svg.appendChild(line);
            }
        }
    });
    
    treeWrapper.appendChild(svg);
    
    // 노드들 생성
    SKILL_TREE.forEach(node => {
        const level = gameState.upgrades[node.id] || 0;
        const maxed = level >= node.maxLevel;
        const cost = getUpgradeCost(node.id);
        const canBuy = canBuyUpgrade(node.id);
        const parentMet = !node.parent || (gameState.upgrades[node.parent] || 0) >= 1;
        
        const nodeDiv = document.createElement("div");
        nodeDiv.className = "skill-node";
        if (maxed) nodeDiv.classList.add("maxed");
        if (!parentMet) nodeDiv.classList.add("locked");
        if (level > 0) nodeDiv.classList.add("learned");
        if (canBuy) nodeDiv.classList.add("available");
        
        // v4.0: 노드 위치 (중심 기준)
        nodeDiv.style.left = (node.x - 45) + "px";
        nodeDiv.style.top = (node.y - 45) + "px";
        
        // v4.0: 진행도 바 생성 (■■■□□ 형태)
        let progressBars = "";
        const filledCount = level;
        const emptyCount = node.maxLevel - level;
        for (let i = 0; i < filledCount; i++) progressBars += "■";
        for (let i = 0; i < emptyCount; i++) progressBars += "□";
        
        // 최대 레벨이면 모두 채움
        if (maxed) {
            progressBars = "";
            for (let i = 0; i < node.maxLevel; i++) progressBars += "■";
        }
        
        nodeDiv.innerHTML = `
            <div class="skill-node-icon">${node.icon}</div>
            <div class="skill-node-name">${node.name}</div>
            <div class="skill-node-progress">${progressBars}</div>
            <div class="skill-node-level">Lv.${level}/${node.maxLevel}</div>
            ${!parentMet ? `<div class="skill-node-locked">🔒</div>` :
              maxed ? `<div class="skill-node-maxed">MAX</div>` :
              `<div class="skill-node-cost ${canBuy ? "can-buy" : "cant-buy"}">${cost.toLocaleString()}</div>`}
        `;
        
        // 클릭 시 업그레이드
        nodeDiv.addEventListener("click", function() {
            if (canBuy) {
                buyUpgrade(node.id);
                renderSkillTree();
            }
        });
        
        // 툴팁
        const tooltip = document.createElement("div");
        tooltip.className = "skill-tooltip";
        tooltip.innerHTML = `<strong>${node.name}</strong><br>${node.desc}`;
        nodeDiv.appendChild(tooltip);
        
        treeWrapper.appendChild(nodeDiv);
    });
    
    container.appendChild(treeWrapper);
}


// ============================================
// 13. 저장/불러오기
// ============================================

function saveGame() {
    try {
        const saveData = {
            seed: currentSeed,
            faith: gameState.faith,
            totalFaith: gameState.totalFaith,
            followers: gameState.followers,
            currentFollowers: gameState.currentFollowers,
            attackPower: gameState.attackPower,
            attackSpeed: gameState.attackSpeed,
            clickRadius: gameState.clickRadius,
            critChance: gameState.critChance,
            critMult: gameState.critMult,
            stageIndex: gameState.stageIndex,
            godEvolution: gameState.godEvolution,
            upgrades: gameState.upgrades,
            originalArea: gameState.originalArea,
            originalAreaIndex: gameState.originalAreaIndex,
            originalTarget: gameState.originalTarget,
            originalPower: gameState.originalPower,
            currentGodName: gameState.currentGodName,
            currentSkin: gameState.currentSkin,
            eventLogs: gameState.eventLogs,
            isEnding: gameState.isEnding
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    } catch (e) {
        console.warn("저장 실패:", e);
    }
}

function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) return false;
        
        const data = JSON.parse(saved);
        currentSeed = data.seed || Date.now();
        seededRandom = createSeededRandom(currentSeed);
        
        gameState.faith = data.faith || 0;
        gameState.totalFaith = data.totalFaith || 0;
        gameState.followers = data.followers || 0;
        gameState.currentFollowers = data.currentFollowers || 0;
        gameState.attackPower = data.attackPower || 1;
        gameState.attackSpeed = data.attackSpeed || BASE_ATTACK_SPEED;
        gameState.clickRadius = data.clickRadius || 30;
        gameState.critChance = data.critChance || 0;
        gameState.critMult = data.critMult || 5;
        gameState.stageIndex = data.stageIndex || 0;
        gameState.godEvolution = data.godEvolution || 0;
        gameState.upgrades = data.upgrades || {};
        gameState.originalArea = data.originalArea || "";
        gameState.originalAreaIndex = data.originalAreaIndex || 0;
        gameState.originalTarget = data.originalTarget || "";
        gameState.originalPower = data.originalPower || "";
        gameState.currentGodName = data.currentGodName || "";
        gameState.currentSkin = data.currentSkin || "default";
        gameState.eventLogs = data.eventLogs || [];
        gameState.isEnding = data.isEnding || false;
        
        return true;
    } catch (e) {
        console.warn("불러오기 실패:", e);
        return false;
    }
}

function clearSaveData() {
    localStorage.removeItem(SAVE_KEY);
}


// ============================================
// 14. SNS 공유
// ============================================

function shareToClipboard() {
    const text = generateShareText();
    copyToClipboard(text).then(success => {
        if (success) showToast("공유 문구가 복사되었습니다!");
        else showToast("복사에 실패했습니다.");
    });
}

function generateShareText() {
    return `나는 지금
「${gameState.currentGodName}」
으로 시작했다.

현재 영역: ${getStageAreaName(gameState.stageIndex)}
현재 신도: ${gameState.followers.toLocaleString()}명
현재 믿음: ${Math.floor(gameState.faith).toLocaleString()}
등급: ${getRankName()}
신의 형태: ${GOD_EVOLUTIONS[gameState.godEvolution].name}
목표: 유일신

#우리동네신키우기`;
}

async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch (e) {}
    
    try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const result = document.execCommand("copy");
        document.body.removeChild(textarea);
        return result;
    } catch (e) {
        return false;
    }
}

function shareToTwitter() {
    const text = `나는 지금 「${gameState.currentGodName}」으로 시작했다! 영역: ${getStageAreaName(gameState.stageIndex)} #우리동네신키우기`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
}

function shareSeedLink() {
    const url = window.location.origin + window.location.pathname + "?seed=" + currentSeed;
    copyToClipboard(url).then(success => {
        if (success) showToast("링크가 복사되었습니다! 같은 신으로 시작할 수 있습니다.");
        else showToast("링크 복사에 실패했습니다.");
    });
}


// ============================================
// 15. UI 업데이트
// ============================================

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 3000);
}

function updateAllUI() {
    setText("current-god-name", gameState.currentGodName);
    setText("current-rank", getRankName());
    setText("current-faith", Math.floor(gameState.faith).toLocaleString());
    
    // 자동 믿음 배율 계산
    let autoMult = 1;
    const autoUpgrades = ["auto_faith", "auto_pray", "auto_zealot", "auto_priest"];
    autoUpgrades.forEach(id => {
        const lv = gameState.upgrades[id] || 0;
        if (lv > 0) {
            const upgrade = SKILL_TREE.find(u => u.id === id);
            if (id === "auto_priest") {
                autoMult *= (1 + lv * upgrade.value);
            } else {
                autoMult += lv * upgrade.value;
            }
        }
    });
    const fps = gameState.currentFollowers * 0.1 * autoMult;
    setText("faith-per-second", `+${fps.toFixed(1)}/초`);
    
    setText("current-followers", gameState.followers.toLocaleString());
    setText("current-stage", getStageAreaName(gameState.stageIndex));
    setText("current-attack", `${gameState.attackPower}`);
    setText("current-speed", `${gameState.attackSpeed.toFixed(1)}/초`);
    setText("current-radius", `${gameState.clickRadius}px`);
    
    updateGodVisual();
    setText("god-name-display", gameState.currentGodName);
    
    setText("card-god-name", gameState.currentGodName);
    setText("card-followers", gameState.followers.toLocaleString());
    setText("card-faith", Math.floor(gameState.faith).toLocaleString());
    setText("card-rank", getRankName());
    setText("card-stage", getStageAreaName(gameState.stageIndex));
    setText("card-evolution", GOD_EVOLUTIONS[gameState.godEvolution].name);
    
    // 스테이지 진행도
    const config = getStageConfig(gameState.stageIndex);
    const progress = Math.min(100, (gameState.totalFaith / config.targetFaith) * 100);
    const progressBar = document.getElementById("stage-progress-bar");
    if (progressBar) progressBar.style.width = progress + "%";
    setText("stage-progress-text", `${Math.floor(gameState.totalFaith).toLocaleString()} / ${config.targetFaith === Infinity ? "∞" : config.targetFaith.toLocaleString()}`);
    
    updateEventLogUI();
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function updateEventLogUI() {
    const logList = document.getElementById("event-log");
    if (!logList) return;
    logList.innerHTML = "";
    gameState.eventLogs.forEach(msg => {
        const li = document.createElement("li");
        li.textContent = msg;
        logList.appendChild(li);
    });
}


// ============================================
// 16. 게임 시작/종료/화면 전환
// ============================================

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.add("active");
}

function startGameLoops() {
    moveIntervalId = setInterval(movePeople, 50);
    restartSpawnTimer();
    autoFaithIntervalId = setInterval(produceAutoFaith, 1000);
    saveIntervalId = setInterval(saveGame, 5000);
    prophecyIntervalId = setInterval(prophecyAttack, 5000);
}

function stopGameLoops() {
    if (moveIntervalId) clearInterval(moveIntervalId);
    if (spawnIntervalId) clearInterval(spawnIntervalId);
    if (autoFaithIntervalId) clearInterval(autoFaithIntervalId);
    if (saveIntervalId) clearInterval(saveIntervalId);
    if (prophecyIntervalId) clearInterval(prophecyIntervalId);
    stopAutoAttack();
    moveIntervalId = null;
    spawnIntervalId = null;
    autoFaithIntervalId = null;
    saveIntervalId = null;
    prophecyIntervalId = null;
}

function startNewGame() {
    stopGameLoops();
    clearSaveData();
    
    currentSeed = Date.now();
    seededRandom = createSeededRandom(currentSeed);
    
    gameState = {
        faith: 0,
        totalFaith: 0,
        followers: 0,
        currentFollowers: 0,
        attackPower: 1,
        attackSpeed: BASE_ATTACK_SPEED,
        clickRadius: 30,
        critChance: 0,
        critMult: 5,
        stageIndex: 0,
        godEvolution: 0,
        upgrades: {},
        originalArea: "",
        originalAreaIndex: 0,
        originalTarget: "",
        originalPower: "",
        currentGodName: "",
        currentSkin: "default",
        people: [],
        eventLogs: [],
        isEnding: false,
        currentScreen: "play"
    };
    
    generateGodName();
    updateGodName();
    applyUpgradeEffects();
    
    showScreen("game-screen");
    clearAllPeople();
    
    setTimeout(() => {
        measurePlayArea();
        applyStageBackground();
        
        // v4.0: 게임 시작 시 기본 NPC 배치
        spawnInitialPeople();
        
        addEventLog(`${gameState.currentGodName}이(가) 강림했습니다!`);
        addEventLog("마우스를 꾹 눌러 기적의 힘을 보여주세요!");
        updateAllUI();
        switchScreen("play");
        startGameLoops();
    }, 100);
}

function continueGame() {
    showScreen("game-screen");
    updateGodName();
    applyUpgradeEffects();
    updateGodEvolution();
    
    setTimeout(() => {
        measurePlayArea();
        applyStageBackground();
        
        // v4.0: 이어하기 시에도 기본 NPC 배치 (화면이 비어있으면)
        if (gameState.people.length === 0) {
            spawnInitialPeople();
        }
        
        addEventLog("게임이 다시 연결되었습니다.");
        updateAllUI();
        switchScreen("play");
        startGameLoops();
    }, 100);
}


// ============================================
// 17. 이벤트 리스너 등록
// ============================================

function setupEventListeners() {
    // 시작 화면 - 신 생성 버튼
    document.getElementById("generate-btn").addEventListener("click", () => {
        currentSeed = Date.now();
        generateGodName();
        updateGodName();
        
        setText("generated-god-name", gameState.currentGodName);
        setText("start-followers", "0");
        setText("start-power", gameState.originalPower);
        
        document.getElementById("god-info").classList.remove("hidden");
        document.getElementById("start-game-btn").classList.remove("hidden");
    });
    
    document.getElementById("start-game-btn").addEventListener("click", () => {
        startNewGame();
    });
    
    // 플레이 영역 - 마우스 꾹 누르기 자동 연사 공격
    const playArea = document.getElementById("play-area");
    
    playArea.addEventListener("mousedown", (e) => {
        e.preventDefault();
        startAutoAttack(e.clientX, e.clientY);
    });
    
    playArea.addEventListener("mousemove", (e) => {
        if (isMouseDown) {
            mouseClientX = e.clientX;
            mouseClientY = e.clientY;
        }
    });
    
    window.addEventListener("mouseup", () => {
        stopAutoAttack();
    });
    
    // 터치 이벤트 (모바일)
    playArea.addEventListener("touchstart", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        startAutoAttack(touch.clientX, touch.clientY);
    }, { passive: false });
    
    playArea.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (isMouseDown && e.touches.length > 0) {
            const touch = e.touches[0];
            mouseClientX = touch.clientX;
            mouseClientY = touch.clientY;
        }
    }, { passive: false });
    
    window.addEventListener("touchend", () => {
        stopAutoAttack();
    });
    
    // 탭 전환
    document.getElementById("tab-play").addEventListener("click", () => switchScreen("play"));
    document.getElementById("tab-temple").addEventListener("click", () => switchScreen("temple"));
    
    // 공유 버튼
    document.getElementById("share-copy-btn").addEventListener("click", shareToClipboard);
    document.getElementById("share-twitter-btn").addEventListener("click", shareToTwitter);
    document.getElementById("share-link-btn").addEventListener("click", shareSeedLink);
    
    // 새 게임
    document.getElementById("new-game-btn").addEventListener("click", () => {
        if (confirm("정말 새 게임을 시작하시겠습니까? 진행 상황이 사라집니다.")) {
            startNewGame();
        }
    });
    
    // 엔딩 화면
    document.getElementById("ending-share-btn").addEventListener("click", () => {
        const text = `나는 «${gameState.currentGodName}»에서 유일신이 되었다!\n\n최종 신도: ${gameState.followers.toLocaleString()}명\n누적 믿음: ${Math.floor(gameState.totalFaith).toLocaleString()}\n\n#우리동네신키우기`;
        copyToClipboard(text).then(success => {
            if (success) showToast("결과가 복사되었습니다!");
        });
    });
    
    document.getElementById("ending-new-game-btn").addEventListener("click", () => {
        startNewGame();
    });
    
    window.addEventListener("resize", () => {
        measurePlayArea();
    });
}

function handleClickEmpty(clientX, clientY) {
    const playArea = document.getElementById("play-area");
    const rect = playArea.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;
    
    let closest = null;
    let closestDist = Infinity;
    const radius = gameState.clickRadius;
    
    gameState.people.forEach(person => {
        const px = person.x + 12;
        const py = person.y + 12;
        const dist = Math.sqrt((clickX - px) ** 2 + (clickY - py) ** 2);
        if (dist <= radius && dist < closestDist) {
            closest = person;
            closestDist = dist;
        }
    });
    
    if (closest) {
        handleAttack(clientX, clientY, closest);
    } else {
        createClickEffect(clickX, clickY, radius);
    }
}


// ============================================
// 18. 초기 실행
// ============================================

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const seedParam = urlParams.get("seed");
    const hasSave = loadGame();
    
    setupEventListeners();
    
    if (seedParam) {
        currentSeed = parseInt(seedParam, 10);
        seededRandom = createSeededRandom(currentSeed);
        
        gameState = {
            faith: 0, totalFaith: 0, followers: 0, currentFollowers: 0,
            attackPower: 1, attackSpeed: BASE_ATTACK_SPEED, clickRadius: 30,
            critChance: 0, critMult: 5,
            stageIndex: 0, godEvolution: 0,
            upgrades: {}, originalArea: "", originalAreaIndex: 0,
            originalTarget: "", originalPower: "",
            currentGodName: "", currentSkin: "default", people: [], eventLogs: [],
            isEnding: false, currentScreen: "play"
        };
        
        generateGodName();
        updateGodName();
        
        setText("generated-god-name", gameState.currentGodName);
        setText("start-followers", "0");
        setText("start-power", gameState.originalPower);
        document.getElementById("god-info").classList.remove("hidden");
        document.getElementById("start-game-btn").classList.remove("hidden");
        
        showToast(`시드 ${currentSeed}로 같은 신을 생성합니다!`);
        
    } else if (hasSave && !gameState.isEnding) {
        setText("generated-god-name", gameState.currentGodName);
        setText("start-followers", gameState.followers.toString());
        const powerName = gameState.originalPower || "기적";
        setText("start-power", powerName);
        document.getElementById("god-info").classList.remove("hidden");
        
        document.getElementById("start-game-btn").textContent = "이어하기";
        document.getElementById("start-game-btn").classList.remove("hidden");
        
        const startBtn = document.getElementById("start-game-btn");
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);
        newBtn.addEventListener("click", continueGame);
        
        const newGameStartBtn = document.createElement("button");
        newGameStartBtn.className = "btn btn-primary";
        newGameStartBtn.textContent = "새 게임 시작";
        newGameStartBtn.addEventListener("click", () => {
            if (confirm("새 게임을 시작하면 저장된 데이터가 사라집니다.")) {
                startNewGame();
            }
        });
        newBtn.parentNode.insertBefore(newGameStartBtn, newBtn.nextSibling);
    }
    
    showScreen("start-screen");
}

// 게임 초기화 함수를 전역으로 노출
window.initGame = init;