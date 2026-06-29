/* 우리 동네 신 키우기 v5.2 */

const AREA_HIERARCHY = [
    ["서울특별시 구로구 신도림동","구로구","서울특별시","대한민국","아시아","지구","우주","모든 존재"],
    ["서울특별시 마포구 망원동","마포구","서울특별시","대한민국","아시아","지구","우주","모든 존재"],
    ["서울특별시 성동구 성수동","성동구","서울특별시","대한민국","아시아","지구","우주","모든 존재"],
    ["경기도 안양시 평촌동","안양시","경기도","대한민국","아시아","지구","우주","모든 존재"],
    ["부산광역시 해운대구","해운대구","부산광역시","대한민국","아시아","지구","우주","모든 존재"],
    ["제주특별자치도 서귀포시","서귀포시","제주특별자치도","대한민국","아시아","지구","우주","모든 존재"],
    ["전라남도 목포시","목포시","전라남도","대한민국","아시아","지구","우주","모든 존재"],
    ["경상북도 김천시","김천시","경상북도","대한민국","아시아","지구","우주","모든 존재"],
    ["대구광역시 수성구","수성구","대구광역시","대한민국","아시아","지구","우주","모든 존재"],
    ["인천광역시 부평구","부평구","인천광역시","대한민국","아시아","지구","우주","모든 존재"]
];
const AREA_CANDIDATES = AREA_HIERARCHY.map(h => h[0]);
const TARGET_CANDIDATES = ["고등학생","중학생","취준생","직장인","자영업자","대학생","소개팅 초보자","야식 참는 사람","운전면허 응시자","발표 공포증 보유자"];
const POWER_CANDIDATES = ["기말고사 수학 80점 이상 획득 담당","수행평가 발표 안 떨림 담당","최종면접 합격 담당","소개팅 첫 만남 어색함 방지 담당","야식 참기 성공 담당","운전면허 기능시험 합격 담당","배달앱 리뷰 4.8점 유지 담당","고백 성공 담당","다이어트 3일차 포기 방지 담당","복권 5등 당첨 담당"];
const PERSON_GRADES = [
    {name:"일반",hp:5,reward:5,autoFaith:0.05,spawnWeight:100,color:"#c0c0c0",emoji:"🧑"},
    {name:"희귀",hp:20,reward:30,autoFaith:0.3,spawnWeight:30,color:"#4a9eff",emoji:"👨‍🎓"},
    {name:"영웅",hp:80,reward:150,autoFaith:1.5,spawnWeight:8,color:"#aa44ff",emoji:"👨‍🏫"},
    {name:"전설",hp:300,reward:800,autoFaith:8,spawnWeight:2,color:"#ffaa00",emoji:"👨‍💼"},
    {name:"신화",hp:1000,reward:5000,autoFaith:50,spawnWeight:0.3,color:"#ff4444",emoji:"👤"}
];
const PERSON_JOBS = {0:["시민","학생","행인","주부","배달원","알바생","어린이","노인"],1:["대학생","직장인","공무원","간호사","개발자","디자이너"],2:["교수","의사","변호사","사업가","작가","예술가"],3:["유명인","CEO","정치인","스타","발명가"],4:["성인","현자","예언자","구도자"]};
const STAGE_CONFIG = [
    {targetFaith:200,maxPeople:5,spawnInterval:2000,gradeBonus:0},
    {targetFaith:1000,maxPeople:8,spawnInterval:1800,gradeBonus:0.5},
    {targetFaith:5000,maxPeople:12,spawnInterval:1500,gradeBonus:1.0},
    {targetFaith:25000,maxPeople:18,spawnInterval:1200,gradeBonus:1.5},
    {targetFaith:100000,maxPeople:25,spawnInterval:1000,gradeBonus:2.0},
    {targetFaith:500000,maxPeople:35,spawnInterval:800,gradeBonus:3.0},
    {targetFaith:2000000,maxPeople:45,spawnInterval:700,gradeBonus:4.0},
    {targetFaith:Infinity,maxPeople:50,spawnInterval:600,gradeBonus:5.0}
];
const STAGE_BACKGROUNDS = [
    "linear-gradient(180deg,#0d0d20 0%,#15102a 50%,#0d0d20 100%)",
    "linear-gradient(180deg,#0d1020 0%,#15152a 50%,#0d1020 100%)",
    "linear-gradient(180deg,#100d20 0%,#1a152a 50%,#100d20 100%)",
    "linear-gradient(180deg,#120d20 0%,#20152a 50%,#120d20 100%)",
    "linear-gradient(180deg,#151020 0%,#251530 50%,#151020 100%)",
    "linear-gradient(180deg,#181025 0%,#2a1540 50%,#181025 100%)",
    "linear-gradient(180deg,#1a1030 0%,#301550 50%,#1a1030 100%)",
    "radial-gradient(ellipse at center,#3a1a5e 0%,#0a0a1a 70%)"
];
const GOD_EVOLUTIONS = [
    {name:"빛의 구체",emoji:"✨",stageReq:0},{name:"작은 석상",emoji:"🗿",stageReq:1},
    {name:"천사",emoji:"👼",stageReq:2},{name:"후광을 가진 신",emoji:"🔆",stageReq:3},
    {name:"거대한 신",emoji:"🌟",stageReq:4},{name:"우주를 감싼 존재",emoji:"🌌",stageReq:5},
    {name:"형태가 없는 빛",emoji:"⚪",stageReq:6},{name:"유일신",emoji:"♾️",stageReq:7}
];
const SKILL_TREE = [
    {id:"atk_power",name:"기적 공격력",desc:"공격당 데미지 증가",icon:"⚔️",x:150,y:80,parent:null,branch:"stat",maxLevel:20,costBase:50,costGrowth:1.5,type:"attack",value:2},
    {id:"atk_speed",name:"공격 속도",desc:"초당 공격 횟수 증가",icon:"💨",x:150,y:210,parent:"atk_power",branch:"stat",maxLevel:10,costBase:300,costGrowth:1.8,type:"attackSpeed",value:1},
    {id:"area_radius",name:"신의 손길",desc:"공격 범위 증가",icon:"🙌",x:150,y:340,parent:"atk_speed",branch:"stat",maxLevel:10,costBase:100,costGrowth:1.5,type:"radius",value:5},
    {id:"atk_crit",name:"기적 치명타",desc:"일정 확률로 5배 피해",icon:"💥",x:150,y:470,parent:"area_radius",branch:"stat",maxLevel:5,costBase:800,costGrowth:2,type:"crit",value:0.1},
    {id:"atk_critdmg",name:"치명타 피해",desc:"치명타 배율 증가",icon:"💢",x:150,y:600,parent:"atk_crit",branch:"stat",maxLevel:5,costBase:3000,costGrowth:2.5,type:"critDmg",value:2},
    {id:"area_explode",name:"기적 폭발",desc:"포섭 성공 시 주변 피해",icon:"🎆",x:300,y:80,parent:null,branch:"special",maxLevel:5,costBase:1000,costGrowth:2,type:"explode",value:0.5},
    {id:"atk_smite",name:"천벌",desc:"광역 피해",icon:"⚡",x:300,y:210,parent:"area_explode",branch:"special",maxLevel:3,costBase:3000,costGrowth:2.5,type:"smite",value:0.05},
    {id:"atk_chain",name:"연쇄 축복",desc:"주변 전파",icon:"🔗",x:300,y:340,parent:"atk_smite",branch:"special",maxLevel:5,costBase:2000,costGrowth:2,type:"chain",value:0.3},
    {id:"auto_prophecy",name:"예언",desc:"무작위 피해",icon:"🔮",x:300,y:470,parent:"atk_chain",branch:"special",maxLevel:5,costBase:2000,costGrowth:2,type:"prophecy",value:10},
    {id:"atk_reveal",name:"계시",desc:"즉시 포섭",icon:"👁️",x:300,y:600,parent:"auto_prophecy",branch:"special",maxLevel:3,costBase:5000,costGrowth:3,type:"reveal",value:0.02},
    {id:"sp_spawn",name:"소명",desc:"스폰 속도 증가",icon:"📢",x:450,y:80,parent:null,branch:"resource",maxLevel:10,costBase:200,costGrowth:1.5,type:"spawnSpeed",value:0.1},
    {id:"sp_rare",name:"인연",desc:"희귀 등장률 증가",icon:"🍀",x:600,y:80,parent:"sp_spawn",branch:"resource",maxLevel:10,costBase:500,costGrowth:1.8,type:"rareBonus",value:0.1},
    {id:"auto_faith",name:"축복",desc:"자동 믿음 증가",icon:"🙏",x:450,y:210,parent:"sp_spawn",branch:"resource",maxLevel:20,costBase:80,costGrowth:1.5,type:"autoMult",value:0.2},
    {id:"auto_pray",name:"기도 강화",desc:"자동 믿음 배율 증가",icon:"📿",x:450,y:340,parent:"auto_faith",branch:"resource",maxLevel:10,costBase:2000,costGrowth:2,type:"autoMult",value:0.5},
    {id:"auto_zealot",name:"광신도",desc:"자동 믿음 대폭 증가",icon:"🔥",x:450,y:470,parent:"auto_pray",branch:"resource",maxLevel:5,costBase:10000,costGrowth:2.5,type:"autoMult",value:1.0},
    {id:"auto_priest",name:"성직자",desc:"자동 믿음 2배",icon:"⛪",x:450,y:600,parent:"auto_zealot",branch:"resource",maxLevel:3,costBase:50000,costGrowth:3,type:"autoMult",value:2.0}
];
const SKILL_BRANCHES = [{id:"stat",name:"능력치",icon:"⚔️",color:"#ff8844",x:150},{id:"special",name:"특수 능력",icon:"✨",color:"#aa44ff",x:300},{id:"resource",name:"자원",icon:"💰",color:"#44ff88",x:450}];
const RANK_NAMES = ["하급 동네신","동네신","지역신","국가신","대륙신","인류신","우주신","유일신"];
const SAVE_KEY = "ourNeighborhoodGod_v5_2_saveData";
const GOD_NAME_KEY = "currentGodName";
const BASE_ATTACK_SPEED = 3;
const INITIAL_NPC_COUNT = 6;
const ZOOM_MIN = 0.5, ZOOM_MAX = 2.0, ZOOM_STEP = 0.1;
let currentZoom = 1.0;
const SHAKE_INTENSITY = 2, SHAKE_DURATION = 100, SHAKE_COOLDOWN = 80;
let lastShakeTime = 0;
const ROUND_SPEED_BONUS = 0.08, MAX_SPEED_MULT = 2.5;

