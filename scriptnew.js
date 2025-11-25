
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
   General Aptitude (GA) — parsed from uploaded syllabus PDF
------------------------- */

/* -------------------------
   IMPORTANCE (0,1,2)
------------------------- */
const IMPORTANCE = {
  'Probability & Statistics': [1,0,0,1,1,0,0,1,1,2,1,1,0,1,0,0,1,0,0,0,0,1,0,0,1,2,2,1,1,0,0,0,0],
  'Linear Algebra': [1,0,1,1,1,1,0,0,1,1,1,2,2,1,1,1,1,1,1],
  'Calculus & Optimization': [1,1,1,1,1,1,1],

  // NEW: matches trimmed window.PROG (8 topics)
  'Programming': [1,2,2,2,2,1,2,2],

  'Database': [1,1,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0],

  // NEW: matches trimmed window.ML (15 topics)
  'Machine Learning': [1,1,1,1,1,1,1,1,1,1,0,0,0,1,2],

  'AI': [1,1,1,1,1,1,1,1,1],
};

/* -------------------------
   Scheduling config
------------------------- */
const studyStart = new Date('2025-11-19'); // inclusive
// 10 + 10 + 8 + 14 + 8 + 12 + 10 = 72 days → ends on Jan 29, 2026
const studyEnd   = new Date('2026-01-29'); // inclusive

// Pure final revision + mock tests (also your leave window)
const finalRevWindowStart = new Date('2026-01-30');
const finalRevWindowEnd   = new Date('2026-02-14');

const rev1OffsetDays = 10;


/* Archery */
const archeryStart = new Date('2025-12-01');
const archeryWeeks = 12;
const archeryWeekdays = [3,4,6,0]; // Wed, Thu, Sat, Sun

/* GA habit (Jan 01 → Feb 01 as requested, included inside syllabus card) */
const gaHabitStart = new Date('2026-01-01');
const gaHabitEnd   = new Date('2026-02-01');

/* Study intensity: long-leave window (for highlighting) */
// This is your “free to study more” period
const leaveStart = new Date('2026-01-30'); // start of final rev + mocks
const leaveEnd   = new Date('2026-02-14'); // exam-close taper end

/* Amplitude (days) - NEW timetable (sums to 72 days = 19 Nov → 29 Jan) */
const oldAmplitude = {
  'Probability & Statistics': 12,
  'Linear Algebra': 9,
  'Calculus & Optimization': 9,
  'Programming': 15,
  'Database': 9,
  'Machine Learning': 14,
  'AI': 9
};

const amplitude = {
  'Probability & Statistics': 10,
  'Linear Algebra': 10,
  'Calculus & Optimization': 8,
  'Programming': 14,          // advanced topics only
  'Database': 8,
  'Machine Learning': 12,     // advanced topics only
  'AI': 10
};

const oldTotalStudyDays = Object.values(oldAmplitude).reduce((a,b)=>a+b,0);
const newTotalStudyDays = Object.values(amplitude).reduce((a,b)=>a+b,0);
const practiceAllocationDays = Math.max(0, oldTotalStudyDays - newTotalStudyDays);




/* storage prefix & helpers */
const canonicalPrefix = 'GATE_DA::';
function makeKey(topic, idx, type){ return `${canonicalPrefix}${topic}::${idx}::${type}`; }
function makeArcheryKey(dateStr){ return `${canonicalPrefix}archery::${dateStr}`; }
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
   CSV parser (robust for our export format)
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
        if (i+1 < len && text[i+1] === '"'){ field += '"'; i+=2; continue; } // escaped quote
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
   Render functions (with importance column and validation)
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

/* assemble schedulable entries using internal keys (order matters) */
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

/* Compute subject blocks (contiguous), using amplitude days; returns map topic-> {start,end,days} */
function computeSubjectBlocks(amps, startDate){
  const blocks = {};
  let cursor = new Date(startDate.getTime());
  const keys = Object.keys(amps);
  for(const k of keys){
    const days = Math.max(1, Math.floor(amps[k])); // at least 1
    const blockStart = new Date(cursor.getTime());
    const blockEnd = addDays(blockStart, days - 1);
    blocks[k] = {start:blockStart, end:blockEnd, days};
    cursor = addDays(blockEnd, 1);
  }
  return blocks;
}

