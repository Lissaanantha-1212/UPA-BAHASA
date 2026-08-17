// Mock Kredensial User
const USERS = [
    { username: 'staff', password: '123', role: 'staff', redirect: 'staff-dashboard.html' },
    { username: 'kepala', password: '123', role: 'kepala', redirect: 'kepala-dashboard.html' }
];

// Fungsi Modal
function toggleLoginModal(show) {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.toggle('hidden', !show);
    }
}

// Fungsi Handling Form Login
function handleStaffLogin(e) {
    e.preventDefault();
    const userVal = document.getElementById('login-username').value.trim();
    const passVal = document.getElementById('login-password').value.trim();
    const errorEl = document.getElementById('login-error');

    // Cari User
    const foundUser = USERS.find(u => u.username === userVal && u.password === passVal);

    if (foundUser) {
        if (errorEl) errorEl.classList.add('hidden');
        
        // Simpan session sederhana di LocalStorage
        localStorage.setItem('userSession', JSON.stringify({
            username: foundUser.username,
            role: foundUser.role,
            isLoggedIn: true
        }));

        // Redirect ke halaman dashboard sesuai role (staff / kepala)
        window.location.href = foundUser.redirect;
    } else {
        if (errorEl) {
            errorEl.innerText = 'Username atau Password salah!';
            errorEl.classList.remove('hidden');
        }
    }
}