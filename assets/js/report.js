// assets/js/report.js

async function loadStatistikKepala() {
    try {
        // Query Hasil TOEFL
        const { data: toeflData } = await supabase.from('hasil_toefl').select('status_kelulusan');
        // Query Keluhan
        const { data: keluhanData } = await supabase.from('tiket_keluhan').select('status');

        if (toeflData) {
            const totalPeserta = toeflData.length;
            const lulus = toeflData.filter(d => d.status_kelulusan).length;
            const persen = totalPeserta > 0 ? Math.round((lulus / totalPeserta) * 100) : 0;

            document.getElementById('stat-total-peserta').innerText = totalPeserta;
            document.getElementById('stat-persen-lulus').innerText = `${persen}%`;
        }

        if (keluhanData) {
            const selesai = keluhanData.filter(k => k.status === 'SELESAI').length;
            document.getElementById('stat-keluhan-selesai').innerText = `${selesai} / ${keluhanData.length}`;
        }
    } catch (e) {
        console.error('Gagal memuat statistik:', e);
    }
}

function cetakLaporanKepala() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('LAPORAN REKAPITULASI UPA BAHASA POLNES', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Politeknik Negeri Samarinda — Periode 2026', 105, 27, { align: 'center' });
    doc.line(15, 32, 195, 32);

    const total = document.getElementById('stat-total-peserta').innerText;
    const persen = document.getElementById('stat-persen-lulus').innerText;
    const keluhan = document.getElementById('stat-keluhan-selesai').innerText;

    doc.setFontSize(11);
    doc.text(`1. Total Peserta Ujian TOEFL  : ${total} Mahasiswa`, 20, 45);
    doc.text(`2. Tingkat Kelulusan Skor     : ${persen}`, 20, 53);
    doc.text(`3. Penyelesaian Keluhan       : ${keluhan} Tiket Selesai`, 20, 61);

    doc.text('Samarinda, ' + new Date().toLocaleDateString('id-ID'), 140, 90);
    doc.text('Kepala UPA Bahasa POLNES', 140, 96);
    doc.text('(_______________________)', 140, 125);

    doc.save('Laporan_Rekap_Kepala_UPA_Bahasa.pdf');
}

document.addEventListener('DOMContentLoaded', loadStatistikKepala);