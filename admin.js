'use strict';
const bundle=JSON.parse(document.querySelector('#ddd-bundle').textContent);
let data=structuredClone(window.DDD_CONTENT||bundle.content),page='overview',db,edit,selectedFile=null,removeImage=false,saveQueue=Promise.resolve();
const $=s=>document.querySelector(s);
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
function notice(text,error=false){$('#notice').textContent=text;$('#notice').classList.toggle('error',error);}
function action(label,fn,cls=''){const b=el('button',label,cls);b.type='button';b.onclick=fn;return b;}
function download(blob,name){const url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
function safeJSON(v){return JSON.stringify(v).replace(/</g,'\\u003c');}
function saveDraft(){
 const snapshot=structuredClone(data);
 saveQueue=saveQueue.then(()=>new Promise((resolve,reject)=>{if(!db){reject(Error('Browser draft storage is unavailable. Download a backup before closing.'));return;}const tx=db.transaction('draft','readwrite');tx.objectStore('draft').put(snapshot,'content');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);}));
 saveQueue=saveQueue.then(()=>{$('#save-state').textContent='Draft saved in this browser · '+new Date().toLocaleTimeString();return true;}).catch(e=>{$('#save-state').textContent='Draft not saved';notice(e.message,true);return false;});
 return saveQueue;
}
function setPage(p){page=p;document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===p));render();}
const titles={overview:'Your creative desk.',home:'Make a first impression.',characters:'The people of Datta.',episodes:'Publish your next story.',downloads:'Share the working files.',publish:'From draft to website.',office:'Make it your office.'};
function render(){
 $('#page-title').textContent=titles[page];const w=$('#workspace');w.replaceChildren();
 if(page==='office'){renderOffice(w);return;}
 if(page==='overview'){
  const cards=el('div',undefined,'cards');
  [['Characters',data.characters.length,'characters'],['Episodes',data.episodes.length,'episodes'],['Downloads',data.downloads.length,'downloads']].forEach(([label,n,p])=>{const c=el('div',undefined,'card');c.append(el('p',label),el('div',String(n),'stat'),action('Manage '+label.toLowerCase()+' →',()=>setPage(p)));cards.append(c);});w.append(cards);
  const c=el('div',undefined,'card wide');c.append(el('h2','Update DDD without touching code.'));
  [['Edit','Change your homepage, character profiles or episode details.'],['Upload','Choose character photos, episode thumbnails, PDFs or datasets.'],['Preview & save','Preview your draft, then save the website folder or export a website ZIP.']].forEach(([name,desc],i)=>{const s=el('div',undefined,'step');const t=el('div');t.append(el('strong',name),el('p',desc));s.append(el('b',String(i+1)),t);c.append(s);});w.append(c);
  const note=el('p','This studio edits your website on this computer. Exporting does not update an online address. Online hosting is not connected yet.','note');w.append(note);
 }else if(page==='home'){
  const form=el('form',undefined,'card');data.home.headline.forEach((line,i)=>form.append(field('Headline line '+(i+1),'line'+i,line,'text',80)));
  form.append(field('Introduction','intro',data.home.intro,'textarea',1500),el('p','Use short headline lines. Line 2 uses the accent colour.','hint'));
  const submit=el('button','Save homepage','primary');submit.type='submit';form.append(submit);
  form.onsubmit=async e=>{e.preventDefault();const f=new FormData(form);const next=structuredClone(data);next.home={headline:[0,1,2].map(i=>f.get('line'+i)),intro:f.get('intro')};try{data=DDDModel.validate(next);const saved=await saveDraft();notice(saved?'Homepage draft updated. Click Preview website to see it.':'Changes are only in memory. Download a backup before closing.',!saved);}catch(err){notice(err.message,true);}};w.append(form);
 }else if(['characters','episodes','downloads'].includes(page)){
  const toolbar=el('div',undefined,'toolbar');toolbar.append(el('p',page==='characters'?'The established 15-character roster is ready to edit.':page==='episodes'?'Add a YouTube link and an optional thumbnail.':'Upload PDFs, CSVs, Excel files, ZIPs or text files. Maximum 10 MB each.'),action('+ Add '+singular(page),()=>openEditor(page), 'primary'));w.append(toolbar);
  const list=el('div',undefined,'list');if(!data[page].length){const empty=el('div',undefined,'empty');empty.append(el('h2','Your next '+singular(page)+' starts here.'),el('p','Use Add above to create the first item.'));list.append(empty);}
  data[page].forEach((p,i)=>{const item=el('div',undefined,'item');if(p.image){const img=el('img');img.src=p.image;img.alt=p.name||p.title;item.append(img);}else item.append(el('span',page==='characters'?p.name.slice(0,2).toUpperCase():String(i+1).padStart(2,'0'),'initial'));
   const copy=el('div',undefined,'copy');copy.append(el('h3',p.name||p.title),el('p',p.role||p.series||p.filename));const buttons=el('div',undefined,'buttons');buttons.append(action('Edit',()=>openEditor(page,i)),action('Remove',()=>{if(confirm('Remove "'+(p.name||p.title)+'" from this draft? The website folder stays unchanged until you save or export.')){data[page].splice(i,1);saveDraft();render();notice('Removed from draft.');}},'danger'));item.append(copy,buttons);list.append(item);});w.append(list);
 }else if(page==='publish'){
  const c=el('div',undefined,'card');c.append(el('span','LOCAL WEBSITE EDITOR','badge'),el('h2','Preview. Save. Take it with you.'),el('p','Saving the draft only changes this browser. Use one of the options below to create an updated website you can open or upload.'));
  const actions=el('div',undefined,'actions');actions.append(action('Preview website ↗',preview,'primary'),action('Save to website folder',saveFolder),action('Export website ZIP',exportSite));c.append(actions);w.append(c);
  w.append(el('p','Save to website folder: choose the extracted website folder containing index.html and content.js. The browser asks for permission. Only content.js is replaced; photos and downloadable files are included inside it. Refresh index.html to see your changes.','note'));
  const host=el('div',undefined,'card wide');host.append(el('h2','Online publishing: not connected'),el('p','The export contains the full website and the editor. Upload the ZIP contents using your hosting account to update your online site. This dashboard cannot currently publish directly to your Netlify address.'),el('p','Keep a backup: the JSON backup includes your text, images and uploaded files. You can restore it in DDD Studio on another computer.'));w.append(host);
 }
}
function singular(p){return {characters:'character',episodes:'episode',downloads:'download'}[p];}
function field(label,name,value,type='text',max=3000){const wrap=el('label',label);const input=el(type==='textarea'?'textarea':'input');if(type!=='textarea')input.type=type;input.name=name;input.value=value||'';input.required=true;input.maxLength=max;wrap.append(input);return wrap;}
function openEditor(kind,index){
 edit={kind,index};selectedFile=null;removeImage=false;$('#form-error').textContent='';const item=index===undefined?{}:data[kind][index];$('#edit-title').textContent=(index===undefined?'Add ':'Edit ')+singular(kind);const f=$('#fields');f.replaceChildren();
 if(kind==='characters'){f.append(field('Name','name',item.name,'text',100),field('Role','role',item.role,'text',150),field('Profile','bio',item.bio,'textarea',3000));}
 else{f.append(field('Title','title',item.title,'text',150),field('Description','description',item.description,'textarea',3000));}
 if(kind==='episodes'){f.append(field('YouTube video URL','url',item.url,'url',500));const wrap=el('label','Series');const select=el('select');select.name='series';['Data Ka Lafda','Picture Ka Postmortem','Desi Diaries'].forEach(s=>{const o=el('option',s);o.value=s;select.append(o);});select.value=item.series||'Data Ka Lafda';wrap.append(select);f.append(wrap);}
 const label=el('label',kind==='downloads'?'Choose a file (required for a new download)':'Photo / thumbnail (optional)');const upload=el('input');upload.type='file';upload.accept=kind==='downloads'?'.pdf,.csv,.xlsx,.zip,.txt,.png,.jpg,.jpeg,.webp,.gif':'.png,.jpg,.jpeg,.webp,.gif';upload.onchange=()=>{selectedFile=upload.files[0]||null;$('#form-error').textContent='';};label.append(upload);f.append(label);
 if(item.image){const im=el('img',undefined,'preview-img');im.src=item.image;im.alt='Current image';f.append(im,action('Remove current image',()=>{removeImage=true;im.remove();notice('Image will be removed when you save this item.');}));}
 if(item.filename)f.append(el('p','Current file: '+item.filename,'hint'));
 f.append(el('p','Images: PNG, JPEG, WebP or GIF. Files: 10 MB maximum. Keep a backup of your originals.','hint'));$('#edit-dialog').showModal();
}
async function readUpload(file,imageOnly){
 if(file.size>10*1024*1024)throw Error('Choose a file smaller than 10 MB.');
 const ext=file.name.split('.').pop().toLowerCase();const types={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',pdf:'application/pdf',csv:'text/csv',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',zip:'application/zip',txt:'text/plain'};
 if(!types[ext]||(imageOnly&&!types[ext].startsWith('image/')))throw Error('That file type is not supported.');
 const bytes=new Uint8Array(await file.arrayBuffer());
 if(imageOnly){const ok=await new Promise(resolve=>{const im=new Image(),url=URL.createObjectURL(new Blob([bytes],{type:types[ext]}));im.onload=()=>{URL.revokeObjectURL(url);resolve(true);};im.onerror=()=>{URL.revokeObjectURL(url);resolve(false);};im.src=url;});if(!ok)throw Error('This image could not be opened. Choose a valid image.');}
 const base64=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result.split(',')[1]);r.onerror=reject;r.readAsDataURL(new Blob([bytes]));});return 'data:'+types[ext]+';base64,'+base64;
}
$('#edit-form').onsubmit=async e=>{
 e.preventDefault();const submit=e.target.querySelector('[type=submit]');submit.disabled=true;$('#form-error').textContent='';
 try{const f=new FormData(e.target);const next=structuredClone(data);const item=edit.index===undefined?{id:'item-'+crypto.randomUUID()}:{...next[edit.kind][edit.index]};
 if(edit.kind==='characters'){Object.assign(item,{name:f.get('name'),role:f.get('role'),bio:f.get('bio'),image:removeImage?'':item.image||''});}
 else Object.assign(item,{title:f.get('title'),description:f.get('description')});
 if(edit.kind==='episodes')Object.assign(item,{url:f.get('url'),series:f.get('series'),image:removeImage?'':item.image||''});
 if(selectedFile){const encoded=await readUpload(selectedFile,edit.kind!=='downloads');if(edit.kind==='downloads')Object.assign(item,{filename:selectedFile.name,data:encoded});else item.image=encoded;}
 if(edit.kind==='downloads'&&!item.data)throw Error('Choose a file for this download.');
 if(edit.index===undefined)next[edit.kind].push(item);else next[edit.kind][edit.index]=item;
 data=DDDModel.validate(next);const saved=await saveDraft();$('#edit-dialog').close();render();notice(saved?'Saved to browser draft. Preview or export when you are ready.':'Changes are only in memory. Download a backup before closing.',!saved);
 }catch(err){$('#form-error').textContent=err.message||'Could not save. Try again.';}finally{submit.disabled=false;}
};
function compiledFiles(){
 const files={...bundle.files};files['content.js']='window.DDD_CONTENT = '+safeJSON(DDDModel.validate(data))+';\n';
 const newBundle={content:data,files:bundle.files,adminTemplate:bundle.adminTemplate};
 files['admin.html']=bundle.adminTemplate.replace('__BUNDLE__',safeJSON(newBundle));
 return files;
}
function preview(){
try{
 const files=compiledFiles();
 function pageHTML(name){
 let html=files[name];
 html=html.replace(/<link rel="stylesheet" href="([^"]+)">/g,(tag,file)=>files[file]?'<style>'+files[file]+'</style>':tag);
 html=html.replace(/<script src="([^"]+)"><\/script>/g,(tag,file)=>files[file]?'<script>'+files[file].replace(/<\/script/gi,'<\\/script')+'</script>':tag);
 const resources={};['payments.csv','investigation.sql','investigate.py','practice-guide.txt'].forEach(n=>resources[n]='data:text/plain;charset=utf-8,'+encodeURIComponent(files[n]));
 const adapter='<script>(()=>{const resources='+safeJSON(resources)+';function fix(){document.querySelectorAll("a[download]").forEach(a=>{const f=a.getAttribute("href");if(resources[f]){a.href=resources[f];a.download=f;}});}new MutationObserver(fix).observe(document.body,{childList:true,subtree:true});fix();document.addEventListener("click",e=>{const a=e.target.closest("a");if(!a)return;const h=a.getAttribute("href")||"";if(/^(index|tour|dashboard)\\.html/.test(h)){e.preventDefault();parent.postMessage({dddPreview:h},"*");}else if(h==="admin.html"){e.preventDefault();alert("Close this preview tab to return to DDD Studio.");}});})();</script>';
 return html.replace('</body>',adapter+'</body>');
 }
 const pages={'index.html':pageHTML('index.html'),'tour.html':pageHTML('tour.html'),'dashboard.html':pageHTML('dashboard.html')};
 const frameScript='const pages='+safeJSON(pages)+';const f=document.querySelector("iframe");function go(route){const [name,hash]=route.split("#");if(!pages[name])return;f.srcdoc=pages[name];f.onload=()=>{if(hash)try{f.contentDocument.getElementById(hash)?.scrollIntoView();}catch{}};}window.addEventListener("message",e=>{if(e.source===f.contentWindow&&typeof e.data?.dddPreview==="string")go(e.data.dddPreview);});go("index.html");';
 const wrapper='<!doctype html><title>DDD website preview</title><style>html,body,iframe{margin:0;border:0;width:100%;height:100%;display:block}</style><iframe title="DDD draft preview"></iframe><script>'+frameScript.replace(/<\/script/gi,'<\\/script')+'</script>';
 const url=URL.createObjectURL(new Blob([wrapper],{type:'text/html'}));const win=window.open(url,'_blank');notice(win?'Preview opened. Enter Office works inside this preview. It is not published online.':'Allow pop-ups for this editor to see the preview.',!win);setTimeout(()=>URL.revokeObjectURL(url),60000);
}catch(err){notice(err.message,true);}
}


