
/* -------------------------
   Syllabus arrays (AI trimmed to top frequent topics)
------------------------- */
window.P_STATS = [
  'Counting (permutations and combinations)','Probability axioms','Sample space','Events','Independent events','Mutually exclusive events',
  'Marginal probability','Conditional probability','Joint probability','Bayes Theorem','Conditional expectation and variance','Mean','Median','Mode',
  'Standard deviation','Correlation','Covariance','Random variables','Discrete random variables','Probability mass functions',
  'Uniform distribution (discrete)','Bernoulli distribution','Binomial distribution','Continuous random variables','Probability distribution function',
  'Uniform distribution (continuous)','Exponential distribution','Poisson distribution','Normal distribution','Standard normal distribution',
  't-distribution','Chi-squared distributions','Cumulative distribution function','Conditional PDF','Central limit theorem','Confidence interval',
  'z-test','t-test','Chi-squared test'
];

window.LA = ['Vector space','Subspaces','Linear dependence and independence of vectors','Matrices','Projection matrix','Orthogonal matrix','Idempotent matrix','Partition matrix and their properties','Quadratic forms','Systems of linear equations','Gaussian elimination','Eigenvalues','Eigenvectors','Determinant','Rank','Nullity','Projections','LU decomposition','Singular value decomposition'];

window.CALC = ['Functions of a single variable','Limit','Continuity','Differentiability','Taylor series','Maxima and minima','Optimization involving a single variable'];

window.PROG = [
  'Linked lists',
  'Trees',
  'Hash tables',
  'Mergesort',
  'Quicksort',
  'Introduction to graph theory',
  'Graph traversals',
  'Shortest path algorithms'
];

window.DB = ['ER-model','Relational model','Relational algebra','Tuple calculus','SQL','Integrity constraints','Normal form','File organization','Indexing','Data types','Normalization','Discretization','Sampling','Compression','Data warehouse modelling','Schema for multidimensional data models','Concept hierarchies','Measures: categorization and computations'];

window.ML = [
  'Cross-validation methods',
  'LOO cross-validation',
  'k-folds cross-validation',
  'Multi-layer perceptron',
  'Feed-forward neural network',
  'Clustering algorithms',
  'k-means',
  'k-medoid',
  'Hierarchical clustering',
  'Top-down clustering',
  'Bottom-up clustering',
  'Single-linkage',
  'Multiple-linkage',
  'Dimensionality reduction',
  'Principal component analysis'
];

window.AI = [
  'Informed search',
  'Uninformed search',
  'Adversarial search',
  'Propositional logic',
  'Predicate logic',
  'Reasoning under uncertainty',
  'Conditional independence representation',
  'Exact inference through variable elimination',
  'Approximate inference through sampling'
];

/* -------------------------
   IMPORTANCE (0,1,2)
------------------------- */
const IMPORTANCE = {
  'Probability & Statistics': [1,0,0,1,1,0,0,1,1,2,1,1,0,1,0,0,1,0,0,0,0,1,0,0,1,2,2,1,1,0,0,0,0],
  'Linear Algebra': [1,0,1,1,1,1,0,0,1,1,1,2,2,1,1,1,1,1,1],
  'Calculus & Optimization': [1,1,1,1,1,1,1],

  'Programming': [1,2,2,2,2,1,2,2],

  'Database': [1,1,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0],

  'Machine Learning': [1,1,1,1,1,1,1,1,1,1,0,0,0,1,2],

  'AI': [1,1,1,1,1,1,1,1,1],
};

/* -------------------------
   Scheduling config
------------------------- */
const studyStart = new Date('2025-11-19'); // inclusive
const studyEnd   = new Date('2026-01-29'); // inclusive

const finalRevWindowStart = new Date('2026-01-30');
const finalRevWindowEnd   = new Date('2026-02-14');

const rev1OffsetDays = 10;

/* GA habit (legacy) */
const gaHabitStart = new Date('2026-01-01');
const gaHabitEnd   = new Date('2026-02-01');

/* Study intensity: leave window highlight */
const leaveStart = new Date('2026-01-30');
const leaveEnd   = new Date('2026-02-14');

/* -------------------------
   Amplitude (subject study days)
------------------------- */
const amplitude = {
  'Probability & Statistics': 10,
  'Linear Algebra': 10,
  'Calculus & Optimization': 8,
  'Database': 12,
  'Programming': 16,
  'Machine Learning': 16
};


/* storage prefix & helpers */
const canonicalPrefix = 'GATE_DA::';
function makeKey(topic, idx, type){ return `${canonicalPrefix}${topic}::${idx}::${type}`; }

