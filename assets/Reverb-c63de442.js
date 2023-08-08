(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function s(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=s(i);fetch(i.href,o)}})();const v=1/2**32;class F{float(e=1){return this.int()*v*e}norm(e=1){return(this.int()*v-.5)*2*e}normMinMax(e,s){const n=this.minmax(e,s);return this.float()<.5?n:-n}minmax(e,s){return this.float()*(s-e)+e}minmaxInt(e,s){return e|=0,s|=0,e+(this.float()*(s-e)|0)}}const m=Math.random;class T extends F{int(){return m()*4294967296>>>0}float(e=1){return m()*e}norm(e=1){return(m()-.5)*2*e}}const x=new T,C={noise:"white",scale:1,peaks:2,randomAlgorithm:x,decay:2,delay:0,reverse:!1,time:2,filterType:"allpass",filterFreq:2200,filterQ:1,mix:.5,once:!1},E={version:"1.2.18",date:"2023-08-08T00:57:02.471Z"},w=E,k={blue:"blue",brown:"red",green:"green",pink:"pink",red:"red",violet:"violet",white:"white"},u=k,p={bins:2,scale:1,rnd:x},N=(t,e,s)=>{const n=new Array(t);for(let i=0;i<t;i++)n[i]=s.norm(e);return n},g=t=>t.reduce((e,s)=>e+s,0);function*A(t,e){const s=[t[Symbol.iterator](),e[Symbol.iterator]()];for(let n=0;;n^=1){const i=s[n].next();if(i.done)return;yield i.value}}function*y(t){const{bins:e,scale:s,rnd:n}={...p,...t},i=N(e,s,n);i.forEach((c,a)=>i[a]=a&1?c:-c);const o=1/e;let r=g(i);for(let c=0,a=-1;;++c>=e&&(c=0))r-=i[c],r+=i[c]=a*n.norm(s),a^=4294967294,yield a*r*o}const L=t=>A(y(t),y(t)),M=t=>{let e=32;return t&=-t,t&&e--,t&65535&&(e-=16),t&16711935&&(e-=8),t&252645135&&(e-=4),t&858993459&&(e-=2),t&1431655765&&(e-=1),e};function*O(t){const{bins:e,scale:s,rnd:n}={...p,bins:8,...t},i=N(e,s,n),o=1/e;let r=g(i);for(let c=0;;c=c+1>>>0){const a=M(c)%e;r-=i[a],r+=i[a]=n.norm(s),yield r*o}}function*b(t){const{bins:e,scale:s,rnd:n}={...p,...t},i=N(e,s,n),o=1/e;let r=g(i);for(let c=0;;++c>=e&&(c=0))r-=i[c],r+=i[c]=n.norm(s),yield r*o}const S=t=>A(b(t),b(t));function*R(t){const{scale:e,rnd:s}={...p,...t};for(;;)yield s.norm(e)}const j=(t,e)=>t!=null&&typeof t[e]=="function",q=t=>j(t,"xform")?t.xform():t,D=t=>t!=null&&typeof t[Symbol.iterator]=="function";class h{constructor(e){this.value=e}deref(){return this.value}}const P=t=>new h(t),Q=t=>t instanceof h,B=t=>t instanceof h?t:new h(t),I=t=>t instanceof h?t.deref():t,z=(t,e)=>[t,s=>s,e];function K(t){return t?[...t]:z(()=>[],(e,s)=>(e.push(s),e))}function*U(t,e){const s=q(t)(K()),n=s[1],i=s[2];for(let o of e){const r=i([],o);if(Q(r)){yield*I(n(r.deref()));return}r.length&&(yield*r)}yield*I(n([]))}const V=(t,e)=>[t[0],t[1],e];function G(t,e){return D(e)?U(G(t),e):s=>{const n=s[2];let i=t;return V(s,(o,r)=>--i>0?n(o,r):i===0?B(n(o,r)):P(o))}}class d{static version=w.version;static build=w.date;ctx;wetGainNode;dryGainNode;filterNode;convolverNode;outputNode;options;isConnected;noise=R;constructor(e,s){this.ctx=e,this.options=Object.assign(C,s),this.wetGainNode=this.ctx.createGain(),this.dryGainNode=this.ctx.createGain(),this.filterNode=this.ctx.createBiquadFilter(),this.convolverNode=this.ctx.createConvolver(),this.outputNode=this.ctx.createGain(),this.isConnected=!1,this.filterType(this.options.filterType),this.setNoise(this.options.noise),this.buildImpulse(),this.mix(this.options.mix)}connect(e){return this.isConnected&&this.options.once?(this.isConnected=!1,this.outputNode):(this.convolverNode.connect(this.filterNode),this.filterNode.connect(this.wetGainNode),e.connect(this.convolverNode),e.connect(this.dryGainNode).connect(this.outputNode),e.connect(this.wetGainNode).connect(this.outputNode),this.isConnected=!0,this.outputNode)}disconnect(e){return this.isConnected&&(this.convolverNode.disconnect(this.filterNode),this.filterNode.disconnect(this.wetGainNode)),this.isConnected=!1,e}mix(e){if(!d.inRange(e,0,1))throw new RangeError("[Reverb.js] Dry/Wet ratio must be between 0 to 1.");this.options.mix=e,this.dryGainNode.gain.value=1-this.options.mix,this.wetGainNode.gain.value=this.options.mix}time(e){if(!d.inRange(e,1,50))throw new RangeError("[Reverb.js] Time length of inpulse response must be less than 50sec.");this.options.time=e,this.buildImpulse()}decay(e){if(!d.inRange(e,0,100))throw new RangeError("[Reverb.js] Inpulse Response decay level must be less than 100.");this.options.decay=e,this.buildImpulse()}delay(e){if(!d.inRange(e,0,100))throw new RangeError("[Reverb.js] Inpulse Response delay time must be less than 100.");this.options.delay=e,this.buildImpulse()}reverse(e){this.options.reverse=e,this.buildImpulse()}filterType(e="allpass"){this.filterNode.type=this.options.filterType=e}filterFreq(e){if(!d.inRange(e,20,2e4))throw new RangeError("[Reverb.js] Filter frequrncy must be between 20 and 20000.");this.options.filterFreq=e,this.filterNode.frequency.value=this.options.filterFreq}filterQ(e){if(!d.inRange(e,0,10))throw new RangeError("[Reverb.js] Filter quality value must be between 0 and 10.");this.options.filterQ=e,this.filterNode.Q.value=this.options.filterQ}peaks(e){this.options.peaks=e,this.buildImpulse()}scale(e){this.options.scale=e,this.buildImpulse()}randomAlgorithm(e){this.options.randomAlgorithm=e,this.buildImpulse()}setNoise(e){switch(this.options.noise=e,e){case u.blue:this.noise=y;break;case u.green:this.noise=L;break;case u.pink:this.noise=O;break;case u.red:case u.brown:this.noise=b;break;case u.violet:this.noise=S;break;default:this.noise=R}this.buildImpulse()}setRandomAlgorythm(e){this.options.randomAlgorithm=e,this.buildImpulse()}static inRange(e,s,n){return(e-s)*(e-n)<=0}buildImpulse(){const e=this.ctx.sampleRate,s=Math.max(e*this.options.time,1),n=e*this.options.delay,i=this.ctx.createBuffer(2,s,e),o=new Float32Array(s),r=new Float32Array(s),c=this.getNoise(s),a=this.getNoise(s);for(let l=0;l<s;l++){let f=0;l<n?(o[l]=0,r[l]=0,f=this.options.reverse??!1?s-(l-n):l-n):f=this.options.reverse??!1?s-l:l,o[l]=(c[l]??0)*(1-f/s)**this.options.decay,r[l]=(a[l]??0)*(1-f/s)**this.options.decay}i.getChannelData(0).set(o),i.getChannelData(1).set(r),this.convolverNode.buffer=i}getNoise(e){return[...G(e,this.noise({bins:this.options.peaks,scale:this.options.scale,rnd:this.options.randomAlgorithm}))]}}window.Reverb||(window.Reverb=d);export{d as R};
