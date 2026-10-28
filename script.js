'use strict';
const $ = s => document.querySelector(s);
const roster = window.DDD_CONTENT.characters.map(p => [p.name,p.role,p.bio]);
const dialog = $('#profile');
function showDialog(html){$('#profile-body').innerHTML=html;dialog.showModal();}
$('.dialog-close').onclick=()=>dialog.close();
dialog.addEventListener('click', e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
function renderStaff(query=''){
 const filtered=window.DDD_CONTENT.characters.filter(p=>[p.name,p.role,p.bio].join(' ').toLowerCase().includes(query.toLowerCase()));
 $('#staff-grid').replaceChildren();
 const el=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
 filtered.forEach(p=>{
  const b=el('button');b.className='staff-card';b.setAttribute('aria-label','Open profile: '+p.name);
  if(/^data:image\/(png|jpeg|webp|gif);base64,/.test(p.image||'')){const im=el('img');im.src=p.image;im.alt=p.name;im.style.cssText='width:100%;height:135px;object-fit:cover;margin-bottom:15px';b.append(im);}
  else{const av=el('span',p.name.split(' ').slice(0,2).map(w=>w[0]).join(''));av.className='avatar';b.append(av);}
  b.append(el('h3',p.name),el('p',p.role));
  b.onclick=()=>{const body=$('#profile-body');body.replaceChildren();body.append(el('h2',p.name),el('strong',p.role),el('p',p.bio));dialog.showModal();};
  $('#staff-grid').append(b);
 });
 if(!filtered.length)$('#staff-grid').append(el('p','No matching people. Try another name or role.'));
 $('#staff-count').textContent=filtered.length+' people';
}
$('#staff-search').oninput=e=>renderStaff(e.target.value);
renderStaff();
const menu=$('.menu');menu.onclick=()=>{const open=$('nav').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));};
document.querySelectorAll('nav a').forEach(a=>a.onclick=()=>{$('nav').classList.remove('open');menu.setAttribute('aria-expanded','false');});
const rows=[['PAY-001','INV-101','Neem Supplies',8500],['PAY-002','INV-102','Kesar Print',6000],['PAY-003','INV-103','Tara Systems',12000],['PAY-004','INV-104','Neem Supplies',18000],['PAY-005','INV-103','Tara Systems',12000],['PAY-006','INV-105','Kesar Print',8000]];
$('#payments').innerHTML=rows.map(r=>'<tr data-invoice="'+r[1]+'">'+r.map((v,i)=>'<td>'+(i===3?'₹'+v.toLocaleString('en-IN'):v)+'</td>').join('')+'</tr>').join('');
$('#case-form').onsubmit=e=>{e.preventDefault();const good=$('#invoice').value==='INV-103';$('#verdict').textContent=good?'Evidence found: INV-103 appears twice, with two payment IDs of ₹12,000 each. Potential excess: ₹12,000. Verify bank references and reversals before concluding.':'This invoice appears once. Compare the invoice references across all six rows and try again.';document.querySelectorAll('#payments tr').forEach(r=>r.classList.toggle('clue',good&&r.dataset.invoice==='INV-103'));};
$('#hint').onclick=()=>{$('#verdict').textContent='Clue: compare the invoice references in the third and fifth rows. Then check their vendor and amounts.';};
const lessons={
 excel:{title:'Spot the duplicate in a spreadsheet.',text:'Open payments.csv in Excel. Columns A–D are payment_id, invoice_id, vendor and amount. Add a Repeat count column in E, enter this formula in E2, then fill down through E7.',code:'=COUNTIF($B$2:$B$7,B2)',after:'Filter Repeat count above 1. Both INV-103 entries return 2. Compare payment IDs and verify the source records.',file:'practice-guide.txt',label:'Download the complete practice guide'},
 sql:{title:'Let the repeated invoice surface.',text:'Run investigation.sql in SQLite. It creates and fills a practice payments table, then groups by invoice and vendor.',code:'SELECT invoice_id, vendor, COUNT(*) AS entries,\n       SUM(amount) AS total_paid\nFROM payments\nGROUP BY invoice_id, vendor\nHAVING COUNT(*) > 1;',after:'Expected: INV-103 / Tara Systems / 2 entries / 24000 total paid. One invoice amount is ₹12,000.',file:'investigation.sql',label:'Download the runnable SQL file'},
 powerbi:{title:'Show the pattern, not just a total.',text:'Import payments.csv using Get data → Text/CSV. Confirm amount is numeric. Create the measure below, then add a table visual with invoice_id, vendor, Payment entries and Sum of amount.',code:'Payment entries = COUNTROWS(payments)',after:'Filter the visual to Payment entries greater than 1. INV-103 shows two entries and ₹24,000. Compare with the original invoice before treating it as excess.',file:'practice-guide.txt',label:'Download the Power BI walkthrough'},
 python:{title:'Make the duplicate check repeatable.',text:'Keep payments.csv next to investigate.py and run python investigate.py. The script uses Python’s standard library—no packages to install.',code:'from collections import Counter\ncounts = Counter(row["invoice_id"] for row in rows)\nrepeated = {k: n for k, n in counts.items() if n > 1}',after:'The download prints the repeated invoice, the two payment IDs, total paid and the suspected extra amount.',file:'investigate.py',label:'Download the Python script'}
};
function selectTool(key){const l=lessons[key];document.querySelectorAll('[data-tool]').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.tool===key));b.tabIndex=b.dataset.tool===key?0:-1;});$('#lab-panel').setAttribute('aria-labelledby','tab-'+key);$('#lab-panel').innerHTML='<p class="eyebrow">PRACTICE-001 / '+key.toUpperCase()+'</p><h3>'+l.title+'</h3><p>'+l.text+'</p><pre></pre><p>'+l.after+'</p><p style="margin-top:20px"><a href="'+l.file+'" download>↓ '+l.label+'</a></p>';$('#lab-panel pre').textContent=l.code;}
const tabs=[...document.querySelectorAll('[data-tool]')];tabs.forEach((b,i)=>{b.onclick=()=>selectTool(b.dataset.tool);b.onkeydown=e=>{let n;if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%tabs.length;if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();selectTool(tabs[n].dataset.tool);tabs[n].focus();}};});selectTool('excel');
$('#privacy').onclick=()=>showDialog('<p class="eyebrow">ABOUT THIS WEBSITE</p><h2>Desi Data Drama</h2><p>DDD explores data analysis through the fictional world of Datta Enterprises. This website includes a new fictional practice case, not a released episode.</p><p>The public practice tools do not save answers or searches. DDD Studio keeps editing drafts and uploaded files in your browser and includes them in your backups and exports. No analytics or tracking scripts are included.</p><p>Fonts load from Google Fonts, which receives network requests. The hosting service may process access information and authentication under its own policies.</p>');

