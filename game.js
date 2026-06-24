// 게임 상수
const COLS = 6;
const ROWS = 13;
const CELL_SIZE = 45;
const OFFSET_X = 15;
const OFFSET_Y = 25;

// 뿌요 색상
const COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#56ab2f'];

// 게임 상태
let board = [];
let currentPuyo = null;
let nextPuyo = null;
let score = 0;
let chain = 0;
let gameRunning = false;
let gamePaused = false;
let dropInterval = null;
let dropSpeed = 500;

// 캔버스
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-canvas');
const nextCtx = nextCanvas.getContext('2d');

// 버튼
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const restartBtn = document.getElementById('restart-btn');
const retryBtn = document.getElementById('retry-btn');
const gameOverDiv = document.getElementById('game-over');

// Puyo 클래스
class Puyo {
    constructor(x, y, colorIndex) {
        this.x = x;
        this.y = y;
        this.colorIndex = colorIndex;
    }

    draw(context, offsetX = OFFSET_X, offsetY = OFFSET_Y, size = CELL_SIZE) {
        const x = offsetX + this.x * size;
        const y = offsetY + this.y * size;
        
        // 기본 원
        context.beginPath();
        context.arc(x + size/2, y + size/2, size/2 - 3, 0, Math.PI * 2);
        context.fillStyle = COLORS[this.colorIndex];
        context.fill();
        
        // 하이라이트
        context.beginPath();
        context.arc(x + size/2 - 5, y + size/2 - 5, size/4 - 2, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 255, 255, 0.4)';
        context.fill();
        
        // 테두리
        context.beginPath();
        context.arc(x + size/2, y + size/2, size/2 - 3, 0, Math.PI * 2);
        context.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        context.lineWidth = 2;
        context.stroke();
    }
}

// 게임 보드 초기화
function initBoard() {
    board = [];
    for (let i = 0; i < ROWS; i++) {
        board[i] = [];
        for (let j = 0; j < COLS; j++) {
            board[i][j] = null;
        }
    }
}

// 새 뿌요 생성
function createPuyo() {
    const color1 = Math.floor(Math.random() * COLORS.length);
    const color2 = Math.floor(Math.random() * COLORS.length);
    
    return {
        puyo1: new Puyo(2, 0, color1),
        puyo2: new Puyo(3, 0, color2),
        rotation: 0
    };
}

// 다음 뿌요 미리보기 그리기
function drawNextPuyo() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (nextPuyo) {
        const size = 30;
        nextPuyo.puyo1.draw(nextCtx, 10, 20, size);
        nextPuyo.puyo2.draw(nextCtx, 40, 20, size);
    }
}

// 게임 보드 그리기
function drawBoard() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 격자 그리기
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(OFFSET_X + i * CELL_SIZE, OFFSET_Y);
        ctx.lineTo(OFFSET_X + i * CELL_SIZE, OFFSET_Y + ROWS * CELL_SIZE);
        ctx.stroke();
    }
    for (let i = 0; i <= ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(OFFSET_X, OFFSET_Y + i * CELL_SIZE);
        ctx.lineTo(OFFSET_X + COLS * CELL_SIZE, OFFSET_Y + i * CELL_SIZE);
        ctx.stroke();
    }
    
    // 보드에 있는 뿌요 그리기
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (board[i][j]) {
                board[i][j].draw(ctx);
            }
        }
    }
    
    // 현재 뿌요 그리기
    if (currentPuyo && currentPuyo.puyo1 && currentPuyo.puyo2) {
        currentPuyo.puyo1.draw(ctx);
        currentPuyo.puyo2.draw(ctx);
    }
}