function createSeededRandom(seed) {
    let state = seed | 0 || 1;
    return function() { state ^= state << 13; state ^= state >> 17; state ^= state << 5; return ((state >>> 0) / 4294967296); };
}

let currentSeed = 0;
let seededRandom = null;
let gameState = {
    faith:0, totalFaith:0, followers:0, currentFollowers:0,
    attackPower:1, attackSpeed:BASE_ATTACK_SPEED, clickRadius:30,
    critChance:0, critMult:5, stageIndex:0, godEvolution:0,
    upgrades:{}, originalArea:"", originalAreaIndex:0, originalTarget:"", originalPower:"",
    currentGodName:"", currentSkin:"default", people:[], eventLogs:[],
    isEnding:false, endingSeen:false, currentScreen:"play", lastEvolutionShown:-1
};
let moveIntervalId=null, spawnIntervalId=null, autoFaithIntervalId=null, saveIntervalId=null, prophecyIntervalId=null;
let isMouseDown=false, mouseClientX=0, mouseClientY=0, attackIntervalId=null;
let playAreaWidth=0, playAreaHeight=0;

function getRandomGrade() {
    const stageBonus = STAGE_CONFIG[gameState.stageIndex].gradeBonus;
    const rareBonus = (gameState.upgrades["sp_rare"]||0) * SKILL_TREE.find(u=>u.id==="sp_rare").value;
    const totalBonus = stageBonus + rareBonus;
    const weights = PERSON_GRADES.map((g,i)=>g.spawnWeight*(1+totalBonus*i*0.5));
    const total = weights.reduce((a,b)=>a+b,0);
    let rand = Math.random()*total;
    for (let i=0;i<weights.length;i++) { rand -= weights[i]; if (rand<=0) return i; }
    return 0;
}

function getRoundSpeedMultiplier() { return Math.min(MAX_SPEED_MULT, 1 + gameState.stageIndex * ROUND_SPEED_BONUS); }

function createPerson(fromOutside) {
    const grade = getRandomGrade();
    const gradeData = PERSON_GRADES[grade];
    const jobs = PERSON_JOBS[grade];
    const job = jobs[Math.floor(Math.random()*jobs.length)];
    const w = Math.max(playAreaWidth,100), h = Math.max(playAreaHeight,100);
    const centerX = w/2, centerY = h/2;
    const speedMult = getRoundSpeedMultiplier();
    const baseSpeed = (1.0 + Math.random()*0.6) * speedMult;
    let x, y, isEntering = false;
    if (fromOutside) {
        const edge = Math.floor(Math.random()*4);
        const margin = 15;
        if (edge===0) { x=-margin; y=Math.random()*h; }
        else if (edge===1) { x=w+margin; y=Math.random()*h; }
        else if (edge===2) { x=Math.random()*w; y=-margin; }
        else { x=Math.random()*w; y=h+margin; }
        isEntering = true;
        const targetX = centerX + (Math.random()-0.5)*w*0.7;
        const targetY = centerY + (Math.random()-0.5)*h*0.7;
        const dx = targetX - x, dy = targetY - y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        return { id:Date.now()+Math.random(), x, y, dx:(dx/dist)*baseSpeed, dy:(dy/dist)*baseSpeed, speed:baseSpeed, isEntering, directionTimer:0, grade, gradeName:gradeData.name, hp:gradeData.hp, maxHp:gradeData.hp, reward:gradeData.reward, autoFaith:gradeData.autoFaith, emoji:gradeData.emoji, color:gradeData.color, job, element:null, hpBarElement:null };
    } else {
        x = Math.random()*(w-40)+20; y = Math.random()*(h-40)+20;
        const speed = (0.8 + Math.random()*0.6) * speedMult;
        const angle = Math.random()*Math.PI*2;
        return { id:Date.now()+Math.random(), x, y, dx:Math.cos(angle)*speed, dy:Math.sin(angle)*speed, speed, isEntering:false, directionTimer:Math.floor(Math.random()*60), grade, gradeName:gradeData.name, hp:gradeData.hp, maxHp:gradeData.hp, reward:gradeData.reward, autoFaith:gradeData.autoFaith, emoji:gradeData.emoji, color:gradeData.color, job, element:null, hpBarElement:null };
    }
}