function makeGAKey(dateStr){ return `${canonicalPrefix}ga::${dateStr}`; }
function makeGANoteKey(dateStr){ return `${canonicalPrefix}ga_note::${dateStr}`; }
function addDays(d,n){ const x=new Date(d.getTime()); x.setDate(x.getDate()+n); return x; }
function formatDate(d){ if(!d) return ''; return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

function topicKeyFromSummary(summary){
  const s = (summary||'').toLowerCase();
  if (s.includes('probability')) return 'Probability & Statistics';
  if (s.includes('linear algebra')) return 'Linear Algebra';
  if (s.includes('calculus')) return 'Calculus & Optimization';
  if (s.includes('programming')) return 'Programming';
  if (s.includes('database')) return 'Database';
  if (s.includes('machine learning')) return 'Machine Learning';
  if (s.includes('ai') && !s.includes('machine learning')) return 'AI';
  return summary;
}

/* -------------------------
   CSV parser
------------------------- */
function parseCSV(text){
  const rows = [];
  let i=0, len=text.length;
  let row=[], field='';
  let inQuotes=false;
  while(i < len){
    const ch = text[i];
    if (inQuotes){
      if (ch === '"'){
        if (i+1 < len && text[i+1] === '"'){ field += '"'; i+=2; continue; }
        else { inQuotes = false; i++; continue; }
      } else {
        field += ch; i++; continue;
      }
    } else {
      if (ch === '"'){ inQuotes = true; i++; continue; }
      if (ch === ','){ row.push(field); field=''; i++; continue; }
      if (ch === '\r'){ i++; continue; }
      if (ch === '\n'){ row.push(field); rows.push(row); row=[]; field=''; i++; continue; }
      field += ch; i++; continue;
    }
  }
  if (field !== '' || row.length>0){ row.push(field); rows.push(row); }
  return rows;
}

/* -------------------------
   Helper: normalize IMPORTANCE arrays
------------------------- */
function normalizedImportance(topic, length){
  const arr = IMPORTANCE[topic] ? IMPORTANCE[topic].slice(0) : [];
  while (arr.length < length) arr.push(0);
  if (arr.length > length) arr.length = length;
  return arr;
}

/* -------------------------
   Render functions
------------------------- */
function renderTopicArray(topic, arr){
  const table = document.getElementById('topic-'+topic);
  if (!table) return;
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  const impArr = normalizedImportance(topic, arr.length);
  arr.forEach((s, i)=>{
    const imp = impArr[i] || 0;
    let starHtml = '';
    if (imp === 1) starHtml = '<span class="star" title="Important">★</span>';
    else if (imp === 2) starHtml = '<span class="star" title="Very important">★★</span>';
    const tr = document.createElement('tr');
    tr.dataset.topic = topic;
    tr.dataset.idx = i;
    tr.innerHTML = `<td><div class="subtopic-wrap"><div class="subtopic-name">${s}</div>${starHtml}</div></td>
      <td style="text-align:center">${imp>0? (imp===2?'★★':'★') : ''}</td>
      <td style="text-align:center"><input type='checkbox' class='completed' aria-label='Mark completed'></td>
      <td style="text-align:center"><input type='checkbox' class='revised' aria-label='Mark revised'></td>
      <td style="text-align:center"><input type='checkbox' class='practiced' aria-label='Mark practiced'></td>
      <td class="date-cell" style="text-align:center">—</td>
      <td class="date-cell" style="text-align:center">—</td>
      <td class="date-cell" style="text-align:center">—</td>
      <td style="text-align:left"><input type="text" class="note note-field" placeholder="notes..." aria-label="Subtopic notes"></td>`;
    tbody.appendChild(tr);
  });
}

/* assemble schedulable entries */
function allSchedulableEntries(){
  const groups = [
    ['Probability & Statistics', window.P_STATS || []],
    ['Linear Algebra', window.LA || []],
    ['Calculus & Optimization', window.CALC || []],
    ['Programming', window.PROG || []],
    ['Database', window.DB || []],
    ['Machine Learning', window.ML || []],
    ['AI', window.AI || []],
  ];
  const out=[];
  groups.forEach(g=>{
    const tname=g[0], arr=g[1];
    arr.forEach((s,i)=> out.push({topic:tname, subtopic:s, index:i}));
  });
  return out;
}

/* Compute subject blocks (contiguous) */
function computeSubjectBlocks(amps, startDate){
  const blocks = {};
  let cursor = new Date(startDate.getTime());
  const keys = Object.keys(amps);
  for(const k of keys){
    const days = Math.max(1, Math.floor(amps[k]));
    const blockStart = new Date(cursor.getTime());
    const blockEnd = addDays(blockStart, days - 1);
    blocks[k] = {start:blockStart, end:blockEnd, days};
    cursor = addDays(blockEnd, 1);
  }
  return blocks;
}

/* Assign target dates */
function assignTargetDates(){
  const entries = allSchedulableEntries();
  const map = {};
  if (entries.length === 0) return map;

  const blocks = computeSubjectBlocks(amplitude, studyStart);

  const byTopic = {};
  entries.forEach(e=>{
    if (!byTopic[e.topic]) byTopic[e.topic] = [];
    byTopic[e.topic].push(e);
  });

  Object.keys(byTopic).forEach(topic=>{
    const list = byTopic[topic];
    const block = blocks[topic];
    if (!block){
      const totalDays = Math.floor((studyEnd - studyStart)/(1000*60*60*24)) + 1;
      list.forEach((item, idx)=>{
        const frac = idx / (list.length - 1 || 1);
        const dayOffset = Math.round(frac * (totalDays - 1));
        const target = addDays(studyStart, dayOffset);
        const rev1 = addDays(target, rev1OffsetDays);
        map[`${item.topic}::${item.index}`] = {target, rev1};
      });
    } else {
      const spanDays = Math.max(1, Math.floor((block.end - block.start)/(1000*60*60*24)) + 1);
      for(let i=0;i<list.length;i++){
        const frac = i / (list.length - 1 || 1);
        const offset = Math.round(frac * (spanDays - 1));
        const target = addDays(block.start, offset);
        const rev1 = addDays(target, rev1OffsetDays);
        map[`${list[i].topic}::${list[i].index}`] = {target, rev1};
      }
    }
  });

  const finalWindowDays = [];
  for(let d=0; d<=Math.floor((finalRevWindowEnd - finalRevWindowStart)/(1000*60*60*24)); d++){
    finalWindowDays.push(addDays(finalRevWindowStart, d));
  }
  const keys = Object.keys(map);
  for(let i=0;i<keys.length;i++){
    map[keys[i]].finalRev = finalWindowDays[i % finalWindowDays.length];
  }
  return map;
}

/* FINAL REVISION DAILY CALENDAR */
function generateRevisionCalendar() {
  const mapping = assignTargetDates();
  const tbody = document.querySelector("#revisionCalendarTable tbody");
  tbody.innerHTML = "";

  const start = new Date("2026-01-30");
  const end   = new Date("2026-02-14");
  const dayMs = 24 * 60 * 60 * 1000;
  const tasksByDate = {};

  Object.keys(mapping).forEach(key => {
    const entry = mapping[key];
    if (!entry.finalRev) return;
    const d = new Date(entry.finalRev);
    const ds = d.toISOString().split("T")[0];
    const [topic, idxStr] = key.split("::");

    const details = Array.from(document.querySelectorAll("details"));
    const section = details.find(d => {
      const s = d.querySelector("summary");
      return s && topicKeyFromSummary(s.textContent) === topic;
    });

    let sub = topic;
    if (section) {
      const row = section.querySelectorAll("tbody tr")[Number(idxStr)];
      const sEl = row?.querySelector(".subtopic-name");
      if (sEl) sub = sEl.textContent.trim();
    }

    if (!tasksByDate[ds]) tasksByDate[ds] = [];
    tasksByDate[ds].push(sub);
  });

  const mockTestDates = {
    "2026-01-31": "Mock Test 1",
    "2026-02-03": "Mock Test 2",
    "2026-02-07": "Mock Test 3",
    "2026-02-10": "Mock Test 4",
    "2026-02-13": "Light Mixed Test"
  };

  for (let t = start; t <= end; t = new Date(t.getTime() + dayMs)) {
    const ds = t.toISOString().split("T")[0];
    const row = document.createElement("tr");
    row.classList.add("rev-day", "rev-intense");
    const dateCell = `<td>${ds}</td>`;
    const tasks = tasksByDate[ds] || [];
    let tHtml = "";

    if (tasks.length === 0) {
      tHtml = `<div class="rev-task" style="color:#777">Rest / Light Review</div>`;
    } else {
      tasks.forEach(sub => { tHtml += `<div class="rev-task">• ${sub}</div>`; });
    }

    const mock = mockTestDates[ds] ? `<span class="mock-badge">${mockTestDates[ds]}</span>` : "";
    row.innerHTML = `${dateCell}<td>${tHtml}</td><td>${mock}</td>`;
    tbody.appendChild(row);
  }
}

/* populate dates into visible tables */
function populateDates(mapping){
  document.querySelectorAll('details').forEach(section=>{
    const visibleTopic = section.querySelector('summary').textContent.trim();
    const topicKey = topicKeyFromSummary(visibleTopic);
    Array.from(section.querySelectorAll('tbody tr')).forEach((row, idx)=>{
      const key = `${topicKey}::${idx}`;
      const cellTarget = row.cells[5];
      const cellRev1 = row.cells[6];
      const cellFinal = row.cells[7];
      const m = mapping[key];
      if (!m){
        cellTarget.textContent = '—';
        cellRev1.textContent = '—';
        cellFinal.textContent = '—';
        row.dataset.target = '';
        row.dataset.rev1 = '';
        row.dataset.final = '';
      } else {
        cellTarget.textContent = formatDate(m.target);
        cellRev1.textContent = formatDate(m.rev1);
        cellFinal.textContent = formatDate(m.finalRev);
        row.dataset.target = formatDate(m.target);
        row.dataset.rev1 = formatDate(m.rev1);
        row.dataset.final = formatDate(m.finalRev);
      }
    });
  });
}

function applyRowColoring(){
  const today = new Date();
  document.querySelectorAll('details tbody tr').forEach(row=>{
    row.classList.remove('row-overdue','row-due-soon','row-done','row-intense');

    const completed = row.querySelector('.completed') && row.querySelector('.completed').checked;
    const targetStr = row.dataset.target;
    if (!targetStr || targetStr === '') return;

    const parts = targetStr.split('-').map(Number);
    const tDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const daysTo = Math.floor((tDate - today) / (1000*60*60*24));

    const inLeave = (typeof leaveStart !== 'undefined' && typeof leaveEnd !== 'undefined'
                     && tDate >= leaveStart && tDate <= leaveEnd);

    if (completed){
      row.classList.add('row-done');
      if (inLeave) row.classList.add('row-intense');
    } else {
      if (daysTo < 0){
        row.classList.add('row-overdue');
      } else if (daysTo <= 3){
        row.classList.add('row-due-soon');
      }
      if (inLeave){
        row.classList.add('row-intense');
      }
    }
  });
}

/* save/load states for syllabus */
function saveStates(){
  try {
    document.querySelectorAll('details').forEach(section=>{
      const visibleTopic = section.querySelector('summary')?.textContent?.trim() || 'unknown';
      const topicKey = topicKeyFromSummary(visibleTopic);
      Array.from(section.querySelectorAll('tbody tr')).forEach((row, idx)=>{
        ['completed','revised','practiced'].forEach(type=>{
          const cb = row.querySelector('.'+type);
          if (!cb) return;
          try{ localStorage.setItem(makeKey(topicKey, idx, type), cb.checked ? '1' : '0'); }catch(e){}
        });
        const note = row.querySelector('.note-field');
        if (note){
          try{ localStorage.setItem(makeKey(topicKey, idx, 'note'), note.value || ''); }catch(e){}
        }
      });
    });
    // save GA / parallel blocks checkboxes and notes
    document.querySelectorAll('input[data-ga]').forEach(cb=>{
      const ds = cb.getAttribute('data-ga');
      try{ localStorage.setItem(makeGAKey(ds), cb.checked ? '1' : '0'); }catch(e){}
    });
    document.querySelectorAll('input[data-ga-note]').forEach(inp=>{
      const ds = inp.getAttribute('data-ga-note');
      try{ localStorage.setItem(makeGANoteKey(ds), inp.value || ''); }catch(e){}
    });
  } catch(e) {
    console.warn('saveStates failed', e);
  }
}
let saveTimer = null;
function scheduleSaveStates(delay = 400){
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(()=>{ saveStates(); saveTimer = null; }, delay);
}

function loadStates(){
  document.querySelectorAll('details').forEach(section=>{
    const visibleTopic = section.querySelector('summary')?.textContent?.trim() || 'unknown';
    const topicKey = topicKeyFromSummary(visibleTopic);
    Array.from(section.querySelectorAll('tbody tr')).forEach((row, idx)=>{
      ['completed','revised','practiced'].forEach(type=>{
        const cb = row.querySelector('.'+type);
        if (!cb) return;
        const v = localStorage.getItem(makeKey(topicKey, idx, type));
        cb.checked = v === '1';
      });
      const note = row.querySelector('.note-field');
      if (note){
        const nv = localStorage.getItem(makeKey(topicKey, idx, 'note'));
        if (nv !== null) note.value = nv;
      }
    });
  });
  // load GA / parallel block states
  document.querySelectorAll('input[data-ga]').forEach(cb=>{
    const ds = cb.getAttribute('data-ga');
    const v = localStorage.getItem(makeGAKey(ds));
    cb.checked = v === '1';
  });
  document.querySelectorAll('input[data-ga-note]').forEach(inp=>{
    const ds = inp.getAttribute('data-ga-note');
    const v = localStorage.getItem(makeGANoteKey(ds));
    if (v !== null) inp.value = v;
  });
}

/* summary */
function updateSummary(){
  saveStates();

  const rows = [];
  document.querySelectorAll('details').forEach(section=>{
    const visible = section.querySelector('summary').textContent.trim();
    const trs = Array.from(section.querySelectorAll('tbody tr'));
    const total = trs.length;

    let comp=0, rev=0, prac=0;
    trs.forEach(r=>{
      if (r.querySelector('.completed')?.checked) comp++;
      if (r.querySelector('.revised')?.checked) rev++;
      if (r.querySelector('.practiced')?.checked) prac++;
    });

    rows.push(
      `<tr>
        <td>${visible}</td>
        <td style="text-align:center">${total}</td>
        <td style="text-align:center">${comp}</td>
        <td style="text-align:center">${rev}</td>
        <td style="text-align:center">${prac}</td>
        <td style="text-align:center">${total ? ((comp/total)*100).toFixed(1) : '0.0'}%</td>
        <td style="text-align:center">${total ? ((rev/total)*100).toFixed(1) : '0.0'}%</td>
        <td style="text-align:center">${total ? ((prac/total)*100).toFixed(1) : '0.0'}%</td>
      </tr>`
    );
  });

  const allRows = Array.from(document.querySelectorAll('details tbody tr'));
  const grandTotal = allRows.length || 1;

  let gC=0, gR=0, gP=0;
  allRows.forEach(r=>{
    if (r.querySelector('.completed')?.checked) gC++;
    if (r.querySelector('.revised')?.checked) gR++;
    if (r.querySelector('.practiced')?.checked) gP++;
  });

  const grand = `
    <tr class="grand">
      <td><b>Grand Total</b></td>
      <td style="text-align:center">${grandTotal}</td>
      <td style="text-align:center">${gC}</td>
      <td style="text-align:center">${gR}</td>
      <td style="text-align:center">${gP}</td>
      <td style="text-align:center">${((gC/grandTotal)*100).toFixed(1)}%</td>
      <td style="text-align:center">${((gR/grandTotal)*100).toFixed(1)}%</td>
      <td style="text-align:center">${((gP/grandTotal)*100).toFixed(1)}%</td>
    </tr>
  `;

  document.getElementById('summaryTableWrap').innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Main Topic</th>
          <th>Total</th>
          <th>Completed</th>
          <th>Revised</th>
          <th>Practiced</th>
          <th>%C</th>
          <th>%R</th>
          <th>%P</th>
        </tr>
      </thead>
      <tbody>
        ${rows.join('')}
        ${grand}
      </tbody>
    </table>
  `;

  const live = document.getElementById('liveStats');
  if (live) {
    live.textContent = `Completed ${gC}/${grandTotal} · Revised ${gR} · Practiced ${gP}`;
  }

  const pi = document.getElementById('practiceInfo');
  if (pi) {
    pi.textContent = '';
  }

  applyRowColoring();
}


/* CSV export (robust) */
function exportCSV(){
  const quote = v => `"${String(v || '').replace(/"/g,'""')}"`;
  const rows = [];
  document.querySelectorAll('details').forEach(section=>{
    const visibleTopic = section.querySelector('summary')?.textContent?.trim() || '';
    const topicKey = topicKeyFromSummary(visibleTopic);
    Array.from(section.querySelectorAll('tbody tr')).forEach((row, idx)=>{
      const subEl = row.querySelector('.subtopic-name');
      const sub = subEl ? subEl.textContent.trim() : (row.querySelector('td')?.textContent || '').trim();
      const imp = IMPORTANCE[topicKey] && IMPORTANCE[topicKey][idx] ? IMPORTANCE[topicKey][idx] : 0;
      const comp = row.querySelector('.completed')?.checked ? '1':'0';
      const rev = row.querySelector('.revised')?.checked ? '1':'0';
      const prac = row.querySelector('.practiced')?.checked ? '1':'0';
      const targ = row.dataset.target || '';
      const note = (row.querySelector('.note-field')?.value || '');
      rows.push([visibleTopic, topicKey, idx, sub, imp, comp, rev, prac, targ, note].map(quote).join(','));
    });
  });

  const gaRows = [];
  document.querySelectorAll('input[data-ga]').forEach((cb)=>{
    const ds = cb.getAttribute('data-ga');
    const done = cb.checked ? '1' : '0';
    const noteInp = document.querySelector(`input[data-ga-note="${ds}"]`);
    const note = noteInp ? noteInp.value : '';
    gaRows.push([ 'GA/Parallel', 'Parallel Block', ds, 'Daily practice', 0, done, '', '', ds, note ].map(quote).join(','));
  });

  const header = ['visible_topic','internal_topic','idx','subtopic','importance','completed','revised','practiced','target_date','note'].join(',');
  const csv = header + '\n' + rows.join('\n') + (gaRows.length ? ('\n' + gaRows.join('\n')) : '');
  const blob = new Blob([csv], {type:'text/csv'}); const url = URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='gate_da_export.csv'; a.click(); URL.revokeObjectURL(url);
}

