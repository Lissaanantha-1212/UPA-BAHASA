// Data User Terdaftar
const ALLOWED_USERS = [
    { name: 'lisa', password: '123', role: 'staff', redirect: 'staff-dashboard.html' },
    { name: 'kila', password: '123', role: 'kepala', redirect: 'kepala-dashboard.html' }
];

// Fungsi Buka / Tutup Modal Login
function toggleLoginModal(show) {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.toggle('hidden', !show);
    }
}

// Fungsi Handling Login
function handleStaffLogin(e) {
    e.preventDefault();
    const nameVal = document.getElementById('login-name').value.trim().toLowerCase();
    const passVal = document.getElementById('login-password').value.trim();
    const roleVal = document.getElementById('login-role').value;
    const errorEl = document.getElementById('login-error');

    // Validasi Nama, Password, dan Jabatan
    const foundUser = ALLOWED_USERS.find(u => 
        u.name === nameVal && 
        u.password === passVal && 
        u.role === roleVal
    );

    if (foundUser) {
        if (errorEl) errorEl.classList.add('hidden');
        
        // Simpan Session
        localStorage.setItem('userSession', JSON.stringify({
            name: foundUser.name,
            role: foundUser.role,
            isLoggedIn: true
        }));

        // Redirect ke Dashboard Sesuai Jabatan
        window.location.href = foundUser.redirect;
    } else {
        if (errorEl) {
            errorEl.innerText = 'Nama, Password, atau Jabatan tidak sesuai!';
            errorEl.classList.remove('hidden');
        }
    }
}