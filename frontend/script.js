const APP_UNLOCKED_KEY = 'ourLoveSpaceUnlocked';
const MILESTONES_KEY = 'ourLoveSpaceMilestones';
const NOTES_KEY = 'ourLoveSpaceNotes';

function handlePasscode(e) {
    e.preventDefault();
    const val = document.getElementById('passcode-input').value;
    if (val === '0601' || val === '1234') {
        unlockApp();
    } else {
        const err = document.getElementById('lock-error');
        err.classList.remove('hidden');
        setTimeout(() => err.classList.add('hidden'), 3000);
    }
}

function bypassLock() {
    unlockApp();
}

function unlockApp() {
    sessionStorage.setItem(APP_UNLOCKED_KEY, 'true');
    document.documentElement.classList.add('app-unlocked');
    document.getElementById('lock-screen').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('lock-screen').style.display = 'none';
    }, 300);
}

function lockApp() {
    if (typeof logoutAccount === 'function') {
        logoutAccount();
        return;
    }
    sessionStorage.removeItem(APP_UNLOCKED_KEY);
    document.documentElement.classList.remove('app-unlocked');
    document.getElementById('lock-screen').style.display = 'flex';
    document.getElementById('lock-screen').style.opacity = '1';
    document.getElementById('passcode-input').value = '';
}

const startDate = new Date('2026-01-06T00:00:00');