function addPersonToDOM(person) {
    const playArea = document.getElementById("play-area");
    if (!playArea) return;
    const el = document.createElement("div");
    el.className = "person grade-" + person.grade;
    el.dataset.personId = person.id;
    el.style.left = person.x + "px"; el.style.top = person.y + "px";
    el.style.borderColor = person.color; el.style.boxShadow = `0 0 8px ${person.color}66`;
    el.textContent = person.emoji;
    const hpBarBg = document.createElement("div"); hpBarBg.className = "hp-bar-bg";
    const hpBar = document.createElement("div"); hpBar.className = "hp-bar";
    hpBar.style.width = "100%"; hpBar.style.backgroundColor = person.color;
    hpBarBg.appendChild(hpBar); el.appendChild(hpBarBg);
    if (person.grade > 0) {
        const gradeTag = document.createElement("div"); gradeTag.className = "grade-tag";
        gradeTag.textContent = person.gradeName; gradeTag.style.color = person.color;
        el.appendChild(gradeTag);
    }
    playArea.appendChild(el); person.element = el; person.hpBarElement = hpBar;
}

function updatePersonHP(person) { if (person.hpBarElement) { person.hpBarElement.style.width = Math.max(0,(person.hp/person.maxHp)*100) + "%"; } }
function measurePlayArea() { const pa = document.getElementById("play-area"); if (!pa) return; const r = pa.getBoundingClientRect(); playAreaWidth = r.width/currentZoom; playAreaHeight = r.height/currentZoom; }
function spawnInitialPeople() { for (let i=0;i<INITIAL_NPC_COUNT;i++) { const p = createPerson(false); gameState.people.push(p); addPersonToDOM(p); } }
function adjustPeopleCount() {
    const config = STAGE_CONFIG[gameState.stageIndex];
    const target = config.maxPeople;
    if (gameState.people.length < target) { const p = createPerson(true); gameState.people.push(p); addPersonToDOM(p); }
    else if (gameState.people.length > target) { const toRemove = gameState.people.splice(target); toRemove.forEach(p => { if (p.element) p.element.remove(); }); }
}

function movePeople() {
    const w = Math.max(playAreaWidth,100), h = Math.max(playAreaHeight,100);
    const centerX = w/2, centerY = h/2;
    gameState.people.forEach(person => {
        person.x += person.dx; person.y += person.dy;
        if (person.isEntering) {
            if (person.x>10 && person.x<w-30 && person.y>10 && person.y<h-30) {
                person.isEntering = false;
                const angle = Math.random()*Math.PI*2;
                person.dx = Math.cos(angle)*person.speed; person.dy = Math.sin(angle)*person.speed;
            }
        } else {
            person.directionTimer = (person.directionTimer||0) + 1;
            if (person.directionTimer >= 60 + Math.floor(Math.random()*40)) {
                const toCenter = Math.random() < 0.4;
                let angle = toCenter ? Math.atan2(centerY-person.y, centerX-person.x) + (Math.random()-0.5)*1.5 : Math.random()*Math.PI*2;
                person.dx = Math.cos(angle)*person.speed; person.dy = Math.sin(angle)*person.speed;
                person.directionTimer = 0;
            }
            const margin = 5, maxX = Math.max(w-32,10), maxY = Math.max(h-32,10);
            if (person.x<=margin) { person.dx=Math.abs(person.dx); person.x=margin; }
            else if (person.x>=maxX) { person.dx=-Math.abs(person.dx); person.x=maxX; }
            if (person.y<=margin) { person.dy=Math.abs(person.dy); person.y=margin; }
            else if (person.y>=maxY) { person.dy=-Math.abs(person.dy); person.y=maxY; }
        }
        if (person.element) { person.element.style.left = person.x+"px"; person.element.style.top = person.y+"px"; }
    });
}

function clearAllPeople() { gameState.people.forEach(p => { if (p.element) p.element.remove(); }); gameState.people = []; }

function startAutoAttack(cx, cy) { isMouseDown = true; mouseClientX = cx; mouseClientY = cy; doAutoAttack(); const ms = 1000/gameState.attackSpeed; if (attackIntervalId) clearInterval(attackIntervalId); attackIntervalId = setInterval(doAutoAttack, ms); }
function stopAutoAttack() { isMouseDown = false; if (attackIntervalId) { clearInterval(attackIntervalId); attackIntervalId = null; } }
function doAutoAttack() { if (!isMouseDown) return; handleClickEmpty(mouseClientX, mouseClientY); }

function handleAttack(cx, cy, target) {
    const pa = document.getElementById("play-area"); const rect = pa.getBoundingClientRect();
    const clickX = (cx - rect.left)/currentZoom, clickY = (cy - rect.top)/currentZoom;
    let damage = gameState.attackPower;
    const critLevel = gameState.upgrades["atk_crit"]||0; let isCrit = false;
    if (critLevel > 0) { if (Math.random() < critLevel * SKILL_TREE.find(u=>u.id==="atk_crit").value) { damage *= gameState.critMult; isCrit = true; } }
    const revealLevel = gameState.upgrades["atk_reveal"]||0; let isReveal = false;
    if (revealLevel > 0) { if (Math.random() < revealLevel * SKILL_TREE.find(u=>u.id==="atk_reveal").value) { damage = target.hp; isReveal = true; } }
    applyDamage(target, damage, clickX, clickY, isCrit, isReveal);
    const chainLevel = gameState.upgrades["atk_chain"]||0;
    if (chainLevel > 0) {
        const chainDamage = Math.floor(damage * SKILL_TREE.find(u=>u.id==="atk_chain").value * chainLevel);
        const chainRadius = gameState.clickRadius;
        gameState.people.forEach(p => { if (p.id===target.id) return; const px=p.x+12, py=p.y+12; const dist=Math.sqrt((clickX-px)**2+(clickY-py)**2); if (dist<=chainRadius) applyDamage(p, chainDamage, px, py, false, false, true); });
    }
    const smiteLevel = gameState.upgrades["atk_smite"]||0;
    if (smiteLevel > 0 && Math.random() < smiteLevel * SKILL_TREE.find(u=>u.id==="atk_smite").value) {
        const smiteDamage = Math.floor(damage*0.5);
        gameState.people.forEach(p => { if (p.id!==target.id) applyDamage(p, smiteDamage, p.x+12, p.y+12, false, false, true); });
        createSmiteEffect();
    }
    createClickEffect(clickX, clickY, gameState.clickRadius);
    shakeScreen();
    updateAllUI();
}

function applyDamage(person, damage, x, y, isCrit, isReveal, isChain) {
    if (!person || person.hp <= 0) return;
    person.hp -= damage; updatePersonHP(person);
    createDamageText(x, y, damage, isCrit, isChain);
    if (person.element && !isChain) { person.element.classList.remove("hit"); void person.element.offsetWidth; person.element.classList.add("hit"); }
    if (person.hp <= 0) convertPerson(person, isReveal);
}

