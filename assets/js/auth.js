// assets/js/auth.js

function toggleLoginModal(show) {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.toggle('hidden', !show);
    }
}

async function loginStaff() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-pass').value.trim();

    if (!email || !password) return alert('Isi email dan password.');

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) {
            alert('Login gagal: ' + error.message);
        } else {
            alert('Login berhasil!');
            toggleLoginModal(false);
            window.location.href = 'staff-dashboard.html';
        }
    } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan sistem saat login.');
    }
}