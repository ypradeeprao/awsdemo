(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{161:function(e,n,t){"use strict";t.r(n);var o=t(0),l=t(15),a=t.n(l),c=t(63),s=t.n(c),i=t(17),r=t.n(i),u=t(31),d=t(64),g=t(65),h=t(70),j=t(69),b=(t(77),t(66)),m=t.n(b).a.create({baseURL:"http:localhost:3000",responseType:"json"}),f=t(67),p=t.n(f),C=t(68),v="https://hot-lizard-29.loca.lt:4001",O=p()(v),x=void 0,S=function(e){Object(h.a)(t,e);var n=Object(j.a)(t);function t(e){var o;return Object(d.a)(this,t),(o=n.call(this,e)).login=Object(u.a)(r.a.mark((function e(){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,m.post(v+"/login",{usernumber:o.state.usernumber}).then((function(e){console.log(e)}));case 2:case"end":return e.stop()}}),e)}))),o.verify=Object(u.a)(r.a.mark((function e(){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:O.emit("sendverifycheck",{usernumber:o.state.usernumber,code:o.state.code,username:o.state.username});case 1:case"end":return e.stop()}}),e)}))),o.handleChange=function(e){console.log(e.target.name);var n=e.target.name;"tophoneno"==n&&o.setState({tophoneno:e.target.value}),"code"==n&&o.setState({code:e.target.value}),"usernumber"==n&&o.setState({usernumber:e.target.value}),"username"==n&&o.setState({username:e.target.value}),console.log(o.state)},o.answerCall=function(e){console.log(e),O.emit("answercall",{callSid:e,client:o.state.username})},o.rejectCall=function(e){O.emit("rejectcall",{callSid:e})},o.disconnectCall=function(e){console.log(e),O.emit("disconnectcall",{callSid:e,client:o.state.username})},o.dialCall=function(){O.emit("dialcall",{phoneno:o.state.tophoneno,client:o.state.username})},o.disconnectOwnCall=function(e){console.log(o.state.dialcallsid),console.log(o.state.username),O.emit("disconnectownCall",{callSid:o.state.dialcallsid,client:o.state.username})},o.connectTwilioClienttoServer=function(e){console.log(e),(x=new C.Device(e,{debug:!0})).on("error",(function(e){console.log(e)})),x.on("incoming",(function(e){console.log("incoming frm twilio"),console.log(e.parameters.CallSid),o.setState({callSid:e.parameters.CallSid}),e.accept()}))},o.state={tophoneno:"",code:"",fromphoneno:"",callstatus:"",callSid:"",username:"",usernumber:"",callconnectionArray:[],dialstatus:"",dialcallsid:""},o}return Object(g.a)(t,[{key:"componentDidMount",value:function(){var e=this;O.on("logintoken",(function(e){console.log("logintoken"+e)})),O.on("twilioclienttoken",(function(n){console.log("twilioclienttoken"),console.log(n),console.log("isverfiied"+n.isverified),e.connectTwilioClienttoServer(n.token)})),O.on("disconnect",(function(){console.log("socket disconnected")})),O.on("call-new",(function(n){var t=n.data;console.log("call connected"),console.log(t),console.log(t.From),console.log(t.To),console.log(t.Direction),console.log(t.Called),console.log(t.CallSid),console.log(t.CallStatus);var o=e.state.callconnectionArray,l=!1;for(var a in o)o[a].fromphoneno==t.From&&(o[a].callstatus="ringing",o[a].callSid=t.CallSid,l=!0);if(0==l){var c={};c.fromphoneno=t.From,c.callstatus="ringing",c.callSid=t.CallSid,o.push(c)}e.setState({callconnectionArray:o})})),O.on("call-inque",(function(n){console.log(" call is in queue"),console.log(n.data),console.log(n.data.CallStatus);var t=e.state.callconnectionArray;for(var o in t)t[o].fromphoneno==n.data.From&&(t[o].callstatus="inqueue");e.setState({callconnectionArray:t})})),O.on("call-answer",(function(n){console.log(" call is in answer"),console.log(n.data),console.log(n.data.CallStatus);var t=e.state.callconnectionArray;for(var o in t)t[o].callSid==n.data.callsid&&(t[o].callstatus="answering",t[o].answeringuser=n.data.client);e.setState({callconnectionArray:t})})),O.on("call-disc",(function(n){console.log(" call disc from twilio server"),console.log(n.data),console.log(n.data.CallStatus),console.log(n.data.Duration);var t=e.state.callconnectionArray;for(var o in t)t[o].fromphoneno==n.data.From&&(t[o].callstatus="disconnected");e.setState({callconnectionArray:t})})),O.on("dialowncall",(function(n){console.log(" dialowncall"),console.log(n.data.CallSid),console.log(n.data.client);e.state.username;e.state.username==n.data.client&&e.setState({dialstatus:"dialing",dialcallsid:n.data.CallSid})}))}},{key:"render",value:function(){var e=this,n=this.state.callconnectionArray,t=[],l=function(l){console.log(n[l]),t.push(Object(o.jsxs)("div",{children:["ringing"==n[l].callstatus?Object(o.jsxs)(o.Fragment,{children:[n[l].fromphoneno," is calling"]}):"","inqueue"==n[l].callstatus?Object(o.jsxs)(o.Fragment,{children:[n[l].fromphoneno," is inqueue"]}):"","disconnected"==n[l].callstatus?Object(o.jsxs)(o.Fragment,{children:[n[l].fromphoneno," is disconnected"]}):"","answering"==n[l].callstatus?Object(o.jsxs)(o.Fragment,{children:[n[l].fromphoneno," is answering by"," ",n[l].answeringuser]}):"",Object(o.jsxs)("div",{children:[Object(o.jsx)("button",{onClick:function(){return e.answerCall(n[l].callSid)},children:"Answer call"}),Object(o.jsx)("button",{onClick:function(){return e.disconnectCall(n[l].callSid)},children:"Disconnect call"}),Object(o.jsx)("button",{onClick:function(){return e.suggestCall(n[l].callSid)},children:"Suggest call"}),Object(o.jsx)("button",{onClick:function(){return e.rejectCall(n[l].callSid)},children:"Reject call"})]})]}))};for(var a in n)l(a);return Object(o.jsxs)("div",{className:"App",children:[Object(o.jsxs)("div",{children:["Myusername ",Object(o.jsx)("input",{name:"username",onChange:this.handleChange}),"Mynumber",Object(o.jsx)("input",{type:"text",name:"usernumber",list:"exampleList",onChange:this.handleChange}),Object(o.jsxs)("datalist",{id:"exampleList",children:[Object(o.jsx)("option",{value:"+15102400591"}),Object(o.jsx)("option",{value:"+1\u202a5107365704\u202c"})]}),Object(o.jsx)("button",{onClick:this.login,name:"usernumber",onChange:this.handleChange,children:"Login"})]}),Object(o.jsx)("br",{}),Object(o.jsxs)("div",{children:["Verify code ",Object(o.jsx)("input",{name:"code",onChange:this.handleChange})," ",Object(o.jsx)("button",{onClick:this.verify,children:"verify"})]}),Object(o.jsx)("br",{}),Object(o.jsxs)("div",{children:["Dialing Numberr",Object(o.jsx)("input",{name:"tophoneno",onChange:this.handleChange}),Object(o.jsx)("button",{onClick:this.dialCall,children:"Dial"}),Object(o.jsx)("button",{onClick:this.disconnectOwnCall,children:"Disconnect call"}),this.state.dialstatus]}),Object(o.jsx)("br",{}),Object(o.jsx)("br",{}),Object(o.jsx)("br",{}),Object(o.jsx)("br",{}),Object(o.jsx)("br",{}),Object(o.jsx)("br",{}),t]})}}]),t}(a.a.Component),w=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,162)).then((function(n){var t=n.getCLS,o=n.getFID,l=n.getFCP,a=n.getLCP,c=n.getTTFB;t(e),o(e),l(e),a(e),c(e)}))};s.a.render(Object(o.jsx)(a.a.StrictMode,{children:Object(o.jsx)(S,{})}),document.getElementById("root")),w()},77:function(e,n,t){}},[[161,1,2]]]);
//# sourceMappingURL=main.d57c99a7.chunk.js.map