function convertPerson(person, isReveal) {
    const faithGained = person.reward;
    gameState.faith += faithGained; gameState.totalFaith += faithGained;
    gameState.followers++; gameState.currentFollowers++;
    createConvertEffect(person.x+12, person.y+12, person.color);
    const explodeLevel = gameState.upgrades["area_explode"]||0;
    if (explodeLevel > 0) {
        const explodeDamage = Math.floor(person.maxHp * SKILL_TREE.find(u=>u.id==="area_explode").value * explodeLevel);
        const explodeRadius = gameState.clickRadius * 1.5;
        const px = person.x+12, py = person.y+12;
        gameState.people.forEach(o => { if (o.id===person.id||o.hp<=0) return; const ox=o.x+12, oy=o.y+12; const dist=Math.sqrt((px-ox)**2+(py-oy)**2); if (dist<=explodeRadius) applyDamage(o, explodeDamage, ox, oy, false, false, true); });
        createExplodeEffect(px, py, person.color);
    }
    const idx = gameState.people.indexOf(person);
    if (idx >= 0) gameState.people.splice(idx, 1);
    if (person.element) { person.element.classList.add("converting"); setTimeout(() => { if (person.element) person.element.remove(); }, 300); }
    checkStageProgress();
}

function createClickEffect(x, y, radius) { const pa = document.getElementById("play-area"); if (!pa) return; const e = document.createElement("div"); e.className = "click-effect"; e.style.width = (radius*2)+"px"; e.style.height = (radius*2)+"px"; e.style.left = x+"px"; e.style.top = y+"px"; pa.appendChild(e); setTimeout(() => e.remove(), 600); }
function createDamageText(x, y, damage, isCrit, isChain) { const pa = document.getElementById("play-area"); if (!pa) return; const t = document.createElement("div"); t.className = "damage-text"; if (isCrit) t.classList.add("crit"); if (isChain) t.classList.add("chain"); t.textContent = isCrit ? `${damage}!` : `${damage}`; t.style.left = (x+(Math.random()-0.5)*20)+"px"; t.style.top = (y-5)+"px"; pa.appendChild(t); setTimeout(() => t.remove(), 800); }
function createConvertEffect(x, y, color) { const pa = document.getElementById("play-area"); if (!pa) return; const e = document.createElement("div"); e.className = "convert-effect"; e.style.left = x+"px"; e.style.top = y+"px"; e.style.borderColor = color; pa.appendChild(e); setTimeout(() => e.remove(), 600); for (let i=0;i<8;i++) { const p = document.createElement("div"); p.className = "particle"; p.style.left = x+"px"; p.style.top = y+"px"; const angle = (Math.PI*2/8)*i; const dist = 40+Math.random()*30; p.style.setProperty("--dx", Math.cos(angle)*dist+"px"); p.style.setProperty("--dy", Math.sin(angle)*dist+"px"); p.style.backgroundColor = i%2===0 ? "#ffd700" : color; pa.appendChild(p); setTimeout(() => p.remove(), 700); } }
function createExplodeEffect(x, y, color) { const pa = document.getElementById("play-area"); if (!pa) return; const e = document.createElement("div"); e.className = "explode-effect"; e.style.left = x+"px"; e.style.top = y+"px"; e.style.borderColor = color; pa.appendChild(e); setTimeout(() => e.remove(), 500); }
function createSmiteEffect() { const pa = document.getElementById("play-area"); if (!pa) return; const f = document.createElement("div"); f.className = "smite-flash"; pa.appendChild(f); setTimeout(() => f.remove(), 300); }

function shakeScreen() {
    const now = Date.now();
    if (now - lastShakeTime < SHAKE_COOLDOWN) return;
    lastShakeTime = now;
    const pa = document.getElementById("play-area");
    if (pa) {
        const dx = (Math.random()-0.5) * SHAKE_INTENSITY * 2;
        const dy = (Math.random()-0.5) * SHAKE_INTENSITY * 2;
        pa.style.transform = `scale(${currentZoom}) translate(${dx}px, ${dy}px)`;
        setTimeout(() => { pa.style.transform = `scale(${currentZoom})`; }, SHAKE_DURATION);
    }
}

function getUpgradeCost(id) { const u = SKILL_TREE.find(s=>s.id===id); if (!u) return Infinity; const lv = gameState.upgrades[id]||0; if (lv>=u.maxLevel) return Infinity; return Math.floor(u.costBase * Math.pow(u.costGrowth, lv)); }
function canBuyUpgrade(id) { const u = SKILL_TREE.find(s=>s.id===id); if (!u) return false; const lv = gameState.upgrades[id]||0; if (lv>=u.maxLevel) return false; if (u.parent && (gameState.upgrades[u.parent]||0) < 1) return false; return gameState.faith >= getUpgradeCost(id); }
function buyUpgrade(id) { if (!canBuyUpgrade(id)) return; gameState.faith -= getUpgradeCost(id); gameState.upgrades[id] = (gameState.upgrades[id]||0) + 1; applyUpgradeEffects(); updateAllUI(); if (gameState.currentScreen === "temple") renderSkillTree(); }
function applyUpgradeEffects() {
    gameState.attackPower = 1 + (gameState.upgrades["atk_power"]||0) * SKILL_TREE.find(u=>u.id==="atk_power").value;
    gameState.attackSpeed = BASE_ATTACK_SPEED + (gameState.upgrades["atk_speed"]||0) * SKILL_TREE.find(u=>u.id==="atk_speed").value;
    gameState.clickRadius = 30 + (gameState.upgrades["area_radius"]||0) * SKILL_TREE.find(u=>u.id==="area_radius").value;
    gameState.critChance = (gameState.upgrades["atk_crit"]||0) * SKILL_TREE.find(u=>u.id==="atk_crit").value;
    gameState.critMult = 5 + (gameState.upgrades["atk_critdmg"]||0) * SKILL_TREE.find(u=>u.id==="atk_critdmg").value;
}

function getStageAreaName(stageIndex) { const h = AREA_HIERARCHY[gameState.originalAreaIndex]; if (!h) return "알 수 없음"; return h[Math.min(stageIndex, h.length-1)]; }
function getStageConfig(stageIndex) { return STAGE_CONFIG[Math.min(stageIndex, STAGE_CONFIG.length-1)]; }

function checkStageProgress() {
    const config = getStageConfig(gameState.stageIndex);
    if (gameState.totalFaith >= config.targetFaith && gameState.stageIndex < STAGE_CONFIG.length-1) {
        const oldName = gameState.currentGodName;
        const oldEvolution = gameState.godEvolution;
        gameState.stageIndex++;
        updateGodEvolution(); applyStageBackground(); adjustPeopleCount(); restartSpawnTimer();
        updateGodName();
        if (gameState.godEvolution > oldEvolution && gameState.lastEvolutionShown !== gameState.godEvolution) {
            gameState.lastEvolutionShown = gameState.godEvolution;
            showEvolutionModal(oldName, gameState.currentGodName, GOD_EVOLUTIONS[gameState.godEvolution]);
        }
        if (gameState.stageIndex >= STAGE_CONFIG.length-1) checkEnding();
    }
}