function updateCounter() {
    const daysEl = document.getElementById('counter-days');
    if (!daysEl) return;
    const now = new Date();
    const diff = now - startDate;
    if (diff < 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.innerText = days.toLocaleString();
    document.getElementById('counter-hours').innerText = hours;
    document.getElementById('counter-minutes').innerText = minutes;
    document.getElementById('counter-seconds').innerText = seconds;
}
setInterval(updateCounter, 1000);

function loadStoredData() {
    try {
        const savedMilestones = JSON.parse(localStorage.getItem(MILESTONES_KEY) || 'null');
        if (Array.isArray(savedMilestones) && savedMilestones.length) {
            milestones = savedMilestones;
        }

        const savedNotes = JSON.parse(localStorage.getItem(NOTES_KEY) || 'null');
        if (Array.isArray(savedNotes) && savedNotes.length) {
            notes = savedNotes;
        }
    } catch (error) {
        console.warn('Failed to load saved data:', error);
    }
}

let milestones = [
    { id: 1, title: "วันแรกที่ตกลงเป็นแฟนกัน 💖", date: "2026-01-06", icon: "💍" },
    { id: 2, title: "ทริปเที่ยวทะเลครั้งแรก 🌊", date: "2026-03-15", icon: "🏖️" },
    { id: 3, title: "วันครบรอบ 1 ปีความรัก ✨", date: "2027-01-06", icon: "🎉" }
];

let notes = [
    { id: 1, author: "ที่รักเอง", content: "อย่าลืมทานข้าวกลางวันนะคับ เป็นห่วงเสมอ 💖", color: "bg-pink-100 text-pink-900 border-pink-200", date: "วันนี้ 12:30" },
    { id: 2, author: "แฟนสุดสวย", content: "วันเสาร์นี้ไปคาเฟ่แมวกัน ห้ามเบี้ยวนะ! 🐱", color: "bg-yellow-100 text-yellow-900 border-yellow-200", date: "เมื่อวาน" }
];

loadStoredData();

function saveMilestones() {
    localStorage.setItem(MILESTONES_KEY, JSON.stringify(milestones));
}

function saveNotes() {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function renderMilestones() {
    const container = document.getElementById('milestones-container');
    if (!container) return;
    container.innerHTML = '';

    milestones.forEach(m => {
        const targetDate = new Date(m.date);
        const today = new Date();
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let badgeHtml = '';
        if (diffDays > 0) {
            badgeHtml = `<span class="bg-rose-50 text-[#E11D48] px-2.5 py-1 rounded-xl text-[11px] font-bold">อีก ${diffDays} วัน</span>`;
        } else if (diffDays === 0) {
            badgeHtml = `<span class="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-xl text-[11px] font-bold">วันนี้! 🎉</span>`;
        } else {
            badgeHtml = `<span class="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-xl text-[11px] font-bold">ผ่านมาแล้ว ${Math.abs(diffDays)} วัน</span>`;
        }

        const card = document.createElement('div');
        card.className = "bg-gradient-to-br from-pink-50/50 to-rose-50/50 p-4 rounded-2xl border border-pink-100 shadow-2xs";
        card.innerHTML = `
            <div class="flex items-center justify-between gap-3">
                <div class="flex items-center space-x-3 min-w-0">
                    <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-pink-100 flex-shrink-0">${m.icon}</div>
                    <div class="min-w-0">
                        <h4 class="text-sm font-bold text-gray-800 break-words">${m.title}</h4>
                        <p class="text-xs text-gray-500">${m.date}</p>
                    </div>
                </div>
                <div class="flex flex-col items-end gap-2">
                    ${badgeHtml}
                    <div class="flex items-center gap-1">
                        <button type="button" data-milestone-action="edit" data-milestone-id="${m.id}" class="px-2 py-1 text-[10px] font-bold rounded-lg bg-white text-amber-600 border border-amber-200 hover:bg-amber-50">✏️</button>
                        <button type="button" data-milestone-action="delete" data-milestone-id="${m.id}" class="px-2 py-1 text-[10px] font-bold rounded-lg bg-white text-rose-600 border border-rose-200 hover:bg-rose-50">🗑️</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

containerEventSetup();

function containerEventSetup() {
    const container = document.getElementById('milestones-container');
    if (!container || container.dataset.bound === 'true') return;
    container.addEventListener('click', (event) => {
        const button = event.target.closest('[data-milestone-action]');
        if (!button) return;

        const action = button.getAttribute('data-milestone-action');
        const id = Number(button.getAttribute('data-milestone-id'));

        if (action === 'delete') {
            deleteMilestone(id);
        }

        if (action === 'edit') {
            openMilestoneEditor(id);
        }
    });
    container.dataset.bound = 'true';
}

function openMilestoneModal() {
    const modal = document.getElementById('milestone-modal');
    if (!modal) return;
    document.getElementById('m-id').value = '';
    document.getElementById('m-title').value = '';
    document.getElementById('m-date').value = '';
    document.getElementById('m-icon').value = '💖';
    document.getElementById('milestone-modal-title').textContent = '🗓️ เพิ่มวันสำคัญใหม่';
    modal.classList.remove('hidden');
}

function openMilestoneEditor(id) {
    const target = milestones.find(item => item.id === id);
    if (!target) return;
    const modal = document.getElementById('milestone-modal');
    if (!modal) return;
    document.getElementById('m-id').value = target.id;
    document.getElementById('m-title').value = target.title;
    document.getElementById('m-date').value = target.date;
    document.getElementById('m-icon').value = target.icon;
    document.getElementById('milestone-modal-title').textContent = '✏️ แก้ไขวันสำคัญ';
    modal.classList.remove('hidden');
}

function closeMilestoneModal() { const modal = document.getElementById('milestone-modal'); if (modal) modal.classList.add('hidden'); }

function deleteMilestone(id) {
    milestones = milestones.filter(item => item.id !== id);
    saveMilestones();
    renderMilestones();
}

function handleSaveMilestone(e) {
    e.preventDefault();
    const id = document.getElementById('m-id').value;
    const title = document.getElementById('m-title').value.trim();
    const date = document.getElementById('m-date').value;
    const icon = document.getElementById('m-icon').value.trim() || '💖';

    if (!title || !date) return;

    if (id) {
        const index = milestones.findIndex(item => item.id === Number(id));
        if (index >= 0) {
            milestones[index] = { ...milestones[index], title, date, icon };
        }
    } else {
        milestones.push({ id: Date.now(), title, date, icon });
    }

    saveMilestones();
    renderMilestones();
    closeMilestoneModal();
    e.target.reset();
    document.getElementById('m-id').value = '';
}

function renderBulletinNotes() {
    const grid = document.getElementById('bulletin-notes-grid');
    if (!grid) return;
    grid.innerHTML = '';

    notes.forEach(n => {
        const noteEl = document.createElement('div');
        noteEl.className = `${n.color} p-4 rounded-2xl border shadow-md flex flex-col justify-between transform hover:-translate-y-1 transition`;
        noteEl.innerHTML = `
            <div class="flex justify-end gap-1 mb-2">
                <button type="button" data-note-action="edit" data-note-id="${n.id}" class="px-2 py-1 text-[10px] font-bold rounded-lg bg-white/80 text-amber-600">✏️</button>
                <button type="button" data-note-action="delete" data-note-id="${n.id}" class="px-2 py-1 text-[10px] font-bold rounded-lg bg-white/80 text-rose-600">🗑️</button>
            </div>
            <p class="text-xs font-medium mb-4 leading-relaxed">${n.content}</p>
            <div class="flex justify-between items-center text-[10px] opacity-80 pt-2 border-t border-current/20">
                <span class="font-bold">- ${n.author}</span>
                <span>${n.date}</span>
            </div>
        `;
        grid.appendChild(noteEl);
    });
}

function bindBulletinGrid() {
    const grid = document.getElementById('bulletin-notes-grid');
    if (!grid || grid.dataset.bound === 'true') return;
    grid.addEventListener('click', (event) => {
        const button = event.target.closest('[data-note-action]');
        if (!button) return;

        const action = button.getAttribute('data-note-action');
        const id = Number(button.getAttribute('data-note-id'));

        if (action === 'delete') {
            notes = notes.filter(note => note.id !== id);
            saveNotes();
            renderBulletinNotes();
        }

        if (action === 'edit') {
            const target = notes.find(item => item.id === id);
            if (!target) return;
            openNoteEditor(target);
        }
    });
    grid.dataset.bound = 'true';
}

function openNoteEditor(note) {
    const modal = document.getElementById('note-modal');
    if (!modal) return;
    document.getElementById('note-edit-id').value = note.id;
    document.getElementById('note-edit-author').value = note.author;
    document.getElementById('note-edit-color').value = note.color;
    document.getElementById('note-edit-content').value = note.content;
    document.getElementById('note-modal-title').textContent = '✏️ แก้ไขโพสต์อิท';
    modal.classList.remove('hidden');
}

function closeNoteModal() {
    const modal = document.getElementById('note-modal');
    if (modal) modal.classList.add('hidden');
}

function addBulletinNote(e) {
    e.preventDefault();
    const author = document.getElementById('note-author').value.trim();
    const content = document.getElementById('note-content').value.trim();
    const color = document.getElementById('note-color').value;

    if (!author || !content) return;

    notes.unshift({ id: Date.now(), author, content, color, date: "เมื่อสักครู่" });
    saveNotes();
    renderBulletinNotes();
    e.target.reset();
}

function handleSaveNote(e) {
    e.preventDefault();
    const id = Number(document.getElementById('note-edit-id').value);
    const author = document.getElementById('note-edit-author').value.trim();
    const color = document.getElementById('note-edit-color').value;
    const content = document.getElementById('note-edit-content').value.trim();

    if (!author || !content) return;

    const noteIndex = notes.findIndex(item => item.id === id);
    if (noteIndex >= 0) {
        notes[noteIndex] = { ...notes[noteIndex], author, color, content, date: 'แก้ไขแล้ว' };
        saveNotes();
        renderBulletinNotes();
    }

    closeNoteModal();
    e.target.reset();
}

bindBulletinGrid();
renderMilestones();
renderBulletinNotes();

function switchGame(gameId) {
    const ploxC = document.getElementById('game-plox-container');
    if (!ploxC) return;
    
    ploxC.classList.add('hidden');
    document.getElementById('game-memory-container').classList.add('hidden');
    document.getElementById('game-catch-container').classList.add('hidden');
    document.getElementById('game-monopoly-container').classList.add('hidden');

    ['plox', 'memory', 'catch', 'monopoly'].forEach(g => {
        const btn = document.getElementById('btn-game-' + g);
        if (btn) btn.className = "bouncy-btn px-4 py-2 rounded-xl font-bold text-xs bg-pink-100 text-[#E11D48] shadow-xs transition flex items-center space-x-1.5";
    });

    document.getElementById('game-' + gameId + '-container').classList.remove('hidden');
    const activeBtn = document.getElementById('btn-game-' + gameId);
    if (activeBtn) activeBtn.className = "bouncy-btn px-4 py-2 rounded-xl font-bold text-xs bg-[#E11D48] text-white shadow-md transition flex items-center space-x-1.5";

    if (gameId === 'plox') initPloxGame();
    if (gameId === 'memory') initMemoryGame();
    if (gameId === 'monopoly') resetMonopolySetup();
}

const PLOX_ROWS = 10;
const PLOX_COLS = 6;
let ploxBoard = [];
let ploxScore = 0;
let ploxCombo = 0;
let ploxInterval = null;
let ploxGameOver = false;
let ploxBoardInitialized = false;
let ploxCellElements = [];

const ploxItems = [
    { id: 1, name: '❤️', bg: 'bg-rose-500 shadow-rose-500/50' },
    { id: 2, name: '🍓', bg: 'bg-pink-500 shadow-pink-500/50' },
    { id: 3, name: '⭐', bg: 'bg-amber-400 shadow-amber-400/50' },
    { id: 4, name: '🎁', bg: 'bg-purple-500 shadow-purple-500/50' }
];

let currentPlox = { row: 0, col: 2, items: [1, 2] };
let nextPloxItems = [1, 2];

function getRandomPloxItem() {
    return Math.floor(Math.random() * ploxItems.length) + 1;
}

function playPloxSound(type) {
    if (typeof Tone === 'undefined') return;
    try {
        if (!window.ploxSynth) {
            Tone.start();
            window.ploxSynth = new Tone.Synth().toDestination();
        }
        if (type === 'pop') window.ploxSynth.triggerAttackRelease('C5', '16n');
        if (type === 'match') {
            window.ploxSynth.triggerAttackRelease('E5', '8n');
            setTimeout(() => window.ploxSynth.triggerAttackRelease('G5', '8n'), 100);
        }
        if (type === 'gameover') window.ploxSynth.triggerAttackRelease('G2', '4n');
    } catch (error) {
        // Audio is optional and may be blocked until the first user gesture.
    }
}

function initPloxGame() {
    const board = document.getElementById('plox-board');
    if (!board) return;
    ploxBoard = Array(PLOX_ROWS).fill(null).map(() => Array(PLOX_COLS).fill(0));
    ploxScore = 0;
    ploxCombo = 0;
    ploxGameOver = false;
    document.getElementById('plox-score').textContent = '0';
    document.getElementById('plox-combo').textContent = '0x';
    document.getElementById('plox-status').textContent = 'เรียงบล็อกสีหัวใจหรือผลไม้ 3 ชิ้นขึ้นไปเพื่อทำคะแนน! ✨';
    document.getElementById('plox-gameover-overlay')?.classList.add('hidden');
    nextPloxItems = [getRandomPloxItem(), getRandomPloxItem()];
    spawnNewPlox();
    renderPloxBoard();
    clearInterval(ploxInterval);
    ploxInterval = setInterval(ploxGameLoop, 700);
}

function spawnNewPlox() {
    currentPlox = { row: 0, col: 2, items: [...nextPloxItems] };
    nextPloxItems = [getRandomPloxItem(), getRandomPloxItem()];
    if (!canMovePlox(currentPlox.row, currentPlox.col)) triggerPloxGameOver();
    renderNextPloxPreview();
}

function renderNextPloxPreview() {
    const preview = document.getElementById('plox-next-preview');
    if (!preview) return;
    preview.innerHTML = '';
    nextPloxItems.forEach(id => {
        const item = ploxItems.find(entry => entry.id === id);
        const cell = document.createElement('div');
        cell.className = `w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-md ${item.bg}`;
        cell.textContent = item.name;
        preview.appendChild(cell);
    });
}

function ploxGameLoop() {
    if (ploxGameOver) return;
    if (canMovePlox(currentPlox.row + 1, currentPlox.col)) currentPlox.row++;
    else lockPloxPiece();
    renderPloxBoard();
}

function canMovePlox(row, col) {
    if (row < 0 || row + 1 >= PLOX_ROWS || col < 0 || col >= PLOX_COLS) return false;
    return ploxBoard[row][col] === 0 && ploxBoard[row + 1][col] === 0;
}

function getPloxGhostRow() {
    let ghostRow = currentPlox.row;
    while (canMovePlox(ghostRow + 1, currentPlox.col)) ghostRow++;
    return ghostRow;
}

function lockPloxPiece() {
    ploxBoard[currentPlox.row][currentPlox.col] = currentPlox.items[0];
    ploxBoard[currentPlox.row + 1][currentPlox.col] = currentPlox.items[1];
    renderPloxBoard();
    setTimeout(() => {
        if (ploxGameOver) return;
        processPloxMatchesAndGravity();
        spawnNewPlox();
        renderPloxBoard();
    }, 50);
}

function processPloxMatchesAndGravity() {
    let matchedAny = false;
    let matchesFound = true;
    let iterations = 0;

    while (matchesFound && iterations < 10) {
        matchesFound = false;
        const toClear = Array(PLOX_ROWS).fill(null).map(() => Array(PLOX_COLS).fill(false));

        for (let row = 0; row < PLOX_ROWS; row++) {
            for (let col = 0; col < PLOX_COLS - 2; col++) {
                const value = ploxBoard[row][col];
                if (!value) continue;
                let length = 1;
                while (col + length < PLOX_COLS && ploxBoard[row][col + length] === value) length++;
                if (length >= 3) {
                    for (let offset = 0; offset < length; offset++) toClear[row][col + offset] = true;
                    matchesFound = true;
                }
            }
        }

        for (let row = 0; row < PLOX_ROWS - 2; row++) {
            for (let col = 0; col < PLOX_COLS; col++) {
                const value = ploxBoard[row][col];
                if (!value) continue;
                let length = 1;
                while (row + length < PLOX_ROWS && ploxBoard[row + length][col] === value) length++;
                if (length >= 3) {
                    for (let offset = 0; offset < length; offset++) toClear[row + offset][col] = true;
                    matchesFound = true;
                }
            }
        }

        const diagonalDirections = [[1, 1], [1, -1]];
        diagonalDirections.forEach(([rowStep, colStep]) => {
            for (let row = 0; row < PLOX_ROWS; row++) {
                for (let col = 0; col < PLOX_COLS; col++) {
                    const value = ploxBoard[row][col];
                    if (!value) continue;

                    const previousRow = row - rowStep;
                    const previousCol = col - colStep;
                    if (
                        previousRow >= 0 && previousRow < PLOX_ROWS &&
                        previousCol >= 0 && previousCol < PLOX_COLS &&
                        ploxBoard[previousRow][previousCol] === value
                    ) continue;

                    let length = 1;
                    while (
                        row + length * rowStep >= 0 && row + length * rowStep < PLOX_ROWS &&
                        col + length * colStep >= 0 && col + length * colStep < PLOX_COLS &&
                        ploxBoard[row + length * rowStep][col + length * colStep] === value
                    ) length++;

                    if (length >= 3) {
                        for (let offset = 0; offset < length; offset++) {
                            toClear[row + offset * rowStep][col + offset * colStep] = true;
                        }
                        matchesFound = true;
                    }
                }
            }
        });

        if (matchesFound) {
            matchedAny = true;
            ploxCombo++;
            ploxScore += 100 * ploxCombo;
            playPloxSound('match');
            for (let row = 0; row < PLOX_ROWS; row++) {
                for (let col = 0; col < PLOX_COLS; col++) if (toClear[row][col]) ploxBoard[row][col] = 0;
            }
            for (let col = 0; col < PLOX_COLS; col++) {
                let writeRow = PLOX_ROWS - 1;
                for (let row = PLOX_ROWS - 1; row >= 0; row--) {
                    if (!ploxBoard[row][col]) continue;
                    const value = ploxBoard[row][col];
                    ploxBoard[row][col] = 0;
                    ploxBoard[writeRow--][col] = value;
                }
            }
        }
        iterations++;
    }

    if (!matchedAny) ploxCombo = 0;
    document.getElementById('plox-score').textContent = ploxScore;
    document.getElementById('plox-combo').textContent = `${ploxCombo}x`;
}

function triggerPloxGameOver() {
    ploxGameOver = true;
    clearInterval(ploxInterval);
    playPloxSound('gameover');
    document.getElementById('plox-final-score').textContent = `คะแนนรวม: ${ploxScore} คะแนน`;
    document.getElementById('plox-gameover-overlay')?.classList.remove('hidden');
    document.getElementById('plox-status').textContent = 'เกมจบแล้ว กดเล่นใหม่เพื่อเริ่มอีกครั้ง 💔';
}

function movePloxLeft() {
    if (ploxGameOver) return;
    if (currentPlox.col > 0 && canMovePlox(currentPlox.row, currentPlox.col - 1)) {
        currentPlox.col--;
        playPloxSound('pop');
        renderPloxBoard();
    }
}

function movePloxRight() {
    if (ploxGameOver) return;
    if (currentPlox.col < PLOX_COLS - 1 && canMovePlox(currentPlox.row, currentPlox.col + 1)) {
        currentPlox.col++;
        playPloxSound('pop');
        renderPloxBoard();
    }
}

function rotatePlox() {
    if (ploxGameOver) return;
    currentPlox.items.reverse();
    playPloxSound('pop');
    renderPloxBoard();
}

function hardDropPlox() {
    if (ploxGameOver) return;
    while (canMovePlox(currentPlox.row + 1, currentPlox.col)) currentPlox.row++;
    lockPloxPiece();
    renderPloxBoard();
}

function renderPloxBoard() {
    const board = document.getElementById('plox-board');
    if (!board) return;
    if (!ploxBoardInitialized || board.children.length !== PLOX_ROWS * PLOX_COLS) {
        board.innerHTML = '';
        ploxCellElements = [];
        for (let row = 0; row < PLOX_ROWS; row++) {
            ploxCellElements[row] = [];
            for (let col = 0; col < PLOX_COLS; col++) {
                const cell = document.createElement('div');
                cell.className = 'plox-cell rounded-xl flex items-center justify-center text-base shadow-inner';
                board.appendChild(cell);
                ploxCellElements[row][col] = cell;
            }
        }
        ploxBoardInitialized = true;
    }

    const ghostRow = getPloxGhostRow();
    const displayGrid = ploxBoard.map(row => [...row]);
    const ghostGrid = Array(PLOX_ROWS).fill(null).map(() => Array(PLOX_COLS).fill(false));
    if (!ploxGameOver) {
        if (ghostRow > currentPlox.row) {
            ghostGrid[ghostRow][currentPlox.col] = true;
            ghostGrid[ghostRow + 1][currentPlox.col] = true;
        }
        displayGrid[currentPlox.row][currentPlox.col] = currentPlox.items[0];
        displayGrid[currentPlox.row + 1][currentPlox.col] = currentPlox.items[1];
    }

    for (let row = 0; row < PLOX_ROWS; row++) {
        for (let col = 0; col < PLOX_COLS; col++) {
            const cell = ploxCellElements[row][col];
            const value = displayGrid[row][col];
            cell.className = 'plox-cell rounded-xl flex items-center justify-center text-base shadow-inner';
            cell.style.opacity = '';
            cell.textContent = '';
            if (!value) {
                if (ghostGrid[row][col]) {
                    cell.classList.add('ghost-cell');
                    const item = ploxItems.find(entry => entry.id === currentPlox.items[row === ghostRow ? 0 : 1]);
                    if (item) {
                        cell.textContent = item.name;
                        cell.style.opacity = '0.7';
                    }
                } else cell.classList.add('bg-gray-900/40', 'border', 'border-gray-800');
            } else {
                const item = ploxItems.find(entry => entry.id === value);
                if (item) {
                    cell.classList.add(...item.bg.split(' '));
                    cell.textContent = item.name;
                }
            }
        }
    }
}

const memorySymbols = ['💖', '💍', '🌸', '🎁', '⭐', '🍰', '🌈', '🦋', '🍓', '🎀', '🌙', '☀️', '🍭', '🐻', '🌷', '🎈', '🍩', '🧸', '🍉', '🎵', '🫶', '💌', '👑'];
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let memoryMoves = 0;
let memoryLevel = 1;
let memoryPairCount = 4;

function initMemoryGame(resetLevel = true) {
    const grid = document.getElementById('memory-grid');
    if (!grid) return;
    if (resetLevel) memoryLevel = 1;
    memoryPairCount = Math.min(3 + memoryLevel, memorySymbols.length);
    memoryCards = memorySymbols.slice(0, memoryPairCount).flatMap(symbol => [symbol, symbol]);
    memoryCards.sort(() => Math.random() - 0.5);
    matchedPairs = 0;
    memoryMoves = 0;
    flippedCards = [];
    grid.className = `grid grid-cols-4 gap-2 sm:gap-3 mb-3 ${memoryPairCount > 12 ? 'max-h-[25rem] overflow-y-auto' : ''}`;
    document.getElementById('memory-moves').innerText = memoryMoves;
    document.getElementById('memory-level').innerText = `${memoryLevel}/20`;
    const winMessage = document.getElementById('memory-win-msg');
    winMessage.classList.add('hidden');
    winMessage.innerText = '';
    document.getElementById('memory-next-btn').classList.add('hidden');

    grid.innerHTML = '';

    memoryCards.forEach((symbol, idx) => {
        const card = document.createElement('button');
        const cardSize = memoryPairCount > 12 ? 'w-12 h-12 text-xl' : 'w-16 h-16 text-2xl';
        card.className = `${cardSize} bg-pink-100 hover:bg-pink-200 rounded-2xl flex items-center justify-center shadow transition bouncy-btn`;
        card.dataset.symbol = symbol;
        card.dataset.index = idx;
        card.innerText = '❓';
        card.onclick = () => flipMemoryCard(card, symbol, idx);
        grid.appendChild(card);
    });
}

function flipMemoryCard(card, symbol, idx) {
    if (card.disabled || flippedCards.length >= 2) return;
    card.innerText = symbol;
    const cardSize = memoryPairCount > 12 ? 'w-12 h-12 text-xl' : 'w-16 h-16 text-2xl';
    card.className = `${cardSize} bg-white rounded-2xl flex items-center justify-center shadow border-2 border-rose-400`;
    flippedCards.push({ card, symbol, idx });

    if (flippedCards.length === 2) {
        memoryMoves++;
        document.getElementById('memory-moves').innerText = memoryMoves;
        const [c1, c2] = flippedCards;

        if (c1.symbol === c2.symbol && c1.idx !== c2.idx) {
            c1.card.disabled = true;
            c2.card.disabled = true;
            flippedCards = [];
            matchedPairs++;
            if (matchedPairs === memoryPairCount) {
                const winMessage = document.getElementById('memory-win-msg');
                winMessage.innerText = memoryLevel === 20 ? '🎉 ผ่านครบทั้ง 20 ระดับแล้ว เก่งมาก! 💖' : `🎉 ผ่านระดับ ${memoryLevel} แล้ว!`;
                winMessage.classList.remove('hidden');
                if (memoryLevel < 20) document.getElementById('memory-next-btn').classList.remove('hidden');
            }
        } else {
            setTimeout(() => {
                c1.card.innerText = '❓';
                c1.card.className = `${cardSize} bg-pink-100 hover:bg-pink-200 rounded-2xl flex items-center justify-center shadow transition bouncy-btn`;
                c2.card.innerText = '❓';
                c2.card.className = `${cardSize} bg-pink-100 hover:bg-pink-200 rounded-2xl flex items-center justify-center shadow transition bouncy-btn`;
                flippedCards = [];
            }, 800);
        }
    }
}

function nextMemoryLevel() {
    if (memoryLevel >= 20) return;
    memoryLevel++;
    initMemoryGame(false);
}

let catchScore = 0;
let catchInterval = null;
let catchBasketPosition = 50;
let catchMisses = 0;
let catchGameActive = false;
let catchRoundId = 0;

function startCatchGame() {
    const box = document.getElementById('catch-canvas-box');
    const basket = document.getElementById('catch-basket');
    if (!box) return;
    catchScore = 0;
    catchMisses = 0;
    catchGameActive = true;
    catchRoundId++;
    const roundId = catchRoundId;
    catchBasketPosition = 50;
    document.getElementById('catch-score').innerText = catchScore;
    document.getElementById('catch-misses').innerText = catchMisses;
    document.querySelector('#catch-start-overlay p').innerText = 'คลิกหรือแตะซ้าย-ขวาเพื่อขยับตะกร้าเก็บหัวใจ!';
    document.getElementById('catch-start-overlay').classList.add('hidden');
    updateCatchBasketPosition();

    box.querySelectorAll('.falling-heart').forEach(h => h.remove());

    if (catchInterval) clearInterval(catchInterval);
    box.onpointermove = (event) => moveCatchBasket(event.clientX, box);
    catchInterval = setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'falling-heart absolute text-xl select-none animate-bounce';
        heart.innerText = ['💖', '✨', '🌸', '💍'][Math.floor(Math.random() * 4)];
        heart.style.left = Math.floor(Math.random() * 85 + 5) + '%';
        heart.style.top = '0px';
        box.appendChild(heart);

        let pos = 0;
        const fall = setInterval(() => {
            if (!catchGameActive || roundId !== catchRoundId) {
                clearInterval(fall);
                heart.remove();
                return;
            }
            pos += 3;
            heart.style.top = pos + 'px';

            if (pos >= 205) {
                const heartRect = heart.getBoundingClientRect();
                const basketRect = basket.getBoundingClientRect();
                if (heartRect.left < basketRect.right && heartRect.right > basketRect.left) {
                    catchScore += heart.innerText === '💖' ? 1 : 3;
                } else {
                    catchMisses++;
                    document.getElementById('catch-misses').innerText = catchMisses;
                }
                document.getElementById('catch-score').innerText = catchScore;
                clearInterval(fall);
                heart.remove();

                if (catchMisses >= 3) {
                    catchGameActive = false;
                    clearInterval(catchInterval);
                    document.querySelector('#catch-start-overlay p').innerText = 'แพ้แล้ว! พลาดหัวใจครบ 3 ครั้ง 💔';
                    document.getElementById('catch-start-overlay').classList.remove('hidden');
                }
            }
        }, 30);
    }, 1200);
}

function moveCatchBasket(clientX, box) {
    const boxRect = box.getBoundingClientRect();
    catchBasketPosition = ((clientX - boxRect.left) / boxRect.width) * 100;
    catchBasketPosition = Math.max(8, Math.min(92, catchBasketPosition));
    updateCatchBasketPosition();
}

function updateCatchBasketPosition() {
    const basket = document.getElementById('catch-basket');
    if (!basket) return;
    basket.style.left = `${catchBasketPosition}%`;
    basket.style.transform = 'translateX(-50%)';
}

const M_BOARD_SIZE = 40;
let mTurnIdx = 0;
let mRound = 1;
let mRolled = false;
let mPlayers = [];
let isMoving = false;
let mLastRolledDouble = false;
let mGameEnded = false;
let mSelectedTileId = null;

const fantasyCharacters = [
    { name: "ซานต้า", avatar: "🎅", color: "#EF4444", bgClass: "bg-red-500", borderClass: "border-red-400", hex: "#ef4444" },
    { name: "โทรลล์", avatar: "🧌", color: "#10B981", bgClass: "bg-emerald-500", borderClass: "border-emerald-400", hex: "#10b981" },
    { name: "นางฟ้าเด็ก", avatar: "👼", color: "#F59E0B", bgClass: "bg-amber-500", borderClass: "border-amber-400", hex: "#f59e0b" },
    { name: "ยอดหญิง", avatar: "🦸‍♀️", color: "#EC4899", bgClass: "bg-pink-500", borderClass: "border-pink-400", hex: "#ec4899" },
    { name: "พระเอก", avatar: "🦸‍♂️", color: "#3B82F6", bgClass: "bg-blue-500", borderClass: "border-blue-400", hex: "#3b82f6" },
    { name: "แม่มด", avatar: "🧙‍♀️", color: "#8B5CF6", bgClass: "bg-purple-500", borderClass: "border-purple-400", hex: "#8b5cf6" },
    { name: "พ่อมด", avatar: "🧙‍♂️", color: "#6366F1", bgClass: "bg-indigo-500", borderClass: "border-indigo-400", hex: "#6366f1" },
    { name: "เทพธิดา", avatar: "🧚‍♀️", color: "#14B8A6", bgClass: "bg-teal-500", borderClass: "border-teal-400", hex: "#14b8a6" }
];

const mTiles = [];
const tileIcons = ['🚩', '☕', '❓', '🍰', '💸', '🚆', '💐', '📦', '🍿', '🎡', '🔒', '☕', '🎁', '🍰', '⭐', '🚆', '🏖️', '❓', '🏨', '🌴', '☕', '☕', '🎁', '🍰', '💸', '🚆', '💐', '📦', '🍿', '🎡', '👮', '☕', '🎁', '🍰', '⭐', '🚆', '🏖️', '❓', '🏨', '🌴'];
const tileNames = [
    "จุด START 💖", "คาเฟ่เดทแรก", "กล่องเสี่ยงดวง", "ร้านเค้กหวาน", "ภาษีความสุข", "รถไฟฟ้าความรัก", "ร้านดอกไม้", "หีบสมบัติ", "โรงภาพยนตร์", "สวนสนุก",
    "คุกความรัก", "คาเฟ่ริมทะเล", "กล่องเสี่ยงดวง", "ร้านช็อกโกแลต", "โรงแรมรัก", "รถไฟฟ้าความรัก", "รีสอร์ทฮันนีมูน", "กล่องเสี่ยงดวง", "สปาคู่รัก", "เกาะสวาท",
    "ลานจอดรถฟรี", "คาเฟ่แมว", "กล่องเสี่ยงดวง", "ร้านไอศกรีม", "ภาษีความร่ำรวย", "รถไฟฟ้าความรัก", "ร้านของขวัญ", "หีบสมบัติ", "สวนน้ำ", "เวทีคอนเสิร์ต",
    "เข้าคุก", "คาเฟ่หรู", "กล่องเสี่ยงดวง", "ร้านกาแฟสด", "รีสอร์ท 5 ดาว", "รถไฟฟ้าความรัก", "หาดส่วนตัว", "กล่องเสี่ยงดวง", "คฤหาสน์รัก", "เพนต์เฮาส์"
];
const propertyGroups = {
    brown: [1, 3],
    light_blue: [6, 8, 9],
    pink: [11, 13, 14],
    orange: [16, 18, 19],
    red: [21, 23, 24],
    yellow: [26, 27, 29],
    green: [31, 32, 34],
    dark_blue: [37, 39]
};

const tileGroupById = Object.fromEntries(
    Object.entries(propertyGroups).flatMap(([group, ids]) => ids.map(id => [id, group]))
);

for (let i = 0; i < M_BOARD_SIZE; i++) {
    let type = "property";
    let price = 1200 + (i * 100);
    let rent = Math.floor(price * 0.15);
    let housePrice = 400;

    if (i === 0) type = "start";
    else if ([2, 7, 12, 17, 22, 27, 32, 37].includes(i)) type = "chance";
    else if ([4, 24].includes(i)) type = "tax";
    else if ([5, 15, 25, 35].includes(i)) type = "station";
    else if (i === 10) type = "jail";
    else if (i === 30) type = "gotojail";

    mTiles.push({
        id: i,
        name: tileNames[i] || `เมืองรัก #${i}`,
        type: type,
        price: type === "property" || type === "station" ? price : 0,
        rent: type === "property" || type === "station" ? rent : 0,
        baseRent: type === "property" || type === "station" ? rent : 0,
        group: tileGroupById[i] || null,
        owner: null,
        houses: 0,
        hotel: false,
        housePrice: housePrice,
        icon: tileIcons[i] || '💖',
        colorHex: null
    });
}

function resetMonopolySetup() {
    const setupScreen = document.getElementById('monopoly-setup-screen');
    if (!setupScreen) return;
    setupScreen.classList.remove('hidden');
    document.getElementById('monopoly-config-screen').classList.add('hidden');
    document.getElementById('monopoly-board-screen').classList.add('hidden');
}

function showMonopolyConfig() {
    document.getElementById('monopoly-setup-screen').classList.add('hidden');
    document.getElementById('monopoly-config-screen').classList.remove('hidden');
    renderPlayerConfigInputs();
}

function renderPlayerConfigInputs() {
    const playerSelect = document.getElementById('m-player-count');
    const aiSelect = document.getElementById('m-ai-count');
    if (!playerSelect || !aiSelect) return;
    const humanCount = parseInt(playerSelect.value);
    const aiCount = parseInt(aiSelect.value);
    const maxAiCount = 4 - humanCount;
    if (aiCount > maxAiCount) {
        aiSelect.value = String(maxAiCount);
    }
    const selectedAiCount = parseInt(aiSelect.value);
    const count = humanCount + selectedAiCount;
    const container = document.getElementById('m-player-inputs-container');
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = "bg-white p-3 rounded-2xl border border-pink-200 shadow-xs flex flex-col gap-2";
        
        let optionsHtml = '';
        fantasyCharacters.forEach((char, idx) => {
            const selected = idx === i ? 'selected' : '';
            optionsHtml += `<option value="${char.avatar}|${char.name}|${char.hex}" ${selected}>${char.avatar} ${char.name}</option>`;
        });

        div.innerHTML = `
            <label class="text-[11px] font-bold ${i < humanCount ? 'text-[#E11D48]' : 'text-indigo-600'}">${i < humanCount ? `ผู้เล่นคนที่ ${i + 1}` : `AI ตัวที่ ${i - humanCount + 1}`}</label>
            <input type="text" id="m-pname-${i}" value="${i < humanCount ? `ผู้เล่นคนที่ ${i + 1}` : `AI ตัวที่ ${i - humanCount + 1}`}" ${i >= humanCount ? 'readonly' : ''} class="w-full bg-pink-50/50 border border-pink-200 text-gray-800 rounded-xl py-1.5 px-2.5 text-xs focus:outline-none focus:border-rose-500 font-bold">
            <select id="m-pchar-${i}" onchange="validateUniqueCharacters()" class="w-full bg-pink-50/50 border border-pink-200 text-gray-800 rounded-xl py-1.5 px-2.5 text-xs focus:outline-none focus:border-rose-500 font-bold">
                ${optionsHtml}
            </select>
        `;
        container.appendChild(div);
    }
}

function validateUniqueCharacters() {
    const playerSelect = document.getElementById('m-player-count');
    const aiSelect = document.getElementById('m-ai-count');
    if (!playerSelect || !aiSelect) return;
    const count = parseInt(playerSelect.value) + parseInt(aiSelect.value);
    let selectedAvatars = [];
    for (let i = 0; i < count; i++) {
        const el = document.getElementById(`m-pchar-${i}`);
        if (!el) continue;
        const val = el.value.split('|')[0];
        if (selectedAvatars.includes(val)) {
            alert("⚠️ คุณไม่สามารถเลือกตัวละครซ้ำกันได้!");
            for (let c of fantasyCharacters) {
                if (!selectedAvatars.includes(c.avatar)) {
                    el.value = `${c.avatar}|${c.name}|${c.hex}`;
                    break;
                }
            }
            return;
        }
        selectedAvatars.push(val);
    }
}

function startMonopolyBoardGame() {
    const playerSelect = document.getElementById('m-player-count');
    const aiSelect = document.getElementById('m-ai-count');
    if (!playerSelect || !aiSelect) return;
    const humanCount = parseInt(playerSelect.value);
    const count = humanCount + parseInt(aiSelect.value);
    
    mPlayers = [];
    for (let i = 0; i < count; i++) {
        const name = document.getElementById(`m-pname-${i}`).value || `ผู้เล่น ${i + 1}`;
        const charVal = document.getElementById(`m-pchar-${i}`).value.split('|');
        mPlayers.push({
            id: i + 1,
            name: `${name} (${charVal[0]})`,
            money: 15000,
            pos: 0,
            avatar: charVal[0],
            charName: charVal[1],
            color: charVal[2],
            bankrupt: false,
            isAI: i >= humanCount,
            doubleCount: 0
        });
    }

    mTurnIdx = 0;
    mRound = 1;
    mRolled = false;
    mLastRolledDouble = false;
    mGameEnded = false;
    mSelectedTileId = null;
    mTiles.forEach(t => { t.owner = null; t.houses = 0; t.hotel = false; t.rent = t.baseRent; t.colorHex = null; });

    document.getElementById('monopoly-config-screen').classList.add('hidden');
    document.getElementById('monopoly-board-screen').classList.remove('hidden');

    renderMonopolyBoard();
    renderMPlayers();
    updateMButtons();
    logMonopoly("🎲 เริ่มต้นเกมเศรษฐีความรัก!");
}

function getMCoords(id) {
    if (id <= 10) return { col: 11 - id, row: 11 };
    if (id <= 20) return { col: 1, row: 11 - (id - 10) };
    if (id <= 30) return { col: 1 + (id - 20), row: 1 };
    return { col: 11, row: 1 + (id - 30) };
}

function renderMonopolyBoard() {
    const bEl = document.getElementById('monopoly-board');
    if (!bEl) return;
    bEl.querySelectorAll('.m-tile').forEach(t => t.remove());

    mTiles.forEach((tile, idx) => {
        const coords = getMCoords(idx);
        const el = document.createElement('div');
        
        let customStyle = "";
        if (tile.colorHex) {
            customStyle = `background-color: ${tile.colorHex}15; border-color: ${tile.colorHex}; border-width: 2px;`;
        }

        el.className = "m-tile bg-white border border-pink-100 rounded p-0.5 flex flex-col justify-between items-center text-center text-[9px] relative cursor-pointer hover:bg-pink-50 transition shadow-2xs";
        el.style.cssText = customStyle;
        el.style.gridColumnStart = coords.col;
        el.style.gridRowStart = coords.row;
        el.onclick = () => showPropertyCard(idx);

        let ownerBar = (tile.owner !== null && tile.colorHex) ? `<div class="absolute top-0 inset-x-0 h-2 rounded-t" style="background-color: ${tile.colorHex};"></div>` : '';
        let houseIcons = '';
        if (tile.owner !== null && tile.type === 'property') {
            houseIcons = `<span class="text-[8px] bg-white/90 px-1 rounded-full shadow-2xs border border-pink-200">${tile.hotel ? '🏨 โรงแรม' : `🏠x${tile.houses || 0}`}</span>`;
        }
        
        let avatars = '';
        mPlayers.forEach(p => {
            if (p.pos === idx && !p.bankrupt) avatars += `<span class="text-xs scale-110 drop-shadow">${p.avatar}</span>`;
        });

        el.innerHTML = `
            ${ownerBar}
            <div class="flex justify-between items-center w-full px-1 pt-0.5">
                <span class="text-[8px] font-mono text-rose-500 font-bold">#${idx}</span>
                <span class="font-bold text-gray-700 line-clamp-1">${tile.name}</span>
            </div>
            <div class="flex flex-col items-center my-auto"><span class="text-sm">${tile.icon}</span>${houseIcons}</div>
            <span class="text-[9px] text-[#E11D48] font-bold flex gap-0.5 justify-center pb-0.5">${avatars}</span>
        `;
        bEl.appendChild(el);
    });
}

function renderMPlayers() {
    const list = document.getElementById('m-players-list');
    if (!list) return;
    list.innerHTML = '';
    mPlayers.forEach((p, idx) => {
        const isCurr = idx === mTurnIdx;
        const div = document.createElement('div');
        div.className = `p-2.5 rounded-xl border flex justify-between items-center text-xs ${isCurr ? 'border-rose-400 bg-pink-50 shadow-md ring-1 ring-rose-300' : 'border-pink-100 bg-white'}`;
        div.innerHTML = `
            <div>
                <div class="font-bold text-gray-800 flex items-center space-x-1">
                    <span class="w-2.5 h-2.5 rounded-full inline-block" style="background-color: ${p.color};"></span>
                    <span>${p.name} ${isCurr ? '👑' : ''}</span>
                </div>
                <div class="text-[10px] text-gray-500">อยู่ที่: ${mTiles[p.pos].name}</div>
            </div>
            <div class="font-mono text-[#E11D48] font-bold text-right">${p.money.toLocaleString()} ฿</div>
        `;
        list.appendChild(div);
    });
    const turnEl = document.getElementById('m-turn');
    if (turnEl) turnEl.innerText = mPlayers[mTurnIdx].name;
    const roundEl = document.getElementById('m-round');
    if (roundEl) roundEl.innerText = `รอบที่ ${mRound}`;
}

function handleMonopolyRoll() {
    if (mRolled || isMoving || mGameEnded || !mPlayers.length) return;
    mRolled = true;
    isMoving = true;
    updateMButtons();

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const isDouble = d1 === d2;
    document.getElementById('m-dice-1').innerText = d1;
    document.getElementById('m-dice-2').innerText = d2;

    const player = mPlayers[mTurnIdx];
    const steps = d1 + d2;
    if (isDouble) {
        player.doubleCount++;
        mLastRolledDouble = true;
        logMonopoly(`🔥 ${player.name} ทอยได้เบิ้ลครั้งที่ ${player.doubleCount}`);
        if (player.doubleCount >= 3) {
            player.pos = 10;
            player.bankrupt = false;
            player.doubleCount = 0;
            mLastRolledDouble = false;
            mRolled = true;
            isMoving = false;
            logMonopoly(`🚨 ${player.name} ทอยเบิ้ล 3 ครั้งติด ถูกส่งเข้าคุก!`);
            renderMonopolyBoard();
            renderMPlayers();
            updateMButtons();
            scheduleMonopolyEndTurn();
            return;
        }
    } else {
        player.doubleCount = 0;
        mLastRolledDouble = false;
    }
    logMonopoly(`🎲 ${player.name} ทอยได้ ${d1} + ${d2} = ${steps} แต้ม`);

    let currentStep = 0;
    const walkInterval = setInterval(() => {
        if (currentStep < steps) {
            const oldPos = player.pos;
            player.pos = (player.pos + 1) % M_BOARD_SIZE;
            if (player.pos === 0 && oldPos !== 0) {
                player.money += 2000;
                logMonopoly(`🎉 ${player.name} ผ่านจุดเริ่มต้น รับ 2,000 ฿`);
            }
            renderMonopolyBoard();
            renderMPlayers();
            currentStep++;
        } else {
            clearInterval(walkInterval);
            isMoving = false;
            handleTileAction(player, mTiles[player.pos]);
            renderMonopolyBoard();
            renderMPlayers();
            updateMButtons();
            showPropertyCard(player.pos);
            if (player.isAI && !mGameEnded) {
                setTimeout(() => scheduleMonopolyEndTurn(), 900);
            }
        }
    }, 250);
}

function handleTileAction(player, tile) {
    const info = document.getElementById('m-info');
    if (!info) return;
    if (tile.type === 'property' || tile.type === 'station') {
        if (tile.owner === null) {
            info.innerHTML = `💡 ช่อง <strong>${tile.name}</strong> ยังไม่มีเจ้าของ ราคา ${tile.price.toLocaleString()} ฿`;
            if (player.isAI && player.money >= tile.price) {
                player.money -= tile.price;
                tile.owner = player.id;
                tile.colorHex = player.color;
                logMonopoly(`🤖 ${player.name} ซื้อที่ดิน ${tile.name}`);
                info.innerHTML = `🤖 ${player.name} ซื้อ ${tile.name} แล้ว`;
            }
        } else if (tile.owner === player.id) {
            info.innerHTML = `🏠 คุณเป็นเจ้าของช่อง <strong>${tile.name}</strong>`;
            if (player.isAI && tile.type === 'property' && ownsCompleteMonopolyGroup(player.id, tile.group)) {
                if (!tile.hotel && tile.houses < 4 && player.money >= tile.housePrice) {
                    player.money -= tile.housePrice;
                    tile.houses++;
                    tile.rent = getMonopolyRent(tile);
                    logMonopoly(`🤖 ${player.name} สร้างบ้านหลังที่ ${tile.houses} บน ${tile.name}`);
                } else if (!tile.hotel && tile.houses === 4 && player.money >= tile.housePrice * 2) {
                    player.money -= tile.housePrice * 2;
                    tile.hotel = true;
                    tile.rent = getMonopolyRent(tile);
                    logMonopoly(`🤖 ${player.name} อัปเกรด ${tile.name} เป็นโรงแรม`);
                }
            }
        } else {
            const owner = mPlayers.find(p => p.id === tile.owner);
            const rent = getMonopolyRent(tile);
            player.money -= rent;
            owner.money += rent;
            info.innerHTML = `💸 จ่ายค่าเช่า ${rent.toLocaleString()} ฿ ให้ ${owner.name}`;
            logMonopoly(`💸 ${player.name} จ่ายค่าเช่าให้ ${owner.name}`);
        }
    } else if (tile.type === 'tax') {
        player.money -= 800;
        info.innerHTML = `💸 เสียภาษีความสุข 800 ฿`;
    } else if (tile.type === 'chance') {
        const bonus = Math.random() > 0.5 ? 1000 : -500;
        player.money += bonus;
        info.innerHTML = `🎁 กล่องเสี่ยงดวง: ${bonus > 0 ? '+' + bonus : bonus} ฿`;
    } else if (tile.type === 'gotojail') {
        player.pos = 10;
        info.innerHTML = `🔒 ถูกส่งตัวไปคุกความรัก!`;
    } else {
        info.innerHTML = `✨ ตกช่อง ${tile.name}`;
    }
    if (player.money < 0) {
        player.bankrupt = true;
        mGameEnded = true;
        logMonopoly(`💀 ${player.name} ล้มละลาย เกมจบลงแล้ว`);
    }
}

function monopolyBuy() {
    if (mGameEnded) return;
    const player = mPlayers[mTurnIdx];
    const tile = mTiles[player.pos];
    if (tile.owner === null && player.money >= tile.price) {
        player.money -= tile.price;
        tile.owner = player.id;
        tile.colorHex = player.color;
        renderMonopolyBoard();
        renderMPlayers();
        updateMButtons();
        showPropertyCard(player.pos);
    }
}

function monopolyBuild() {
    if (mGameEnded) return;
    const player = mPlayers[mTurnIdx];
    const selectedTile = mSelectedTileId === null ? null : mTiles[mSelectedTileId];
    const tile = selectedTile && selectedTile.owner === player.id ? selectedTile : mTiles[player.pos];
    const tileId = tile.id;
    if (tile.owner !== player.id || tile.type !== 'property' || !ownsCompleteMonopolyGroup(player.id, tile.group)) return;

    if (!tile.hotel && tile.houses < 4 && player.money >= tile.housePrice) {
        player.money -= tile.housePrice;
        tile.houses++;
        tile.rent = getMonopolyRent(tile);
        logMonopoly(`🏠 ${player.name} สร้างบ้านหลังที่ ${tile.houses} บน ${tile.name}`);
        renderMonopolyBoard();
        renderMPlayers();
        updateMButtons();
        showPropertyCard(tileId);
    } else if (!tile.hotel && tile.houses === 4 && player.money >= tile.housePrice * 2) {
        player.money -= tile.housePrice * 2;
        tile.hotel = true;
        tile.rent = getMonopolyRent(tile);
        logMonopoly(`🏨 ${player.name} อัปเกรด ${tile.name} เป็นโรงแรม`);
        renderMonopolyBoard();
        renderMPlayers();
        updateMButtons();
        showPropertyCard(tileId);
    }
}

function ownsCompleteMonopolyGroup(playerId, group) {
    if (!group) return false;
    return propertyGroups[group].every(tileId => mTiles[tileId].owner === playerId);
}

function getMonopolyRent(tile) {
    if (!tile.baseRent) return 0;
    if (tile.hotel) return tile.baseRent * 8;
    return tile.baseRent * (tile.houses + 1);
}

function getMonopolyBuildLabel(player, tile) {
    if (!tile || tile.owner !== player.id || tile.type !== 'property') return '🏠 ซื้อบ้าน';
    if (!ownsCompleteMonopolyGroup(player.id, tile.group)) return 'ต้องครองโซนให้ครบ';
    if (tile.hotel) return 'มีโรงแรมแล้ว';
    if (tile.houses === 4) return '🏨 ซื้อโรงแรม';
    return `🏠 ซื้อบ้าน (${tile.houses}/4)`;
}

function monopolyEndTurn() {
    if (mGameEnded || isMoving || !mPlayers.length) return;
    mRolled = false;
    if (mLastRolledDouble) {
        mLastRolledDouble = false;
        const player = mPlayers[mTurnIdx];
        logMonopoly(`🌟 ${player.name} ได้ทอยต่อเนื่องเพราะทอยเบิ้ล`);
    } else {
        mPlayers[mTurnIdx].doubleCount = 0;
        mTurnIdx = (mTurnIdx + 1) % mPlayers.length;
        if (mTurnIdx === 0) mRound++;
    }
    mSelectedTileId = null;
    renderMPlayers();
    updateMButtons();
    document.getElementById('m-info').innerHTML = `ตาของ ${mPlayers[mTurnIdx].name} แล้ว!`;
    if (mPlayers[mTurnIdx].isAI && !mGameEnded) {
        setTimeout(() => handleMonopolyRoll(), 900);
    }
}

function scheduleMonopolyEndTurn() {
    setTimeout(() => monopolyEndTurn(), 900);
}

function showPropertyCard(idx) {
    const tile = mTiles[idx];
    const cardEl = document.getElementById('m-property-card');
    if (!cardEl) return;
    mSelectedTileId = idx;
    let ownerName = "ไม่มีเจ้าของ";
    if (tile.owner !== null) {
        const o = mPlayers.find(p => p.id === tile.owner);
        if (o) ownerName = o.name;
    }
    cardEl.innerHTML = `
        <div class="font-bold text-amber-600 text-sm mb-1">${tile.icon} ${tile.name}</div>
        <div class="space-y-1 text-gray-600 text-[11px]">
            <div>ราคา: <span class="font-bold text-emerald-600">${tile.price ? tile.price.toLocaleString() + ' ฿' : '-'}</span></div>
            <div>ค่าเช่า: <span class="font-bold text-rose-600">${getMonopolyRent(tile) ? getMonopolyRent(tile).toLocaleString() + ' ฿' : '-'}</span></div>
            ${tile.type === 'property' ? `<div>สถานะ: <span class="font-bold text-amber-600">${tile.hotel ? '🏨 โรงแรม' : `🏠 ${tile.houses}/4 หลัง`}</span></div>` : ''}
            ${tile.owner !== null ? '<div class="text-[10px] text-gray-400">เลือกช่องนี้เพื่อสร้างบ้าน/โรงแรมได้</div>' : ''}
            <div>เจ้าของ: <span class="font-bold text-cyan-600">${ownerName}</span></div>
        </div>
    `;
    updateMButtons();
}

function logMonopoly(msg) {
    const logs = document.getElementById('m-logs');
    if (!logs) return;
    const item = document.createElement('div');
    item.className = "text-[10px] text-gray-700 border-b border-pink-100 py-0.5";
    item.innerText = msg;
    logs.insertBefore(item, logs.firstChild);
}

function updateMButtons() {
    const buyBtn = document.getElementById('m-buy-btn');
    if (!buyBtn) return;
    const rollBtn = document.getElementById('m-roll-btn');
    const player = mPlayers[mTurnIdx];
    if (!player) return;
    const selectedTile = mSelectedTileId === null ? null : mTiles[mSelectedTileId];
    const tile = selectedTile && selectedTile.owner === player.id ? selectedTile : mTiles[player.pos];
    const canBuy = mRolled && (tile.type === 'property' || tile.type === 'station') && tile.owner === null && player.money >= tile.price;
    const ownsGroup = ownsCompleteMonopolyGroup(player.id, tile.group);
    const buildCost = tile.houses === 4 && !tile.hotel ? tile.housePrice * 2 : tile.housePrice;
    const canBuild = !player.isAI && tile.type === 'property' && tile.owner === player.id && ownsGroup && !tile.hotel && player.money >= buildCost;

    if (rollBtn) rollBtn.disabled = mRolled || isMoving || player.isAI || mGameEnded;
    buyBtn.disabled = !canBuy;
    const buildBtn = document.getElementById('m-build-btn');
    buildBtn.disabled = !canBuild;
    buildBtn.innerText = getMonopolyBuildLabel(player, tile);
    document.getElementById('m-end-btn').disabled = !mRolled;
}

window.onload = function() {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (sessionStorage.getItem(APP_UNLOCKED_KEY) === 'true') unlockApp();
    updateCounter();
    renderMilestones();
    renderBulletinNotes();
    initPloxGame();
};
