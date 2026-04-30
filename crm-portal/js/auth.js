// ── AUTH HELPERS ──

async function requireAuth() {
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) {
    window.location.href = 'login.html';
    return null;
  }
  return data.session.user;
}

async function getProfile(userId) {
  const { data } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data || {};
}

async function handleLogout() {
  await supabaseClient.auth.signOut();
  window.location.href = 'login.html';
}

async function logActivity(action, details) {
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) return;
  await supabaseClient.from('activity_log').insert([{
    user_id: data.session.user.id,
    action,
    details
  }]);
}