/* CSV import using parseCSV (more tolerant) */
function importCSVFile(file){
  const reader=new FileReader();
  reader.onload = e=>{
    const text = e.target.result.replace(/^\uFEFF/, '');
    const rows = parseCSV(text);
    let start = 0;
    if (rows.length>0){
      const headers = rows[0].map(h=>String(h||'').toLowerCase());
      if (headers.includes('visible_topic') && headers.includes('subtopic')) start = 1;
    }
    for(let r=start;r<rows.length;r++){
      const parts = rows[r];
      if (!parts || parts.length < 9) continue;
      const visible = (parts[0]||'').replace(/""/g,'"').trim();
      const internal = (parts[1]||'').replace(/""/g,'"').trim();
      const idxRaw = (parts[2]||'').replace(/^"|"$/g,'');
      const idx = isNaN(Number(idxRaw)) ? idxRaw : parseInt(idxRaw,10);
      const imp = parseInt((parts[4]||'').replace(/^"|"$/g,''),10) || 0;
      const comp = String(parts[5]||'').replace(/^"|"$/g,'') === '1';
      const rev = String(parts[6]||'').replace(/^"|"$/g,'') === '1';
      const prac = String(parts[7]||'').replace(/^"|"$/g,'') === '1';
      const targ = parts[8] ? String(parts[8]||'').replace(/^"|"$/g,'').replace(/""/g,'"') : '';
      const note = parts[9] ? String(parts[9]||'').replace(/^"|"$/g,'').replace(/""/g,'"') : '';

      if ((visible || '').toLowerCase().includes('parallel') || (internal||'').toLowerCase().includes('parallel')){
        const ds = idx;
        if (ds){
          try{ localStorage.setItem(makeGAKey(ds), comp ? '1':'0'); }catch(e){}
          if (note) try{ localStorage.setItem(makeGANoteKey(ds), note); }catch(e){}
        }
        continue;
      }

      const details = Array.from(document.querySelectorAll('details'));
      let section = details.find(d => (d.querySelector('summary')?.textContent||'').trim() === visible);
      if (!section && internal){
        section = details.find(d => {
          const s = (d.querySelector('summary')?.textContent||'').trim().toLowerCase();
          const ik = (internal||'').toLowerCase();
          return s.includes(ik) || ik.includes(s);
        });
      }
      if (!section) {
        const topicKey = topicKeyFromSummary(visible) || topicKeyFromSummary(internal);
        section = details.find(d => (d.querySelector('summary')?.textContent||'').toLowerCase().includes((topicKey||'').toLowerCase()));
      }
      if (!section) continue;
      const rowsInSection = section.querySelectorAll('tbody tr');
      const numericIdx = Number(idx);
      if (!isNaN(numericIdx) && rowsInSection[numericIdx]) {
        const row = rowsInSection[numericIdx];
        if (!row) continue;
        if (row.querySelector('.completed')) row.querySelector('.completed').checked = comp;
        if (row.querySelector('.revised')) row.querySelector('.revised').checked = rev;
        if (row.querySelector('.practiced')) row.querySelector('.practiced').checked = prac;
        if (row.querySelector('.note-field')) row.querySelector('.note-field').value = note;
        if (targ) {
          row.dataset.target = targ;
          row.cells[5].textContent = targ;
        }
        const topicKey = topicKeyFromSummary(visible) || internal;
        if (!IMPORTANCE[topicKey]) IMPORTANCE[topicKey] = [];
        IMPORTANCE[topicKey][numericIdx] = imp;
      }
    }
    const groups = [
      ['Probability & Statistics', window.P_STATS || []],
      ['Linear Algebra', window.LA || []],
      ['Calculus & Optimization', window.CALC || []],
      ['Programming', window.PROG || []],
      ['Database', window.DB || []],
      ['Machine Learning', window.ML || []],
      ['AI', window.AI || []]
    ];
    groups.forEach(g=> renderTopicArray(g[0], g[1]));
    const mapping = assignTargetDates();
    populateDates(mapping);
    loadStates();
    updateSummary();
    alert('Import finished.');
  };
  reader.readAsText(file);
}