function updateGodEvolution() { for (let i = GOD_EVOLUTIONS.length-1; i >= 0; i--) { if (gameState.stageIndex >= GOD_EVOLUTIONS[i].stageReq) { gameState.godEvolution = i; break; } } }
function applyStageBackground() { const pa = document.getElementById("play-area"); if (pa) pa.style.background = STAGE_BACKGROUNDS[Math.min(gameState.stageIndex, STAGE_BACKGROUNDS.length-1)]; }
function restartSpawnTimer() { if (spawnIntervalId) clearInterval(spawnIntervalId); const config = getStageConfig(gameState.stageIndex); let interval = config.spawnInterval; const lv = gameState.upgrades["sp_spawn"]||0; if (lv > 0) interval = Math.max(300, interval / (1 + SKILL_TREE.find(u=>u.id==="sp_spawn").value * lv)); spawnIntervalId = setInterval(() => adjustPeopleCount(), interval); }
function updateGodVisual() { const e = GOD_EVOLUTIONS[gameState.godEvolution]; const ge = document.getElementById("god-emoji"); const gn = document.getElementById("god-evolution-name"); if (ge) ge.textContent = e.emoji; if (gn) gn.textContent = e.name; const pe = document.getElementById("portrait-god-emoji"); if (pe) pe.textContent = e.emoji; }

function generateGodName() {
    seededRandom = createSeededRandom(currentSeed);
    const areaIndex = Math.floor(seededRandom() * AREA_CANDIDATES.length);
    const area = AREA_CANDIDATES[areaIndex];
    const target = TARGET_CANDIDATES[Math.floor(seededRandom() * TARGET_CANDIDATES.length)];
    const power = POWER_CANDIDATES[Math.floor(seededRandom() * POWER_CANDIDATES.length)];
    gameState.originalArea = area; gameState.originalAreaIndex = areaIndex;
    gameState.originalTarget = target; gameState.originalPower = power;
    gameState.currentGodName = `${area} ${target} ${power}의 신`;
    localStorage.setItem(GOD_NAME_KEY, gameState.currentGodName);
}

function updateGodName() {
    const stage = gameState.stageIndex, evo = gameState.godEvolution;
    if (stage >= 7 && evo >= 7) { gameState.currentGodName = "유일신"; localStorage.setItem(GOD_NAME_KEY, gameState.currentGodName); return; }
    const areaName = getStageAreaName(stage);
    const powerNames = ["작은 기적","축복","기적","성공","운명","인과율","초월","유일"];
    gameState.currentGodName = `${areaName} ${powerNames[Math.min(evo, powerNames.length-1)]}의 신`;
    localStorage.setItem(GOD_NAME_KEY, gameState.currentGodName);
}

function getRankName() { return RANK_NAMES[Math.min(gameState.stageIndex, RANK_NAMES.length-1)]; }

function produceAutoFaith() {
    let autoMult = 1;
    ["auto_faith","auto_pray","auto_zealot","auto_priest"].forEach(id => { const lv = gameState.upgrades[id]||0; if (lv > 0) { const u = SKILL_TREE.find(s=>s.id===id); if (id === "auto_priest") autoMult *= (1+lv*u.value); else autoMult += lv*u.value; } });
    const baseAuto = gameState.currentFollowers * 0.1 * autoMult;
    if (baseAuto > 0) { gameState.faith += baseAuto; gameState.totalFaith += baseAuto; }
    updateAllUI();
    if (gameState.currentScreen === "temple") renderSkillTree();
}

function prophecyAttack() { const lv = gameState.upgrades["auto_prophecy"]||0; if (lv === 0 || gameState.people.length === 0) return; const damage = lv * SKILL_TREE.find(u=>u.id==="auto_prophecy").value; const count = Math.min(gameState.people.length, 1+Math.floor(lv/2)); for (let i=0;i<count;i++) { if (gameState.people.length === 0) break; const idx = Math.floor(Math.random()*gameState.people.length); const p = gameState.people[idx]; applyDamage(p, damage, p.x+12, p.y+12, false, false, true); } }

function checkEnding() { if (gameState.stageIndex >= STAGE_CONFIG.length-1 && gameState.godEvolution >= 7 && !gameState.endingSeen) { gameState.isEnding = true; gameState.endingSeen = true; showEndingScreen(); } }
function showEndingScreen() { stopGameLoops(); document.getElementById("ending-followers").textContent = gameState.followers.toLocaleString(); document.getElementById("ending-total-faith").textContent = Math.floor(gameState.totalFaith).toLocaleString(); showScreen("ending-screen"); }
function continueAfterEnding() { gameState.isEnding = false; showScreen("game-screen"); setTimeout(() => { measurePlayArea(); applyStageBackground(); if (gameState.people.length === 0) spawnInitialPeople(); updateAllUI(); switchScreen("play"); startGameLoops(); }, 100); }

function switchScreen(name) {
    gameState.currentScreen = name;
    const ps = document.getElementById("play-view"), ts = document.getElementById("temple-view"), is = document.getElementById("info-view");
    const tp = document.getElementById("tab-play"), tt = document.getElementById("tab-temple"), ti = document.getElementById("tab-info");
    if (ps) ps.classList.add("hidden"); if (ts) ts.classList.add("hidden"); if (is) is.classList.add("hidden");
    if (tp) tp.classList.remove("active"); if (tt) tt.classList.remove("active"); if (ti) ti.classList.remove("active");
    if (name === "temple") { if (ts) ts.classList.remove("hidden"); if (tt) tt.classList.add("active"); renderSkillTree(); }
    else if (name === "info") { if (is) is.classList.remove("hidden"); if (ti) ti.classList.add("active"); updateAllUI(); }
    else { if (ps) ps.classList.remove("hidden"); if (tp) tp.classList.add("active"); }
}

function renderSkillTree() {
    const container = document.getElementById("upgrade-tree-container"); if (!container) return; container.innerHTML = "";
    const maxX = Math.max(...SKILL_TREE.map(s=>s.x))+100, maxY = Math.max(...SKILL_TREE.map(s=>s.y))+100;
    const tw = document.createElement("div"); tw.className = "skill-tree-wrapper"; tw.style.width = maxX+"px"; tw.style.height = maxY+"px"; tw.style.position = "relative";
    SKILL_BRANCHES.forEach(b => { const h = document.createElement("div"); h.className = "skill-branch-header"; h.style.left = (b.x-50)+"px"; h.style.top = "10px"; h.style.color = b.color; h.innerHTML = `${b.icon} ${b.name}`; tw.appendChild(h); });
    const svg = document.createElementNS("http://www.w3.org/2000/svg","svg"); svg.setAttribute("width",maxX); svg.setAttribute("height",maxY); svg.style.position = "absolute"; svg.style.top = "0"; svg.style.left = "0"; svg.style.pointerEvents = "none";
    SKILL_TREE.forEach(n => { if (n.parent) { const p = SKILL_TREE.find(s=>s.id===n.parent); if (p) { const unlocked = (gameState.upgrades[p.id]||0) >= 1; const line = document.createElementNS("http://www.w3.org/2000/svg","line"); line.setAttribute("x1",p.x); line.setAttribute("y1",p.y); line.setAttribute("x2",n.x); line.setAttribute("y2",n.y); line.setAttribute("stroke",unlocked?"#ffd700":"#3a2a5a"); line.setAttribute("stroke-width",unlocked?"3":"2"); line.setAttribute("stroke-dasharray",unlocked?"none":"5,5"); line.setAttribute("opacity",unlocked?"0.8":"0.4"); svg.appendChild(line); } } });
    tw.appendChild(svg);
    SKILL_TREE.forEach(n => {
        const lv = gameState.upgrades[n.id]||0, maxed = lv>=n.maxLevel, cost = getUpgradeCost(n.id), canBuy = canBuyUpgrade(n.id), parentMet = !n.parent || (gameState.upgrades[n.parent]||0) >= 1;
        const nd = document.createElement("div"); nd.className = "skill-node"; if (maxed) nd.classList.add("maxed"); if (!parentMet) nd.classList.add("locked"); if (lv>0) nd.classList.add("learned"); if (canBuy) nd.classList.add("available");
        nd.style.left = (n.x-45)+"px"; nd.style.top = (n.y-45)+"px";
        let pb = ""; for (let i=0;i<lv;i++) pb+="■"; for (let i=0;i<n.maxLevel-lv;i++) pb+="□"; if (maxed) { pb = ""; for (let i=0;i<n.maxLevel;i++) pb+="■"; }
        nd.innerHTML = `<div class="skill-node-icon">${n.icon}</div><div class="skill-node-name">${n.name}</div><div class="skill-node-progress">${pb}</div><div class="skill-node-level">Lv.${lv}/${n.maxLevel}</div>${!parentMet?`<div class="skill-node-locked">🔒</div>`:maxed?`<div class="skill-node-maxed">MAX</div>`:`<div class="skill-node-cost ${canBuy?"can-buy":"cant-buy"}">${cost.toLocaleString()}</div>`}`;
        nd.addEventListener("click", () => { if (canBuy) { buyUpgrade(n.id); renderSkillTree(); } });
        const tt = document.createElement("div"); tt.className = "skill-tooltip"; tt.innerHTML = `<strong>${n.name}</strong><br>${n.desc}`; nd.appendChild(tt);
        tw.appendChild(nd);
    });
    container.appendChild(tw);
}

