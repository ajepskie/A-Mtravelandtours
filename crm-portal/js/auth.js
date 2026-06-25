// ── AUTH HELPERS ──

// Role definitions — must match exactly what's in Supabase profiles table
const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  ACCOUNTS: 'Accounts',
  WORKER: 'Employee / Worker',
  TESTER: 'Tester'
};

// ── Check if role is admin level (can see all clients)
function isAdminLevel(role) {
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.ACCOUNTS].includes(role);
}

// ── Check if role can delete clients
function canDelete(role) {
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(role);
}

// ── Check if role can edit clients
function canEdit(role) {
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.ACCOUNTS, ROLES.WORKER].includes(role);
}

// ── Check if role can see timestamps
function canViewTimestamps(role) {
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.ACCOUNTS].includes(role);
}

// ── Check if role can access backup
function canAccessBackup(role) {
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.ACCOUNTS].includes(role);
}

// ── Check if role can manage users
function canManageUsers(role) {
  return role === ROLES.SUPER_ADMIN;
}

// ── Role display label
function roleLabel(role) {
  const labels = {
    'Super Admin': '👑 Super Admin',
    'Admin': '🔧 Admin',
    'Accounts': '💼 Accounts',
    'Employee / Worker': '👷 Worker',
    'Tester': '🧪 Tester'
  };
  return labels[role] || role;
}

// ── Role CSS class
function roleClass(role) {
  const classes = {
    'Super Admin': 'superadmin',
    'Admin': 'admin',
    'Accounts': 'accounts',
    'Employee / Worker': 'worker',
    'Tester': 'tester'
  };
  return classes[role] || 'worker';
}

// ── Require authentication — redirect to login if not logged in
async function requireAuth() {
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) {
    window.location.href = 'login.html';
    return null;
  }
  return data.session.user;
}

// ── Get user profile from profiles table
// NOTE: Supabase column is "Roles" (capital R) — we normalize it to "role"
// so ALL html files can use profile.role consistently
async function getProfile(userId) {
  const { data } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!data) return { role: 'Employee / Worker' };

  return {
    ...data,
    role: data.Roles || data.role || 'Employee / Worker'
  };
}

// ── Apply role-based UI visibility
function applyRoleUI(role) {
  // Show/hide admin-only elements
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isAdminLevel(role) ? '' : 'none';
  });

  // Show/hide superadmin-only elements
  document.querySelectorAll('.superadmin-only').forEach(el => {
    el.style.display = canManageUsers(role) ? '' : 'none';
  });

  // Show/hide timestamp columns
  document.querySelectorAll('.ts-col').forEach(el => {
    el.style.display = canViewTimestamps(role) ? '' : 'none';
  });
}

// ── Logout
async function handleLogout() {
  await supabaseClient.auth.signOut();
  window.location.href = 'login.html';
}

// ── Log activity
async function logActivity(action, details) {
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) return;
  await supabaseClient.from('activity_log').insert([{
    user_id: data.session.user.id,
    action,
    details
  }]);
}