function exportSite(){try{download(DDDZip.zip(compiledFiles()),'ddd-website-'+new Date().toISOString().slice(0,10)+'.zip');notice('Website ZIP exported. Extract and open index.html, or upload its contents through your hosting account.');}catch(err){notice(err.message,true);}}
async function saveFolder(){
 if(!window.showDirectoryPicker){notice('Direct folder saving is not supported in this browser. Use Export website ZIP instead.',true);return;}
 try{const dir=await window.showDirectoryPicker({mode:'readwrite'});await dir.getFileHandle('index.html');await dir.getFileHandle('content.js');
 const index=await (await dir.getFileHandle('index.html')).getFile();if(!(await index.text()).includes('content-view.js'))throw Error('Choose this DDD website folder, not a different website.');
 const out=await dir.getFileHandle('content.js');const writer=await out.createWritable();await writer.write(compiledFiles()['content.js']);await writer.close();notice('Saved to your website folder. Refresh index.html to see it. Your online website has not changed.');
 }catch(err){if(err.name==='AbortError')notice('Folder selection cancelled. Your draft is safe.');else notice(err.name==='NotFoundError'?'Choose the extracted DDD website folder containing index.html and content.js.':err.message,true);}
}
$('#preview').onclick=preview;$('#backup').onclick=()=>download(new Blob([JSON.stringify(DDDModel.validate(data),null,2)],{type:'application/json'}),'ddd-studio-backup.json');
$('#restore').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>45*1024*1024)throw Error('Backup is too large.');const next=DDDModel.validate(JSON.parse(await file.text()));if(!confirm('Replace this browser draft with the selected backup? Download a backup first if you want to keep the current draft.'))return;data=next;const saved=await saveDraft();render();notice(saved?'Backup restored to draft.':'Backup loaded in memory only. Export before closing.',!saved);}catch(err){notice(err.message,true);}finally{e.target.value='';}};
$('#close-dialog').onclick=$('#cancel').onclick=()=>$('#edit-dialog').close();
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>setPage(b.dataset.page));
try { const req=indexedDB.open('ddd-studio-v1',1);req.onupgradeneeded=()=>req.result.createObjectStore('draft');
req.onsuccess=()=>{db=req.result;const get=db.transaction('draft').objectStore('draft').get('content');get.onsuccess=()=>{if(get.result){try{data=DDDModel.validate(get.result);$('#save-state').textContent='Saved browser draft restored.';}catch{notice('Saved draft could not be read. Default website loaded.',true);}}else $('#save-state').textContent='Default website loaded. Changes will save in this browser.';render();};get.onerror=()=>{notice('Could not read the saved draft. Export a backup before closing.',true);render();};};
req.onerror=()=>{notice('Browser storage is unavailable. Keep this tab open and export a backup after edits.',true);render();}; } catch(e) {notice('Browser storage is unavailable. Export a backup before closing.',true);}
render();

