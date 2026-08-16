// assets/js/excel-upload.js

async function prosesUploadExcel() {
    const fileInput = document.getElementById('excel-file-input');
    const statusBox = document.getElementById('upload-status');

    if (!fileInput.files.length) {
        alert('Pilih file Excel terlebih dahulu!');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    statusBox.className = 'mt-3 p-3 text-xs rounded border bg-blue-50 text-blue-800 border-blue-200';
    statusBox.innerText = 'Membaca file Excel... Mohon tunggu.';
    statusBox.classList.remove('hidden');

    reader.onload = async function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (!jsonData.length) {
                throw new Error('File Excel kosong atau format tidak sesuai.');
            }

            let insertedCount = 0;

            for (const row of jsonData) {
                // Estimasi pembacaan kolom dari Excel
                const nim = String(row.NIM || row.nim || '');
                const nama = String(row.Nama || row.NAMA || row.nama || '');
                const listening = parseInt(row.Listening || row.listening || 0);
                const structure = parseInt(row.Structure || row.structure || 0);
                const reading = parseInt(row.Reading || row.reading || 0);

                const totalScore = Math.round(((listening + structure + reading) * 10) / 3);
                const statusLulus = totalScore >= 450; // Syarat passing score POLNES (misal: 450)

                if (nim) {
                    // 1. Upsert Data Mahasiswa
                    await supabase.from('mahasiswa').upsert({ nim, nama });

                    // 2. Insert Hasil TOEFL
                    await supabase.from('hasil_toefl').insert({
                        nim,
                        listening_score: listening,
                        structure_score: structure,
                        reading_score: reading,
                        total_score: totalScore,
                        status_kelulusan: statusLulus
                    });
                    insertedCount++;
                }
            }

            statusBox.className = 'mt-3 p-3 text-xs rounded border bg-emerald-50 text-emerald-800 border-emerald-200';
            statusBox.innerText = `Berhasil mengimpor ${insertedCount} data nilai TOEFL ke database!`;
            fileInput.value = '';
        } catch (err) {
            console.error(err);
            statusBox.className = 'mt-3 p-3 text-xs rounded border bg-red-50 text-red-800 border-red-200';
            statusBox.innerText = 'Gagal memproses file: ' + err.message;
        }
    };

    reader.readAsArrayBuffer(file);
}

// Fungsi Fetch Tiket di Staff Dashboard
async function loadTiketKeluhan() {
    const tbody = document.getElementById('table-tiket-body');
    if (!tbody) return;

    const { data, error } = await supabase
        .from('tiket_keluhan')
        .select('*')
        .order('created_at', { ascending: false });

    if (error || !data.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-400">Belum ada tiket keluhan masuk.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(t => `
        <tr class="hover:bg-slate-50">
            <td class="p-3 font-mono font-bold text-blue-900">${t.kode_tiket}</td>
            <td class="p-3"><b>${t.nama}</b><br><span class="text-slate-400">${t.nim}</span></td>
            <td class="p-3 capitalize">${t.kategori}</td>
            <td class="p-3 max-w-xs truncate">${t.deskripsi}</td>
            <td class="p-3"><span class="px-2 py-1 rounded text-[10px] font-bold ${t.status === 'SELESAI' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${t.status}</span></td>
            <td class="p-3">
                <button onclick="updateTiket('${t.kode_tiket}')" class="bg-blue-900 text-white text-[10px] px-2.5 py-1 rounded hover:bg-blue-950">Update</button>
            </td>
        </tr>
    `).join('');
}

async function updateTiket(kodeTiket) {
    const status = prompt('Masukkan Status Baru (DIPROSES / SELESAI):', 'SELESAI');
    const catatan = prompt('Catatan untuk mahasiswa:', 'Keluhan telah ditindaklanjuti.');

    if (status && catatan) {
        await supabase
            .from('tiket_keluhan')
            .update({ status: status.toUpperCase(), catatan_staff: catatan })
            .eq('kode_tiket', kodeTiket);
        
        alert('Tiket berhasil diperbarui!');
        loadTiketKeluhan();
    }
}

document.addEventListener('DOMContentLoaded', loadTiketKeluhan);