// 뿌요 이동
function movePuyo(dx, dy) {
    if (!currentPuyo || !gameRunning || gamePaused) return false;
    
    const newX1 = currentPuyo.puyo1.x + dx;
    const newY1 = currentPuyo.puyo1.y + dy;
    const newX2 = currentPuyo.puyo2.x + dx;
    const newY2 = currentPuyo.puyo2.y + dy;
    
    // 충돌 체크
    if (checkCollision(newX1, newY1, currentPuyo.puyo1) || 
        checkCollision(newX2, newY2, currentPuyo.puyo2)) {
        return false;
    }
    
    currentPuyo.puyo1.x = newX1;
    currentPuyo.puyo1.y = newY1;
    currentPuyo.puyo2.x = newX2;
    currentPuyo.puyo2.y = newY2;
    
    return true;
}

// 회전
function rotatePuyo() {
    if (!currentPuyo || !gameRunning || gamePaused) return;
    
    const centerX = currentPuyo.puyo1.x;
    const centerY = currentPuyo.puyo1.y;
    
    const dx = currentPuyo.puyo2.x - centerX;
    const dy = currentPuyo.puyo2.y - centerY;
    
    // 시계 방향 회전
    const newDx = -dy;
    const newDy = dx;
    
    const newX = centerX + newDx;
    const newY = centerY + newDy;
    
    // 충돌 체크
    if (!checkCollision(newX, newY, currentPuyo.puyo2)) {
        currentPuyo.puyo2.x = newX;
        currentPuyo.puyo2.y = newY;
    } else {
        // 벽에 붙어있을 경우 반대편으로 회전
        const altX = centerX - newDx;
        const altY = centerY - newDy;
        if (!checkCollision(altX, altY, currentPuyo.puyo2)) {
            currentPuyo.puyo2.x = altX;
            currentPuyo.puyo2.y = altY;
        }
    }
}

// 충돌 체크
function checkCollision(x, y, self) {
    if (x < 0 || x >= COLS || y >= ROWS) return true;
    if (y < 0) return false;
    
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (board[i][j] && board[i][j] !== self) {
                if (board[i][j].x === x && board[i][j].y === y) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

// 뿌요 배치
function placePuyo() {
    board[currentPuyo.puyo1.y][currentPuyo.puyo1.x] = currentPuyo.puyo1;
    board[currentPuyo.puyo2.y][currentPuyo.puyo2.x] = currentPuyo.puyo2;
    currentPuyo = null;
}

// 연결된 뿌요 찾기
function findConnectedPuyo(x, y, colorIndex, visited) {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return [];
    if (visited[y][x]) return [];
    if (!board[y][x] || board[y][x].colorIndex !== colorIndex) return [];
    
    visited[y][x] = true;
    let connected = [{x, y}];
    
    connected = connected.concat(findConnectedPuyo(x+1, y, colorIndex, visited));
    connected = connected.concat(findConnectedPuyo(x-1, y, colorIndex, visited));
    connected = connected.concat(findConnectedPuyo(x, y+1, colorIndex, visited));
    connected = connected.concat(findConnectedPuyo(x, y-1, colorIndex, visited));
    
    return connected;
}

// 뿌요 삭제
function removePuyo() {
    const visited = [];
    for (let i = 0; i < ROWS; i++) {
        visited[i] = [];
        for (let j = 0; j < COLS; j++) {
            visited[i][j] = false;
        }
    }
    
    let removed = false;
    let totalRemoved = 0;
    let chainCount = 0;
    
    while (true) {
        let removedInChain = false;
        const visitedChain = [];
        for (let i = 0; i < ROWS; i++) {
            visitedChain[i] = [];
            for (let j = 0; j < COLS; j++) {
                visitedChain[i][j] = false;
            }
        }
        
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                if (board[i][j] && !visitedChain[i][j]) {
                    const connected = findConnectedPuyo(j, i, board[i][j].colorIndex, visitedChain);
                    if (connected.length >= 4) {
                        removedInChain = true;
                        removed = true;
                        totalRemoved += connected.length;
                        
                        for (const pos of connected) {
                            board[pos.y][pos.x] = null;
                        }
                    }
                }
            }
        }
        
        if (removedInChain) {
            chainCount++;
            applyGravity();
        } else {
            break;
        }
    }
    
    if (removed) {
        // 점수 계산
        const chainBonus = Math.pow(2, chainCount - 1) * 100;
        const countBonus = (totalRemoved - 3) * 100;
        const addScore = chainBonus * countBonus * chainCount;
        score += addScore;
        chain = chainCount;
        
        updateScore();
    } else {
        chain = 0;
        updateScore();
    }
    
    return removed;
}