function renderOffice(w){
 data.office=data.office||{images:{},theme:{cream:'#fff4df',blue:'#195788',orange:'#df641f',navy:'#103b60'}};
 const card=el('div',undefined,'card');card.append(el('h2','Match the office colours'));
 const form=el('form');for(const [key,label] of [['cream','Walls / background'],['blue','Blue frames / buttons'],['orange','Orange trims'],['navy','Dark text']]){const wrap=el('label',label),input=el('input');input.type='color';input.name=key;input.value=data.office.theme[key];wrap.append(input);form.append(wrap);}
 const save=el('button','Save colours','primary');save.type='submit';form.append(save);form.onsubmit=async e=>{e.preventDefault();const next=structuredClone(data);const f=new FormData(form);for(const k of Object.keys(next.office.theme))next.office.theme[k]=f.get(k);try{data=DDDModel.validate(next);const saved=await saveDraft();notice(saved?'Office colours saved. Preview the website.':'Kept in memory only. Export a backup.',!saved);}catch(err){notice(err.message,true);}};card.append(form);w.append(card);
 const rooms=el('div',undefined,'card wide');rooms.append(el('h2','Cabin and room artwork'),el('p','Choose a room and upload its existing artwork. The tour will show that image instead of the floor-plan close-up. This does not turn a flat image into a 360-degree panorama.'));
 const select=el('select');Object.entries(DDD_TOUR.rooms).forEach(([id,r])=>{const o=el('option',r.name);o.value=id;select.append(o);});const label=el('label','Room');label.append(select);rooms.append(label);
 const input=el('input');input.type='file';input.accept='.jpg,.jpeg,.png,.webp,.gif';rooms.append(input);const status=el('p','No custom artwork for this room.','hint');rooms.append(status);
 const update=()=>status.textContent=data.office.images[select.value]?'Custom room artwork saved.':'Using the supplied exterior or floor-plan view.';select.onchange=update;
 rooms.append(action('Upload room artwork',async()=>{try{if(!input.files[0])throw Error('Choose an image first.');const image=await readUpload(input.files[0],true);const next=structuredClone(data);next.office.images[select.value]=image;data=DDDModel.validate(next);const saved=await saveDraft();input.value='';update();notice(saved?'Room artwork saved. Open the room in Preview to see it.':'Kept in memory only. Export a backup.',!saved);}catch(err){notice(err.message,true);}},'primary'),action('Use original plan view',async()=>{delete data.office.images[select.value];await saveDraft();update();}));w.append(rooms);update();
}
