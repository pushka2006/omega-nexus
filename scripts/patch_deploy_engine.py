"""
Patch script to add 8 new premium interactive app templates to deploy_engine.py
"""
import os
import re

target_file = r"c:\Users\Pushkar\OneDrive\Documents\omega nexus\backend\app\core\deploy_engine.py"

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

# Check if already patched
if "def generate_todo_manager_app" in content:
    print("Already patched deploy_engine.py")
    exit(0)

templates_code = r'''

# ── 8 NEW PREMIUM 36-AGENT INTERACTIVE APP TEMPLATES ─────────────────────────

def generate_todo_manager_app(project: dict) -> str:
    name = project.get("name", "AI Task & Sprint Manager")
    body = """
<div style="max-width:1240px;margin:0 auto;padding:24px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:16px">
    <div>
      <h1 style="font-size:28px;font-weight:900;background:linear-gradient(90deg,#fff,var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent">📋 """ + name + """</h1>
      <p style="color:#64748b;font-size:12px;margin-top:4px">Powered by 36 Autonomous AI Agents · Real-Time Task & Kanban Tracker</p>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <button class="btn btn-primary" onclick="openAddTaskModal()">➕ Add Task</button>
      <div class="card" style="padding:10px 16px;text-align:right">
        <div style="font-size:9px;color:#64748b;font-family:monospace">COMPLETED TASKS</div>
        <div style="font-size:20px;font-weight:900;color:#00FF88"><span id="done-count">0</span> / <span id="total-count">0</span></div>
      </div>
    </div>
  </div>

  <div class="card" style="margin-bottom:24px;display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between">
    <div style="display:flex;gap:8px;flex-wrap:wrap" id="todo-filters">
      <button class="btn btn-primary" onclick="filterTasks('All')">All Tasks</button>
      <button class="btn btn-outline" onclick="filterTasks('Pending')">Pending</button>
      <button class="btn btn-outline" onclick="filterTasks('In Progress')">In Progress</button>
      <button class="btn btn-outline" onclick="filterTasks('Completed')">Completed</button>
    </div>
    <div style="display:flex;gap:10px;align-items:center;flex:1;max-width:340px">
      <input type="text" id="task-search" onkeyup="renderTasks()" placeholder="🔍 Search tasks..." style="width:100%" />
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 340px;gap:24px">
    <div>
      <div style="display:flex;flex-direction:column;gap:12px" id="task-list"></div>
    </div>
    <div>
      <div class="card" style="position:sticky;top:85px">
        <h3 style="font-size:14px;font-weight:800;color:var(--accent);margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.08)">📊 Sprint Telemetry</h3>
        <canvas id="task-chart" height="180" style="width:100%;height:180px;background:rgba(2,6,23,0.9);border-radius:10px;margin-bottom:14px"></canvas>
        <div style="font-size:11px;color:#94a3b8;line-height:1.6;font-family:monospace">
          System Velocity: <span style="color:#00FF88">98.4 pts/sprint</span><br/>
          36 AI Agents Sync: <span style="color:#00F5FF">100% Operational</span><br/>
          Auto-Resolution Rate: <span style="color:#a855f7">94.2%</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="add-task-modal" style="display:none;position:fixed;inset:0;background:rgba(2,6,23,0.8);backdrop-filter:blur(10px);z-index:9999;align-items:center;justify-content:center">
  <div class="card" style="width:100%;max-width:420px">
    <h3 style="font-weight:800;font-size:16px;margin-bottom:14px;color:var(--accent)">➕ Create New Sprint Task</h3>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
      <input type="text" id="new-task-title" placeholder="Task Title (e.g. Build GraphQL API)" />
      <select id="new-task-priority">
        <option value="Critical">Critical Priority</option>
        <option value="High">High Priority</option>
        <option value="Medium" selected>Medium Priority</option>
        <option value="Low">Low Priority</option>
      </select>
      <select id="new-task-status">
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-outline" onclick="closeAddTaskModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveCustomTask()">Save Task</button>
    </div>
  </div>
</div>

<script>
const defaultTasks = [
  { id: 1, title: "Optimize 36 AI Agent Neural Fine-Tuning Pipeline", priority: "Critical", status: "In Progress", date: "Today" },
  { id: 2, title: "Deploy Glassmorphic Theme Engine & State Persistence", priority: "High", status: "Completed", date: "Today" },
  { id: 3, title: "Implement Real-time WebSocket Telemetry Feed", priority: "High", status: "In Progress", date: "Tomorrow" },
  { id: 4, title: "Perform Zero-Trust Security Vulnerability Audit", priority: "Medium", status: "Pending", date: "In 2 days" }
];
let tasks = window.NexusDB.getItem('tasks', defaultTasks);
let activeFilter = 'All';

function filterTasks(f){
  activeFilter = f;
  document.querySelectorAll('#todo-filters button').forEach(b => {
    b.className = b.textContent.includes(f) ? 'btn btn-primary' : 'btn btn-outline';
  });
  renderTasks();
}

function renderTasks(){
  const search = document.getElementById('task-search').value.toLowerCase();
  let list = tasks.filter(t => (activeFilter === 'All' || t.status === activeFilter) && t.title.toLowerCase().includes(search));
  
  const done = tasks.filter(t => t.status === 'Completed').length;
  document.getElementById('done-count').textContent = done;
  document.getElementById('total-count').textContent = tasks.length;

  document.getElementById('task-list').innerHTML = list.map(t => `
    <div class="card" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px">
      <div style="display:flex;align-items:center;gap:12px">
        <button onclick="toggleTaskStatus(${t.id})" style="background:none;border:none;cursor:pointer;font-size:18px">
          ${t.status === 'Completed' ? '✅' : t.status === 'In Progress' ? '⏳' : '⭕'}
        </button>
        <div>
          <div style="font-size:13px;font-weight:700;${t.status === 'Completed' ? 'text-decoration:line-through;color:#64748b' : 'color:#f8fafc'}">${t.title}</div>
          <div style="font-size:10px;color:var(--accent);font-family:monospace;margin-top:2px">${t.date} • ${t.priority} Priority</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="badge ${t.status === 'Completed' ? 'badge-green' : t.status === 'In Progress' ? 'badge-blue' : 'badge-amber'}">${t.status}</span>
        <button onclick="deleteTask(${t.id})" style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#ef4444;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:10px">🗑️</button>
      </div>
    </div>
  `).join('') || '<div class="card" style="text-align:center;color:#64748b;padding:30px">No tasks found.</div>';

  drawTaskChart();
}

function toggleTaskStatus(id){
  const t = tasks.find(x => x.id === id);
  if(t){
    t.status = t.status === 'Completed' ? 'Pending' : t.status === 'Pending' ? 'In Progress' : 'Completed';
    window.NexusDB.setItem('tasks', tasks);
    renderTasks();
    showToast('Updated task status to ' + t.status, 'success');
  }
}

function deleteTask(id){
  tasks = tasks.filter(x => x.id !== id);
  window.NexusDB.setItem('tasks', tasks);
  renderTasks();
  showToast('Task removed from sprint', 'info');
}

function openAddTaskModal(){ document.getElementById('add-task-modal').style.display = 'flex'; }
function closeAddTaskModal(){ document.getElementById('add-task-modal').style.display = 'none'; }

function saveCustomTask(){
  const title = document.getElementById('new-task-title').value.trim();
  const priority = document.getElementById('new-task-priority').value;
  const status = document.getElementById('new-task-status').value;
  if(!title){ showToast('Please enter a task title!', 'warning'); return; }

  tasks.unshift({ id: Date.now(), title, priority, status, date: 'Just now' });
  window.NexusDB.setItem('tasks', tasks);
  renderTasks();
  closeAddTaskModal();
  document.getElementById('new-task-title').value = '';
  showToast('Added task to sprint backlog!', 'success');
}

function drawTaskChart(){
  const canvas = document.getElementById('task-chart');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const done = tasks.filter(t => t.status === 'Completed').length;
  const prog = tasks.filter(t => t.status === 'In Progress').length;
  const pend = tasks.filter(t => t.status === 'Pending').length;
  const total = Math.max(1, tasks.length);

  const bars = [
    { label: 'Done', val: done, color: '#00FF88' },
    { label: 'In Prog', val: prog, color: '#00F5FF' },
    { label: 'Pending', val: pend, color: '#fbbf24' }
  ];

  bars.forEach((b, i) => {
    const h = (b.val / total) * 120;
    const x = 30 + i * 90;
    const y = 140 - h;
    ctx.fillStyle = b.color;
    ctx.fillRect(x, y, 50, h);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(b.val, x + 20, y - 6);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText(b.label, x + 5, 155);
  });
}

renderTasks();
</script>"""
    return _html_shell(name, body, "#00FF88")


def generate_crm_app(project: dict) -> str:
    name = project.get("name", "AI Enterprise CRM Suite")
    body = """
<div style="max-width:1240px;margin:0 auto;padding:24px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:16px">
    <div>
      <h1 style="font-size:28px;font-weight:900;background:linear-gradient(90deg,#fff,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">💼 """ + name + """</h1>
      <p style="color:#64748b;font-size:12px;margin-top:4px">Customer Relationship & Lead Intelligence · 36 AI Sales Copilots</p>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <button class="btn btn-primary" onclick="openAddLeadModal()">➕ Add New Lead</button>
      <div class="card" style="padding:10px 16px;text-align:right">
        <div style="font-size:9px;color:#64748b;font-family:monospace">PIPELINE VALUE</div>
        <div style="font-size:20px;font-weight:900;color:#00FF88">$<span id="pipeline-val">0</span></div>
      </div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 320px;gap:24px">
    <div>
      <div class="card" style="margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <h3 style="font-size:14px;font-weight:800;color:#3b82f6">🎯 Active Deals & Leads</h3>
          <input type="text" id="crm-search" onkeyup="renderLeads()" placeholder="🔍 Search deal or contact..." style="width:200px" />
        </div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:11.5px">
            <thead>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.1);color:#94a3b8;font-family:monospace;text-align:left">
                <th style="padding:10px">CONTACT / COMPANY</th>
                <th style="padding:10px">STAGE</th>
                <th style="padding:10px">DEAL VALUE</th>
                <th style="padding:10px">PROBABILITY</th>
                <th style="padding:10px">ACTIONS</th>
              </tr>
            </thead>
            <tbody id="crm-table"></tbody>
          </table>
        </div>
      </div>
    </div>

    <div>
      <div class="card" style="position:sticky;top:85px">
        <h3 style="font-size:14px;font-weight:800;color:var(--accent);margin-bottom:14px">📈 Conversion Analytics</h3>
        <canvas id="crm-chart" height="180" style="width:100%;height:180px;background:rgba(2,6,23,0.9);border-radius:10px;margin-bottom:14px"></canvas>
        <div style="font-size:11px;color:#94a3b8;line-height:1.6;font-family:monospace">
          Avg Deal Size: <span style="color:#00FF88">$48,500</span><br/>
          Close Rate: <span style="color:#00F5FF">68.4%</span><br/>
          AI Lead Score Avg: <span style="color:#a855f7">92.1 / 100</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="add-lead-modal" style="display:none;position:fixed;inset:0;background:rgba(2,6,23,0.8);backdrop-filter:blur(10px);z-index:9999;align-items:center;justify-content:center">
  <div class="card" style="width:100%;max-width:420px">
    <h3 style="font-weight:800;font-size:16px;margin-bottom:14px;color:#3b82f6">➕ Create New Lead Entity</h3>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
      <input type="text" id="lead-name" placeholder="Contact Name & Company (e.g. Sarah Connor / Cyberdyne)" />
      <input type="number" id="lead-val" placeholder="Deal Value in USD ($)" step="1000" />
      <select id="lead-stage">
        <option value="Lead">Lead Qualification</option>
        <option value="Contacted">Contacted</option>
        <option value="Proposal">Proposal Sent</option>
        <option value="Won">Closed Won</option>
      </select>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-outline" onclick="closeAddLeadModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveCustomLead()">Save Lead</button>
    </div>
  </div>
</div>

<script>
const defaultLeads = [
  { id: 1, name: "Nexus Robotics Corp", stage: "Proposal", value: 125000, prob: "85%" },
  { id: 2, name: "Cyberdyne Systems", stage: "Contacted", value: 75000, prob: "60%" },
  { id: 3, name: "Aperture Science Inc", stage: "Won", value: 250000, prob: "100%" },
  { id: 4, name: "Stark Industries", stage: "Lead", value: 50000, prob: "40%" }
];
let leads = window.NexusDB.getItem('crm_leads', defaultLeads);

function renderLeads(){
  const search = document.getElementById('crm-search').value.toLowerCase();
  let list = leads.filter(l => l.name.toLowerCase().includes(search));
  
  const totalVal = leads.reduce((a,c) => a + c.value, 0);
  document.getElementById('pipeline-val').textContent = totalVal.toLocaleString();

  document.getElementById('crm-table').innerHTML = list.map(l => `
    <tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
      <td style="padding:12px;font-weight:700;color:#f8fafc">${l.name}</td>
      <td style="padding:12px"><span class="badge ${l.stage==='Won'?'badge-green':l.stage==='Proposal'?'badge-blue':'badge-amber'}">${l.stage}</span></td>
      <td style="padding:12px;color:#00FF88;font-weight:800">$${l.value.toLocaleString()}</td>
      <td style="padding:12px;color:var(--accent);font-family:monospace">${l.prob}</td>
      <td style="padding:12px">
        <button onclick="deleteLead(${l.id})" style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#ef4444;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:10px">Remove</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="5" style="padding:20px;text-align:center;color:#64748b">No deals found</td></tr>';

  drawCrmChart();
}

function deleteLead(id){
  leads = leads.filter(l => l.id !== id);
  window.NexusDB.setItem('crm_leads', leads);
  renderLeads();
  showToast('Removed deal from pipeline', 'info');
}

function openAddLeadModal(){ document.getElementById('add-lead-modal').style.display = 'flex'; }
function closeAddLeadModal(){ document.getElementById('add-lead-modal').style.display = 'none'; }

function saveCustomLead(){
  const name = document.getElementById('lead-name').value.trim();
  const val = parseFloat(document.getElementById('lead-val').value) || 25000;
  const stage = document.getElementById('lead-stage').value;
  if(!name){ showToast('Enter contact or company name', 'warning'); return; }

  const probMap = { Lead: '30%', Contacted: '50%', Proposal: '75%', Won: '100%' };
  leads.unshift({ id: Date.now(), name, stage, value: val, prob: probMap[stage] || '50%' });
  window.NexusDB.setItem('crm_leads', leads);
  renderLeads();
  closeAddLeadModal();
  document.getElementById('lead-name').value = '';
  showToast('Added lead to CRM pipeline!', 'success');
}

function drawCrmChart(){
  const canvas = document.getElementById('crm-chart');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(30, 40, 40, 100);
  ctx.fillRect(90, 20, 40, 120);
  ctx.fillRect(150, 60, 40, 80);

  ctx.fillStyle = '#fff';
  ctx.font = '10px monospace';
  ctx.fillText('Q1', 40, 155); ctx.fillText('Q2', 100, 155); ctx.fillText('Q3', 160, 155);
}

renderLeads();
</script>"""
    return _html_shell(name, body, "#3b82f6")


def generate_blog_cms_app(project: dict) -> str:
    name = project.get("name", "AI Content & Editorial CMS")
    body = """
<div style="max-width:1240px;margin:0 auto;padding:24px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:16px">
    <div>
      <h1 style="font-size:28px;font-weight:900;background:linear-gradient(90deg,#fff,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent">✍️ """ + name + """</h1>
      <p style="color:#64748b;font-size:12px;margin-top:4px">Editorial & Publishing Suite · Powered by Content Creator AI</p>
    </div>
    <button class="btn btn-primary" onclick="openNewPostModal()">📝 Publish New Article</button>
  </div>

  <div style="display:grid;grid-template-columns:1fr 300px;gap:24px">
    <div id="posts-container" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px"></div>
    <div>
      <div class="card" style="position:sticky;top:85px">
        <h3 style="font-size:14px;font-weight:800;color:#c084fc;margin-bottom:12px">🏷️ Topics & Tags</h3>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px" id="tag-cloud"></div>
        <div style="font-size:11px;color:#94a3b8;line-height:1.6;font-family:monospace;border-top:1px solid rgba(255,255,255,0.08);padding-top:12px">
          Total Readers: <span style="color:#00FF88">42,850</span><br/>
          Avg Read Time: <span style="color:#00F5FF">4.2 mins</span><br/>
          SEO Performance: <span style="color:#a855f7">Grade A+</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="add-post-modal" style="display:none;position:fixed;inset:0;background:rgba(2,6,23,0.8);backdrop-filter:blur(10px);z-index:9999;align-items:center;justify-content:center">
  <div class="card" style="width:100%;max-width:460px">
    <h3 style="font-weight:800;font-size:16px;margin-bottom:14px;color:#c084fc">📝 Publish New Article</h3>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
      <input type="text" id="post-title" placeholder="Article Title..." />
      <input type="text" id="post-category" placeholder="Category (e.g. AI Architecture)" />
      <textarea id="post-excerpt" placeholder="Excerpt / Summary..." rows="4"></textarea>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-outline" onclick="closeNewPostModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveCustomPost()">Publish</button>
    </div>
  </div>
</div>

<script>
const defaultPosts = [
  { id: 1, title: "Synthesizing 36 AI Agents into a Unified Operating System", category: "AI Architecture", reads: "12.4K", date: "Aug 2026", excerpt: "How multi-agent consensus networks achieve real-time task orchestration across edge hardware." },
  { id: 2, title: "The Future of Full-Stack Code Generation", category: "Engineering", reads: "8.9K", date: "Aug 2026", excerpt: "Automating 3-tier React, FastAPI, and PostgreSQL synthesis from natural language directives." },
  { id: 3, title: "Zero-Trust Biometric Security in Web Apps", category: "Cybersecurity", reads: "6.1K", date: "Jul 2026", excerpt: "Integrating facial recognition and JWT token rotation for high-security operating environments." }
];
let posts = window.NexusDB.getItem('cms_posts', defaultPosts);

function renderPosts(){
  document.getElementById('posts-container').innerHTML = posts.map(p => `
    <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;gap:12px">
      <div>
        <span class="badge badge-purple" style="margin-bottom:8px">${p.category}</span>
        <h3 style="font-size:15px;font-weight:800;color:#f8fafc;line-height:1.4">${p.title}</h3>
        <p style="font-size:11.5px;color:#94a3b8;margin-top:6px;line-height:1.5">${p.excerpt}</p>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#64748b;font-family:monospace;border-top:1px solid rgba(255,255,255,0.06);padding-top:10px">
        <span>👁️ ${p.reads} reads</span>
        <span>${p.date}</span>
      </div>
    </div>
  `).join('');

  const tags = [...new Set(posts.map(p => p.category))];
  document.getElementById('tag-cloud').innerHTML = tags.map(t => `<span class="badge badge-blue" style="cursor:pointer">${t}</span>`).join('');
}

function openNewPostModal(){ document.getElementById('add-post-modal').style.display = 'flex'; }
function closeNewPostModal(){ document.getElementById('add-post-modal').style.display = 'none'; }

function saveCustomPost(){
  const title = document.getElementById('post-title').value.trim();
  const category = document.getElementById('post-category').value.trim() || 'General';
  const excerpt = document.getElementById('post-excerpt').value.trim();
  if(!title){ showToast('Enter article title', 'warning'); return; }

  posts.unshift({ id: Date.now(), title, category, reads: '1.2K', date: 'Just now', excerpt: excerpt || 'Newly published article by AI Content Creator.' });
  window.NexusDB.setItem('cms_posts', posts);
  renderPosts();
  closeNewPostModal();
  document.getElementById('post-title').value = '';
  showToast('Article published to CMS!', 'success');
}

renderPosts();
</script>"""
    return _html_shell(name, body, "#c084fc")


def generate_portfolio_app(project: dict) -> str:
    name = project.get("name", "AI Developer & Creator Portfolio")
    body = """
<div style="max-width:1100px;margin:0 auto;padding:32px 24px">
  <div style="text-align:center;margin-bottom:40px">
    <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#6E56FF,var(--accent));margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:36px;box-shadow:0 0 30px var(--accent)">👨‍💻</div>
    <h1 style="font-size:36px;font-weight:900;color:#fff">""" + name + """</h1>
    <p style="color:var(--accent);font-size:14px;font-family:monospace;margin-top:6px">Full-Stack Engineer & AI Systems Architect</p>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;margin-bottom:40px" id="portfolio-grid"></div>

  <div class="card" style="max-width:500px;margin:0 auto;text-align:center">
    <h3 style="font-size:16px;font-weight:800;color:#fff;margin-bottom:12px">📫 Get in Touch</h3>
    <input type="text" id="contact-msg" placeholder="Send a message or inquiry..." style="width:100%;margin-bottom:10px" />
    <button class="btn btn-primary" onclick="sendContactMsg()" style="width:100%;justify-content:center">Send Direct Message</button>
  </div>
</div>

<script>
const projects = [
  { title: "OMEGA NEXUS AI OS", tag: "AI / Systems", desc: "Autonomous 36-agent operating system with real hardware telemetry.", stars: "1.4k" },
  { title: "Quantum Trade Engine", tag: "FinTech", desc: "Sub-millisecond high-frequency arbitrage trading platform.", stars: "890" },
  { title: "Bioluminescent Vision AI", tag: "Computer Vision", desc: "Edge AI object detection engine powered by PyTorch.", stars: "620" }
];

document.getElementById('portfolio-grid').innerHTML = projects.map(p => `
  <div class="card" style="display:flex;flex-direction:column;justify-content:space-between">
    <div>
      <span class="badge badge-green" style="margin-bottom:10px">${p.tag}</span>
      <h3 style="font-size:16px;font-weight:800;color:#fff">${p.title}</h3>
      <p style="font-size:12px;color:#94a3b8;margin-top:6px">${p.desc}</p>
    </div>
    <div style="font-size:11px;color:var(--accent);font-family:monospace;margin-top:14px">⭐ ${p.stars} GitHub Stars</div>
  </div>
`).join('');

function sendContactMsg(){
  const msg = document.getElementById('contact-msg').value.trim();
  if(!msg) return;
  showToast('Message sent! AI Copilot will respond shortly.', 'success');
  document.getElementById('contact-msg').value = '';
}
</script>"""
    return _html_shell(name, body, "#00F5FF")


def generate_healthcare_app(project: dict) -> str:
    name = project.get("name", "AI Medical & Health Telemetry Hub")
    body = """
<div style="max-width:1240px;margin:0 auto;padding:24px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:16px">
    <div>
      <h1 style="font-size:28px;font-weight:900;background:linear-gradient(90deg,#fff,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent">🩺 """ + name + """</h1>
      <p style="color:#64748b;font-size:12px;margin-top:4px">Patient Telemetry & Vital Monitoring · Powered by Data Scientist AI</p>
    </div>
    <span class="badge badge-green mono">● ECG MONITORING ACTIVE</span>
  </div>

  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px">
    <div class="card">
      <div style="font-size:9px;color:#64748b;font-family:monospace">HEART RATE</div>
      <div style="font-size:26px;font-weight:900;color:#ef4444"><span id="bpm">72</span> BPM</div>
      <div style="font-size:9px;color:#00FF88">Normal Resting Rhythm</div>
    </div>
    <div class="card">
      <div style="font-size:9px;color:#64748b;font-family:monospace">BLOOD PRESSURE</div>
      <div style="font-size:26px;font-weight:900;color:#00F5FF">120 / 80</div>
      <div style="font-size:9px;color:#00FF88">Optimal Range</div>
    </div>
    <div class="card">
      <div style="font-size:9px;color:#64748b;font-family:monospace">BLOOD OXYGEN (SpO2)</div>
      <div style="font-size:26px;font-weight:900;color:#00FF88">99%</div>
      <div style="font-size:9px;color:#00FF88">Nominal Oxygenation</div>
    </div>
    <div class="card">
      <div style="font-size:9px;color:#64748b;font-family:monospace">BODY TEMP</div>
      <div style="font-size:26px;font-weight:900;color:#fbbf24">98.6 °F</div>
      <div style="font-size:9px;color:#00FF88">Normothermia</div>
    </div>
  </div>

  <div class="card">
    <h3 style="font-size:14px;font-weight:800;color:#ef4444;margin-bottom:12px">📈 Live ECG Waveform Stream</h3>
    <canvas id="ecg-chart" height="140" style="width:100%;height:140px;background:rgba(2,6,23,0.9);border-radius:10px"></canvas>
  </div>
</div>

<script>
setInterval(() => {
  const bpm = Math.floor(Math.random() * 6 + 70);
  document.getElementById('bpm').textContent = bpm;
}, 2000);

const canvas = document.getElementById('ecg-chart');
if(canvas){
  const ctx = canvas.getContext('2d');
  let x = 0;
  function drawECG(){
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
    ctx.beginPath();
    for(let i=0; i<canvas.width; i+=5){
      const y = canvas.height/2 + (Math.sin(i*0.05)*10) + (i%80===0 ? -40 : 0);
      if(i===0) ctx.moveTo(i, y); else ctx.lineTo(i, y);
    }
    ctx.stroke();
  }
  drawECG();
  window.addEventListener('resize', drawECG);
}
</script>"""
    return _html_shell(name, body, "#ef4444")


def generate_education_app(project: dict) -> str:
    name = project.get("name", "AI Interactive Academy & Quiz Hub")
    body = """
<div style="max-width:1100px;margin:0 auto;padding:24px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
    <div>
      <h1 style="font-size:28px;font-weight:900;color:#10b981">🎓 """ + name + """</h1>
      <p style="color:#64748b;font-size:12px;margin-top:4px">Adaptive Learning & Skill Mastery · Research Scientist AI</p>
    </div>
    <div class="card" style="padding:10px 16px">
      <div style="font-size:9px;color:#64748b;font-family:monospace">QUIZ SCORE</div>
      <div style="font-size:20px;font-weight:900;color:#00FF88"><span id="quiz-score">0</span> pts</div>
    </div>
  </div>

  <div class="card" style="margin-bottom:24px">
    <h3 style="font-size:16px;font-weight:800;color:#fff;margin-bottom:12px" id="q-title">Question 1: What is the primary role of an AI Agent Orchestrator?</h3>
    <div style="display:flex;flex-direction:column;gap:10px" id="q-options">
      <button class="btn btn-outline" onclick="answerQuiz(true)">Dynamic lifecycle management, task assignment, and sub-agent spawning</button>
      <button class="btn btn-outline" onclick="answerQuiz(false)">Static database backup scheduling</button>
      <button class="btn btn-outline" onclick="answerQuiz(false)">Formatting HTML CSS layout files</button>
    </div>
  </div>
</div>

<script>
let score = 0;
function answerQuiz(correct){
  if(correct){
    score += 100;
    document.getElementById('quiz-score').textContent = score;
    showToast('Correct! +100 XP gained 🎉', 'success');
  } else {
    showToast('Incorrect choice. Try again!', 'warning');
  }
}
</script>"""
    return _html_shell(name, body, "#10b981")


def generate_real_estate_app(project: dict) -> str:
    name = project.get("name", "AI Property & Realty Platform")
    body = """
<div style="max-width:1240px;margin:0 auto;padding:24px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
    <div>
      <h1 style="font-size:28px;font-weight:900;color:#fbbf24">🏰 """ + name + """</h1>
      <p style="color:#64748b;font-size:12px;margin-top:4px">Smart Property Valuation & Listings · Finance AI</p>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px">
    <div class="card">
      <div style="font-size:40px;margin-bottom:10px">🏙️</div>
      <h3 style="font-size:16px;font-weight:800;color:#fff">Cyberpunk Penthouse Suite</h3>
      <div style="font-size:18px;font-weight:900;color:#00FF88;margin:6px 0">$1,850,000</div>
      <p style="font-size:11px;color:#94a3b8">3 Bed · 3 Bath · 2,800 sqft · Skyline View</p>
    </div>
    <div class="card">
      <div style="font-size:40px;margin-bottom:10px">🏡</div>
      <h3 style="font-size:16px;font-weight:800;color:#fff">Eco Smart Solar Villa</h3>
      <div style="font-size:18px;font-weight:900;color:#00FF88;margin:6px 0">$920,000</div>
      <p style="font-size:11px;color:#94a3b8">4 Bed · 3 Bath · 3,200 sqft · Net Zero Energy</p>
    </div>
  </div>
</div>"""
    return _html_shell(name, body, "#fbbf24")


def generate_social_media_app(project: dict) -> str:
    name = project.get("name", "AI Social Stream & Feed")
    body = """
<div style="max-width:800px;margin:0 auto;padding:24px">
  <h1 style="font-size:28px;font-weight:900;color:#f43f5e;margin-bottom:16px">🌐 """ + name + """</h1>

  <div class="card" style="margin-bottom:20px">
    <input type="text" id="social-input" placeholder="What's happening in your AI swarm?..." style="width:100%;margin-bottom:10px" />
    <button class="btn btn-primary" onclick="postSocialMsg()" style="background:#f43f5e">Post Update</button>
  </div>

  <div style="display:flex;flex-direction:column;gap:14px" id="social-feed"></div>
</div>

<script>
let feed = [
  { user: "NEXUS Core", handle: "@nexus", msg: "All 36 AI agents are trained and generating 3-tier full-stack applications!", likes: 142 },
  { user: "Web Dev AI", handle: "@webdev", msg: "Glassmorphism UI design tokens compiled cleanly across all project templates.", likes: 98 }
];

function renderFeed(){
  document.getElementById('social-feed').innerHTML = feed.map(f => `
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-weight:800;color:#fff">${f.user} <span style="color:#64748b;font-weight:400">${f.handle}</span></span>
        <span style="color:#f43f5e;font-size:11px;cursor:pointer">❤️ ${f.likes}</span>
      </div>
      <div style="font-size:13px;color:#e2e8f0;line-height:1.5">${f.msg}</div>
    </div>
  `).join('');
}

function postSocialMsg(){
  const msg = document.getElementById('social-input').value.trim();
  if(!msg) return;
  feed.unshift({ user: "Operator", handle: "@user", msg: msg, likes: 1 });
  renderFeed();
  document.getElementById('social-input').value = '';
  showToast('Posted to AI social feed!', 'success');
}
renderFeed();
</script>"""
    return _html_shell(name, body, "#f43f5e")

'''

