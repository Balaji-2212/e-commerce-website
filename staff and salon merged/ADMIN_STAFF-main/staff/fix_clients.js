const fs = require('fs');
let html = fs.readFileSync('clients.html', 'utf8');

// The original file is a mess right now.
// Let's just use schedule.html's header because they are identical.
let scheduleHtml = fs.readFileSync('schedule.html', 'utf8');
const endHeaderIdx = scheduleHtml.indexOf('<!-- CONTENT -->');

if (endHeaderIdx !== -1) {
    let newHtml = scheduleHtml.substring(0, endHeaderIdx);
    
    // Replace <title>
    newHtml = newHtml.replace('<title>My Schedule · Srijes</title>', '<title>Client Records · Srijes</title>');
    
    // Change nav active state
    newHtml = newHtml.replace('class="nav-item ripple active" onclick="window.location.href=\'schedule.html\'"', 'class="nav-item ripple" onclick="window.location.href=\'schedule.html\'"');
    newHtml = newHtml.replace('<span class="nav-dot"></span>', '');
    newHtml = newHtml.replace('class="nav-item ripple" onclick="window.location.href=\'clients.html\'"', 'class="nav-item ripple active" onclick="window.location.href=\'clients.html\'"');
    
    // Add dot to clients
    newHtml = newHtml.replace('<span class="nav-icon">👥</span> Client Records', '<span class="nav-icon">👥</span> Client Records\n        <span class="nav-dot"></span>');
    
    const rest = \<!-- CONTENT -->
    <main class="content">
      <!-- PAGE HEADING -->
      <div class="page-heading">
        <div>
          <h1 class="greeting" id="greeting">Good afternoon, Priya ✨</h1>
          <p class="shift-line">
            Your shift today:
            <strong id="shiftLine">9:00 AM – 6:00 PM</strong>
          </p>
        </div>
      </div>

      <!-- SECTIONS CONTAINER -->
      <div id="dashboardSection" class="content-section">
        <!-- CLIENT RECORDS HEADER -->
        <div class="card" style="margin-bottom: 24px;">
          <div class="card-head">
            <div>
              <div class="card-title">Client Records</div>
              <div class="card-sub">Access history, formulas, and notes</div>
            </div>
            <div style="display: flex; gap: 10px;">
              <input type="text" id="clientSearch" class="form-input" placeholder="Search clients..."
                onkeyup="filterClients()" style="padding: 6px 12px;" />
            </div>
          </div>
        </div>

        <div class="main-grid" style="grid-template-columns: 350px 1fr; align-items: start;">
          <!-- CLIENT LIST -->
          <div class="left-col" style="position: sticky; top: 90px;">
            <div class="card" style="height: calc(100vh - 200px); overflow-y: auto; padding: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
              <div id="clientList" class="client-list">
                <!-- Populated by JS -->
              </div>
            </div>
          </div>

          <!-- CLIENT DETAIL -->
          <div class="right-col">
            <div class="card" id="clientDetailCard"
              style="min-height: calc(100vh - 200px); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--muted); box-shadow: 0 4px 12px rgba(0,0,0,0.03); background: var(--card);">
              <div style="font-size: 48px; margin-bottom: 16px;">👤</div>
              <div style="font-size: 15px;">Select a client from the list<br>to view their history and formulas.</div>
            </div>
          </div>
        </div>

        <div class="footer-note">Srijes Salon · Staff Portal</div>
      </div> <!-- End dashboardSection -->

    </main>
  </div>

  <!-- CALENDAR MODAL -->
  <div class="modal-overlay hidden" id="calModalOverlay" onclick="closeCalModal()">
    <div class="modal-box" onclick="event.stopPropagation()">
      <div class="modal-head">
        <h3 id="calModalTitle">Attendance Details</h3>
        <button class="close-btn" style="display: block" onclick="closeCalModal()">
          ✕
        </button>
      </div>
      <div class="modal-body">
        <div id="calModalContent"></div>
        <button class="btn-outline ripple" style="width: 100%; margin-top: 16px"
          onclick="showToast('Dispute raised successfully!', 'warning', '✋')">
          Raise a Dispute
        </button>
      </div>
    </div>
  </div>

  <!-- ADD APPOINTMENT MODAL -->
  <div class="modal-overlay hidden" id="addAptModalOverlay" onclick="closeAddAptModal()">
    <div class="modal-box" onclick="event.stopPropagation()">
      <div class="modal-head">
        <h3>Add Appointment</h3>
        <button class="close-btn" style="display: block" onclick="closeAddAptModal()">
          ✕
        </button>
      </div>
      <div class="modal-body">
        <div style="display: flex; flex-direction: column; gap: 12px">
          <div>
            <label style="font-size: 12px; color: var(--muted); font-weight: 600">Client Name</label>
            <input type="text" id="newAptClient" class="form-input" placeholder="E.g. Aditi Sharma" style="
                  width: 100%;
                  padding: 8px;
                  border: 1px solid var(--border);
                  border-radius: 6px;
                  background: var(--muted-bg);
                  color: var(--fg);
                  margin-top: 4px;
                " />
          </div>
          <div>
            <label style="font-size: 12px; color: var(--muted); font-weight: 600">Phone Number</label>
            <input type="text" id="newAptPhone" class="form-input" placeholder="10-digit number" style="
                  width: 100%;
                  padding: 8px;
                  border: 1px solid var(--border);
                  border-radius: 6px;
                  background: var(--muted-bg);
                  color: var(--fg);
                  margin-top: 4px;
                " />
          </div>
          <div>
            <label style="font-size: 12px; color: var(--muted); font-weight: 600">Service</label>
            <input type="text" id="newAptService" class="form-input" placeholder="E.g. Haircut" style="
                  width: 100%;
                  padding: 8px;
                  border: 1px solid var(--border);
                  border-radius: 6px;
                  background: var(--muted-bg);
                  color: var(--fg);
                  margin-top: 4px;
                " />
          </div>
          <div style="display: flex; gap: 12px">
            <div style="flex: 1">
              <label style="font-size: 12px; color: var(--muted); font-weight: 600">Time</label>
              <input type="time" id="newAptTime" class="form-input" style="
                    width: 100%;
                    padding: 8px;
                    border: 1px solid var(--border);
                    border-radius: 6px;
                    background: var(--muted-bg);
                    color: var(--fg);
                    margin-top: 4px;
                  " />
            </div>
            <div style="flex: 1">
              <label style="font-size: 12px; color: var(--muted); font-weight: 600">Duration (min)</label>
              <input type="number" id="newAptDuration" class="form-input" value="60" style="
                    width: 100%;
                    padding: 8px;
                    border: 1px solid var(--border);
                    border-radius: 6px;
                    background: var(--muted-bg);
                    color: var(--fg);
                    margin-top: 4px;
                  " />
            </div>
          </div>
          <button class="btn-primary ripple" style="width: 100%; margin-top: 12px; padding: 10px"
            onclick="submitNewAppointment()">
            Save Appointment
          </button>
        </div>
      </div>
    </div>
  </div>

  <div id="toastContainer" class="toast-container"></div>
  <!-- BREAK MODAL -->
  <div class="modal-overlay hidden" id="breakModalOverlay" onclick="closeBreakModal()">
    <div class="modal-box" onclick="event.stopPropagation()" style="max-width: 300px">
      <div class="modal-head">
        <h3>Start Break</h3>
        <button class="close-btn" style="display: block" onclick="closeBreakModal()">
          ✕
        </button>
      </div>
      <div class="modal-body">
        <label style="font-size: 12px; color: var(--muted); font-weight: 600">Break Duration (mins)</label>
        <input type="number" id="breakDurationInput" class="form-input" value="15" style="
              width: 100%;
              padding: 8px;
              border: 1px solid var(--border);
              border-radius: 6px;
              background: var(--muted-bg);
              color: var(--fg);
              margin-top: 4px;
              margin-bottom: 12px;
            " />
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
          <button class="btn-outline btn-sm ripple" style="flex: 1"
            onclick="document.getElementById('breakDurationInput').value=15; startBreak()">15m</button>
          <button class="btn-outline btn-sm ripple" style="flex: 1"
            onclick="document.getElementById('breakDurationInput').value=30; startBreak()">30m</button>
          <button class="btn-outline btn-sm ripple" style="flex: 1"
            onclick="document.getElementById('breakDurationInput').value=45; startBreak()">45m</button>
        </div>
        <button class="btn-primary ripple" style="width: 100%; padding: 10px" onclick="startBreak()">
          Start Custom Timer
        </button>
      </div>
    </div>
  </div>

  <!-- INVENTORY MODAL -->
  <div class="modal-overlay hidden" id="inventoryModalOverlay" onclick="closeInventoryModal()">
    <div class="modal-box" onclick="event.stopPropagation()" style="max-width: 400px">
      <div class="modal-head">
        <h3>Request Supplies</h3>
        <button class="close-btn" style="display: block" onclick="closeInventoryModal()">
          ✕
        </button>
      </div>
      <div class="modal-body">
        <div style="display: flex; flex-direction: column; gap: 12px">
          <div>
            <label style="font-size: 12px; color: var(--muted); font-weight: 600">Select Item</label>
            <select id="invItem" class="form-input" style="
                  width: 100%;
                  padding: 8px;
                  border: 1px solid var(--border);
                  border-radius: 6px;
                  background: var(--muted-bg);
                  color: var(--fg);
                  margin-top: 4px;
                ">
              <option value="Olaplex">Olaplex</option>
              <option value="Shampoo">Shampoo</option>
              <option value="Gloves">Gloves</option>
            </select>
          </div>
          <div>
            <label style="font-size: 12px; color: var(--muted); font-weight: 600">Quantity Needed</label>
            <input type="number" id="invQty" class="form-input" value="1" min="1" style="
                  width: 100%;
                  padding: 8px;
                  border: 1px solid var(--border);
                  border-radius: 6px;
                  background: var(--muted-bg);
                  color: var(--fg);
                  margin-top: 4px;
                " />
          </div>
          <div>
            <label style="font-size: 12px; color: var(--muted); font-weight: 600">Station / Room</label>
            <input type="text" id="invStation" class="form-input" placeholder="e.g., Station 4" style="
                  width: 100%;
                  padding: 8px;
                  border: 1px solid var(--border);
                  border-radius: 6px;
                  background: var(--muted-bg);
                  color: var(--fg);
                  margin-top: 4px;
                " />
          </div>
          <button class="btn-primary ripple" style="width: 100%; margin-top: 8px; padding: 10px"
            onclick="submitInventoryRequest()">
            Send Request
          </button>
        </div>
      </div>
    </div>
    </div>

  <!-- SERVICE MENU CHEAT SHEET MODAL -->
  <div class="modal-overlay hidden" id="cheatSheetModalOverlay" onclick="closeCheatSheetModal()">
    <div class="modal-box" onclick="event.stopPropagation()" style="max-width: 600px; width:90%;">
      <div class="modal-head">
        <h3>Service & Price Menu</h3>
        <button class="close-btn" style="display: block" onclick="closeCheatSheetModal()">✕</button>
      </div>
      <div class="modal-body" style="padding:16px;">
        <input type="text" id="cheatSheetSearch" class="form-input" placeholder="Search services..."
          onkeyup="filterCheatSheet()"
          style="width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); color: var(--fg); margin-bottom: 16px;" />

        <div id="cheatSheetBody" style="max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; padding-right: 4px;">
          <!-- Dynamically populated by app.js -->
        </div>
      </div>
    </div>
  </div>

  <!-- STAFF CHAT FAB & WINDOW -->
  <button class="chat-fab ripple" onclick="toggleStaffChat()">💬</button>
  <div class="chat-window hidden" id="staffChatWindow">
    <div class="chat-header">
      <div style="font-weight: 600">Reception Desk</div>
      <button class="close-btn" style="display: block" onclick="toggleStaffChat()">
        ✕
      </button>
    </div>
    <div class="chat-body" id="chatBody">
      <div class="chat-msg received">
        Hi! Let us know if you need anything.
      </div>
    </div>
    <div class="chat-quick-replies">
      <button class="btn-outline btn-sm ripple" onclick="sendChatMessage('Running 10 mins late')">
        10 mins late
      </button>
      <button class="btn-outline btn-sm ripple" onclick="sendChatMessage('Client arrived?')">
        Client arrived?
      </button>
      <button class="btn-outline btn-sm ripple" onclick="sendChatMessage('Need help at station')">
        Need help
      </button>
    </div>
    <div class="chat-input-area">
      <input type="text" id="chatInput" placeholder="Type message..."
        onkeypress="if (event.key === 'Enter') sendChatMessage(this.value);" />
      <button class="btn-primary ripple" onclick="sendChatMessage(document.getElementById('chatInput').value)">
        ➤
      </button>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <script src="data.js"></script>
  <script src="app.js"></script>
</body>
</html>\;

    newHtml += rest;
    fs.writeFileSync('clients.html', newHtml);
    console.log('Restored successfully');
} else {
    console.log('Could not find indices');
}
