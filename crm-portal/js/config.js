// ── SUPABASE CONFIG ──
const SUPABASE_URL = 'https://erflzptoneomuijkldaq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZmx6cHRvbmVvbXVpamtsZGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzQ1MDAsImV4cCI6MjA5MTc1MDUwMH0.Nbwnnvx1cJonojdRuoEtWaqBDhIakOHvhjQ5taW1FTY';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


{
  "models": [
    {
      "title": "Ollama Llama3.2 (Backup)",
      "provider": "ollama",
      "model": "llama3.2"
    },
    {
      "title": "Ollama Qwen (Backup)",
      "provider": "ollama",
      "model": "qwen3.6:latest"
    },
    {
      "title": "Ollama Gemma4 (Backup)",
      "provider": "ollama",
      "model": "gemma4"
    }
  ],
  "tabAutocompleteModel": null
}