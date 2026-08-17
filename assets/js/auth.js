/**
 * Utility Auth & Sesi Lokal untuk UPA Bahasa
 */

// Simpan Sesi User
function saveSession(username, posisi) {
    const sessionData = {
        username: username,
        posisi: posisi,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('user_logged', JSON.stringify(sessionData));
}

// Ambil Sesi User
function getSession() {
    const session = localStorage.getItem('user_logged');
    return session ? JSON.parse(session) : null;
}

// Proteksi Halaman Dashboard berdasarkan Role
function checkAuth(requiredRole) {
    const user = getSession();
    
    // Jika belum login sama sekali, lempar kembali ke index.html
    if (!user) {
        alert('Anda belum login. Silakan masuk terlebih dahulu.');
        window.location.href = 'index.html';
        return null;
    }

    // Jika role tidak cocok, batasi akses
    if (requiredRole && user.posisi !== requiredRole) {
        alert(`Akses ditolak! Halaman ini hanya untuk ${requiredRole}.`);
        window.location.href = 'index.html';
        return null;
    }

    return user;
}

// Logout dan Hapus Sesi
function handleLogout() {
    localStorage.removeItem('user_logged');
    window.location.href = 'index.html';
}