/* reset */
function resetAll(){
  if (!confirm('Reset all progress and clear saved progress?')) return;
  document.querySelectorAll('input[type=checkbox]').forEach(cb=>cb.checked=false);
  document.querySelectorAll('.note-field').forEach(n=>n.value='');
  Object.keys(localStorage).forEach(k=>{ if (k.startsWith(canonicalPrefix)) localStorage.removeItem(k); });
  updateSummary();

  generateGAParallelOnLoad();
}
/* ---------- Custom GA schedule (date -> {topic, note}) ---------- */
const customGASchedule = {
  '2026-01-01': { topic: 'Verbal — Grammar basics', note: 'notes...' },
  '2026-01-02': { topic: 'Quant — Number systems', note: 'notes...' },
  '2026-01-03': { topic: 'Reasoning — Series & patterns', note: 'notes...' },
  '2026-01-04': { topic: 'Data Interpretation — Tables & charts', note: 'notes...' },
  '2026-01-05': { topic: 'Verbal — Para jumbles', note: 'notes...' },
  '2026-01-06': { topic: 'Quant — Algebra basics', note: 'notes...' },
  '2026-01-07': { topic: 'Reasoning — Blood relations', note: 'notes...' },
  '2026-01-08': { topic: 'DI — Percentages in DI', note: 'notes...' },
  '2026-01-09': { topic: 'Verbal — Reading comprehension (Set 1)', note: 'notes...' },
  '2026-01-10': { topic: 'Quant — Ratios & proportions', note: 'notes...' },
  '2026-01-11': { topic: 'Reasoning — Coding-decoding', note: 'notes...' },
  '2026-01-12': { topic: 'DI — Simple graphs', note: 'notes...' },
  '2026-01-13': { topic: 'Verbal — Vocabulary (syn/ant)', note: 'notes...' },
  '2026-01-14': { topic: 'Quant — Time & work', note: 'notes...' },
  '2026-01-15': { topic: 'Reasoning — Directions', note: 'notes...' },
  '2026-01-16': { topic: 'DI — Mixed sets', note: 'notes...' },
  '2026-01-17': { topic: 'Verbal — Error spotting', note: 'notes...' },
  '2026-01-18': { topic: 'Quant — Percentages', note: 'notes...' },
  '2026-01-19': { topic: 'Reasoning — Analogies', note: 'notes...' },
  '2026-01-20': { topic: 'DI — Combined DI', note: 'notes...' },
  '2026-01-21': { topic: 'Verbal — Synonyms/antonyms practice', note: 'notes...' },
  '2026-01-22': { topic: 'Quant — Time/speed/distance', note: 'notes...' },
  '2026-01-23': { topic: 'Reasoning — Non-verbal', note: 'notes...' },
  '2026-01-24': { topic: 'DI — Caselets', note: 'notes...' },
  '2026-01-25': { topic: 'Verbal — Reading comprehension (Set 2)', note: 'notes...' },
  '2026-01-26': { topic: 'Quant — Profit & loss', note: 'notes...' },
  '2026-01-27': { topic: 'Reasoning — Puzzles', note: 'notes...' },
  '2026-01-28': { topic: 'DI — Data comparison', note: 'notes...' },
  '2026-01-29': { topic: 'Verbal — Cloze test', note: 'notes...' },
  '2026-01-30': { topic: 'Quant — Mixed practice set', note: 'notes...' },
  '2026-01-31': { topic: 'Reasoning — Combined reasoning test', note: 'notes...' },
  '2026-02-01': { topic: 'DI — Revision + speed test', note: '' }
};
/* ---------- Custom AI 15-day schedule (date -> {topic, note}) ---------- */
const customAISchedule = {
  '2026-01-01': { topic: 'Search — uninformed search basics', note: '' },
  '2026-01-02': { topic: 'Search — BFS, DFS, UCS', note: '' },
  '2026-01-03': { topic: 'Search — informed (greedy, A*)', note: '' },
  '2026-01-04': { topic: 'Search — adversarial (minimax)', note: '' },
  '2026-01-05': { topic: 'Search — alpha–beta pruning', note: '' },

  '2026-01-06': { topic: 'Logic — propositional logic fundamentals', note: '' },
  '2026-01-07': { topic: 'Logic — CNF + resolution', note: '' },
  '2026-01-08': { topic: 'Logic — predicate logic + quantifiers', note: '' },
  '2026-01-09': { topic: 'Logic — unification & reasoning', note: '' },

  '2026-01-10': { topic: 'Uncertainty — conditional independence', note: '' },
  '2026-01-11': { topic: 'Uncertainty — Bayesian networks', note: '' },
  '2026-01-12': { topic: 'Inference — exact (variable elimination)', note: '' },
  '2026-01-13': { topic: 'Inference — approximate (sampling)', note: '' },

  '2026-01-14': { topic: 'Mixed practice — search + logic', note: '' },
  '2026-01-15': { topic: 'Mixed practice — uncertainty + inference', note: '' }
};
/* ---------- AI PARALLEL TABLE (with custom topics) ---------- */
function generateAIParallelTable(startDate, days, containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;

  const table = document.createElement('table');
  table.className = 'table';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th style="width:120px">Date</th>
      <th>AI Topic</th>
      <th style="width:80px">Done</th>
      <th>Notes</th>
    </tr>`;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  for (let i = 0; i < days; i++) {
    const d = addDays(startDate, i);
    const ds = formatDate(d);

    const custom = customAISchedule[ds];
    const topic = custom ? custom.topic : `AI Practice — ${ds}`;
    const savedDone = localStorage.getItem(makeGAKey(ds)) === '1';
    const savedNote = localStorage.getItem(makeGANoteKey(ds));
    const noteToShow = savedNote !== null ? savedNote : (custom ? custom.note : '');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${ds}</td>
      <td>${escapeHtml(topic)}</td>
      <td style="text-align:center">
        <input type="checkbox" data-ga="${ds}" ${savedDone ? 'checked' : ''}>
      </td>
      <td>
        <input class="note-field" data-ga-note="${ds}" value="${escapeAttr(noteToShow)}" placeholder="notes...">
      </td>`;
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  wrap.appendChild(table);

  wrap.querySelectorAll('input[data-ga]').forEach(cb => {
    cb.addEventListener('change', () => {
      const ds = cb.getAttribute('data-ga');
      localStorage.setItem(makeGAKey(ds), cb.checked ? '1' : '0');
      updateGASummary();
      scheduleSaveStates();
    });
  });

  wrap.querySelectorAll('input[data-ga-note]').forEach(inp => {
    inp.addEventListener('input', () => {
      const ds = inp.getAttribute('data-ga-note');
      localStorage.setItem(makeGANoteKey(ds), inp.value || '');
    });
  });
}



