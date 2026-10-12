// Figma Plugin API script. Supply `content` from visual-explanations.json.
await figma.loadFontAsync({family:'Inter',style:'Regular'});
await figma.loadFontAsync({family:'Inter',style:'Medium'});
const page=figma.createPage();page.name='Case explanations · illustrated';await figma.setCurrentPageAsync(page);
const ids=[page.id],frames=[],cards=[];
const rgb=h=>({r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255});
const paint=h=>[{type:'SOLID',color:rgb(h)}];
function frame(parent,name,w,bg,dir='VERTICAL'){const n=figma.createAutoLayout(dir);parent.appendChild(n);n.name=name;n.resize(w,10);n.primaryAxisSizingMode='AUTO';n.counterAxisSizingMode='FIXED';n.fills=bg?paint(bg):[];ids.push(n.id);return n;}
function text(parent,value,size,color,width,medium=false){const t=figma.createText();parent.appendChild(t);t.fontName={family:'Inter',style:medium?'Medium':'Regular'};t.characters=value;t.fontSize=size;t.lineHeight={unit:'PIXELS',value:size*1.45};t.fills=paint(color);t.textAutoResize='HEIGHT';t.resize(width,t.height);ids.push(t.id);return t;}
function draw(kind,c){const a=c.a,m=c.m,s=c.s,l=c.l,f=c.f;
 const esc=v=>v.replaceAll('&','&amp;').replaceAll('<','&lt;');
 const rect=(x,y,w,h,fill=s,stroke=l,r=4)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
 const path=(d,col=a,sw=2)=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const label=(x,y,v,size=12,col=f)=>`<text x="${x}" y="${y}" font-family="Inter" font-size="${size}" fill="${col}">${esc(v)}</text>`;
 const dot=(x,y,r=5,col=a)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
 const arrow=(x,y,w=26)=>path(`M ${x} ${y} h ${w} m -5 -5 l 5 5 l -5 5`);
 const down=(x,y,h=16)=>path(`M ${x} ${y} v ${h} m -4 -4 l 4 4 l 4 -4`);
 const tag=(x,y,w,title,fill=s)=>rect(x,y,w,32,fill,fill===s?l:a)+label(x+10,y+21,title,12,fill===s?f:s);
 const rows=(x,y,w)=>[0,1,2].map(v=>path(`M ${x} ${y+v*17} h ${w}`,l)).join('');
 const phone=(x,y,title)=>rect(x,y,86,124)+label(x+12,y+22,title,11)+rows(x+12,y+43,62);
 let z='';
 if(kind==='layers')z=tag(52,8,208,'Widgets: tables · charts')+down(155,44)+tag(52,64,208,'Fusion layer I built',a)+down(155,100)+tag(52,120,208,'Salt foundation')+path('M 268 137 H 292 V 80 H 266',m,1.5)+label(4,176,'Missing patterns contributed back',12,m);
 if(kind==='cubes')z=tag(4,17,94,'FactSet')+arrow(103,33,22)+tag(132,17,176,'Reusable widget')+down(219,53)+tag(132,78,176,'Dashboard page')+down(219,114)+tag(132,139,176,'Permitted view',a)+label(5,94,'Many cubes',11,m)+label(5,112,'Import / export',11,m);
 if(kind==='human')z=tag(5,15,138,'Claude drafts')+arrow(146,31,20)+tag(173,15,134,'I compare',a)+down(238,54)+tag(173,79,134,'I tune',a)+down(238,117)+tag(173,142,134,'React export')+path('M 11 70 H 131 V 158 H 157',l,1.5)+label(17,94,'First answer',12,m)+label(17,113,'stays a draft',12,m);
 if(kind==='systems')z=tag(36,6,240,'Tokens · density · theme',a)+down(155,43)+[0,1,2,3,4].map((i)=>rect(6+i*61,75,56,67)+label(11+i*61,97,['Salt','Material','Fluent','Carbon','Own'][i],9)+rows(14+i*61,110,38)).join('')+label(13,168,'Components or explicit fallbacks',12,m);
 if(kind==='roles')z=tag(5,13,132,'Trader')+tag(175,13,132,'Client')+path('M 71 50 V 74 H 242 V 50')+down(155,75)+tag(32,101,248,'One platform',a)+label(39,157,'Different entitlements',14,m);
 if(kind==='engine')z=rect(35,20,242,136)+label(55,46,'Vendor chart engine',16)+path('M 52 132 L 85 116 L 124 123 L 155 83 L 193 105 L 257 70')+path('M 49 62 H 264',l)+label(54,177,'Design within its capabilities',12,m);
 if(kind==='fxaudit')z=tag(5,20,85,'Change')+arrow(94,36,22)+tag(122,20,85,'Confirm')+arrow(211,36,16)+tag(233,20,75,'Record',a)+rect(25,86,262,78)+label(42,110,'Original design specification',13)+label(42,139,'Audit backend not in rebuild',12,m);
 if(kind==='audit')z=tag(5,20,85,'Change')+arrow(94,36,22)+tag(122,20,85,'Review')+arrow(211,36,16)+tag(233,20,75,'Record',a)+path('M 160 55 V 81')+rect(25,86,262,78)+label(42,108,'Source',12,m)+label(139,108,'Person',12,m)+label(223,108,'Sign-off',12,m)+rows(42,125,222);
 if(kind==='repair')z=tag(10,8,292,'Hardcoded colours → fragile fixes')+down(155,43)+tag(10,65,136,'Feature work',a)+tag(166,65,136,'Foundation fix')+label(39,117,'Ship first',12,a)+label(173,117,'Phase alongside',11,m)+down(234,127)+label(166,170,'Start: blotter',12);
 if(kind==='dealroles')z=tag(4,7,126,'Sales')+tag(183,7,126,'Legal')+tag(4,140,126,'Custody ops')+tag(183,140,126,'Product')+path('M 66 43 V 68 H 245 V 43 M 66 138 V 113 H 245 V 138')+rect(90,65,132,52,a,a)+label(120,96,'One deal',16,s);
 if(kind==='bridge')z=tag(7,14,133,'Excel template')+arrow(145,30,22)+tag(175,14,133,'Shared deal',a)+rect(24,66,266,102)+label(41,89,'Download → Fill → Upload',13)+rows(41,112,232)+label(44,160,'Mapped into the platform',11,m);
 if(kind==='entry')z=phone(5,20,'iPhone')+phone(215,20,'Web')+tag(5,61,136,'Sample or create',a)+tag(159,61,142,'Theme → gate',a)+label(158,125,'Then child details',11,m)+label(22,173,'Two distinct starting points',13,m);
 if(kind==='missed')z=rect(22,18,268,136)+label(41,43,'The week keeps growing',14)+[0,1,2,3,4,5,6].map(i=>dot(46+i*36,78,10,i===3?l:a)).join('')+path('M 39 113 H 270',l,4)+path('M 39 113 H 189',a,4)+label(41,141,'Earned progress stays',12,m);
 if(kind==='midnight')z=rect(20,24,119,112)+rect(173,24,119,112)+label(43,63,'23:59',26)+label(193,63,'00:00',26)+arrow(144,80,23)+label(39,110,'Today',14,m)+label(190,110,'New day',14,a)+label(50,169,'Local time · app stays open',12,m);
 if(kind==='offline')z=phone(8,12,'Offline')+phone(218,12,'Synced')+tag(69,64,174,'Queued ticks',a)+path('M 108 119 H 203',a)+label(115,147,'Reconnect',12,m)+label(43,172,'Two adults · one child',12,m);
 if(kind==='homes')z=path('M 16 75 l 37 -34 l 37 34 M 27 65 v 61 h 52 V 65 M 223 75 l 37 -34 l 37 34 M 234 65 v 61 h 52 V 65')+tag(48,134,217,'Same family board',a)+rect(99,11,115,93)+label(110,33,'This week',12)+label(110,54,"At Mum’s",12,m)+label(110,84,'Birthday week',11,m);
 if(kind==='access')z=rect(18,23,278,132)+label(39,61,'Aa',23)+label(111,61,'Aa',37,a)+label(201,61,'1.6×',18,m)+path('M 34 81 H 281',l)+label(35,111,'VoiceOver: labelled tabs',13)+label(35,137,'Calm / Reduce Motion: no confetti',11,m);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="312" height="184" viewBox="0 0 312 184">${z}</svg>`;
}
let i=0;for(const [key,p] of Object.entries(content))for(const theme of ['light','dark']){
 const dark=theme==='dark',c={a:({fusion:['#705d8d','#c8b6e2'],ai:['#8b5168','#e3b3c6'],deal:['#8b5168','#e3b3c6'],fx:['#496a83','#a4cbe6'],winking:['#4f7352','#b9d5b8']})[key][dark?1:0],s:dark?'#222933':'#ffffff',f:dark?'#edf0f4':'#202932',m:dark?'#b8c0ca':'#56616b',l:dark?'#46515f':'#d6dce1'};
 const root=frame(page,p.name+' · explanations · '+theme,744,dark?'#171d23':'#f6f8fa');root.x=160+i++*840;root.y=220;root.paddingLeft=root.paddingRight=root.paddingTop=root.paddingBottom=24;root.itemSpacing=24;
 text(root,p.title,24,c.f,696,true);
 for(let n=0;n<p.cards.length;n+=2){const row=frame(root,'Illustrated concepts '+n,696,null,'HORIZONTAL');row.itemSpacing=24;row.counterAxisSizingMode='AUTO';
 for(let j=n;j<Math.min(n+2,p.cards.length);j++){const q=p.cards[j],card=frame(row,q.title,336,c.s);card.paddingLeft=card.paddingRight=12;card.paddingTop=card.paddingBottom=16;card.itemSpacing=14;card.cornerRadius=4;card.strokes=paint(c.l);
 const art=figma.createNodeFromSvg(draw(q.art,c));card.appendChild(art);art.name=q.art+' · editable illustration';ids.push(art.id,...art.findAll().map(n=>n.id));
 text(card,q.title,20,c.f,312,true);text(card,q.body,16,c.m,312);
 cards.push({key,theme,index:j,nodeId:card.id,width:card.width,height:card.height});}
 const rowHeight=Math.max(...row.children.map(card=>card.height));
 for(const card of row.children){card.primaryAxisSizingMode='FIXED';card.resize(card.width,rowHeight);cards.find(entry=>entry.nodeId===card.id).height=rowHeight;}
 }
 text(root,p.caption,14,c.m,696);frames.push({key,theme,nodeId:root.id,width:root.width,height:root.height});
}
return {pageId:page.id,createdNodeIds:ids,frames,cards};