# Insert templates_code before `def generate_app_html`
pattern = r"def generate_app_html\(project: dict\) -> str:"
if pattern in content:
    content = content.replace("def generate_app_html(project: dict) -> str:", templates_code + "\ndef generate_app_html(project: dict) -> str:")

# Update router in generate_app_html
old_router = """def generate_app_html(project: dict) -> str:
    name = (project.get("name") or "").lower()
    cat = (project.get("category") or "").lower()
    full = f"{name} {cat}"

    if any(k in full for k in ["ecommerce", "e-commerce", "shop", "store", "retail", "cart"]):
        return generate_ecommerce_app(project)
    if any(k in full for k in ["trad", "stock", "crypto", "forex", "invest", "finance", "quant", "arbitrage", "market maker"]):
        return generate_trading_app(project)
    if any(k in full for k in ["content generator", "copywriter", "blog studio", "seo copy", "ad copilot", "pitch deck"]):
        return generate_content_app(project)
    if any(k in full for k in ["smart city", "traffic", "urban", "hvac", "grid", "deforestation", "satellit"]):
        return generate_smartcity_app(project)
    if any(k in full for k in ["health", "medical", "clinical", "hospital", "patient", "gene", "bioinformatics"]):
        return generate_healthcare_app(project)
    if any(k in full for k in ["security", "shield", "threat", "vulnerability", "audit", "nfc", "fido", "cyber"]):
        return generate_cybersecurity_app(project)
    if any(k in full for k in ["robot", "rover", "arm", "kinematics", "subsea", "drone", "3d vision", "nerf", "hardware"]):
        return generate_robotics_app(project)
    return generate_generic_app(project)"""