/* ---------- Auto-generate GA parallel schedule ---------- */
function generateGAParallelTable(startDate, days, containerId, prefixLabel='GA') {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  // If container is a single div but already contains other content (like an extra header), we still append a table.
  const table = document.createElement('table');
  table.className = 'table';
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th style="width:120px">Date</th><th>Topic</th><th style="width:80px">Done</th><th>Notes</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  for (let i = 0; i < days; i++) {
    const d = addDays(startDate, i);
    const ds = formatDate(d);

    // Prefer custom topic if supplied
    const custom = customGASchedule[ds] || null;
    const displayedTopic = custom ? custom.topic : `${prefixLabel} — ${ds}`;

    // Load saved state (checkbox and note)
    const savedDone = localStorage.getItem(makeGAKey(ds)) === '1';
    // Note: prefer localStorage stored note if user previously edited; otherwise use custom schedule's note, otherwise empty
    const savedNote = localStorage.getItem(makeGANoteKey(ds));
    const noteToShow = savedNote !== null ? savedNote : (custom ? (custom.note || '') : '');

    const tr = document.createElement('tr');

    tr.innerHTML = `<td>${ds}</td>
      <td>${escapeHtml(displayedTopic)}</td>
      <td style="text-align:center"><input type="checkbox" data-ga="${ds}" ${savedDone ? 'checked' : ''} aria-label="GA ${ds}"></td>
      <td><input class="note-field" data-ga-note="${ds}" placeholder="notes..." aria-label="GA note ${ds}" value="${escapeAttr(noteToShow)}"></td>`;

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  wrap.appendChild(table);

  // wire events (save on change)
  wrap.querySelectorAll('input[data-ga]').forEach(cb=>{
    cb.addEventListener('change', ()=>{
      const ds = cb.getAttribute('data-ga');
      try{ localStorage.setItem(makeGAKey(ds), cb.checked ? '1' : '0'); }catch(e){}
      updateGASummary();
      scheduleSaveStates();
    });
  });
  wrap.querySelectorAll('input[data-ga-note]').forEach(inp=>{
    inp.addEventListener('input', ()=>{
      const ds = inp.getAttribute('data-ga-note');
      try{ localStorage.setItem(makeGANoteKey(ds), inp.value || ''); }catch(e){}
    });
  });
  updateGASummary();
}

// small helpers to avoid HTML injection when inserting user strings into table
function escapeHtml(s){
  if (s === null || s === undefined) return '';
  return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
}
function escapeAttr(s){ return escapeHtml(s); }


/* Configure GA parallel blocks */
const gaParallelStart = new Date('2026-01-01');
const gaParallelDays30 = 30;   // GA 30 days in January (Jan 1 → Jan 30)

/* AI parallel block (front-loaded) */
const aiParallelStart = new Date('2026-01-01');
const aiParallelDays  = 15; // Jan 1 -> Jan 15

function generateGAParallelOnLoad(){
  const containerId = 'ga-auto-wrap';
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const header = document.createElement('div');
  header.style.marginBottom = '6px';
  header.innerHTML = `<h4 style="margin:8px 0 6px">General Aptitude — Parallel GA (auto)</h4>
    <p class="small">GA run in parallel: auto-generated schedule (persistent checkboxes & notes).</p>`;
  container.appendChild(header);

  generateGAParallelTable(gaParallelStart, gaParallelDays30, containerId, 'GA Daily');

  // AI parallel 15-day block (Jan 1 → Jan 15) — front-loaded, overlaps GA
  const aiHeader = document.createElement('div');
  aiHeader.style.marginTop = '12px';
  aiHeader.innerHTML = `<h4 style="margin:8px 0 6px">AI Practice — 15-day parallel (Jan 1 → Jan 15)</h4>
                        <p class="small">Front-loaded AI practice running in parallel with GA (persistent checkboxes & notes).</p>`;
  container.appendChild(aiHeader);
generateAIParallelTable(aiParallelStart, aiParallelDays, containerId);
}

/* GA legacy wiring */
function generateGAHabitUI(){
  document.querySelectorAll('input[data-ga]').forEach(cb=>{
    cb.addEventListener('change', ()=>{ try{ localStorage.setItem(makeGAKey(cb.getAttribute('data-ga')), cb.checked ? '1' : '0'); }catch(e){} updateGASummary(); scheduleSaveStates(); });
  });
  document.querySelectorAll('input[data-ga-note]').forEach(inp=>{
    inp.addEventListener('input', ()=>{ try{ localStorage.setItem(makeGANoteKey(inp.getAttribute('data-ga-note')), inp.value || ''); }catch(e){} });
  });
  updateGASummary();
}

function updateGASummary(){
  const inputs = Array.from(document.querySelectorAll('input[data-ga]'));
  const done = inputs.filter(i=>i.checked).length;
  const total = inputs.length || 1;
  let info = document.getElementById('ga-habit-info-inline');
  if (!info){
    info = document.createElement('div'); info.id = 'ga-habit-info-inline'; info.style.margin = '8px 0';
    const gaDaily = document.getElementById('ga-auto-wrap');
    if (gaDaily && gaDaily.parentNode) gaDaily.parentNode.insertBefore(info, gaDaily);
    else document.getElementById('summaryCard').appendChild(info);
  }
  info.textContent = `GA daily practice completed: ${done}/${total} days (Jan 01 → Jan 30).`;
}

/* ICS export */
function toICSDate(d){
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
}

function exportICS(){
  const mapping = assignTargetDates();
  const entries = [];

  Object.keys(mapping).forEach(key=>{
    const [topic, idx] = key.split('::');
    const target = mapping[key].target;
    if (!target) return;

    const start = toICSDate(new Date(target));
    const uid = `gate-da-${key}-${start}@local`;

    let title = topic;
    const details = Array.from(document.querySelectorAll('details'));
    const section = details.find(d => topicKeyFromSummary(d.querySelector('summary')?.textContent) === topic);
    if (section){
      const row = section.querySelectorAll('tbody tr')[Number(idx)];
      const subEl = row?.querySelector('.subtopic-name');
      if (subEl) title = `${topic} — ${subEl.textContent.trim()}`;
    }

    const evt = [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${(new Date()).toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${start}`,
      `SUMMARY:${title}`,
      'END:VEVENT'
    ].join('\r\n');

    entries.push(evt);
  });

  if (!entries.length){
    alert('No scheduled items to export.');
    return;
  }

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GATE DA Tracker//EN',
    ...entries,
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], {type:'text/calendar'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gate_da_schedule.ics';
  a.click();
  URL.revokeObjectURL(url);
}

/* init */
window.addEventListener('load', ()=>{
  const groups = [
    ['Probability & Statistics', window.P_STATS || []],
    ['Linear Algebra', window.LA || []],
    ['Calculus & Optimization', window.CALC || []],
    ['Programming', window.PROG || []],
    ['Database', window.DB || []],
    ['Machine Learning', window.ML || []],
    ['AI', window.AI || []],
  ];
  groups.forEach(g=> renderTopicArray(g[0], g[1]));

  const mapping = assignTargetDates();
  populateDates(mapping);

  loadStates();



  generateGAParallelOnLoad();

  generateGAHabitUI();

  applyRowColoring();
  updateSummary();
  generateRevisionCalendar();

  document.addEventListener('change', (e)=>{ 
    if (!e.target) return;
    if (e.target.matches('input[type=checkbox]') || e.target.matches('.note-field')) { scheduleSaveStates(); updateSummary(); }
  });
  document.addEventListener('input', (e)=>{ if (e.target && e.target.matches('.note-field')) scheduleSaveStates(); });

  document.getElementById('exportCsv').addEventListener('click', exportCSV);
  document.getElementById('exportIcsBtn').addEventListener('click', exportICS);
  document.getElementById('clearStorage').addEventListener('click', resetAll);
  document.getElementById('copySummary').addEventListener('click', ()=>{ navigator.clipboard?.writeText(document.getElementById('summaryTableWrap').innerText).then(()=>alert('Summary copied to clipboard')).catch(()=>alert('Could not copy')); });

  const fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.addEventListener('change', (ev)=>{ const f=ev.target.files && ev.target.files[0]; if (f) importCSVFile(f); fileInput.value=''; });
  }

  setInterval(applyRowColoring, 1000*60*10);

  document.querySelectorAll('.date-cell').forEach(cell=>{
    cell.addEventListener('mouseenter', (e)=>{
      const row = cell.closest('tr'); if (!row) return;
      const r1 = row.dataset.rev1 || '', rf = row.dataset.final || '';
      if (r1 || rf) cell.title = `Rev1: ${r1 || '—'} • Final: ${rf || '—'}`;
    });
  });
});


