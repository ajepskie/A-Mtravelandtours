/* ================================================================
   WANDERPH - MAIN JAVASCRIPT
   ================================================================
   This file contains all the functionality for WanderPH website.
   - Supabase configuration and initialization
   - Form handling and WhatsApp integration
   - UI interactions and animations
   ================================================================ */

// ================================================================
// CONFIGURATION - Change these values to customize the app
// ================================================================

// Supabase credentials - Get these from your Supabase dashboard
const SUPABASE_URL = 'https://erflzptoneomuijkldaq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZmx6cHRvbmVvbXVpamtsZGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzQ1MDAsImV4cCI6MjA5MTc1MDUwMH0.Nbwnnvx1cJonojdRuoEtWaqBDhIakOHvhjQ5taW1FTY';

// WhatsApp number - Replace with your business WhatsApp number
const WHATSAPP_NUMBER = '971564718805'; // Format: country code + number (no +, no spaces)

// ================================================================
// SUPABASE INITIALIZATION - Setup the database connection
// ================================================================

// Global variables
var supabase = null;
var supabaseReady = false;

console.log('🔍 Supabase Configuration:');
console.log('URL:', SUPABASE_URL);
console.log('Key available:', !!SUPABASE_KEY);

/**
 * Initialize the Supabase client
 * This function is called when the Supabase SDK finishes loading
 */
function initSupabaseClient() {
  console.log('📦 Supabase SDK load event triggered');
  console.log('window.supabase exists:', !!window.supabase);

  if (window.supabase && window.supabase.createClient) {
    try {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      supabaseReady = true;
      console.log('✅ Supabase initialized successfully - Ready to save leads!');
      console.log('Supabase client:', supabase);
      return true;
    } catch (e) {
      console.error('❌ Error creating Supabase client:', e);
      return false;
    }
  } else {
    console.error('❌ Supabase SDK not available. window.supabase:', window.supabase);
    return false;
  }
}

/**
 * Handle SDK load errors
 */
function handleSDKError() {
  console.error('❌ Failed to load Supabase SDK from CDN');
}

/**
 * Fallback: Try initializing after page loads if onload hasn't fired
 */
window.addEventListener('load', function() {
  console.log('📄 Page load event - Checking Supabase...');
  if (!supabaseReady && window.supabase) {
    initSupabaseClient();
  } else if (!window.supabase) {
    console.error('❌ Still no Supabase SDK after page load');
  }
});

// ================================================================
// FORM HANDLING - WhatsApp submission and Supabase integration
// ================================================================

/**
 * Send form data to WhatsApp and save to database
 * Called when the "Send via WhatsApp" button is clicked
 */
function sendToWhatsApp() {
  // Get form values
  const name = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const trip = document.getElementById('ftrip').value;

  // Validate form
  if (!name) {
    alert('Please enter your name.');
    return;
  }
  if (!phone) {
    alert('Please enter your phone number.');
    return;
  }
  if (!trip) {
    alert('Please select your trip type.');
    return;
  }

  console.log('🚀 sendToWhatsApp triggered');
  console.log('Supabase ready:', supabaseReady);
  console.log('Supabase object exists:', !!supabase);
  console.log('Has .from method:', supabase ? typeof supabase.from === 'function' : 'N/A');

  // Save to Supabase database
  if (supabaseReady && supabase && typeof supabase.from === 'function') {
    console.log('💾 Saving lead to Supabase:', { name, phone, trip });
    supabase.from('Leads').insert([
      {
        name: name,
        phone: phone,
        trip_type: trip,
        created_at: new Date().toISOString()
      }
    ])
      .then(response => {
        console.log('✅ Lead saved successfully!', response);
      })
      .catch(err => {
        console.error('❌ Error saving to database:', err);
        console.error('Error details:', {
          message: err.message,
          code: err.code,
          details: err
        });
      });
  } else {
    console.warn('⚠️ Supabase not ready!');
    console.warn('supabaseReady:', supabaseReady);
    console.warn('supabase exists:', !!supabase);
    console.warn('has .from method:', supabase ? typeof supabase.from : 'N/A');

    if (!supabaseReady) {
      alert('⚠️ Supabase is still loading. Please wait a moment and try again.');
    }
  }

  // Create WhatsApp message
  const message =
    `Hi WanderPH! 👋\n\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Trip Type: ${trip}\n\n` +
    `I'd like to know more about your travel services!`;

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  // Show notification and open WhatsApp
  showToast();
  setTimeout(() => window.open(url, '_blank'), 800);
}

// ================================================================
// UI INTERACTIONS - Animations and user feedback
// ================================================================

/**
 * Show a toast notification (green popup at the bottom)
 */
function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/**
 * Scroll smoothly to the form section
 * Called when "Plan My Trip" button in navbar is clicked
 */
function scrollToForm() {
  document.getElementById('lead-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Update navbar background on scroll
 * Makes the navbar more opaque as you scroll down
 */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  nav.style.background = window.scrollY > 50
    ? 'rgba(15,23,42,0.98)'
    : 'rgba(15,23,42,0.85)';
});
