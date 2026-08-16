// assets/js/toefl.js

let currentHasilData = null;

async function cariSkor() {
    const nimInput = document.getElementById('input-nim');
    if (!nimInput) return;
    
    const nim = nimInput.value.trim();
    const box = document.getElementById('hasil-box');
    const err = document.getElementById('hasil-error');

    box.classList.add('hidden');
    err.classList.add('hidden');

    if (!nim) return;

    try {
        const { data, error } = await supabase
            .from('hasil_toefl')
            .select('*, mahasiswa(*)')
            .eq('nim', nim)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error || !data) {
            err.classList.remove('hidden');
        } else {
            currentHasilData = data;
            document.getElementById('res-nama').innerText = data.mahasiswa?.nama || 'Mahasiswa POLNES';
            document.getElementById('res-nim').innerText = data.nim;
            document.getElementById('res-list').innerText = data.listening_score;
            document.getElementById('res-struct').innerText = data.structure_score;
            document.getElementById('res-read').innerText = data.reading_score;
            document.getElementById('res-total').innerText = data.total_score;

            const badge = document.getElementById('status-badge');
            const btnCetak = document.getElementById('btn-cetak-sertifikat');

            if (data.status_kelulusan) {
                badge.className = 'p-3 text-white font-bold text-center text-sm bg-emerald-600';
                badge.innerText = 'STATUS: LULUS (MEMENUHI SYARAT SKOR POLNES)';
                if (btnCetak) btnCetak.style.display = 'block';
            } else {
                badge.className = 'p-3 text-white font-bold text-center text-sm bg-rose-600';
                badge.innerText = 'STATUS: BELUM LULUS (SILAKAN DAFTAR REMEDIAL)';
                if (btnCetak) btnCetak.style.display = 'none';
            }
            box.classList.remove('hidden');
        }
    } catch (e) {
        console.error(e);
        err.classList.remove('hidden');
    }
}

function cetakSertifikat() {
    if (!currentHasilData) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Frame Sertifikat
    doc.setLineWidth(2);
    doc.setDrawColor(20, 83, 45);
    doc.rect(10, 10, 277, 190);
    doc.rect(12, 12, 273, 186);

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('POLITEKNIK NEGERI SAMARINDA', 148, 35, { align: 'center' });
    doc.setFontSize(13);
    doc.text('UNIT PELAKSANA AKADEMIK (UPA) BAHASA', 148, 43, { align: 'center' });

    // Judul
    doc.setFontSize(18);
    doc.setTextColor(20, 83, 45);
    doc.text('CERTIFICATE OF ACHIEVEMENT', 148, 62, { align: 'center' });

    // Isi
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('This is to certify that:', 148, 75, { align: 'center' });

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text((currentHasilData.mahasiswa?.nama || 'Mahasiswa').toUpperCase(), 148, 90, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`NIM: ${currentHasilData.nim}`, 148, 98, { align: 'center' });
    doc.text('achieved the following scores on the TOEFL ITP Test:', 148, 110, { align: 'center' });

    // Rincian Skor
    doc.text(`Section 1 - Listening Comprehension : ${currentHasilData.listening_score}`, 100, 125);
    doc.text(`Section 2 - Structure & Written Express : ${currentHasilData.structure_score}`, 100, 133);
    doc.text(`Section 3 - Reading Comprehension : ${currentHasilData.reading_score}`, 100, 141);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`TOTAL SCORE : ${currentHasilData.total_score}`, 100, 152);

    doc.save(`Sertifikat_TOEFL_${currentHasilData.nim}.pdf`);
}