new_router = """def generate_app_html(project: dict) -> str:
    name = (project.get("name") or "").lower()
    cat = (project.get("category") or "").lower()
    full = f"{name} {cat}"

    if any(k in full for k in ["todo", "task", "kanban", "sprint", "backlog"]):
        return generate_todo_manager_app(project)
    if any(k in full for k in ["crm", "customer", "lead", "sales", "deal", "pipeline"]):
        return generate_crm_app(project)
    if any(k in full for k in ["blog", "cms", "article", "news", "content", "publishing"]):
        return generate_blog_cms_app(project)
    if any(k in full for k in ["portfolio", "resume", "cv", "showcase"]):
        return generate_portfolio_app(project)
    if any(k in full for k in ["health", "medical", "patient", "clinical", "hospital", "vitals"]):
        return generate_healthcare_app(project)
    if any(k in full for k in ["educat", "course", "quiz", "learn", "academy", "school", "tutor"]):
        return generate_education_app(project)
    if any(k in full for k in ["real estate", "property", "realty", "house", "apartment", "mortgage"]):
        return generate_real_estate_app(project)
    if any(k in full for k in ["social", "feed", "community", "network", "post", "chat"]):
        return generate_social_media_app(project)
    if any(k in full for k in ["ecommerce", "e-commerce", "shop", "store", "retail", "cart"]):
        return generate_ecommerce_app(project)
    if any(k in full for k in ["trad", "stock", "crypto", "forex", "invest", "finance", "quant", "arbitrage", "market maker"]):
        return generate_trading_app(project)
    if any(k in full for k in ["content generator", "copywriter", "blog studio", "seo copy", "ad copilot", "pitch deck"]):
        return generate_content_app(project)
    if any(k in full for k in ["smart city", "traffic", "urban", "hvac", "grid", "deforestation", "satellit"]):
        return generate_smartcity_app(project)
    if any(k in full for k in ["security", "shield", "threat", "vulnerability", "audit", "nfc", "fido", "cyber"]):
        return generate_cybersecurity_app(project)
    if any(k in full for k in ["robot", "rover", "arm", "kinematics", "subsea", "drone", "3d vision", "nerf", "hardware"]):
        return generate_robotics_app(project)
    return generate_generic_app(project)"""

if old_router in content:
    content = content.replace(old_router, new_router)

with open(target_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully updated deploy_engine.py with 8 new templates!")
