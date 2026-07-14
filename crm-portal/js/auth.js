// ── AUTH HELPERS ──

function applyTheme(theme) {
  const resolvedTheme = theme === 'light' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', resolvedTheme);
  localStorage.setItem('crm-theme', resolvedTheme);
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.innerHTML = resolvedTheme === 'dark'
      ? '☀️ Light'
      : '🌙 Dark';
  }
}

function toggleTheme() {
  const current = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  applyTheme(current === 'light' ? 'dark' : 'light');
}

function initThemeToggle() {
  const savedTheme = localStorage.getItem('crm-theme');
  applyTheme(savedTheme || 'dark');

  document.querySelectorAll('.topbar').forEach(topbar => {
    if (topbar.querySelector('.theme-toggle')) return;

    const actions = document.createElement('div');
    actions.className = 'topbar-actions';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle color theme');
    button.onclick = toggleTheme;
    actions.appendChild(button);
    topbar.appendChild(actions);
  });
}

// Role definitions — must match exactly what's in Supabase profiles table
const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  ACCOUNTS: 'Accounts',
  WORKER: 'Employee / Worker',
  TESTER: 'Tester'
};

function normalizeRole(role) {
  if (!role) return ROLES.WORKER;
  const value = String(role).trim();
  if (value === 'superadmin' || value === 'Super Admin' || value === 'SuperAdmin') return ROLES.SUPER_ADMIN;
  if (value === 'admin' || value === 'Admin') return ROLES.ADMIN;
  if (value === 'accounts' || value === 'Accounts') return ROLES.ACCOUNTS;
  if (value === 'worker' || value === 'Employee / Worker' || value === 'Employee' || value === 'Worker') return ROLES.WORKER;
  if (value === 'tester' || value === 'Tester') return ROLES.TESTER;
  return value;
}

// ── Check if role is admin level (can see all clients)
function isAdminLevel(role) {
  const normalizedRole = normalizeRole(role);
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.ACCOUNTS].includes(normalizedRole);
}

// ── Check if role can delete clients
function canDelete(role) {
  const normalizedRole = normalizeRole(role);
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(normalizedRole);
}

// ── Check if role can edit clients
function canEdit(role) {
  const normalizedRole = normalizeRole(role);
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.ACCOUNTS, ROLES.WORKER].includes(normalizedRole);
}

// ── Check if role can see timestamps
function canViewTimestamps(role) {
  const normalizedRole = normalizeRole(role);
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.ACCOUNTS].includes(normalizedRole);
}

// ── Check if role can access backup
function canAccessBackup(role) {
  const normalizedRole = normalizeRole(role);
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.ACCOUNTS].includes(normalizedRole);
}

// ── Check if role can manage users
function canManageUsers(role) {
  return normalizeRole(role) === ROLES.SUPER_ADMIN;
}

// ── Check if role can access invoices
function canAccessInvoices(role) {
  const normalizedRole = normalizeRole(role);
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(normalizedRole);
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

document.addEventListener('DOMContentLoaded', initThemeToggle);

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
    role: normalizeRole(data.Roles || data.role || 'Employee / Worker')
  };
}

// ── Apply role-based UI visibility
function applyRoleUI(role) {
  const normalizedRole = normalizeRole(role);
  const isSuperAdmin = normalizedRole === ROLES.SUPER_ADMIN;
  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(normalizedRole);
  const isAccounts = normalizedRole === ROLES.ACCOUNTS;
  const isWorker = normalizedRole === ROLES.WORKER;
  const isTester = normalizedRole === ROLES.TESTER;

  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = (isSuperAdmin || isAdmin) ? '' : 'none';
  });

  document.querySelectorAll('.superadmin-only').forEach(el => {
    el.style.display = isSuperAdmin ? '' : 'none';
  });

  document.querySelectorAll('.backup-only').forEach(el => {
    el.style.display = (isSuperAdmin || isAdmin || isAccounts) ? '' : 'none';
  });

  document.querySelectorAll('.workers-only').forEach(el => {
    el.style.display = (isSuperAdmin || isAdmin) ? '' : 'none';
  });

  document.querySelectorAll('.sales-only').forEach(el => {
    el.style.display = (isSuperAdmin || isAdmin || isAccounts || isWorker) ? '' : 'none';
  });

  document.querySelectorAll('.add-client-only').forEach(el => {
    el.style.display = (isSuperAdmin || isAdmin || isAccounts || isWorker) ? '' : 'none';
  });

  document.querySelectorAll('.clients-only').forEach(el => {
    el.style.display = (isSuperAdmin || isAdmin || isAccounts || isWorker || isTester) ? '' : 'none';
  });

  document.querySelectorAll('.ts-col').forEach(el => {
    el.style.display = canViewTimestamps(normalizedRole) ? '' : 'none';
  });
}

function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(link => {
    link.classList.remove('active');
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
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