/* Assign target dates using subject blocks -> distribute subtopics evenly in block */
function assignTargetDates(){
  const entries = allSchedulableEntries();
  const map = {};
  if (entries.length === 0) return map;

  const blocks = computeSubjectBlocks(amplitude, studyStart);

  // for each subject, gather its entries
  const byTopic = {};
  entries.forEach(e=>{
    if (!byTopic[e.topic]) byTopic[e.topic] = [];
    byTopic[e.topic].push(e);
  });

  // distribute within block
  Object.keys(byTopic).forEach(topic=>{
    const list = byTopic[topic];
    const block = blocks[topic];
    if (!block){
      // fallback: evenly scatter across whole window
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

  // assign finalRev round-robin over final window days
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
/* -----------------------------
   FINAL REVISION DAILY CALENDAR
   ----------------------------- */

function generateRevisionCalendar() {
  const mapping = assignTargetDates();
  const tbody = document.querySelector("#revisionCalendarTable tbody");
  tbody.innerHTML = "";

  const start = new Date("2026-01-30");
  const end   = new Date("2026-02-14");

  const dayMs = 24 * 60 * 60 * 1000;

  // Reverse-map by date -> list of topics
  const tasksByDate = {};

  Object.keys(mapping).forEach(key => {
    const entry = mapping[key];
    if (!entry.finalRev) return;

    const d = new Date(entry.finalRev);
    const ds = d.toISOString().split("T")[0];

    const [topic, idxStr] = key.split("::");

    // Find subtopic text for label
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

  // MOCK TEST schedule
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
      tasks.forEach(sub => {
        tHtml += `<div class="rev-task">• ${sub}</div>`;
      });
    }

    const mock = mockTestDates[ds]
      ? `<span class="mock-badge">${mockTestDates[ds]}</span>`
      : "";

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

    // Inside your leave window?
    const inLeave = (typeof leaveStart !== 'undefined' && typeof leaveEnd !== 'undefined'
                     && tDate >= leaveStart && tDate <= leaveEnd);

    if (completed){
      row.classList.add('row-done');
      if (inLeave) row.classList.add('row-intense'); // highlight what you finished on leave
    } else {
      if (daysTo < 0){
        row.classList.add('row-overdue');
      } else if (daysTo <= 3){
        row.classList.add('row-due-soon');
      }
      if (inLeave){
        row.classList.add('row-intense');           // strong highlight for leave window
      }
    }
  });
}


/* save/load states for syllabus (using normalized topic keys) */
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
    // save GA daily checkboxes and notes
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
  // load GA daily states
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
    trs.forEach(r=>{ if (r.querySelector('.completed')?.checked) comp++; if (r.querySelector('.revised')?.checked) rev++; if (r.querySelector('.practiced')?.checked) prac++; });
    rows.push(`<tr><td>${visible}</td><td style='text-align:center'>${total}</td><td style='text-align:center'>${comp}</td><td style='text-align:center'>${rev}</td><td style='text-align:center'>${prac}</td><td style='text-align:center'>${total?((comp/total)*100).toFixed(1):'0.0'}%</td><td style='text-align:center'>${total?((rev/total)*100).toFixed(1):'0.0'}%</td><td style='text-align:center'>${total?((prac/total)*100).toFixed(1):'0.0'}%</td></tr>`);
  });
  const allRows = Array.from(document.querySelectorAll('details tbody tr'));
  const grandTotal = allRows.length || 1;
  let gC=0,gR=0,gP=0; allRows.forEach(r=>{ if (r.querySelector('.completed')?.checked) gC++; if (r.querySelector('.revised')?.checked) gR++; if (r.querySelector('.practiced')?.checked) gP++; });
  const grand = `<tr class='grand'><td><b>Grand Total</b></td><td style='text-align:center'>${grandTotal}</td><td style='text-align:center'>${gC}</td><td style='text-align:center'>${gR}</td><td style='text-align:center'>${gP}</td><td style='text-align:center'>${((gC/grandTotal)*100).toFixed(1)}%</td><td style='text-align:center'>${((gR/grandTotal)*100).toFixed(1)}%</td><td style='text-align:center'>${((gP/grandTotal)*100).toFixed(1)}%</td></tr>`;
  document.getElementById('summaryTableWrap').innerHTML = `<table class='table'><thead><tr><th>Main Topic</th><th>Total Subtopics</th><th>Completed</th><th>Revised</th><th>Practiced</th><th>%C</th><th>%R</th><th>%P</th></tr></thead><tbody>${rows.join('')} ${grand}</tbody></table>`;
  const live = document.getElementById('liveStats');
  if (live) live.textContent = `Completed ${gC}/${grandTotal} · Revised ${gR} · Practiced ${gP}`;
  // show practice allocation info (dynamic)
  const pi = document.getElementById('practiceInfo');
  if (pi) {
    if (practiceAllocationDays > 0) {
      // compute actual end date of Probability block to be safe
      const blocks = computeSubjectBlocks(amplitude, studyStart);
      const pBlock = blocks['Probability & Statistics'];
      const pEnd = pBlock ? formatDate(pBlock.end) : '2025-11-27';
      pi.textContent = `Practice allocation: ${practiceAllocationDays} day(s) were freed by previous amplitude changes. Current adjustment: Probability shortened to finish on ${pEnd} and ${amplitude['Programming'] - oldAmplitude['Programming']} days moved to Programming.`;
    } else {
      pi.textContent = `Practice allocation: no net freed days (total study days unchanged).`;
    }
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

  // GA daily
  const gaRows = [];
  document.querySelectorAll('input[data-ga]').forEach((cb)=>{
    const ds = cb.getAttribute('data-ga');
    const done = cb.checked ? '1' : '0';
    const noteInp = document.querySelector(`input[data-ga-note="${ds}"]`);
    const note = noteInp ? noteInp.value : '';
    gaRows.push([ 'GA Daily', 'General Aptitude', ds, 'Daily practice', 0, done, '', '', ds, note ].map(quote).join(','));
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
    const text = e.target.result.replace(/^\uFEFF/, ''); // strip BOM
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

      // handle GA rows
      if ((visible || '').toLowerCase().includes('ga daily') || (internal||'').toLowerCase().includes('general aptitude')){
        const ds = idx; // third column used as date/idx for GA rows
        if (ds){
          try{ localStorage.setItem(makeGAKey(ds), comp ? '1':'0'); }catch(e){}
          if (note) try{ localStorage.setItem(makeGANoteKey(ds), note); }catch(e){}
        }
        continue;
      }

      // robust section finder: match either visible or internal via topicKeyFromSummary
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
        // update IMPORTANCE safely
        const topicKey = topicKeyFromSummary(visible) || internal;
        if (!IMPORTANCE[topicKey]) IMPORTANCE[topicKey] = [];
        IMPORTANCE[topicKey][numericIdx] = imp;
      }
    }
    // re-render
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
    // reassign dates and reload updated state
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
  // clear archery & ga storage
  generateArcherySchedule(); // regenerate (will load from storage if present)
  generateGAHabitUI();
}

/* archery schedule with persistence */
function generateArcherySchedule(){
  const wrap = document.getElementById('archeryScheduleWrap'); wrap.innerHTML='';
  const table = document.createElement('table'); table.className='table';
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Week</th><th>Session Dates (tick when done)</th></tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  for(let w=0; w<archeryWeeks; w++){
    const thisWeekBase = addDays(archeryStart, w*7);
    const sessionDates = archeryWeekdays.map(weekday=>{
      const offset = (weekday - thisWeekBase.getDay() + 7) % 7;
      return addDays(thisWeekBase, offset);
    });
    const tr = document.createElement('tr');
    const datesHtml = sessionDates.map(d=>{
      const ds = formatDate(d);
      const saved = localStorage.getItem(makeArcheryKey(ds)) === '1';
      return `<label style="display:inline-block;margin-right:8px"><input type="checkbox" data-arch="${ds}" ${saved ? 'checked' : ''} aria-label="Archery ${ds}"> ${ds}</label>`;
    }).join('');
    tr.innerHTML = `<td>Week ${w+1}</td><td>${datesHtml}</td>`;
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  wrap.appendChild(table);

  // wire archery checkbox change to save
  wrap.querySelectorAll('input[data-arch]').forEach(cb=>{
    cb.addEventListener('change', (e)=>{
      const ds = cb.getAttribute('data-arch');
      try{ localStorage.setItem(makeArcheryKey(ds), cb.checked ? '1' : '0'); }catch(e){}
    });
  });
}

/* GA daily habit UI helper (generates listeners for GA checkboxes already in HTML) */
function generateGAHabitUI(){
  // wire GA checkboxes & notes (they are already present in the syllabus card table)
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
    const gaDaily = document.getElementById('ga-daily-plan');
    if (gaDaily && gaDaily.parentNode) gaDaily.parentNode.insertBefore(info, gaDaily);
    else document.getElementById('summaryCard').appendChild(info);
  }
  info.textContent = `GA daily practice completed: ${done}/${total} days (Jan 01 → Feb 01).`;
}

/* ---------- ICS export ---------- */
function toICSDate(d){
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
}

function exportICS(){
  const mapping = assignTargetDates(); // recompute with latest config
  const entries = [];

  Object.keys(mapping).forEach(key=>{
    const [topic, idx] = key.split('::');
    const target = mapping[key].target;
    if (!target) return;

    const start = toICSDate(new Date(target));
    const uid = `gate-da-${key}-${start}@local`;

    // find subtopic text for SUMMARY
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

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GATE DA Tracker//EN',
    ...entries,
    'END:VCALENDAR'
  ];

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

/* ---------- init ---------- */
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
  generateArcherySchedule();
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
  fileInput.addEventListener('change', (ev)=>{ const f=ev.target.files && ev.target.files[0]; if (f) importCSVFile(f); fileInput.value=''; });

  setInterval(applyRowColoring, 1000*60*10);

  document.querySelectorAll('.date-cell').forEach(cell=>{
    cell.addEventListener('mouseenter', (e)=>{
      const row = cell.closest('tr'); if (!row) return;
      const r1 = row.dataset.rev1 || '', rf = row.dataset.final || '';
      if (r1 || rf) cell.title = `Rev1: ${r1 || '—'} • Final: ${rf || '—'}`;
    });
  });
});
