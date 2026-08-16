// assets/js/config.js

// Ganti URL dan Key di bawah ini dengan project Supabase Anda
const SUPABASE_URL = 'https://YOUR-SUPABASE-URL.supabase.co';
const SUPABASE_KEY = 'YOUR-SUPABASE-ANON-KEY';

// Inisialisasi Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);