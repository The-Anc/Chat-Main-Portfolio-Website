/* OPTIONAL: Supabase powers the private upload dashboard.
   1. Create a project at https://supabase.com
   2. Copy Project URL and anon/public key from Project Settings > API.
   3. Paste them below. Never put a service_role key in this file.
   Until configured, the public site still works with content.js / GitHub edits.
*/
window.SUPABASE_CONFIG = {
  url: "YOUR_SUPABASE_PROJECT_URL",
  anonKey: "YOUR_SUPABASE_ANON_PUBLIC_KEY",
  bucket: "portfolio"
};
