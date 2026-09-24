const ACCOUNTS_KEY = 'ourLoveSpaceAccounts';
const CURRENT_ACCOUNT_KEY = 'ourLoveSpaceCurrentAccount';

function getAccounts() {
    try {
        return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    } catch (error) {
        return [];
    }
}

function saveAccounts(accounts) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function prepareDefaultAccount() {
    const accounts = getAccounts();
    const adminIndex = accounts.findIndex(account => account.username === 'thanachatdo18@gmail.com');
    if (adminIndex < 0) {
        accounts.push({
            username: 'thanachatdo18@gmail.com',
            displayName: 'Donut',
            password: '06032550',
            role: 'admin'
        });
    } else {
        accounts[adminIndex] = { ...accounts[adminIndex], displayName: accounts[adminIndex].displayName || 'Donut', role: 'admin' };
    }
    saveAccounts(accounts);
    try {
        const currentAccount = JSON.parse(sessionStorage.getItem(CURRENT_ACCOUNT_KEY) || 'null');
        if (currentAccount?.username === 'thanachatdo18@gmail.com') {
            sessionStorage.setItem(CURRENT_ACCOUNT_KEY, JSON.stringify(accounts.find(account => account.username === currentAccount.username)));
        }
    } catch (error) {
        sessionStorage.removeItem(CURRENT_ACCOUNT_KEY);
    }
}

function showAccountPanel(mode = 'login', message = '') {
    const lockScreen = document.getElementById('lock-screen');
    if (!lockScreen) return;
    const isRegister = mode === 'register';
    lockScreen.style.display = 'flex';
    lockScreen.style.opacity = '1';
    lockScreen.innerHTML = `
        <div class="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-pink-100">
            <div class="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">🔐💖</div>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Our Cozy Love Space</h2>
            <p class="text-xs text-gray-500 mb-6">${isRegister ? 'สร้างบัญชีใหม่เพื่อเข้าพื้นที่ความรัก' : 'เข้าสู่ระบบเพื่อเข้าพื้นที่ความรักของเรา'}</p>
            <form id="account-form" class="space-y-3 text-left">
                ${isRegister ? '<input id="account-display-name" type="text" maxlength="40" required placeholder="ชื่อที่แสดง" class="w-full px-4 py-3 text-sm bg-pink-50/50 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-rose-500">' : ''}
                <input id="account-username" type="text" maxlength="80" required autocomplete="username" placeholder="ชื่อผู้ใช้หรืออีเมล" class="w-full px-4 py-3 text-sm bg-pink-50/50 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-rose-500">
                <input id="account-password" type="password" minlength="4" required autocomplete="${isRegister ? 'new-password' : 'current-password'}" placeholder="รหัสผ่าน" class="w-full px-4 py-3 text-sm bg-pink-50/50 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-rose-500">
                <button type="submit" class="w-full bg-[#E11D48] hover:bg-rose-700 text-white font-bold py-3 rounded-2xl shadow-md transition bouncy-btn text-sm">${isRegister ? 'สร้างบัญชี 💖' : 'เข้าสู่ระบบ ✨'}</button>
            </form>
            <p id="account-message" class="text-xs text-red-500 mt-3 font-medium ${message ? '' : 'hidden'}">${message}</p>
            <button id="account-switch" type="button" class="mt-4 text-xs text-rose-500 hover:text-rose-700 font-semibold underline">${isRegister ? 'มีบัญชีแล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สร้างบัญชีใหม่'}</button>
        </div>`;

    document.getElementById('account-form').addEventListener('submit', (event) => submitAccount(event, isRegister));
    document.getElementById('account-switch').addEventListener('click', () => showAccountPanel(isRegister ? 'login' : 'register'));
}

function setAccountMessage(message) {
    const messageEl = document.getElementById('account-message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.classList.remove('hidden');
    }
}

function submitAccount(event, isRegister) {
    event.preventDefault();
    const username = document.getElementById('account-username').value.trim().toLowerCase();
    const password = document.getElementById('account-password').value;
    const displayName = isRegister ? document.getElementById('account-display-name').value.trim() : '';
    const accounts = getAccounts();

    if (username.length < 3) {
        setAccountMessage('ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร');
        return;
    }
    if (password.length < 4) {
        setAccountMessage('รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร');
        return;
    }
    if (isRegister) {
        if (!displayName) {
            setAccountMessage('กรุณาใส่ชื่อที่แสดง');
            return;
        }
        if (accounts.some(account => account.username === username)) {
            setAccountMessage('ชื่อผู้ใช้หรืออีเมลนี้มีบัญชีแล้ว');
            return;
        }
        const account = { username, displayName, password, role: 'user' };
        accounts.push(account);
        saveAccounts(accounts);
        unlockAccount(account);
        return;
    }

    const account = accounts.find(item => item.username === username && item.password === password);
    if (!account) {
        setAccountMessage('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        return;
    }
    unlockAccount(account);
}

function unlockAccount(account) {
    window.currentAccount = account;
    sessionStorage.setItem(CURRENT_ACCOUNT_KEY, JSON.stringify(account));
    document.documentElement.classList.add('app-unlocked');
    document.querySelectorAll('[data-admin-only]').forEach((element) => {
        element.classList.toggle('hidden', account.role !== 'admin');
        element.classList.toggle('flex', account.role === 'admin');
    });
    const lockScreen = document.getElementById('lock-screen');
    if (lockScreen) {
        lockScreen.style.opacity = '0';
        setTimeout(() => { lockScreen.style.display = 'none'; }, 300);
    }
}

function logoutAccount() {
    sessionStorage.removeItem(CURRENT_ACCOUNT_KEY);
    document.documentElement.classList.remove('app-unlocked');
    document.querySelectorAll('[data-admin-only]').forEach((element) => {
        element.classList.add('hidden');
        element.classList.remove('flex');
    });
    showAccountPanel('login');
}

function initAccountSystem() {
    prepareDefaultAccount();
    let currentAccount = null;
    try {
        currentAccount = JSON.parse(sessionStorage.getItem(CURRENT_ACCOUNT_KEY) || 'null');
    } catch (error) {
        sessionStorage.removeItem(CURRENT_ACCOUNT_KEY);
    }
    if (currentAccount) {
        unlockAccount(currentAccount);
    } else {
        showAccountPanel('login');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccountSystem);
} else {
    initAccountSystem();
}
