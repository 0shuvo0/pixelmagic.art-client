/**
 * Bundled by jsDelivr using Rollup v2.79.2 and Terser v5.37.0.
 * Original file: /npm/assemblyai@4.9.0/dist/browser.mjs
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var e="undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{};function t(){throw new Error("setTimeout has not been defined")}function s(){throw new Error("clearTimeout has not been defined")}var r=t,n=s;function i(e){if(r===setTimeout)return setTimeout(e,0);if((r===t||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0);try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}"function"==typeof e.setTimeout&&(r=setTimeout),"function"==typeof e.clearTimeout&&(n=clearTimeout);var o,a=[],c=!1,h=-1;function l(){c&&o&&(c=!1,o.length?a=o.concat(a):h=-1,a.length&&d())}function d(){if(!c){var e=i(l);c=!0;for(var t=a.length;t;){for(o=a,a=[];++h<t;)o&&o[h].run();h=-1,t=a.length}o=null,c=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===s||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{return n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function u(e,t){this.fun=e,this.array=t}u.prototype.run=function(){this.fun.apply(null,this.array)};function f(){}var m=f,p=f,w=f,y=f,b=f,g=f,v=f;var T=e.performance||{},S=T.now||T.mozNow||T.msNow||T.oNow||T.webkitNow||function(){return(new Date).getTime()};var k=new Date;var A={nextTick:function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var s=1;s<arguments.length;s++)t[s-1]=arguments[s];a.push(new u(e,t)),1!==a.length||c||i(d)},title:"browser",browser:!0,env:{},argv:[],version:"",versions:{},on:m,addListener:p,once:w,off:y,removeListener:b,removeAllListeners:g,emit:v,binding:function(e){throw new Error("process.binding is not supported")},cwd:function(){return"/"},chdir:function(e){throw new Error("process.chdir is not supported")},umask:function(){return 0},hrtime:function(e){var t=.001*S.call(T),s=Math.floor(t),r=Math.floor(t%1*1e9);return e&&(s-=e[0],(r-=e[1])<0&&(s--,r+=1e9)),[s,r]},platform:"browser",release:{},config:{},uptime:function(){return(new Date-k)/1e3}};const U={cache:"no-store"};let J="";"undefined"!=typeof navigator&&navigator.userAgent&&(J+=navigator.userAgent);const _={sdk:{name:"JavaScript",version:"4.9.0"}};A.versions.node&&-1===J.indexOf("Node")&&(_.runtime_env={name:"Node",version:A.versions.node}),A.versions.bun&&-1===J.indexOf("Bun")&&(_.runtime_env={name:"Bun",version:A.versions.bun}),"undefined"!=typeof Deno&&A.versions.bun&&-1===J.indexOf("Deno")&&(_.runtime_env={name:"Deno",version:Deno.version.deno});class E{constructor(e){var t;this.params=e,!1===e.userAgent?this.userAgent=void 0:this.userAgent=(t=e.userAgent||{},J+(!1===t?"":" AssemblyAI/1.0 ("+Object.entries({..._,...t}).map((([e,t])=>t?`${e}=${t.name}/${t.version}`:"")).join(" ")+")"))}async fetch(e,t){t={...U,...t};let s={Authorization:this.params.apiKey,"Content-Type":"application/json"};U?.headers&&(s={...s,...U.headers}),t?.headers&&(s={...s,...t.headers}),this.userAgent&&(s["User-Agent"]=this.userAgent,"undefined"!=typeof window&&"chrome"in window&&(s["AssemblyAI-Agent"]=this.userAgent)),t.headers=s,e.startsWith("http")||(e=this.params.baseUrl+e);const r=await fetch(e,t);if(r.status>=400){let e;const t=await r.text();if(t){try{e=JSON.parse(t)}catch{}if(e?.error)throw new Error(e.error);throw new Error(t)}throw new Error(`HTTP Error: ${r.status} ${r.statusText}`)}return r}async fetchJson(e,t){return(await this.fetch(e,t)).json()}}class P extends E{summary(e){return this.fetchJson("/lemur/v3/generate/summary",{method:"POST",body:JSON.stringify(e)})}questionAnswer(e){return this.fetchJson("/lemur/v3/generate/question-answer",{method:"POST",body:JSON.stringify(e)})}actionItems(e){return this.fetchJson("/lemur/v3/generate/action-items",{method:"POST",body:JSON.stringify(e)})}task(e){return this.fetchJson("/lemur/v3/generate/task",{method:"POST",body:JSON.stringify(e)})}getResponse(e){return this.fetchJson(`/lemur/v3/${e}`)}purgeRequestData(e){return this.fetchJson(`/lemur/v3/${e}`,{method:"DELETE"})}}const{WritableStream:O}="undefined"!=typeof window?window:void 0!==e?e:globalThis,x=WebSocket??e?.WebSocket??window?.WebSocket??self?.WebSocket,$=(e,t)=>t?new x(e,t):new x(e),N=4e3,R=4001,D=4002,W=4003,B=4004,I=4008,L=4010,K=4029,j=4030,q=4031,F=4032,z=4033,C=4034,M=4100,H=4101,G=4102,Q=4103,V=1013,X=4104,Y={[N]:"Sample rate must be a positive integer",[R]:"Not Authorized",[D]:"Insufficient funds",[W]:"This feature is paid-only and requires you to add a credit card. Please visit https://app.assemblyai.com/ to add a credit card to your account.",[B]:"Session ID does not exist",[I]:"Session has expired",[L]:"Session is closed",[K]:"Rate limited",[j]:"Unique session violation",[q]:"Session Timeout",[F]:"Audio too short",[z]:"Audio too long",[C]:"Audio too small to transcode",[M]:"Bad JSON",[H]:"Bad schema",[G]:"Too many streams",[Q]:"This session has been reconnected. This WebSocket is no longer valid.",[V]:"Reconnect attempts exhausted",[X]:"Could not parse word boost parameter"};class Z extends Error{}const ee='{"terminate_session":true}';class te{constructor(e){if(this.listeners={},this.realtimeUrl=e.realtimeUrl??"wss://api.assemblyai.com/v2/realtime/ws",this.sampleRate=e.sampleRate??16e3,this.wordBoost=e.wordBoost,this.encoding=e.encoding,this.endUtteranceSilenceThreshold=e.endUtteranceSilenceThreshold,this.disablePartialTranscripts=e.disablePartialTranscripts,"token"in e&&e.token&&(this.token=e.token),"apiKey"in e&&e.apiKey&&(this.apiKey=e.apiKey),!this.token&&!this.apiKey)throw new Error("API key or temporary token is required.")}connectionUrl(){const e=new URL(this.realtimeUrl);if("wss:"!==e.protocol)throw new Error("Invalid protocol, must be wss");const t=new URLSearchParams;return this.token&&t.set("token",this.token),t.set("sample_rate",this.sampleRate.toString()),this.wordBoost&&this.wordBoost.length>0&&t.set("word_boost",JSON.stringify(this.wordBoost)),this.encoding&&t.set("encoding",this.encoding),t.set("enable_extra_session_information","true"),this.disablePartialTranscripts&&t.set("disable_partial_transcripts",this.disablePartialTranscripts.toString()),e.search=t.toString(),e}on(e,t){this.listeners[e]=t}connect(){return new Promise((e=>{if(this.socket)throw new Error("Already connected");const t=this.connectionUrl();this.token?this.socket=$(t.toString()):(console.warn("API key authentication is not supported for the RealtimeTranscriber in browser environment. Use temporary token authentication instead.\nLearn more at https://github.com/AssemblyAI/assemblyai-node-sdk/blob/main/docs/compat.md#browser-compatibility."),this.socket=$(t.toString(),{headers:{Authorization:this.apiKey}})),this.socket.binaryType="arraybuffer",this.socket.onopen=()=>{void 0!==this.endUtteranceSilenceThreshold&&null!==this.endUtteranceSilenceThreshold&&this.configureEndUtteranceSilenceThreshold(this.endUtteranceSilenceThreshold)},this.socket.onclose=({code:e,reason:t})=>{t||e in Y&&(t=Y[e]),this.listeners.close?.(e,t)},this.socket.onerror=e=>{e.error?this.listeners.error?.(e.error):this.listeners.error?.(new Error(e.message))},this.socket.onmessage=({data:t})=>{const s=JSON.parse(t.toString());if("error"in s)this.listeners.error?.(new Z(s.error));else switch(s.message_type){case"SessionBegins":{const t={sessionId:s.session_id,expiresAt:new Date(s.expires_at)};e(t),this.listeners.open?.(t);break}case"PartialTranscript":s.created=new Date(s.created),this.listeners.transcript?.(s),this.listeners["transcript.partial"]?.(s);break;case"FinalTranscript":s.created=new Date(s.created),this.listeners.transcript?.(s),this.listeners["transcript.final"]?.(s);break;case"SessionInformation":this.listeners.session_information?.(s);break;case"SessionTerminated":this.sessionTerminatedResolve?.()}}}))}sendAudio(e){this.send(e)}stream(){return new O({write:e=>{this.sendAudio(e)}})}forceEndUtterance(){this.send('{"force_end_utterance":true}')}configureEndUtteranceSilenceThreshold(e){this.send(`{"end_utterance_silence_threshold":${e}}`)}send(e){if(!this.socket||this.socket.readyState!==this.socket.OPEN)throw new Error("Socket is not open for communication");this.socket.send(e)}async close(e=!0){if(this.socket){if(this.socket.readyState===this.socket.OPEN)if(e){const e=new Promise((e=>{this.sessionTerminatedResolve=e}));this.socket.send(ee),await e}else this.socket.send(ee);this.socket?.removeAllListeners&&this.socket.removeAllListeners(),this.socket.close()}this.listeners={},this.socket=void 0}}class se extends te{}class re extends E{constructor(e){super(e),this.rtFactoryParams=e}createService(e){return this.transcriber(e)}transcriber(e){const t={...e};return t.token||t.apiKey||(t.apiKey=this.rtFactoryParams.apiKey),new te(t)}async createTemporaryToken(e){return(await this.fetchJson("/v2/realtime/token",{method:"POST",body:JSON.stringify(e)})).token}}class ne extends re{}function ie(e){return e.startsWith("http")||e.startsWith("https")||e.startsWith("data:")?null:e.startsWith("file://")?e.substring(7):e.startsWith("file:")?e.substring(5):e}class oe extends E{constructor(e,t){super(e),this.files=t}async transcribe(e,t){const s=await this.submit(e);return await this.waitUntilReady(s.id,t)}async submit(e){let t,s;if("audio"in e){const{audio:r,...n}=e;if("string"==typeof r){const e=ie(r);t=null!==e?await this.files.upload(e):r.startsWith("data:")?await this.files.upload(r):r}else t=await this.files.upload(r);s={...n,audio_url:t}}else s=e;return await this.fetchJson("/v2/transcript",{method:"POST",body:JSON.stringify(s)})}async create(e,t){const s=ie(e.audio_url);if(null!==s){const t=await this.files.upload(s);e.audio_url=t}const r=await this.fetchJson("/v2/transcript",{method:"POST",body:JSON.stringify(e)});return t?.poll??1?await this.waitUntilReady(r.id,t):r}async waitUntilReady(e,t){const s=t?.pollingInterval??3e3,r=t?.pollingTimeout??-1,n=Date.now();for(;;){const t=await this.get(e);if("completed"===t.status||"error"===t.status)return t;if(r>0&&Date.now()-n>r)throw new Error("Polling timeout");await new Promise((e=>setTimeout(e,s)))}}get(e){return this.fetchJson(`/v2/transcript/${e}`)}async list(e){let t="/v2/transcript";"string"==typeof e?t=e:e&&(t=`${t}?${new URLSearchParams(Object.keys(e).map((t=>[t,e[t]?.toString()||""])))}`);const s=await this.fetchJson(t);for(const e of s.transcripts)e.created=new Date(e.created),e.completed&&(e.completed=new Date(e.completed));return s}delete(e){return this.fetchJson(`/v2/transcript/${e}`,{method:"DELETE"})}wordSearch(e,t){const s=new URLSearchParams({words:t.join(",")});return this.fetchJson(`/v2/transcript/${e}/word-search?${s.toString()}`)}sentences(e){return this.fetchJson(`/v2/transcript/${e}/sentences`)}paragraphs(e){return this.fetchJson(`/v2/transcript/${e}/paragraphs`)}async subtitles(e,t="srt",s){let r=`/v2/transcript/${e}/${t}`;if(s){const e=new URLSearchParams;e.set("chars_per_caption",s.toString()),r+=`?${e.toString()}`}const n=await this.fetch(r);return await n.text()}redactions(e){return this.redactedAudio(e)}redactedAudio(e){return this.fetchJson(`/v2/transcript/${e}/redacted-audio`)}async redactedAudioFile(e){const{redacted_audio_url:t,status:s}=await this.redactedAudio(e);if("redacted_audio_ready"!==s)throw new Error(`Redacted audio status is ${s}`);const r=await fetch(t);if(!r.ok)throw new Error(`Failed to fetch redacted audio: ${r.statusText}`);return{arrayBuffer:r.arrayBuffer.bind(r),blob:r.blob.bind(r),body:r.body,bodyUsed:r.bodyUsed}}}class ae extends E{async upload(e){let t;t="string"==typeof e?e.startsWith("data:")?function(e){const t=e.split(","),s=t[0].match(/:(.*?);/)[1],r=atob(t[1]);let n=r.length;const i=new Uint8Array(n);for(;n--;)i[n]=r.charCodeAt(n);return new Blob([i],{type:s})}(e):await async function(){throw new Error("Interacting with the file system is not supported in this environment.")}():e;return(await this.fetchJson("/v2/upload",{method:"POST",body:t,headers:{"Content-Type":"application/octet-stream"},duplex:"half"})).upload_url}}class ce{constructor(e){e.baseUrl=e.baseUrl||"https://api.assemblyai.com",e.baseUrl&&e.baseUrl.endsWith("/")&&(e.baseUrl=e.baseUrl.slice(0,-1)),this.files=new ae(e),this.transcripts=new oe(e,this.files),this.lemur=new P(e),this.realtime=new re(e)}}export{ce as AssemblyAI,ae as FileService,P as LemurService,se as RealtimeService,ne as RealtimeServiceFactory,te as RealtimeTranscriber,re as RealtimeTranscriberFactory,oe as TranscriptService};export default null;
//# sourceMappingURL=/sm/8f6a73ba766801da9132288aa1994d174007840805824e85881d16f9d904baf5.map