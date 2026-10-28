(function(root){
'use strict';
const safeText=(v,max=2000)=>{if(typeof v!=='string'||v.length>max)throw Error('Text is missing or too long.');return v;};
function youtube(v){if(!v)return '';try{const u=new URL(v);if(u.protocol!=='https:')return '';if(u.hostname==='youtu.be')return /^[\w-]{11}$/.test(u.pathname.slice(1))?u.pathname.slice(1):'';if(['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname)){const id=u.searchParams.get('v')||u.pathname.split('/').filter(Boolean).at(-1);return /^[\w-]{11}$/.test(id)?id:'';}}catch{}return '';}
function asset(v,image=false){if(v==='')return v;if(typeof v!=='string'||v.length>15*1024*1024)throw Error('File too large.');const pattern=image?/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/:/^data:(image\/(png|jpeg|webp|gif)|application\/(pdf|zip|octet-stream|vnd.openxmlformats-officedocument.spreadsheetml.sheet)|text\/(csv|plain));base64,[A-Za-z0-9+/=]+$/;if(!pattern.test(v))throw Error('Unsupported file type.');return v;}
function validate(d){if(!d||d.version!==1||!d.home||!Array.isArray(d.characters)||!Array.isArray(d.episodes)||!Array.isArray(d.downloads))throw Error('This is not a DDD backup.');
if(JSON.stringify(d).length>45*1024*1024)throw Error('Project exceeds the 45 MB limit.');
if(!Array.isArray(d.home.headline)||d.home.headline.length!==3)throw Error('Use three headline lines.');
const home={headline:d.home.headline.map(v=>safeText(v,80)),intro:safeText(d.home.intro,1500)};
if(d.characters.length>50||d.episodes.length>100||d.downloads.length>100)throw Error('Too many items.');
const id=v=>{if(typeof v!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(v))throw Error('Invalid item ID.');return v;};
const characters=d.characters.map(p=>({id:id(p.id),name:safeText(p.name,100),role:safeText(p.role,150),bio:safeText(p.bio,3000),image:asset(p.image||'',true)}));
const episodes=d.episodes.map(p=>{if(!youtube(p.url))throw Error('Use a valid YouTube video URL.');return {id:id(p.id),title:safeText(p.title,150),description:safeText(p.description,3000),url:p.url,series:safeText(p.series,80),image:asset(p.image||'',true)};});
const downloads=d.downloads.map(p=>({id:id(p.id),title:safeText(p.title,150),description:safeText(p.description,3000),filename:safeText(p.filename,150).replace(/[\\/:*?"<>|]/g,'_'),data:asset(p.data)}));
for(const list of [characters,episodes,downloads])if(new Set(list.map(p=>p.id)).size!==list.length)throw Error('Duplicate item IDs.');
const images={};for(const [k,v] of Object.entries(d.office?.images||{})){if(!/^[a-z0-9-]{1,40}$/.test(k))throw Error('Invalid room name.');images[k]=asset(v,true);}
const theme={cream:'#fff4df',blue:'#195788',orange:'#df641f',navy:'#103b60'};
for(const k of Object.keys(theme)){const v=d.office?.theme?.[k];if(v!==undefined){if(!/^#[0-9a-f]{6}$/i.test(v))throw Error('Choose a valid colour.');theme[k]=v;}}
return {version:1,home,characters,episodes,downloads,office:{images,theme}};}
root.DDDModel={validate,youtube};
if(typeof module!=='undefined')module.exports=root.DDDModel;
})(typeof window!=='undefined'?window:globalThis);
