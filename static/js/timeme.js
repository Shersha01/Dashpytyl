(()=>{((e,t)=>"undefined"!=typeof module&&module.exports?module.exports=t():"function"==typeof define&&define.amd?void define([],()=>e.TimeMe=t()):e.TimeMe=t())(this,()=>{let e={startStopTimes:{},idleTimeoutMs:3e4,currentIdleTimeMs:0,checkIdleStateRateMs:250,isUserCurrentlyOnPage:!0,isUserCurrentlyIdle:!1,currentPageName:"default-page-name",timeElapsedCallbacks:[],userLeftCallbacks:[],userReturnCallbacks:[],trackTimeOnElement:t=>{let s=document.getElementById(t);s&&(s.addEventListener("mouseover",()=>{e.startTimer(t)}),s.addEventListener("mousemove",()=>{e.startTimer(t)}),s.addEventListener("mouseleave",()=>{e.stopTimer(t)}),s.addEventListener("keypress",()=>{e.startTimer(t)}),s.addEventListener("focus",()=>{e.startTimer(t)}))},getTimeOnElementInSeconds:t=>{let s=e.getTimeOnPageInSeconds(t);return s||0},startTimer:(t,s)=>{if(t||(t=e.currentPageName),void 0===e.startStopTimes[t])e.startStopTimes[t]=[];else{let s=e.startStopTimes[t],n=s[s.length-1];if(void 0!==n&&void 0===n.stopTime)return}e.startStopTimes[t].push({startTime:s||new Date,stopTime:void 0})},stopAllTimers:()=>{let t=Object.keys(e.startStopTimes);for(let s=0;s<t.length;s++)e.stopTimer(t[s])},stopTimer:(t,s)=>{t||(t=e.currentPageName);let n=e.startStopTimes[t];void 0!==n&&0!==n.length&&void 0===n[n.length-1].stopTime&&(n[n.length-1].stopTime=s||new Date)},getTimeOnCurrentPageInSeconds:()=>e.getTimeOnPageInSeconds(e.currentPageName),getTimeOnPageInSeconds:t=>{let s=e.getTimeOnPageInMilliseconds(t);return void 0===s?void 0:s/1e3},getTimeOnCurrentPageInMilliseconds:()=>e.getTimeOnPageInMilliseconds(e.currentPageName),getTimeOnPageInMilliseconds:t=>{let s=0,n=e.startStopTimes[t];if(void 0===n)return;let i=0;for(let e=0;e<n.length;e++){let t=n[e].startTime,s=n[e].stopTime;void 0===s&&(s=new Date),i+=s-t}return s=Number(i)},getTimeOnAllPagesInSeconds:()=>{let t=[],s=Object.keys(e.startStopTimes);for(let n=0;n<s.length;n++){let i=s[n],r=e.getTimeOnPageInSeconds(i);t.push({pageName:i,timeOnPage:r})}return t},setIdleDurationInSeconds:t=>{let s=parseFloat(t);if(!1!==isNaN(s))throw{name:"InvalidDurationException",message:"An invalid duration time ("+t+") was provided."};e.idleTimeoutMs=1e3*t},setCurrentPageName:t=>{e.currentPageName=t},resetRecordedPageTime:t=>{delete e.startStopTimes[t]},resetAllRecordedPageTimes:()=>{let t=Object.keys(e.startStopTimes);for(let s=0;s<t.length;s++)e.resetRecordedPageTime(t[s])},userActivityDetected:()=>{e.isUserCurrentlyIdle&&e.triggerUserHasReturned(),e.resetIdleCountdown()},resetIdleCountdown:()=>{e.isUserCurrentlyIdle=!1,e.currentIdleTimeMs=0},callWhenUserLeaves:(t,s)=>{e.userLeftCallbacks.push({callback:t,numberOfTimesToInvoke:s})},callWhenUserReturns:(t,s)=>{e.userReturnCallbacks.push({callback:t,numberOfTimesToInvoke:s})},triggerUserHasReturned:()=>{if(!e.isUserCurrentlyOnPage){e.isUserCurrentlyOnPage=!0,e.resetIdleCountdown();for(let t=0;t<e.userReturnCallbacks.length;t++){let s=e.userReturnCallbacks[t],n=s.numberOfTimesToInvoke;(isNaN(n)||void 0===n||n>0)&&(s.numberOfTimesToInvoke-=1,s.callback())}}e.startTimer()},triggerUserHasLeftPageOrGoneIdle:()=>{if(e.isUserCurrentlyOnPage){e.isUserCurrentlyOnPage=!1;for(let t=0;t<e.userLeftCallbacks.length;t++){let s=e.userLeftCallbacks[t],n=s.numberOfTimesToInvoke;(isNaN(n)||void 0===n||n>0)&&(s.numberOfTimesToInvoke-=1,s.callback())}}e.stopAllTimers()},callAfterTimeElapsedInSeconds:(t,s)=>{e.timeElapsedCallbacks.push({timeInSeconds:t,callback:s,pending:!0})},checkIdleState:()=>{for(let t=0;t<e.timeElapsedCallbacks.length;t++)e.timeElapsedCallbacks[t].pending&&e.getTimeOnCurrentPageInSeconds()>e.timeElapsedCallbacks[t].timeInSeconds&&(e.timeElapsedCallbacks[t].callback(),e.timeElapsedCallbacks[t].pending=!1);!1===e.isUserCurrentlyIdle&&e.currentIdleTimeMs>e.idleTimeoutMs?(e.isUserCurrentlyIdle=!0,e.triggerUserHasLeftPageOrGoneIdle()):e.currentIdleTimeMs+=e.checkIdleStateRateMs},visibilityChangeEventName:void 0,hiddenPropName:void 0,listenForVisibilityEvents:(t,s)=>{t&&e.listenForUserLeavesOrReturnsEvents(),s&&e.listForIdleEvents()},listenForUserLeavesOrReturnsEvents:()=>{void 0!==document.hidden?(e.hiddenPropName="hidden",e.visibilityChangeEventName="visibilitychange"):void 0!==document.mozHidden?(e.hiddenPropName="mozHidden",e.visibilityChangeEventName="mozvisibilitychange"):void 0!==document.msHidden?(e.hiddenPropName="msHidden",e.visibilityChangeEventName="msvisibilitychange"):void 0!==document.webkitHidden&&(e.hiddenPropName="webkitHidden",e.visibilityChangeEventName="webkitvisibilitychange")},listForIdleEvents:()=>{document.addEventListener("mousemove",()=>{e.userActivityDetected()}),document.addEventListener("keyup",()=>{e.userActivityDetected()}),document.addEventListener("touchstart",()=>{e.userActivityDetected()}),window.addEventListener("scroll",()=>{e.userActivityDetected()}),setInterval(()=>{!0!==e.isUserCurrentlyIdle&&e.checkIdleState()},e.checkIdleStateRateMs)},websocket:void 0,websocketHost:void 0,setUpWebsocket:t=>{if(window.WebSocket&&t){let s=t.websocketHost;try{e.websocket=new WebSocket(s),window.onbeforeunload=(()=>{e.sendCurrentTime(t.appId)}),e.websocket.onopen=(()=>{e.sendInitWsRequest(t.appId)}),e.websocket.onerror=(e=>{console&&console.log("Error occurred in websocket connection: "+e)}),e.websocket.onmessage=(e=>{console&&console.log(e.data)})}catch(e){console&&console.error("Failed to connect to websocket host.  Error:"+e)}}},websocketSend:t=>{e.websocket.send(JSON.stringify(t))},sendCurrentTime:t=>{let s={type:"INSERT_TIME",appId:t,timeOnPageMs:e.getTimeOnCurrentPageInMilliseconds(),pageName:e.currentPageName};e.websocketSend(s)},sendInitWsRequest:t=>{let s={type:"INIT",appId:t};e.websocketSend(s)},initialize:t=>{let s=e.idleTimeoutMs||30,n=e.currentPageName||"default-page-name",i=void 0,r=void 0,a=!0,o=!0;t&&(s=t.idleTimeoutInSeconds||s,n=t.currentPageName||n,i=t.websocketOptions,r=t.initialStartTime,!1===t.trackWhenUserLeavesPage&&(a=!1),!1===t.trackWhenUserGoesIdle&&(o=!1)),e.setIdleDurationInSeconds(s),e.setCurrentPageName(n),e.setUpWebsocket(i),e.listenForVisibilityEvents(a,o),e.startTimer(void 0,r)}};return e})}).call(this);