function saveGame() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ seed:currentSeed, faith:gameState.faith, totalFaith:gameState.totalFaith, followers:gameState.followers, currentFollowers:gameState.currentFollowers, attackPower:gameState.attackPower, attackSpeed:gameState.attackSpeed, clickRadius:gameState.clickRadius, critChance:gameState.critChance, critMult:gameState.critMult, stageIndex:gameState.stageIndex, godEvolution:gameState.godEvolution, upgrades:gameState.upgrades, originalArea:gameState.originalArea, originalAreaIndex:gameState.originalAreaIndex, originalTarget:gameState.originalTarget, originalPower:gameState.originalPower, currentGodName:gameState.currentGodName, currentSkin:gameState.currentSkin, eventLogs:gameState.eventLogs, isEnding:gameState.isEnding, endingSeen:gameState.endingSeen, lastEvolutionShown:gameState.lastEvolutionShown })); } catch(e) { console.warn("save fail:",e); } }
function loadGame() { try { const s = localStorage.getItem(SAVE_KEY); if (!s) return false; const d = JSON.parse(s); currentSeed = d.seed||Date.now(); seededRandom = createSeededRandom(currentSeed); gameState.faith=d.faith||0; gameState.totalFaith=d.totalFaith||0; gameState.followers=d.followers||0; gameState.currentFollowers=d.currentFollowers||0; gameState.attackPower=d.attackPower||1; gameState.attackSpeed=d.attackSpeed||BASE_ATTACK_SPEED; gameState.clickRadius=d.clickRadius||30; gameState.critChance=d.critChance||0; gameState.critMult=d.critMult||5; gameState.stageIndex=d.stageIndex||0; gameState.godEvolution=d.godEvolution||0; gameState.upgrades=d.upgrades||{}; gameState.originalArea=d.originalArea||""; gameState.originalAreaIndex=d.originalAreaIndex||0; gameState.originalTarget=d.originalTarget||""; gameState.originalPower=d.originalPower||""; gameState.currentGodName=d.currentGodName||""; gameState.currentSkin=d.currentSkin||"default"; gameState.eventLogs=d.eventLogs||[]; gameState.isEnding=d.isEnding||false; gameState.endingSeen=d.endingSeen||false; gameState.lastEvolutionShown=d.lastEvolutionShown!==undefined?d.lastEvolutionShown:-1; return true; } catch(e) { console.warn("load fail:",e); return false; } }
function clearSaveData() { localStorage.removeItem(SAVE_KEY); localStorage.removeItem(GOD_NAME_KEY); }

