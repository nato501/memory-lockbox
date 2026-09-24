const profileAccountsKey = 'ourLoveSpaceAccounts';
const profileCurrentKey = 'ourLoveSpaceCurrentAccount';
let profileAccount = null;
let profileImage = '';

function readCurrentProfileAccount() {
    try {
        profileAccount = JSON.parse(sessionStorage.getItem(profileCurrentKey) || 'null');
    } catch (error) {
        profileAccount = null;
    }
    return profileAccount;
}

function renderProfile() {
    if (!profileAccount) return;
    document.getElementById('profile-name').value = profileAccount.displayName || '';
    document.getElementById('profile-username').value = profileAccount.username || '';
    profileImage = profileAccount.image || '';
    updateProfilePreview();
}

function updateProfilePreview() {
    const preview = document.getElementById('profile-preview');
    const removeButton = document.getElementById('remove-image');
    if (profileImage) {
        preview.innerHTML = `<img src="${profileImage}" alt="รูปโปรไฟล์" class="w-full h-full object-cover">`;
        removeButton.classList.remove('hidden');
    } else {
        const name = profileAccount?.displayName || 'U';
        preview.textContent = name.charAt(0).toUpperCase();
        removeButton.classList.add('hidden');
    }
}

function showProfileMessage(message, isError = false) {
    const messageElement = document.getElementById('profile-message');
    messageElement.textContent = message;
    messageElement.className = `text-center text-xs font-medium mt-2 ${isError ? 'text-red-500' : 'text-emerald-600'}`;
}

function resizeImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.onload = () => {
                const maxSize = 600;
                const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
                const canvas = document.createElement('canvas');
                canvas.width = Math.max(1, Math.round(image.width * scale));
                canvas.height = Math.max(1, Math.round(image.height * scale));
                canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.82));
            };
            image.onerror = () => reject(new Error('รูปภาพไม่ถูกต้อง'));
            image.src = reader.result;
        };
        reader.onerror = () => reject(new Error('อ่านรูปภาพไม่สำเร็จ'));
        reader.readAsDataURL(file);
    });
}

function saveProfile(event) {
    event.preventDefault();
    if (!profileAccount) return;
    const displayName = document.getElementById('profile-name').value.trim();
    if (!displayName) {
        showProfileMessage('กรุณาใส่ชื่อที่แสดง', true);
        return;
    }

    const accounts = JSON.parse(localStorage.getItem(profileAccountsKey) || '[]');
    const accountIndex = accounts.findIndex(account => account.username === profileAccount.username);
    if (accountIndex < 0) {
        showProfileMessage('ไม่พบบัญชีนี้ในเครื่อง', true);
        return;
    }

    profileAccount = { ...profileAccount, displayName, image: profileImage };
    accounts[accountIndex] = profileAccount;
    localStorage.setItem(profileAccountsKey, JSON.stringify(accounts));
    sessionStorage.setItem(profileCurrentKey, JSON.stringify(profileAccount));
    window.currentAccount = profileAccount;
    showProfileMessage('บันทึกโปรไฟล์แล้ว ✨');
}

document.addEventListener('DOMContentLoaded', () => {
    readCurrentProfileAccount();
    renderProfile();

    document.getElementById('profile-image').addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            showProfileMessage('รูปมีขนาดเกิน 2MB', true);
            event.target.value = '';
            return;
        }
        try {
            profileImage = await resizeImage(file);
            updateProfilePreview();
            showProfileMessage('เลือกรูปแล้ว กดบันทึกเพื่อใช้รูปนี้');
        } catch (error) {
            showProfileMessage(error.message, true);
        }
    });

    document.getElementById('remove-image').addEventListener('click', () => {
        profileImage = '';
        document.getElementById('profile-image').value = '';
        updateProfilePreview();
    });

    document.getElementById('profile-form').addEventListener('submit', saveProfile);
});
