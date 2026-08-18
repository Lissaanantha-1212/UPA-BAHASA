/**
 * Fitur Upload & Kalkulasi Otomatis Hasil Ujian TOEFL
 */

// Simulasi Tabel Konversi Nilai TOEFL ITP (Raw Score -> Converted Score)
function convertListening(raw) {
    if (raw >= 45) return 65;
    if (raw >= 35) return 52;
    if (raw >= 25) return 45;
    if (raw >= 15) return 38;
    return 31;
}

function convertStructure(raw) {
    if (raw >= 35) return 63;
    if (raw >= 25) return 51;
    if (raw >= 15) return 41;
    return 31;
}

function convertReading(raw) {
    if (raw >= 45) return 63;
    if (raw >= 35) return 52;
    if (raw >= 25) return 43;
    if (raw >= 15) return 35;
    return 31;
}

// Fungsi Hitung Total Skor TOEFL
function calculateTOEFL(l, s, r) {
    const cL = convertListening(l);
    const cS = convertStructure(s);
    const cR = convertReading(r);
    const total = Math.round(((cL + cS + cR) * 10) / 3);
    return {
        totalScore: total,
        status: total >= 450 ? 'LULUS' : 'REMEDIAL'
    };
}

// Fungsi Parse CSV / Excel Sederhana
function previewExcelData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\n');
        const tbody = document.getElementById('excel-preview-body');
        
        if (!tbody) return;
        tbody.innerHTML = ''; // Clear tabel lama

        let count = 0;
        lines.forEach((line, index) => {
            if (index === 0 || !line.trim()) return; // Skip Header & Baris Kosong
            
            const cols = line.split(',');
            if (cols.length >= 6) {
                const nim = cols[0].trim();
                const nama = cols[1].trim();
                const pc = cols[2].trim();
                const listening = parseInt(cols[3].trim()) || 0;
                const structure = parseInt(cols[4].trim()) || 0;
                const reading = parseInt(cols[5].trim()) || 0;

                // Hitung kalkulasi otomatis
                const result = calculateTOEFL(listening, structure, reading);
                const isLulus = result.status === 'LULUS';

                const rowHtml = `
                    <tr>
                        <td class="p-3 border-b text-slate-600">${nim}</td>
                        <td class="p-3 border-b font-semibold">${nama}</td>
                        <td class="p-3 border-b">${pc}</td>
                        <td class="p-3 border-b text-center text-slate-500">L: ${listening} | S: ${structure} | R: ${reading}</td>
                        <td class="p-3 border-b text-center font-bold ${isLulus ? 'text-brand-900' : 'text-rose-700'}">${result.totalScore}</td>
                        <td class="p-3 border-b text-center">
                            <span class="${isLulus ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} font-bold px-2.5 py-1 rounded-full text-[10px]">
                                ${result.status} ${isLulus ? '(Hijau)' : ''}
                            </span>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += rowHtml;
                count++;
            }
        });

        alert(`Berhasil mengimpor dan menghitung kalkulasi untuk ${count} data mahasiswa!`);
    };

    reader.readAsText(file);
}