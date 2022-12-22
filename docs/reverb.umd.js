/**
 * @logue/reverb
 *
 * @description JavaScript Reverb effect class
 * @author Logue <logue@hotmail.co.jp>
 * @copyright 2019-2022 By Masashi Yoshikawa All rights reserved.
 * @license MIT
 * @version 1.2.2
 * @see {@link https://github.com/logue/Reverb.js}
 */

(function(n,s){typeof exports=="object"&&typeof module<"u"?module.exports=s(require("@thi.ng/random"),require("@thi.ng/colored-noise"),require("@thi.ng/transducers")):typeof define=="function"&&define.amd?define(["@thi.ng/random","@thi.ng/colored-noise","@thi.ng/transducers"],s):(n=typeof globalThis<"u"?globalThis:n||self,n.Reverb=s(n.random,n.colordNoise,n.transducers))})(this,function(n,s,p){"use strict";const o={BLUE:"blue",GREEN:"green",PINK:"pink",RED:"red",VIOLET:"violet",WHITE:"white",BROWN:"red"},f={noise:o.WHITE,scale:1,peaks:2,randomAlgorithm:n.SYSTEM,decay:2,delay:0,reverse:!1,time:2,filterType:"allpass",filterFreq:2200,filterQ:1,mix:.5,once:!1},c={version:"1.2.2",date:"2022-12-22T02:11:22.209Z"};class u{static version=c.version;static build=c.date;ctx;wetGainNode;dryGainNode;filterNode;convolverNode;outputNode;options;isConnected;noise=s.white;constructor(e,t){this.ctx=e,this.options={...f,...t},this.wetGainNode=this.ctx.createGain(),this.dryGainNode=this.ctx.createGain(),this.filterNode=this.ctx.createBiquadFilter(),this.convolverNode=this.ctx.createConvolver(),this.outputNode=this.ctx.createGain(),this.isConnected=!1,this.filterType(this.options.filterType),this.setNoise(this.options.noise),this.buildImpulse(),this.mix(this.options.mix)}connect(e){return this.isConnected&&this.options.once?(this.isConnected=!1,this.outputNode):(this.convolverNode.connect(this.filterNode),this.filterNode.connect(this.wetGainNode),e.connect(this.convolverNode),e.connect(this.dryGainNode).connect(this.outputNode),e.connect(this.wetGainNode).connect(this.outputNode),this.isConnected=!0,this.outputNode)}disconnect(e){return this.isConnected&&(this.convolverNode.disconnect(this.filterNode),this.filterNode.disconnect(this.wetGainNode)),this.isConnected=!1,e}mix(e){if(!this.inRange(e,0,1))throw new RangeError("[Reverb.js] Dry/Wet ratio must be between 0 to 1.");this.options.mix=e,this.dryGainNode.gain.value=1-this.options.mix,this.wetGainNode.gain.value=this.options.mix}time(e){if(!this.inRange(e,1,50))throw new RangeError("[Reverb.js] Time length of inpulse response must be less than 50sec.");this.options.time=e,this.buildImpulse()}decay(e){if(!this.inRange(e,0,100))throw new RangeError("[Reverb.js] Inpulse Response decay level must be less than 100.");this.options.decay=e,this.buildImpulse()}delay(e){if(!this.inRange(e,0,100))throw new RangeError("[Reverb.js] Inpulse Response delay time must be less than 100.");this.options.delay=e,this.buildImpulse()}reverse(e){this.options.reverse=e,this.buildImpulse()}filterType(e="allpass"){this.filterNode.type=this.options.filterType=e}filterFreq(e){if(!this.inRange(e,20,2e4))throw new RangeError("[Reverb.js] Filter frequrncy must be between 20 and 20000.");this.options.filterFreq=e,this.filterNode.frequency.value=this.options.filterFreq}filterQ(e){if(!this.inRange(e,0,10))throw new RangeError("[Reverb.js] Filter quality value must be between 0 and 10.");this.options.filterQ=e,this.filterNode.Q.value=this.options.filterQ}peaks(e){this.options.peaks=e,this.buildImpulse()}scale(e){this.options.scale=e,this.buildImpulse()}randomAlgorithm(e){this.options.randomAlgorithm=e,this.buildImpulse()}setNoise(e){switch(this.options.noise=e,e){case o.BLUE:this.noise=s.blue;break;case o.GREEN:this.noise=s.green;break;case o.PINK:this.noise=s.pink;break;case o.RED:case o.BROWN:this.noise=s.red;break;case o.VIOLET:this.noise=s.violet;break;default:this.noise=s.white}this.buildImpulse()}setRandomAlgorythm(e){this.options.randomAlgorithm=e,this.buildImpulse()}inRange(e,t,r){return(e-t)*(e-r)<=0}buildImpulse(){const e=this.ctx.sampleRate,t=Math.max(e*this.options.time,1),r=e*this.options.delay,a=this.ctx.createBuffer(2,t,e),l=new Float32Array(t),d=new Float32Array(t),m=this.getNoise(t),b=this.getNoise(t);for(let i=0;i<t;i++){let h=0;i<r?(l[i]=0,d[i]=0,h=this.options.reverse?t-(i-r):i-r):h=this.options.reverse?t-i:i,l[i]=m[i]*(1-h/t)**this.options.decay,d[i]=b[i]*(1-h/t)**this.options.decay}a.getChannelData(0).set(l),a.getChannelData(1).set(d),this.convolverNode.buffer=a}getNoise(e){return[...p.take(e,this.noise(this.options.peaks,this.options.scale,this.options.randomAlgorithm))]}}return window.Reverb||(window.Reverb=u),u});