function shareToClipboard() { copyToClipboard(generateShareText()).then(s => showToast(s ? "공유 문구가 복사되었습니다!" : "복사에 실패했습니다.")); }
function generateShareText() { return `나는 지금\n「${gameState.currentGodName}」\n으로 시작했다.\n\n현재 영역: ${getStageAreaName(gameState.stageIndex)}\n현재 신도: ${gameState.followers.toLocaleString()}명\n현재 믿음: ${Math.floor(gameState.faith).toLocaleString()}\n등급: ${getRankName()}\n신의 형태: ${GOD_EVOLUTIONS[gameState.godEvolution].name}\n목표: 유일신\n\n#우리동네신키우기`; }
async function copyToClipboard(text) { try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return true; } } catch(e) {} try { const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.left = "-9999px"; document.body.appendChild(ta); ta.focus(); ta.select(); const r = document.execCommand("copy"); document.body.removeChild(ta); return r; } catch(e) { return false; } }
function shareToTwitter() { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`나는 지금 「${gameState.currentGodName}」으로 시작했다! 영역: ${getStageAreaName(gameState.stageIndex)} #우리동네신키우기`)}`, "_blank", "noopener,noreferrer"); }
function shareSeedLink() { copyToClipboard(window.location.origin + window.location.pathname + "?seed=" + currentSeed).then(s => showToast(s ? "링크가 복사되었습니다!" : "링크 복사에 실패했습니다.")); }
function shareAsImage() { try { const c = document.createElement("canvas"); c.width = 400; c.height = 500; const ctx = c.getContext("2d"); const g = ctx.createLinearGradient(0,0,0,500); g.addColorStop(0,"#1a0a2e"); g.addColorStop(1,"#0a0a1a"); ctx.fillStyle = g; ctx.fillRect(0,0,400,500); ctx.strokeStyle = "#ffd700"; ctx.lineWidth = 3; ctx.strokeRect(10,10,380,480); ctx.font = "80px serif"; ctx.textAlign = "center"; ctx.fillText(GOD_EVOLUTIONS[gameState.godEvolution].emoji, 200, 120); ctx.font = "bold 18px sans-serif"; ctx.fillStyle = "#ffd700"; ctx.fillText(gameState.currentGodName, 200, 180); ctx.font = "14px sans-serif"; ctx.fillStyle = "#e0d0ff"; ctx.textAlign = "left"; [`신도: ${gameState.followers.toLocaleString()}명`,`믿음: ${Math.floor(gameState.faith).toLocaleString()}`,`등급: ${getRankName()}`,`스테이지: ${getStageAreaName(gameState.stageIndex)}`,`형태: ${GOD_EVOLUTIONS[gameState.godEvolution].name}`].forEach((s,i) => ctx.fillText(s, 50, 240+i*30)); ctx.font = "italic 12px sans-serif"; ctx.fillStyle = "#7b4fbf"; ctx.textAlign = "center"; ctx.fillText("#우리동네신키우기", 200, 450); const link = document.createElement("a"); link.download = "my_god_card.png"; link.href = c.toDataURL("image/png"); link.click(); showToast("이미지가 저장되었습니다!"); } catch(e) { showToast("이미지 저장에 실패했습니다."); } }
function shareToKakao() { const text = generateShareText(); if (typeof Kakao !== "undefined" && Kakao.Share) { Kakao.Share.sendDefault({ objectType:"text", text:text, link:{mobileWebUrl:window.location.href, webUrl:window.location.href} }); } else { copyToClipboard(text).then(s => showToast(s ? "공유 문구가 복사되었습니다! 카카오톡에 붙여넣기 해주세요." : "카카오톡 공유를 사용할 수 없습니다.")); } }
function shareToInstagram() { copyToClipboard(generateShareText()).then(s => { if (s) { showToast("공유 문구가 복사되었습니다! 인스타그램 스토리에 붙여넣기 해주세요."); window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer"); } else showToast("인스타그램 공유를 사용할 수 없습니다."); }); }

function showToast(msg) { const t = document.getElementById("toast"); t.textContent = msg; t.classList.remove("hidden"); setTimeout(() => t.classList.add("hidden"), 3000); }

function updateAllUI() {
    setText("current-god-name", gameState.currentGodName);
    setText("current-rank", getRankName());
    setText("current-faith", Math.floor(gameState.faith).toLocaleString());
    let autoMult = 1; ["auto_faith","auto_pray","auto_zealot","auto_priest"].forEach(id => { const lv = gameState.upgrades[id]||0; if (lv > 0) { const u = SKILL_TREE.find(s=>s.id===id); if (id === "auto_priest") autoMult *= (1+lv*u.value); else autoMult += lv*u.value; } });
    setText("faith-per-second", `+${(gameState.currentFollowers*0.1*autoMult).toFixed(1)}/초`);
    setText("current-followers", gameState.followers.toLocaleString());
    setText("current-stage", getStageAreaName(gameState.stageIndex));
    setText("current-attack", `${gameState.attackPower}`);
    setText("current-speed", `${gameState.attackSpeed.toFixed(1)}/초`);
    setText("current-radius", `${gameState.clickRadius}px`);
    updateGodVisual();
    setText("god-name-display", gameState.currentGodName);
    setText("portrait-god-name", gameState.currentGodName);
    setText("portrait-god-rank", getRankName());
    const ps = document.getElementById("portrait-god-stage");
    if (ps) ps.textContent = `${getStageAreaName(gameState.stageIndex)} | ${GOD_EVOLUTIONS[gameState.godEvolution].name} | 믿음 ${Math.floor(gameState.faith).toLocaleString()}`;
    setText("card-god-name", gameState.currentGodName);
    setText("card-followers", gameState.followers.toLocaleString());
    setText("card-faith", Math.floor(gameState.faith).toLocaleString());
    setText("card-rank", getRankName());
    setText("card-stage", getStageAreaName(gameState.stageIndex));
    setText("card-evolution", GOD_EVOLUTIONS[gameState.godEvolution].name);
    const config = getStageConfig(gameState.stageIndex);
    const progress = Math.min(100, (gameState.totalFaith / config.targetFaith) * 100);
    const pb = document.getElementById("stage-progress-bar"); if (pb) pb.style.width = progress + "%";
    setText("stage-progress-text", `${Math.floor(gameState.totalFaith).toLocaleString()} / ${config.targetFaith === Infinity ? "∞" : config.targetFaith.toLocaleString()}`);
}

function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }

function showEvolutionModal(oldName, newName, evolution) {
    const modal = document.getElementById("evolution-modal"); if (!modal) return;
    setText("evolution-emoji", evolution.emoji); setText("evolution-old-name", oldName); setText("evolution-new-name", newName);
    modal.classList.remove("hidden");
    const sc = modal.querySelector(".evolution-stars"); if (sc) { sc.innerHTML = ""; for (let i=0;i<20;i++) { const s = document.createElement("div"); s.className = "evolution-star"; s.style.left = Math.random()*100+"%"; s.style.top = Math.random()*100+"%"; s.style.animationDelay = Math.random()*0.5+"s"; s.textContent = ["✨","⭐","🌟","💫"][Math.floor(Math.random()*4)]; sc.appendChild(s); } }
    updateAllUI();
}
function closeEvolutionModal() { const m = document.getElementById("evolution-modal"); if (m) m.classList.add("hidden"); }

function applyZoom() { const pa = document.getElementById("play-area"); if (!pa) return; pa.style.transform = `scale(${currentZoom})`; pa.style.transformOrigin = "center center"; pa.style.transition = "transform 0.2s ease"; measurePlayArea(); }
function handleZoom(e) { if (!e.ctrlKey) return; e.preventDefault(); const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP; const nz = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, currentZoom + delta)); if (nz !== currentZoom) { currentZoom = nz; applyZoom(); } }

function showScreen(id) { document.querySelectorAll(".screen").forEach(s => s.classList.remove("active")); const s = document.getElementById(id); if (s) s.classList.add("active"); }
function startGameLoops() { moveIntervalId = setInterval(movePeople, 50); restartSpawnTimer(); autoFaithIntervalId = setInterval(produceAutoFaith, 1000); saveIntervalId = setInterval(saveGame, 5000); prophecyIntervalId = setInterval(prophecyAttack, 5000); }
function stopGameLoops() { if (moveIntervalId) clearInterval(moveIntervalId); if (spawnIntervalId) clearInterval(spawnIntervalId); if (autoFaithIntervalId) clearInterval(autoFaithIntervalId); if (saveIntervalId) clearInterval(saveIntervalId); if (prophecyIntervalId) clearInterval(prophecyIntervalId); stopAutoAttack(); moveIntervalId=spawnIntervalId=autoFaithIntervalId=saveIntervalId=prophecyIntervalId=null; }

function startNewGame() {
    stopGameLoops(); clearSaveData();
    if (currentSeed === 0) { currentSeed = Date.now(); }
    seededRandom = createSeededRandom(currentSeed);
    currentZoom = 1.0; applyZoom();
    gameState = { faith:0, totalFaith:0, followers:0, currentFollowers:0, attackPower:1, attackSpeed:BASE_ATTACK_SPEED, clickRadius:30, critChance:0, critMult:5, stageIndex:0, godEvolution:0, upgrades:{}, originalArea:"", originalAreaIndex:0, originalTarget:"", originalPower:"", currentGodName:"", currentSkin:"default", people:[], eventLogs:[], isEnding:false, endingSeen:false, currentScreen:"play", lastEvolutionShown:-1 };
    generateGodName();
    applyUpgradeEffects();
    showScreen("game-screen"); clearAllPeople();
    setTimeout(() => { measurePlayArea(); applyStageBackground(); spawnInitialPeople(); updateAllUI(); switchScreen("play"); startGameLoops(); }, 100);
}

function startBrandNewGame() {
    stopGameLoops(); clearSaveData();
    currentSeed = Date.now();
    localStorage.removeItem(GOD_NAME_KEY);
    seededRandom = createSeededRandom(currentSeed);
    currentZoom = 1.0; applyZoom();
    gameState = { faith:0, totalFaith:0, followers:0, currentFollowers:0, attackPower:1, attackSpeed:BASE_ATTACK_SPEED, clickRadius:30, critChance:0, critMult:5, stageIndex:0, godEvolution:0, upgrades:{}, originalArea:"", originalAreaIndex:0, originalTarget:"", originalPower:"", currentGodName:"", currentSkin:"default", people:[], eventLogs:[], isEnding:false, endingSeen:false, currentScreen:"play", lastEvolutionShown:-1 };
    generateGodName();
    applyUpgradeEffects();
    showScreen("game-screen"); clearAllPeople();
    setTimeout(() => { measurePlayArea(); applyStageBackground(); spawnInitialPeople(); updateAllUI(); switchScreen("play"); startGameLoops(); }, 100);
}

function continueGame() {
    showScreen("game-screen"); applyUpgradeEffects(); updateGodEvolution();
    setTimeout(() => { measurePlayArea(); applyStageBackground(); if (gameState.people.length === 0) spawnInitialPeople(); updateAllUI(); switchScreen("play"); startGameLoops(); }, 100);
}

function setupEventListeners() {
    document.getElementById("generate-btn").addEventListener("click", () => {
        currentSeed = Date.now();
        generateGodName();
        setText("generated-god-name", gameState.currentGodName);
        setText("start-followers", "0");
        setText("start-power", gameState.originalPower);
        document.getElementById("god-info").classList.remove("hidden");
        document.getElementById("start-game-btn").classList.remove("hidden");
    });
    document.getElementById("start-game-btn").addEventListener("click", () => { startNewGame(); });
    const playArea = document.getElementById("play-area");
    playArea.addEventListener("mousedown", (e) => { e.preventDefault(); startAutoAttack(e.clientX, e.clientY); });
    playArea.addEventListener("mousemove", (e) => { if (isMouseDown) { mouseClientX = e.clientX; mouseClientY = e.clientY; } });
    window.addEventListener("mouseup", () => { stopAutoAttack(); });
    playArea.addEventListener("touchstart", (e) => { e.preventDefault(); const t = e.touches[0]; startAutoAttack(t.clientX, t.clientY); }, { passive: false });
    playArea.addEventListener("touchmove", (e) => { e.preventDefault(); if (isMouseDown && e.touches.length > 0) { const t = e.touches[0]; mouseClientX = t.clientX; mouseClientY = t.clientY; } }, { passive: false });
    window.addEventListener("touchend", () => { stopAutoAttack(); });
    playArea.addEventListener("wheel", handleZoom, { passive: false });
    const tp = document.getElementById("tab-play"), tt = document.getElementById("tab-temple"), ti = document.getElementById("tab-info");
    if (tp) tp.addEventListener("click", () => switchScreen("play"));
    if (tt) tt.addEventListener("click", () => switchScreen("temple"));
    if (ti) ti.addEventListener("click", () => switchScreen("info"));
    const sc = document.getElementById("share-copy-btn"); if (sc) sc.addEventListener("click", shareToClipboard);
    const st = document.getElementById("share-twitter-btn"); if (st) st.addEventListener("click", shareToTwitter);
    const sl = document.getElementById("share-link-btn"); if (sl) sl.addEventListener("click", shareSeedLink);
    const si = document.getElementById("share-image-btn"); if (si) si.addEventListener("click", shareAsImage);
    const sk = document.getElementById("share-kakao-btn"); if (sk) sk.addEventListener("click", shareToKakao);
    const sg = document.getElementById("share-instagram-btn"); if (sg) sg.addEventListener("click", shareToInstagram);
    const ng = document.getElementById("new-game-btn");
    if (ng) ng.addEventListener("click", () => { if (confirm("정말 새 게임을 시작하시겠습니까? 진행 상황이 사라집니다.")) { startBrandNewGame(); } });
    const ec = document.getElementById("ending-continue-btn");
    if (ec) { const nb = ec.cloneNode(true); ec.parentNode.replaceChild(nb, ec); nb.addEventListener("click", continueAfterEnding); }
    const es = document.getElementById("ending-share-btn");
    if (es) es.addEventListener("click", () => { copyToClipboard(`나는 «${gameState.currentGodName}»에서 유일신이 되었다!\n\n최종 신도: ${gameState.followers.toLocaleString()}명\n누적 믿음: ${Math.floor(gameState.totalFaith).toLocaleString()}\n\n#우리동네신키우기`).then(s => { if (s) showToast("결과가 복사되었습니다!"); }); });
    const en = document.getElementById("ending-new-game-btn");
    if (en) en.addEventListener("click", () => { startBrandNewGame(); });
    const ev = document.getElementById("evolution-close-btn");
    if (ev) ev.addEventListener("click", closeEvolutionModal);
    window.addEventListener("resize", () => { measurePlayArea(); });
}

