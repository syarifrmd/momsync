# 🏥 Penjelasan Teknis & Fitur Proyek MomSync

Dokumen ini berisi ringkasan non-teknis mengenai teknologi dan fitur yang digunakan dalam aplikasi **MomSync**. Dokumen ini dapat digunakan sebagai referensi atau materi presentasi kepada klien.

---

## ✨ Tentang MomSync
**MomSync** adalah platform kesehatan digital (E-Health) yang dirancang khusus untuk mendampingi ibu dan anak. Aplikasi ini menggabungkan kemudahan akses website modern dengan kecanggihan kecerdasan buatan (AI) untuk memberikan layanan kesehatan yang responsif dan akurat.

---

## 🚀 Fitur Unggulan (Highlights)

### 1. 🤖 Asisten Kesehatan Cerdas (AI Powered)
Aplikasi ini terintegrasi dengan **Google Gemini 2.5 Flash**, sebuah model kecerdasan buatan terkini.
- **Fungsi:** Memberikan jawaban instan terkait pertanyaan kesehatan umum, kehamilan, dan tumbuh kembang anak.
- **Keunggulan:** Respon yang cepat, bahasa yang natural, dan kemampuan memahami konteks percakapan pengguna.

### 3. 🏥 Pencarian Rumah Sakit Terintegrasi
- **Sumber Data Terpercaya:** Menggunakan **API Rumah Sakit Indonesia Integration (use.api.co.id)** untuk mendapatkan data rumah sakit yang valid secara real-time.
- **Peta & Navigasi:** Terintegrasi langsung dengan **Google Maps** untuk memudahkan pengguna menemukan rute tercepat ke fasilitas kesehatan terdekat.
- **Filter Pintar:** Pengguna bisa mencari berdasarkan provinsi, tipe rumah sakit, atau ketersediaan layanan.

### 4. 📲 Aplikasi Web yang Dapat Diinstal (PWA)
MomSync menggunakan teknologi **Progressive Web App (PWA)**.
- **Apa artinya?** Pengguna tidak perlu mengunduh aplikasi lewat App Store atau Play Store.
- **Cara Kerja:** Cukup buka website di browser HP (Chrome/Safari), lalu tekan tombol "Install". Aplikasi akan muncul di layar utama (homescreen) layaknya aplikasi native.
- **Benefit:** Lebih ringan, hemat memori HP, dan bisa berjalan dengan koneksi internet yang minim.

### 3. 👩‍⚕️ Telekonsultasi & Manajemen Data
- **Konsultasi Dokter:** Fitur untuk menghubungkan pengguna dengan tenaga medis.
- **Artikel Edukasi:** Menyediakan konten kesehatan yang terpercaya.
- **Profil Kesehatan:** Mencatat riwayat dan data kesehatan pengguna secara terstruktur.

---

## 🛠️ Teknologi di Balik Layar (Tech Stack)

Aplikasi ini dibangun menggunakan standar industri teknologi terkini untuk menjamin performa, keamanan, dan kemudahan pengembangan di masa depan.

| Komponen | Teknologi yang Digunakan | Penjelasan Sederhana |
| :--- | :--- | :--- |
| **Pondasi Utama (Backend)** | **Laravel 12 (PHP)** | Framework PHP terpopuler di dunia. Menjamin keamanan data, kecepatan proses server, dan kemudahan pengelolaan database. |
| **Tampilan (Frontend)** | **React.js & Inertia.js** | Teknologi yang sama yang digunakan oleh Facebook/Instagram. Membuat tampilan aplikasi sangat interaktif dan perpindahan halaman terasa instan (tanpa reload). |
| **Desain Antarmuka** | **Tailwind CSS & Shadcn UI** | Sistem desain modern yang membuat tampilan aplikasi terlihat bersih, profesional, dan responsif (bagus di HP maupun Laptop). |
| **Kecerdasan Buatan** | **Google Gemini API** | Otak di balik fitur tanya jawab cerdas. |
| **Integrasi Peta** | **Google Maps & Hospital API** | Menghubungkan pengguna dengan lokasi layanan kesehatan terdekat secara akurat. |
| **Keamanan** | **Laravel Fortify** | Sistem keamanan standar industri untuk login, registrasi, dan proteksi password pengguna. |

---

## 💡 Mengapa Memilih Teknologi Ini?

1.  **Kecepatan (Performance):** Kombinasi Laravel dan React membuat aplikasi terasa sangat ringan dan cepat saat digunakan.
2.  **Skalabilitas (Future-Proof):** Struktur kode yang rapi memudahkan penambahan fitur baru di masa depan (misalnya: integrasi video call atau pembayaran online).
3.  **Efisiensi Biaya:** Dengan teknologi PWA, Anda mendapatkan dua solusi sekaligus: Website dan Aplikasi Mobile (Android/iOS) dalam satu kali pengembangan.

---

*Dibuat otomatis oleh Sistem Asisten Pengembang MomSync.*
