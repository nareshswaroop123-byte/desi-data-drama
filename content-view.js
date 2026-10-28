'use strict';
(function(){
const d=window.DDD_CONTENT;
const make=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
const h=document.querySelector('.hero h1');h.replaceChildren();d.home.headline.forEach((line,i)=>{const e=make(i===1?'em':'span',line);h.append(e);if(i<2)h.append(make('br'));});
document.querySelector('.intro').textContent=d.home.intro;
document.querySelector('.intro').style.whiteSpace='pre-line';
document.querySelector('.hero-foot span').textContent=d.characters.length+' characters';
function photo(item){if(!/^data:image\/(png|jpeg|webp|gif);base64,/.test(item.image||''))return null;const im=make('img');im.src=item.image;im.alt=item.title||item.name;im.style.cssText='width:100%;height:170px;object-fit:cover;border-radius:4px;margin-bottom:16px';return im;}
const episodes=document.querySelector('#published-episodes');const downloads=document.querySelector('#published-downloads');
if(!d.episodes.length){const p=make('p','Episodes will appear here when published. Try the practice case above today.');p.className='quiet';episodes.append(p);}
for(const item of d.episodes){const a=make('article');const img=photo(item);if(img)a.append(img);a.append(make('span',item.series),make('h3',item.title),make('p',item.description));const link=make('a','Watch on YouTube ↗');const id=window.DDDModel.youtube(item.url);if(id){link.href='https://www.youtube.com/watch?v='+id;link.target='_blank';link.rel='noopener noreferrer';a.append(link);}episodes.append(a);}
for(const item of d.downloads){const a=make('article');a.append(make('span','RESOURCE'),make('h3',item.title),make('p',item.description));const link=make('a','Download ↓');link.href=item.data;link.download=item.filename;a.append(link);downloads.append(a);}
})();