// 중력 적용
function applyGravity() {
    for (let j = 0; j < COLS; j++) {
        let emptyRow = ROWS - 1;
        for (let i = ROWS - 1; i >= 0; i--) {
            if (board[i][j]) {
                if (i !== emptyRow) {
                    board[emptyRow][j] = board[i][j];
                    board[emptyRow][j].y = emptyRow;
                    board[i][j] = null;
                }
                emptyRow--;
            }
        }
    }
}

// 현재 뿌요가 바닥에 닿았는지 체크
function isOnGround() {
    if (!currentPuyo) return false;
    
    const y1 = currentPuyo.puyo1.y;
    const y2 = currentPuyo.puyo2.y;
    
    if (y1 >= ROWS - 1 || y2 >= ROWS - 1) return true;
    
    return checkCollision(currentPuyo.puyo1.x, currentPuyo.puyo1.y + 1, currentPuyo.puyo1) ||
           checkCollision(currentPuyo.puyo2.x, currentPuyo.puyo2.y + 1, currentPuyo.puyo2);
}

// 하드 드롭
function hardDrop() {
    if (!currentPuyo || !gameRunning || gamePaused) return;
    
    while (!isOnGround()) {
        movePuyo(0, 1);
    }
    
    lockPuyo();
}

// 뿌요 고정
function lockPuyo() {
    placePuyo();
    drawBoard();
    
    // 게임 오버 체크
    if (board[0][2] || board[0][3]) {
        gameOver();
        return;
    }
    
    // 뿌요 삭제
    setTimeout(() => {
        removePuyo();
        drawBoard();
        
        // 새 뿌요 생성
        setTimeout(() => {
            currentPuyo = nextPuyo;
            nextPuyo = createPuyo();
            drawNextPuyo();
            drawBoard();
        }, 200);
    }, 200);
}

// 점수 업데이트
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('chain').textContent = chain;
}

// 게임 오버
function gameOver() {
    gameRunning = false;
    clearInterval(dropInterval);
    
    document.getElementById('final-score').textContent = score;
    gameOverDiv.classList.remove('hidden');
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    restartBtn.disabled = true;
}

// 게임 시작
function startGame() {
    initBoard();
    score = 0;
    chain = 0;
    updateScore();
    gameOverDiv.classList.add('hidden');
    
    currentPuyo = createPuyo();
    nextPuyo = createPuyo();
    drawNextPuyo();
    drawBoard();
    
    gameRunning = true;
    gamePaused = false;
    dropSpeed = 500;
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    restartBtn.disabled = false;
    
    clearInterval(dropInterval);
    dropInterval = setInterval(() => {
        if (!gamePaused) {
            if (!movePuyo(0, 1)) {
                lockPuyo();
            }
            drawBoard();
        }
    }, dropSpeed);
}

// 일시정지 토글
function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? '계속' : '일시정지';
}

// 키보드 입력 처리
document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            movePuyo(-1, 0);
            break;
        case 'ArrowRight':
            movePuyo(1, 0);
            break;
        case 'ArrowDown':
            if (!movePuyo(0, 1)) {
                lockPuyo();
            }
            break;
        case 'ArrowUp':
            rotatePuyo();
            break;
        case ' ':
            e.preventDefault();
            hardDrop();
            break;
    }
    
    drawBoard();
});

// 이벤트 리스너
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', startGame);
retryBtn.addEventListener('click', startGame);

// 초기 화면 그리기
initBoard();
drawBoard();