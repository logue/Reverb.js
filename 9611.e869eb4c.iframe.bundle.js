"use strict";(self.rspackChunk_logue_reverb=self.rspackChunk_logue_reverb||[]).push([[9611],{"./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-JWPE2WC7.mjs"(t,e,a){function n(t,e){t.accDescr&&e.setAccDescription?.(t.accDescr),t.accTitle&&e.setAccTitle?.(t.accTitle),t.title&&e.setDiagramTitle?.(t.title)}(0,a("./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs").K)(n,"populateCommonDb"),a.d(e,{S:()=>n})},"./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/cynefinDiagram-5FMLGOSQ.mjs"(t,e,a){var n=a("./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-JWPE2WC7.mjs"),r=a("./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-CLGD4ZFX.mjs"),i=a("./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-75Z2AOVW.mjs"),o=a("./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs"),l=a("./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs"),s=a("./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs"),c=a("./node_modules/.pnpm/@mermaid-js+parser@1.2.1/node_modules/@mermaid-js/parser/dist/mermaid-parser.core.mjs"),d=(0,s.K)(()=>({domains:new Map,transitions:[]}),"createDefaultData"),m=d(),f=(0,s.K)(()=>m.domains,"getDomains"),p={getDomains:f,getTransitions:(0,s.K)(()=>m.transitions,"getTransitions"),setDomains:(0,s.K)(t=>{if(t)for(let e of t){let t=e.domain,a=(e.items??[]).map(t=>({label:t.label}));m.domains.set(t,{name:t,items:a})}},"setDomains"),setTransitions:(0,s.K)(t=>{t&&(m.transitions=t.filter(t=>t.from!==t.to||(l.R.warn(`Cynefin: self-loop transition on domain "${t.from}" is not meaningful and will be skipped.`),!1)).map(t=>({from:t.from,to:t.to,label:t.label||void 0})))},"setTransitions"),getConfig:(0,s.K)(()=>(0,i.$t)({...o.UI.cynefin,...(0,o.zj)().cynefin}),"getConfig"),clear:(0,s.K)(()=>{(0,o.IU)(),m=d()},"clear"),setAccTitle:o.SV,getAccTitle:o.iN,setDiagramTitle:o.ke,getDiagramTitle:o.ab,getAccDescription:o.m7,setAccDescription:o.EI},y=(0,s.K)(t=>{(0,n.S)(t,p),p.setDomains(t.domains),p.setTransitions(t.transitions)},"populate"),u={parse:(0,s.K)(async t=>{let e=await (0,c.qg)("cynefin",t);l.R.debug(e),y(e)},"parse")};function h(t){let e=t+0x6d2b79f5|0;return e=Math.imul(e^e>>>15,1|e),(((e^=e+Math.imul(e^e>>>7,61|e))^e>>>14)>>>0)/0x100000000}function x(t){let e=0;for(let a=0;a<t.length;a++)e=(e<<5)-e+t.charCodeAt(a)|0;return e}function $(t,e){return"number"==typeof t&&Number.isFinite(t)&&0!==t?t:x(e)}function g(t,e,a,n){let r=t/2,i=n??.015*t,o=e/7,l=[];for(let t=0;t<=7;t++){let e=h(a+17*t)*i*2-i;l.push({x:r+e,y:t*o})}let s=`M${l[0].x},${l[0].y}`;for(let t=0;t<l.length-1;t++){let e=l[t],n=l[t+1],r=(e.y+n.y)/2,o=1.5*i*(t%2==0?1:-1)*h(a+31*t+7),c=e.x+o,d=n.x-o;s+=` C${c},${r} ${d},${r} ${n.x},${n.y}`}return s}function b(t,e,a,n){let r=e/2,i=n??.015*e,o=t/7,l=[];for(let t=0;t<=7;t++){let e=h(a+23*t)*i*2-i;l.push({x:t*o,y:r+e})}let s=`M${l[0].x},${l[0].y}`;for(let t=0;t<l.length-1;t++){let e=l[t],n=l[t+1],r=(e.x+n.x)/2,o=1.5*i*(t%2==0?1:-1)*h(a+37*t+11),c=e.y+o,d=n.y-o;s+=` C${r},${c} ${r},${d} ${n.x},${n.y}`}return s}function k(t,e){let a=t/2,n=.5*e,r=.03*t;return`M${a},${n} C${a+r},${n+(e-n)*.2} ${a-1.5*r},${n+(e-n)*.55} ${a+.5*r},${n+(e-n)*.75} C${a-r},${n+(e-n)*.85} ${a+.3*r},${n+(e-n)*.95} ${a},${e}`}function w(t,e,a,n){return`M${t-a},${e} A${a},${n} 0 1,1 ${t+a},${e} A${a},${n} 0 1,1 ${t-a},${e} Z`}(0,s.K)(h,"seededRandom"),(0,s.K)(x,"hashString"),(0,s.K)($,"resolveSeed"),(0,s.K)(g,"generateFoldPath"),(0,s.K)(b,"generateHorizontalBoundary"),(0,s.K)(k,"generateCliffPath"),(0,s.K)(w,"generateConfusionPath");var C={complex:{model:"Probe → Sense → Respond",practice:"Emergent Practices"},complicated:{model:"Sense → Analyse → Respond",practice:"Good Practices"},clear:{model:"Sense → Categorise → Respond",practice:"Best Practices"},chaotic:{model:"Act → Sense → Respond",practice:"Novel Practices"},confusion:{model:"",practice:"Disorder"}},D=(0,s.K)((t,e)=>{let a=t/2,n=e/2;return{complex:{cx:a/2,cy:n/2,x:0,y:0,w:a,h:n},complicated:{cx:a+a/2,cy:n/2,x:a,y:0,w:a,h:n},chaotic:{cx:a/2,cy:n+n/2,x:0,y:n,w:a,h:n},clear:{cx:a+a/2,cy:n+n/2,x:a,y:n,w:a,h:n},confusion:{cx:a,cy:n,x:.7*a,y:.7*n,w:.6*a,h:.6*n}}},"getDomainLayouts"),_=(0,s.K)(()=>{let t=(0,o.P$)(),e=(0,o.zj)();return(0,i.$t)(t,e.themeVariables).cynefin},"getCynefinDomainColors"),A=(0,s.K)((t,e,a,n)=>{let i=n.db,s=i.getDomains(),c=i.getTransitions(),d=i.getDiagramTitle(),m=i.getAccTitle(),f=i.getAccDescription(),p=i.getConfig(),y=_();l.R.debug("Rendering Cynefin diagram");let u=p.width,h=p.height,x=p.padding,A=p.showDomainDescriptions,K=p.boundaryAmplitude,T=u+2*x,S=h+2*x,B={complex:y.complexBg,complicated:y.complicatedBg,clear:y.clearBg,chaotic:y.chaoticBg,confusion:y.confusionBg},j=(0,r.D)(e);(0,o.a$)(j,S,T,p.useMaxWidth??!0),j.attr("viewBox",`0 0 ${T} ${S}`),m&&j.append("title").text(m),f&&j.append("desc").text(f);let z=j.append("g").attr("transform",`translate(${x}, ${x})`),v=D(u,h),L=$(p.seed,e),M=z.append("g").attr("class","cynefin-backgrounds"),P=["complex","complicated","chaotic","clear"];for(let t of P){let e=v[t];M.append("rect").attr("class","cynefinDomain").attr("x",e.x).attr("y",e.y).attr("width",e.w).attr("height",e.h).attr("fill",B[t]).attr("fill-opacity",.4).attr("stroke","none")}let F=z.append("g").attr("class","cynefin-boundaries");F.append("path").attr("class","cynefinBoundary").attr("d",g(u,h,L,K)).attr("fill","none"),F.append("path").attr("class","cynefinBoundary").attr("d",b(u,h,L+100,K)).attr("fill","none"),F.append("path").attr("class","cynefinCliff").attr("d",k(u,h)).attr("fill","none");let I=.15*u,R=.15*h;z.append("path").attr("class","cynefinConfusion").attr("d",w(u/2,h/2,I,R)).attr("fill",B.confusion).attr("fill-opacity",.5);let W=z.append("g").attr("class","cynefin-labels");for(let t of P){let e=v[t];W.append("text").attr("class","cynefinDomainLabel").attr("x",e.cx).attr("y",A?e.cy-30:e.cy).attr("text-anchor","middle").attr("dominant-baseline","middle").text(t.charAt(0).toUpperCase()+t.slice(1))}if(W.append("text").attr("class","cynefinDomainLabel").attr("x",u/2).attr("y",A?h/2-10:h/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text("Confusion"),A){let t=z.append("g").attr("class","cynefin-subtitles");for(let e of P){let a=v[e],n=C[e];t.append("text").attr("class","cynefinSubtitle").attr("x",a.cx).attr("y",a.cy-10).attr("text-anchor","middle").attr("dominant-baseline","middle").text(n.model),t.append("text").attr("class","cynefinSubtitle").attr("x",a.cx).attr("y",a.cy+5).attr("text-anchor","middle").attr("dominant-baseline","middle").text(n.practice)}t.append("text").attr("class","cynefinSubtitle").attr("x",u/2).attr("y",h/2+8).attr("text-anchor","middle").attr("dominant-baseline","middle").text(C.confusion.practice)}let Y=z.append("g").attr("class","cynefin-items");for(let t of["complex","complicated","chaotic","clear","confusion"]){let e,a=s.get(t);if(!a||0===a.items.length)continue;let n=v[t],r="confusion"===t,i=a.items,o=0;if(r&&a.items.length>3&&(o=a.items.length-3,i=a.items.slice(0,3)),r){let t=A?22:14;e=n.cy+t}else e=n.cy+(A?25:15);if([...i].forEach((a,r)=>{let i=e+30*r,o=Y.append("g"),l=o.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",13).attr("text-anchor","middle").attr("dominant-baseline","central").text(a.label),s=7*a.label.length,c=l.node();if(c&&"function"==typeof c.getBBox){let t=c.getBBox();t.width>0&&(s=t.width)}let d=s+20,m=n.cx-d/2;o.attr("transform",`translate(${m}, ${i})`),o.insert("rect","text").attr("class","cynefinItem").attr("x",0).attr("y",0).attr("width",d).attr("height",26).attr("rx",4).attr("ry",4).attr("fill",B[t]).attr("fill-opacity",.95),l.attr("x",d/2).attr("y",13)}),o>0){let a=e+30*i.length,r=`+${o} more`,l=Y.append("g"),s=l.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",13).attr("text-anchor","middle").attr("dominant-baseline","central").text(r),c=7*r.length,d=s.node();if(d&&"function"==typeof d.getBBox){let t=d.getBBox();t.width>0&&(c=t.width)}let m=c+20,f=n.cx-m/2;l.attr("transform",`translate(${f}, ${a})`),l.insert("rect","text").attr("class","cynefinItemOverflow").attr("x",0).attr("y",0).attr("width",m).attr("height",26).attr("rx",4).attr("ry",4).attr("fill",B[t]).attr("fill-opacity",.6),s.attr("x",m/2).attr("y",13)}}if(c.length>0){let t=j.select("defs").empty()?j.append("defs"):j.select("defs"),a=`cynefin-arrow-${e}`;t.append("marker").attr("id",a).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto-start-reverse").append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("class","cynefinArrowHead");let n=z.append("g").attr("class","cynefin-arrows");c.forEach(t=>{let e=v[t.from],r=v[t.to];if(!e||!r)return;if(t.from===t.to)return void l.R.warn(`Cynefin renderer: skipping self-loop on domain "${t.from}"`);let i=e.cx,o=e.cy,s=r.cx,c=r.cy,d=s-i,m=c-o,f=Math.sqrt(d*d+m*m),p=.15*f,y=(i+s)/2+-m/f*p,u=(o+c)/2+d/f*p;n.append("path").attr("class","cynefinArrowLine").attr("d",`M${i},${o} Q${y},${u} ${s},${c}`).attr("fill","none").attr("marker-end",`url(#${a})`),t.label&&n.append("text").attr("class","cynefinArrowLabel").attr("x",y).attr("y",u-6).attr("text-anchor","middle").attr("dominant-baseline","auto").text(t.label)})}d&&z.append("text").attr("class","cynefinTitle").attr("x",u/2).attr("y",-x/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text(d)},"draw"),K=(0,s.K)(()=>{let t=(0,o.P$)(),e=(0,o.zj)();return(0,i.$t)(t,e.themeVariables).cynefin},"getCynefinTheme"),T={parser:u,db:p,renderer:{draw:A},styles:(0,s.K)(()=>{let t=K();return`
	.cynefinDomain {
		stroke: none;
	}
	.cynefinDomainLabel {
		font-size: ${t.domainFontSize}px;
		font-weight: bold;
		fill: ${t.labelColor};
	}
	.cynefinSubtitle {
		font-size: ${t.itemFontSize-1}px;
		fill: ${t.textColor};
		font-style: italic;
	}
	.cynefinItem {
		fill-opacity: 0.95;
		stroke: ${t.boundaryColor};
		stroke-width: 1;
	}
	.cynefinItemText {
		font-size: ${t.itemFontSize}px;
		fill: ${t.textColor};
	}
	.cynefinItemOverflow {
		fill-opacity: 0.6;
		stroke: ${t.boundaryColor};
		stroke-width: 1;
		stroke-dasharray: 3 2;
	}
	.cynefinBoundary {
		stroke: ${t.boundaryColor};
		stroke-width: ${t.boundaryWidth};
		stroke-dasharray: 6 3;
	}
	.cynefinCliff {
		stroke: ${t.cliffColor};
		stroke-width: ${t.cliffWidth};
	}
	.cynefinConfusion {
		stroke: ${t.boundaryColor};
		stroke-width: 1.5;
		stroke-dasharray: 4 2;
	}
	.cynefinArrowLine {
		stroke: ${t.arrowColor};
		stroke-width: ${t.arrowWidth};
		fill: none;
	}
	.cynefinArrowHead {
		fill: ${t.arrowColor};
		stroke: none;
	}
	.cynefinArrowLabel {
		font-size: ${t.itemFontSize-1}px;
		fill: ${t.textColor};
	}
	.cynefinTitle {
		font-size: ${t.domainFontSize+2}px;
		font-weight: bold;
		fill: ${t.labelColor};
	}
	`},"styles")};a.d(e,{diagram:()=>T})}}]);
//# sourceMappingURL=9611.e869eb4c.iframe.bundle.js.map