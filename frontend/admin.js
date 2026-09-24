const adminAccountsKey = 'ourLoveSpaceAccounts';
const adminCurrentKey = 'ourLoveSpaceCurrentAccount';
let editingUsername = '';

function adminCurrentAccount() {
    try {
        return JSON.parse(sessionStorage.getItem(adminCurrentKey) || 'null');
    } catch (error) {
        return null;
    }
}

function adminMessage(message, isError = false) {
    const element = document.getElementById('admin-message');
    element.textContent = message;
    element.className = `sm:col-span-2 text-center text-xs font-medium ${isError ? 'text-red-500' : 'text-emerald-600'}`;
}

function resetAccountForm() {
    editingUsername = '';
    document.getElementById('account-edit-form').reset();
    document.getElementById('edit-original-username').value = '';
    document.getElementById('account-submit-label').textContent = 'เพิ่มบัญชี';
    document.getElementById('cancel-edit').classList.add('hidden');
}

function renderAccounts() {
    const list = document.getElementById('accounts-list');
    const accounts = getAccounts();
    const current = adminCurrentAccount();
    document.getElementById('account-count').textContent = `${accounts.length} บัญชี`;
    list.innerHTML = accounts.map(account => `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-pink-100 bg-pink-50/40">
            <div class="flex items-center gap-3 min-w-0">
                <div class="w-11 h-11 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 text-white flex items-center justify-center font-bold overflow-hidden flex-shrink-0">${account.image ? `<img src="${account.image}" class="w-full h-full object-cover" alt="">` : account.displayName.charAt(0).toUpperCase()}</div>
                <div class="min-w-0"><p class="font-bold text-sm text-gray-700 truncate">${account.displayName} ${account.username === current?.username ? '<span class="text-xs text-emerald-600">(คุณ)</span>' : ''}</p><p class="text-xs text-gray-400 truncate">${account.username}</p></div>
            </div>
            <div class="flex items-center gap-2"><span class="px-2.5 py-1 rounded-lg text-[11px] font-bold ${account.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}">${account.role === 'admin' ? 'Admin' : 'สมาชิก'}</span><button type="button" data-action="edit" data-username="${account.username}" class="px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-amber-600 text-xs font-bold">แก้ไข</button><button type="button" data-action="delete" data-username="${account.username}" class="px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 text-xs font-bold" ${account.username === current?.username ? 'disabled title="ลบบัญชีตัวเองไม่ได้"' : ''}>ลบ</button></div>
        </div>`).join('');
}

function editAccount(username) {
    const account = getAccounts().find(item => item.username === username);
    if (!account) return;
    editingUsername = account.username;
    document.getElementById('edit-original-username').value = account.username;
    document.getElementById('edit-display-name').value = account.displayName;
    document.getElementById('edit-username').value = account.username;
    document.getElementById('edit-password').value = account.password;
    document.getElementById('edit-role').value = account.role;
    document.getElementById('account-submit-label').textContent = 'บันทึกการแก้ไข';
    document.getElementById('cancel-edit').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveAccount(event) {
    event.preventDefault();
    const originalUsername = document.getElementById('edit-original-username').value;
    const username = document.getElementById('edit-username').value.trim().toLowerCase();
    const displayName = document.getElementById('edit-display-name').value.trim();
    const password = document.getElementById('edit-password').value;
    const role = document.getElementById('edit-role').value;
    const accounts = getAccounts();

    if (username.length < 3 || !displayName || password.length < 4) {
        adminMessage('กรุณากรอกข้อมูลให้ครบ และรหัสผ่านอย่างน้อย 4 ตัวอักษร', true);
        return;
    }
    if (!originalUsername && accounts.some(account => account.username === username)) {
        adminMessage('ชื่อผู้ใช้นี้มีอยู่แล้ว', true);
        return;
    }
    if (originalUsername && username !== originalUsername && accounts.some(account => account.username === username)) {
        adminMessage('ชื่อผู้ใช้นี้มีอยู่แล้ว', true);
        return;
    }

    const updated = { username, displayName, password, role };
    if (originalUsername) {
        const index = accounts.findIndex(account => account.username === originalUsername);
        updated.image = accounts[index].image || '';
        accounts[index] = updated;
        if (adminCurrentAccount()?.username === originalUsername) {
            sessionStorage.setItem(adminCurrentKey, JSON.stringify(updated));
            window.currentAccount = updated;
        }
        adminMessage('แก้ไขบัญชีแล้ว ✨');
    } else {
        accounts.push({ ...updated, image: '' });
        adminMessage('เพิ่มบัญชีแล้ว ✨');
    }
    saveAccounts(accounts);
    resetAccountForm();
    renderAccounts();
}

function deleteAccount(username) {
    const current = adminCurrentAccount();
    if (username === current?.username) {
        adminMessage('ลบบัญชีตัวเองไม่ได้', true);
        return;
    }
    if (!window.confirm('ต้องการลบบัญชีนี้ใช่ไหม?')) return;
    saveAccounts(getAccounts().filter(account => account.username !== username));
    renderAccounts();
    adminMessage('ลบบัญชีแล้ว ✨');
}

document.addEventListener('DOMContentLoaded', () => {
    const current = adminCurrentAccount();
    if (!current || current.role !== 'admin') {
        document.getElementById('admin-content').innerHTML = '<section class="bg-white rounded-3xl p-8 shadow-xl border border-pink-100 text-center"><div class="text-5xl mb-4">🔒</div><h2 class="text-xl font-bold text-gray-700 mb-2">หน้านี้สำหรับ Admin เท่านั้น</h2><p class="text-sm text-gray-400 mb-5">บัญชีของคุณไม่มีสิทธิ์เข้าถึงหน้าจัดการบัญชี</p><a href="index.html" class="inline-block bg-[#E11D48] text-white px-5 py-2.5 rounded-xl text-sm font-bold">กลับหน้าหลัก</a></section>';
        return;
    }
    renderAccounts();
    document.getElementById('admin-status').textContent = `เข้าสู่ระบบในชื่อ ${current.displayName}`;
    document.getElementById('account-edit-form').addEventListener('submit', saveAccount);
    document.getElementById('cancel-edit').addEventListener('click', resetAccountForm);
    document.getElementById('accounts-list').addEventListener('click', event => {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        if (button.dataset.action === 'edit') editAccount(button.dataset.username);
        if (button.dataset.action === 'delete') deleteAccount(button.dataset.username);
    });
});
