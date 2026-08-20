"use strict";(self.rspackChunk_logue_reverb=self.rspackChunk_logue_reverb||[]).push([[1961],{"./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-JWPE2WC7.mjs"(e,t,r){function i(e,t){e.accDescr&&t.setAccDescription?.(e.accDescr),e.accTitle&&t.setAccTitle?.(e.accTitle),e.title&&t.setDiagramTitle?.(e.title)}(0,r("./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs").K)(i,"populateCommonDb"),r.d(t,{S:()=>i})},"./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-SVP7TREG.mjs"(e,t,r){var i=r("./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-CLGD4ZFX.mjs"),a=r("./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs"),n=r("./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs"),o=r("./node_modules/.pnpm/mermaid@11.17.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs"),l="",d="",s="",m=[],c=new Map,h=(0,o.K)(e=>(0,a.jZ)(e,(0,a.D7)()),"sanitizeText"),p=(0,o.K)(e=>{switch(e.type){case"terminal":return{...e,value:h(e.value)};case"nonterminal":return{...e,name:h(e.name)};case"sequence":return{...e,elements:e.elements.map(p)};case"choice":return{...e,alternatives:e.alternatives.map(p)};case"optional":return{...e,element:p(e.element)};case"repetition":return{...e,element:p(e.element),separator:e.separator?p(e.separator):void 0};case"special":return{...e,text:h(e.text)}}},"sanitizeAstNode"),u=(0,o.K)(()=>{l="",d="",s="",m.length=0,c.clear(),(0,a.IU)(),n.R.debug("[Railroad] Database cleared")},"clear"),g=(0,o.K)(e=>{l=h(e),n.R.debug("[Railroad] Title set:",e)},"setTitle"),T=(0,o.K)(()=>l,"getTitle"),f=(0,o.K)(e=>{let t={...e,name:h(e.name),definition:p(e.definition),comment:e.comment?h(e.comment):void 0};n.R.debug("[Railroad] Adding rule:",t.name),c.has(t.name)&&n.R.warn(`[Railroad] Rule '${t.name}' is already defined. Overwriting.`),m.push(t),c.set(t.name,t)},"addRule"),x=(0,o.K)(()=>m,"getRules"),k=(0,o.K)(e=>c.get(e),"getRule"),w=(0,o.K)(e=>{d=h(e).replace(/^\s+/g,""),n.R.debug("[Railroad] Accessibility title set:",e)},"setAccTitle"),C=(0,o.K)(()=>d,"getAccTitle"),$=(0,o.K)(e=>{s=h(e).replace(/\n\s+/g,"\n"),n.R.debug("[Railroad] Accessibility description set:",e)},"setAccDescription"),S={clear:u,setTitle:g,getTitle:T,addRule:f,getRules:x,getRule:k,setAccTitle:w,getAccTitle:C,setAccDescription:$,getAccDescription:(0,o.K)(()=>s,"getAccDescription"),setDiagramTitle:g,getDiagramTitle:T},F={compactMode:!1,padding:10,verticalSeparation:8,horizontalSeparation:10,arcRadius:10,fontSize:14,fontFamily:"monospace",terminalFill:"#FFFFC0",terminalStroke:"#000000",terminalTextColor:"#000000",nonTerminalFill:"#FFFFFF",nonTerminalStroke:"#000000",nonTerminalTextColor:"#000000",lineColor:"#000000",strokeWidth:2,markerFill:"#000000",commentFill:"#E8E8E8",commentStroke:"#888888",commentTextColor:"#666666",specialFill:"#F0E0FF",specialStroke:"#8800CC",ruleNameColor:"#000066",showMarkers:!0,markerRadius:5},y=/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$|^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s%+,./-]+\)$|^[a-z]+$/i,R=/^[\w "',.-]+$/,b=new Set(["compactMode","padding","verticalSeparation","horizontalSeparation","arcRadius","fontSize","fontFamily","terminalFill","terminalStroke","terminalTextColor","nonTerminalFill","nonTerminalStroke","nonTerminalTextColor","lineColor","strokeWidth","markerFill","commentFill","commentStroke","commentTextColor","specialFill","specialStroke","ruleNameColor","showMarkers","markerRadius"]),v=(0,o.K)(e=>!!e&&Object.keys(e).every(e=>"railroad"===e||b.has(e)),"isRailroadStyleOptions"),z=(0,o.K)(e=>e?"railroad"in e&&e.railroad?e.railroad:v(e)?e:{}:{},"extractRailroadOverrides"),K=(0,o.K)(e=>{if(!e||v(e))return{};let{railroad:t,svgId:r,theme:i,look:a,...n}=e;return n},"extractThemeOverrides"),M=(0,o.K)((e,t)=>{if("string"!=typeof e)return t;let r=e.trim();return y.test(r)?r:t},"sanitizeColorValue"),D=(0,o.K)((e,t)=>{if("string"!=typeof e)return t;let r=e.trim();return R.test(r)?r:t},"sanitizeFontFamilyValue"),_=(0,o.K)((e,t)=>{let r="number"==typeof e?e:"string"==typeof e?Number.parseFloat(e):0/0;return Number.isFinite(r)&&r>=0?r:t},"sanitizeNumberValue"),A=(0,o.K)(e=>{let t="number"==typeof e?e:"string"==typeof e?Number.parseFloat(e):0/0;return Number.isFinite(t)&&t>0?t:void 0},"parseThemeFontSize"),N=(0,o.K)(e=>{let t=D(e.fontFamily,F.fontFamily),r=A(e.fontSize)??F.fontSize;return{...F,fontFamily:t,fontSize:r,terminalFill:M(e.secondBkg??e.secondaryColor,F.terminalFill),terminalStroke:M(e.secondaryBorderColor??e.lineColor,F.terminalStroke),terminalTextColor:M(e.secondaryTextColor??e.textColor,F.terminalTextColor),nonTerminalFill:M(e.mainBkg??e.background,F.nonTerminalFill),nonTerminalStroke:M(e.primaryBorderColor??e.lineColor,F.nonTerminalStroke),nonTerminalTextColor:M(e.primaryTextColor??e.textColor,F.nonTerminalTextColor),lineColor:M(e.lineColor,F.lineColor),markerFill:M(e.lineColor,F.markerFill),commentFill:M(e.labelBackground??e.tertiaryColor,F.commentFill),commentStroke:M(e.tertiaryBorderColor??e.lineColor,F.commentStroke),commentTextColor:M(e.tertiaryTextColor??e.textColor,F.commentTextColor),specialFill:M(e.tertiaryColor??e.secondaryColor,F.specialFill),specialStroke:M(e.tertiaryBorderColor??e.secondaryBorderColor,F.specialStroke),ruleNameColor:M(e.titleColor??e.textColor,F.ruleNameColor)}},"buildThemeDefaults"),E=(0,o.K)(e=>{let t=(0,a.zj)(),r=N({...(0,a.P$)(),...t.themeVariables??{},...K(e)}),i={...t.railroad??{},...z(e)};return{compactMode:i.compactMode??r.compactMode,padding:_(i.padding,r.padding),verticalSeparation:_(i.verticalSeparation,r.verticalSeparation),horizontalSeparation:_(i.horizontalSeparation,r.horizontalSeparation),arcRadius:_(i.arcRadius,r.arcRadius),fontSize:_(i.fontSize,r.fontSize),fontFamily:D(i.fontFamily,r.fontFamily),terminalFill:M(i.terminalFill,r.terminalFill),terminalStroke:M(i.terminalStroke,r.terminalStroke),terminalTextColor:M(i.terminalTextColor,r.terminalTextColor),nonTerminalFill:M(i.nonTerminalFill,r.nonTerminalFill),nonTerminalStroke:M(i.nonTerminalStroke,r.nonTerminalStroke),nonTerminalTextColor:M(i.nonTerminalTextColor,r.nonTerminalTextColor),lineColor:M(i.lineColor,r.lineColor),strokeWidth:_(i.strokeWidth,r.strokeWidth),markerFill:M(i.markerFill,r.markerFill),commentFill:M(i.commentFill,r.commentFill),commentStroke:M(i.commentStroke,r.commentStroke),commentTextColor:M(i.commentTextColor,r.commentTextColor),specialFill:M(i.specialFill,r.specialFill),specialStroke:M(i.specialStroke,r.specialStroke),ruleNameColor:M(i.ruleNameColor,r.ruleNameColor),showMarkers:i.showMarkers??r.showMarkers,markerRadius:_(i.markerRadius,r.markerRadius)}},"buildRailroadStyleOptions"),B=(0,o.K)(e=>{let{fontFamily:t,fontSize:r,terminalFill:i,terminalStroke:a,terminalTextColor:n,nonTerminalFill:o,nonTerminalStroke:l,nonTerminalTextColor:d,lineColor:s,strokeWidth:m,markerFill:c,commentFill:h,commentStroke:p,commentTextColor:u,specialFill:g,specialStroke:T,ruleNameColor:f}=E(e);return`
  .railroad-diagram {
    font-family: ${t};
    font-size: ${r}px;
  }

  .railroad-terminal rect {
    fill: ${i};
    stroke: ${a};
    stroke-width: ${m}px;
  }

  .railroad-terminal text {
    fill: ${n};
    font-family: ${t};
    font-size: ${r}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-nonterminal rect {
    fill: ${o};
    stroke: ${l};
    stroke-width: ${m}px;
  }

  .railroad-nonterminal text {
    fill: ${d};
    font-family: ${t};
    font-size: ${r}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-line {
    stroke: ${s};
    stroke-width: ${m}px;
    fill: none;
  }

  .railroad-start circle,
  .railroad-end circle {
    fill: ${c};
  }

  .railroad-comment ellipse {
    fill: ${h};
    stroke: ${p};
    stroke-width: ${m}px;
  }

  .railroad-comment text {
    fill: ${u};
    font-style: italic;
    font-family: ${t};
    font-size: ${r}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-special rect {
    fill: ${g};
    stroke: ${T};
    stroke-width: ${m}px;
    stroke-dasharray: 5,3;
  }

  .railroad-special text {
    fill: ${d};
    font-family: ${t};
    font-size: ${r}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-rule-name {
    font-weight: bold;
    fill: ${f};
    font-family: ${t};
    font-size: ${r}px;
  }

  .railroad-group {
    /* Grouping container, no specific styles */
  }
`},"getStyles"),j=class{constructor(){this.d=""}static{(0,o.K)(this,"PathBuilder")}moveTo(e,t){return this.d+=`M ${e} ${t} `,this}lineTo(e,t){return this.d+=`L ${e} ${t} `,this}horizontalTo(e){return this.d+=`H ${e} `,this}verticalTo(e){return this.d+=`V ${e} `,this}arcTo(e,t,r,i,a,n,o){return this.d+=`A ${e} ${t} ${r} ${+!!i} ${+!!a} ${n} ${o} `,this}build(){return this.d.trim()}},O=class{constructor(e,t=E()){this.textCache=new Map,this.svg=e,this.config=t}static{(0,o.K)(this,"RailroadRenderer")}measureText(e){if(this.textCache.has(e))return this.textCache.get(e);let t=this.svg.append("text").attr("font-family",this.config.fontFamily).attr("font-size",this.config.fontSize).text(e),r=t.node().getBBox(),i={width:r.width,height:r.height};return t.remove(),this.textCache.set(e,i),i}renderTerminal(e,t){let r=this.measureText(t),i=r.width+2*this.config.padding,a=r.height+2*this.config.padding,n=e.append("g").attr("class","railroad-terminal");return n.append("rect").attr("x",0).attr("y",0).attr("width",i).attr("height",a).attr("rx",10).attr("ry",10),n.append("text").attr("x",i/2).attr("y",a/2).text(t),{element:n.node(),dimensions:{width:i,height:a,up:a/2,down:a/2}}}renderNonTerminal(e,t){let r=this.measureText(t),i=r.width+2*this.config.padding,a=r.height+2*this.config.padding,n=e.append("g").attr("class","railroad-nonterminal");return n.append("rect").attr("x",0).attr("y",0).attr("width",i).attr("height",a),n.append("text").attr("x",i/2).attr("y",a/2).text(t),{element:n.node(),dimensions:{width:i,height:a,up:a/2,down:a/2}}}renderSequence(e,t){let r=t.map(t=>this.renderExpression(e,t)),i=0,a=0,n=0;for(let e of r)i+=e.dimensions.width,a=Math.max(a,e.dimensions.up),n=Math.max(n,e.dimensions.down);i+=(r.length-1)*this.config.horizontalSeparation;let o=e.append("g").attr("class","railroad-sequence"),l=0;for(let e=0;e<r.length;e++){let t=r[e],i=a-t.dimensions.up;if(o.node().appendChild(t.element).setAttribute("transform",`translate(${l}, ${i})`),e<r.length-1){let e=l+t.dimensions.width,r=e+this.config.horizontalSeparation,i=a;o.append("path").attr("class","railroad-line").attr("d",new j().moveTo(e,i).lineTo(r,i).build())}l+=t.dimensions.width+this.config.horizontalSeparation}return{element:o.node(),dimensions:{width:i,height:a+n,up:a,down:n}}}renderChoice(e,t){let r=t.map(t=>this.renderExpression(e,t)),i=0,a=0;for(let e of r)i=Math.max(i,e.dimensions.width),a+=e.dimensions.height;a+=(r.length-1)*this.config.verticalSeparation;let n=this.config.arcRadius,o=i+4*n,l=e.append("g").attr("class","railroad-choice"),d=0,s=a/2;for(let e of r){let t=d,r=t+e.dimensions.up,a=2*n+(i-e.dimensions.width)/2;l.node().appendChild(e.element).setAttribute("transform",`translate(${a}, ${t})`);let m=new j,c=r>s;r===s?m.moveTo(0,s).lineTo(a,r):m.moveTo(0,s).arcTo(n,n,0,!1,c,n,s+(c?n:-n)).lineTo(n,r-(c?n:-n)).arcTo(n,n,0,!1,!c,2*n,r).lineTo(a,r),l.append("path").attr("class","railroad-line").attr("d",m.build());let h=new j,p=a+e.dimensions.width,u=o-2*n;r===s?h.moveTo(p,r).lineTo(o,s):h.moveTo(p,r).lineTo(u,r).arcTo(n,n,0,!1,!c,o-n,r+(c?-n:n)).lineTo(o-n,s+(c?n:-n)).arcTo(n,n,0,!1,c,o,s),l.append("path").attr("class","railroad-line").attr("d",h.build()),d+=e.dimensions.height+this.config.verticalSeparation}return{element:l.node(),dimensions:{width:o,height:a,up:s,down:a-s}}}renderOptional(e,t){let r=this.renderExpression(e,t),i=this.config.arcRadius,a=2*i,n=r.dimensions.width+4*i,o=r.dimensions.height+a,l=e.append("g").attr("class","railroad-optional"),d=2*i;l.node().appendChild(r.element).setAttribute("transform",`translate(${d}, ${a})`);let s=a+r.dimensions.up,m=new j().moveTo(0,s).lineTo(2*i,s);l.append("path").attr("class","railroad-line").attr("d",m.build());let c=new j().moveTo(d+r.dimensions.width,s).lineTo(n,s);l.append("path").attr("class","railroad-line").attr("d",c.build());let h=new j().moveTo(0,s).arcTo(i,i,0,!1,!1,i,s-i).lineTo(i,i).arcTo(i,i,0,!1,!0,2*i,0).lineTo(n-2*i,0).arcTo(i,i,0,!1,!0,n-i,i).lineTo(n-i,s-i).arcTo(i,i,0,!1,!1,n,s);return l.append("path").attr("class","railroad-line").attr("d",h.build()),{element:l.node(),dimensions:{width:n,height:o,up:s,down:o-s}}}renderRepetition(e,t,r){let i=this.renderExpression(e,t),a=this.config.arcRadius,n=2*a,o=i.dimensions.width+4*a,l=0===r,d=i.dimensions.height+n+(l?n:0),s=e.append("g").attr("class","railroad-repetition"),m=2*a,c=l?n:0;s.node().appendChild(i.element).setAttribute("transform",`translate(${m}, ${c})`);let h=c+i.dimensions.up;s.append("path").attr("class","railroad-line").attr("d",new j().moveTo(0,h).lineTo(2*a,h).build()),s.append("path").attr("class","railroad-line").attr("d",new j().moveTo(m+i.dimensions.width,h).lineTo(o,h).build());let p=c+i.dimensions.height+a,u=new j().moveTo(m+i.dimensions.width,h).arcTo(a,a,0,!1,!0,m+i.dimensions.width+a,h+a).lineTo(m+i.dimensions.width+a,p).arcTo(a,a,0,!1,!0,m+i.dimensions.width,p+a).lineTo(2*a,p+a).arcTo(a,a,0,!1,!0,a,p).lineTo(a,h+a).arcTo(a,a,0,!1,!0,2*a,h);if(s.append("path").attr("class","railroad-line").attr("d",u.build()),l){let e=new j().moveTo(0,h).arcTo(a,a,0,!1,!1,a,h-a).lineTo(a,a).arcTo(a,a,0,!1,!0,2*a,0).lineTo(o-2*a,0).arcTo(a,a,0,!1,!0,o-a,a).lineTo(o-a,h-a).arcTo(a,a,0,!1,!1,o,h);s.append("path").attr("class","railroad-line").attr("d",e.build())}return{element:s.node(),dimensions:{width:o,height:d,up:h,down:d-h}}}renderSpecial(e,t){let r=this.measureText("? "+t+" ?"),i=r.width+2*this.config.padding,a=r.height+2*this.config.padding,n=e.append("g").attr("class","railroad-special");return n.append("rect").attr("x",0).attr("y",0).attr("width",i).attr("height",a),n.append("text").attr("x",i/2).attr("y",a/2).text("? "+t+" ?"),{element:n.node(),dimensions:{width:i,height:a,up:a/2,down:a/2}}}renderExpression(e,t){switch(t.type){case"terminal":return this.renderTerminal(e,t.value);case"nonterminal":return this.renderNonTerminal(e,t.name);case"sequence":return this.renderSequence(e,t.elements);case"choice":return this.renderChoice(e,t.alternatives);case"optional":return this.renderOptional(e,t.element);case"repetition":return this.renderRepetition(e,t.element,t.min);case"special":return this.renderSpecial(e,t.text);default:throw Error(`Unknown node type: ${t.type}`)}}renderRule(e,t){let r=this.svg.append("g").attr("class","railroad-rule").attr("transform",`translate(0, ${t})`),i=e.name+" =",a=this.measureText(i).width+20,n=a+20,o=r.append("g"),l=this.renderExpression(o,e.definition),d=Math.max(20,l.dimensions.up),s=d-l.dimensions.up;return o.attr("transform",`translate(${n}, ${s})`),r.append("g").attr("class","railroad-rule-name-group").append("text").attr("class","railroad-rule-name").attr("x",0).attr("y",d).text(i),r.append("g").attr("class","railroad-start").append("circle").attr("cx",a).attr("cy",d).attr("r",this.config.markerRadius),r.append("g").attr("class","railroad-end").append("circle").attr("cx",n+l.dimensions.width+10).attr("cy",d).attr("r",this.config.markerRadius),r.append("path").attr("class","railroad-line").attr("d",new j().moveTo(a+this.config.markerRadius,d).lineTo(n,d).build()),r.append("path").attr("class","railroad-line").attr("d",new j().moveTo(n+l.dimensions.width,d).lineTo(n+l.dimensions.width+10-this.config.markerRadius,d).build()),{height:Math.max(40,s+l.dimensions.height+2*this.config.padding),width:n+l.dimensions.width+10+this.config.markerRadius}}renderDiagram(e){let t=this.config.padding,r=0;for(let i of e){let e=this.renderRule(i,t);t+=e.height+this.config.verticalSeparation,r=Math.max(r,e.width)}return{width:r+2*this.config.padding,height:t+this.config.padding}}},V=(0,o.K)((e,t,r)=>{(0,a.a$)(e,t.height,t.width,r),e.attr("viewBox",`0 0 ${t.width} ${t.height}`)},"configureRailroadSvgSize"),W={draw:(0,o.K)((e,t,r)=>{n.R.debug("[Railroad] Rendering diagram\n"+e);try{let e=(0,i.D)(t);e.attr("class","railroad-diagram");let r=(0,a.zj)().railroad,o=r?.useMaxWidth??!0,l=S.getRules();if(n.R.debug(`[Railroad] Rendering ${l.length} rules`),0===l.length){n.R.warn("[Railroad] No rules to render"),V(e,{height:100,width:200},o);return}let d=new O(e,E()).renderDiagram(l);V(e,d,o),n.R.debug("[Railroad] Render complete")}catch(e){throw n.R.error("[Railroad] Render error:",e),e}},"draw")};r.d(t,{$:()=>B,U:()=>W,db:()=>S})}}]);
//# sourceMappingURL=1961.037f61c7.iframe.bundle.js.map