function handleClickEmpty(cx, cy) {
    const pa = document.getElementById("play-area"); const rect = pa.getBoundingClientRect();
    const clickX = (cx - rect.left)/currentZoom, clickY = (cy - rect.top)/currentZoom;
    let closest = null, closestDist = Infinity;
    const radius = gameState.clickRadius;
    gameState.people.forEach(p => { const px = p.x+12, py = p.y+12; const dist = Math.sqrt((clickX-px)**2+(clickY-py)**2); if (dist <= radius && dist < closestDist) { closest = p; closestDist = dist; } });
    if (closest) handleAttack(cx, cy, closest); else createClickEffect(clickX, clickY, radius);
}

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const seedParam = urlParams.get("seed");
    const hasSave = loadGame();
    setupEventListeners();
    if (seedParam) {
        currentSeed = parseInt(seedParam, 10);
        seededRandom = createSeededRandom(currentSeed);
        gameState = { faith:0, totalFaith:0, followers:0, currentFollowers:0, attackPower:1, attackSpeed:BASE_ATTACK_SPEED, clickRadius:30, critChance:0, critMult:5, stageIndex:0, godEvolution:0, upgrades:{}, originalArea:"", originalAreaIndex:0, originalTarget:"", originalPower:"", currentGodName:"", currentSkin:"default", people:[], eventLogs:[], isEnding:false, endingSeen:false, currentScreen:"play", lastEvolutionShown:-1 };
        generateGodName();
        setText("generated-god-name", gameState.currentGodName);
        setText("start-followers", "0");
        setText("start-power", gameState.originalPower);
        document.getElementById("god-info").classList.remove("hidden");
        document.getElementById("start-game-btn").classList.remove("hidden");
        showToast(`시드 ${currentSeed}로 같은 신을 생성합니다!`);
    } else if (hasSave && !gameState.isEnding) {
        const savedName = localStorage.getItem(GOD_NAME_KEY);
        if (savedName) gameState.currentGodName = savedName;
        setText("generated-god-name", gameState.currentGodName);
        setText("start-followers", gameState.followers.toString());
        setText("start-power", gameState.originalPower || "기적");
        document.getElementById("god-info").classList.remove("hidden");
        document.getElementById("start-game-btn").textContent = "이어하기";
        document.getElementById("start-game-btn").classList.remove("hidden");
        const sb = document.getElementById("start-game-btn");
        const nb = sb.cloneNode(true); sb.parentNode.replaceChild(nb, sb);
        nb.addEventListener("click", continueGame);
        const ngs = document.createElement("button"); ngs.className = "btn btn-primary"; ngs.textContent = "새 게임 시작";
        ngs.addEventListener("click", () => { if (confirm("새 게임을 시작하면 저장된 데이터가 사라집니다.")) { startBrandNewGame(); } });
        nb.parentNode.insertBefore(ngs, nb.nextSibling);
    }
    showScreen("start-screen");
}

window.initGame = init;