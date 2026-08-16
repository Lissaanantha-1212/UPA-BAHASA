// assets/js/keluhan.js

async function kirimLaporan() {
    const nim = document.getElementById('form-nim').value;
    const nama = document.getElementById('form-nama').value;
    const kategori = document.getElementById('form-kategori').value;
    const deskripsi = document.getElementById('form-deskripsi').value;

    if (!nim || !nama || !deskripsi) return alert('Mohon lengkapi seluruh form.');

    const kodeTiket = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    
    try {
        const { error } = await supabase.from('tiket_keluhan').insert({
            kode_tiket: kodeTiket,
            nim, 
            nama, 
            kategori, 
            deskripsi,
            status: 'MENUNGGU'
        });

        if (error) throw error;

        const alertBox = document.getElementById('tiket-alert');
        alertBox.classList.remove('hidden');
        alertBox.innerHTML = `Laporan berhasil dikirim! Kode Tiket Anda: <b>${kodeTiket}</b>`;
        
        // Reset form
        document.getElementById('form-deskripsi').value = '';
    } catch (err) {
        alert('Gagal mengirim laporan: ' + err.message);
    }
}

async function trackTiket() {
    const kode = document.getElementById('input-kode-tiket').value.trim();
    if (!kode) return;

    try {
        const { data, error } = await supabase
            .from('tiket_keluhan')
            .select('*')
            .eq('kode_tiket', kode)
            .maybeSingle();

        const res = document.getElementById('tracking-result');

        if (data && !error) {
            document.getElementById('track-kategori').innerText = data.kategori;
            document.getElementById('track-status').innerText = data.status;
            document.getElementById('track-catatan').innerText = data.catatan_staff || 'Sedang diproses oleh staff UPA Bahasa.';
            res.classList.remove('hidden');
        } else {
            alert('Kode Tiket tidak ditemukan.');
        }
    } catch (err) {
        console.error(err);
        alert('Gagal melakukan tracking tiket.');
    }
}