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

/**
 * Preview the confirmation inside the page
 */
function previewConfirmation() {
  const phone = document.getElementById('company-phone').value || '[Phone Number]';
  const email = document.getElementById('company-email').value || '[Email Address]';
  const website = document.getElementById('company-website').value || '[Website]';
  const address = document.getElementById('company-address').value || '[Office Address]';
  const client = document.getElementById('client-name').value || '[CLIENT NAME]';
  const passport = document.getElementById('passport-number').value || '[PASSPORT NUMBER]';
  const rate = document.getElementById('discounted-rate').value || '[AMOUNT] AED';

  const preview = document.getElementById('confirmation-preview');
  preview.style.color = 'inherit';
  preview.innerHTML = `
    <div style="background:#fff;color:#0f172a;padding:22px;border-radius:8px;">
      <div style="display:flex;align-items:center;gap:18px;margin-bottom:12px;">
        <img src="assets/images/am-logo-horizontal-with-tagline.png" alt="AM Travel & Tours" style="max-width:220px;" />
      </div>

      <div style="margin-top:6px;">
        <div style="font-weight:700;margin-bottom:6px">A&M TRAVEL AND TOURS</div>
        <div style="font-size:0.95rem;color:#374151">${phone} | ${email} | ${website}</div>
        <div style="font-size:0.9rem;color:#6b7280;margin-top:6px">${address}</div>
      </div>

      <hr style="margin:14px 0;border:none;border-top:1px solid #e5e7eb" />

      <h3 style="margin:6px 0 12px 0">VISA CHANGE CONFIRMATION:</h3>
      <div style="font-weight:700;margin-bottom:6px">90 Days Inside the Country Visa Change</div>
      <div style="margin:12px 0">
        <div><strong>CLIENT NAME:</strong> ${client}</div>
        <div><strong>PASSPORT NUMBER:</strong> ${passport}</div>
        <div><strong>DISCOUNTED RATE:</strong> ${rate}</div>
      </div>

      <div style="background:#fef3c7;padding:10px;border-radius:6px;margin-bottom:12px">
        <strong>NOTE:</strong> IF FINES APPEARED, YOU NEED TO SETTLE. YOU WILL BE GUIDED ACCORDINGLY.
      </div>

      <h4 style="margin:8px 0">Terms and Conditions:</h4>
      <ol style="color:#374151">
        <li>Visa Approval is up to immigration solely.</li>
        <li>A&M Travel and Tours will apply tourist Visa in the guidance of DTCM Rules. In case of any rejection due to any reason we will not be responsible for Application charge.</li>
        <li>If person does not leave UAE within required time as per visa then all fines will be paid by Applicant / Guarantor of Applicant.</li>
        <li>In case of all kind of over stays or absconding of applicant all fines will be paid by Applicant / Guarantor of application.</li>
        <li>Visa is non-refundable.</li>
        <li>Overstay fine will be shouldered by the client.</li>
      </ol>

      <div style="margin-top:18px">
        <div style="margin-bottom:30px">CONFIRMED BY:</div>
        <div style="border-top:1px dashed #e5e7eb;padding-top:10px">NAME AND SIGNATURE:</div>
      </div>
    </div>
  `;
}

/**
 * Generate and download the confirmation as a PDF using html2pdf
 */
function generateConfirmationPDF() {
  // Build the same content used for preview
  const phone = document.getElementById('company-phone').value || '[Phone Number]';
  const email = document.getElementById('company-email').value || '[Email Address]';
  const website = document.getElementById('company-website').value || '[Website]';
  const address = document.getElementById('company-address').value || '[Office Address]';
  const client = document.getElementById('client-name').value || '[CLIENT NAME]';
  const passport = document.getElementById('passport-number').value || '[PASSPORT NUMBER]';
  const rate = document.getElementById('discounted-rate').value || '[AMOUNT] AED';

  const wrapper = document.createElement('div');
  wrapper.style.padding = '18px';
  wrapper.style.fontFamily = "'DM Sans', Arial, sans-serif";
  wrapper.style.color = '#0f172a';
  wrapper.innerHTML = `
    <div style="padding:18px;">
      <div style="display:flex;align-items:center;gap:18px;margin-bottom:12px;">
        <img src="assets/images/am-logo-horizontal-with-tagline.png" alt="AM Travel & Tours" style="max-width:260px;" />
      </div>

      <div style="margin-top:6px;">
        <div style="font-weight:700;margin-bottom:6px">A&M TRAVEL AND TOURS</div>
        <div style="font-size:0.95rem;color:#374151">${phone} | ${email} | ${website}</div>
        <div style="font-size:0.9rem;color:#6b7280;margin-top:6px">${address}</div>
      </div>

      <hr style="margin:14px 0;border:none;border-top:1px solid #e5e7eb" />

      <h3 style="margin:6px 0 12px 0">VISA CHANGE CONFIRMATION:</h3>
      <div style="font-weight:700;margin-bottom:6px">90 Days Inside the Country Visa Change</div>
      <div style="margin:12px 0">
        <div><strong>CLIENT NAME:</strong> ${client}</div>
        <div><strong>PASSPORT NUMBER:</strong> ${passport}</div>
        <div><strong>DISCOUNTED RATE:</strong> ${rate} AED</div>
      </div>

      <div style="background:#fff3cd;padding:10px;border-radius:6px;margin-bottom:12px">
        <strong>NOTE:</strong> IF FINES APPEARED, YOU NEED TO SETTLE. YOU WILL BE GUIDED ACCORDINGLY.
      </div>

      <h4 style="margin:8px 0">Terms and Conditions:</h4>
      <ol style="color:#374151">
        <li>Visa Approval is up to immigration solely.</li>
        <li>A&M Travel and Tours will apply tourist Visa in the guidance of DTCM Rules. In case of any rejection due to any reason we will not be responsible for Application charge.</li>
        <li>If person does not leave UAE within required time as per visa then all fines will be paid by Applicant / Guarantor of Applicant.</li>
        <li>In case of all kind of over stays or absconding of applicant all fines will be paid by Applicant / Guarantor of application.</li>
        <li>Visa is non-refundable.</li>
        <li>Overstay fine will be shouldered by the client.</li>
      </ol>

      <div style="margin-top:18px">
        <div style="margin-bottom:30px">CONFIRMED BY:</div>
        <div style="border-top:1px dashed #e5e7eb;padding-top:10px">NAME AND SIGNATURE:</div>
      </div>
    </div>
  `;

  // Append to body (offscreen) so html2pdf can render images
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-9999px';
  document.body.appendChild(wrapper);

  const fileNameBase = (client && client.trim() ? client.trim().replace(/\s+/g, '_') : 'confirmation');
  const opt = {
    margin: 0.5,
    filename: `${fileNameBase}_confirmation.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  // Generate and download PDF
  if (window.html2pdf) {
    html2pdf().set(opt).from(wrapper).save().then(() => {
      document.body.removeChild(wrapper);
    }).catch(err => {
      console.error('Error generating PDF:', err);
      document.body.removeChild(wrapper);
      alert('An error occurred while generating the PDF. Check console for details.');
    });
  } else {
    document.body.removeChild(wrapper);
    alert('PDF library not loaded. Please ensure html2pdf bundle is available.');
  }
}
