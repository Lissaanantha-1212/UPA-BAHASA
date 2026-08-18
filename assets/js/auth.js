// MEMERIKSA SESI SAAT HALAMAN DILOAD
function getSession() {
    const rawData = localStorage.getItem('user_session') || localStorage.getItem('upa_current_user');
    if (!rawData) return null;
    try {
        const user = JSON.parse(rawData);
        return (user && user.isLoggedIn) ? user : null;
    } catch (e) {
        return null;
    }
}

// MENYIMPAN SESI LOGIN
function saveSession(username, posisi) {
    const sessionData = {
        username: username,
        posisi: posisi,
        isLoggedIn: true
    };
    localStorage.setItem('user_session', JSON.stringify(sessionData));
    localStorage.setItem('upa_current_user', JSON.stringify(sessionData));
}

// MENGHAPUS SESI LOGOUT TOTAL
function clearSession() {
    localStorage.removeItem('user_session');
    localStorage.removeItem('upa_current_user');
    localStorage.clear();
    sessionStorage.clear();
    
    // Hapus semua cookies
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
}