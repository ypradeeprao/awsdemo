import "./App.css";
import React from "react";
import axios from "./Axios";
//import socket from "./Socketio";
import socketIOClient from "socket.io-client";
import * as Twilio from "twilio-client";
const ENDPOINT = "http://127.0.0.1:4001";
//const ENDPOINT = "https://hot-lizard-29.loca.lt:4001";
const socket = socketIOClient(ENDPOINT);
let device = undefined;
//JSON.parse(localStorage.getItem("token"));
//localStorage.setItem("token", JSON.stringify("Smith"));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tophoneno: "",
      code: "",
      fromphoneno: "",
      callstatus: "",
      callSid: "",
      username: "",
      usernumber: "",
      callconnectionArray: [],
      dialstatus: "",
      dialcallsid: "",
    };
  }

  componentDidMount() {
    socket.on("logintoken", (data) => {
      console.log("logintoken" + data);
    });

    socket.on("twilioclienttoken", (data) => {
      console.log("twilioclienttoken");
      console.log(data);
      console.log("isverfiied" + data.isverified);
      this.connectTwilioClienttoServer(data.token);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
    socket.on("call-new", (req) => {
      let data = req.data;
      console.log("call connected");
      console.log(data);
      console.log(data.From);
      console.log(data.To);
      console.log(data.Direction);
      console.log(data.Called);
      console.log(data.CallSid);
      console.log(data.CallStatus);

      let callconnectionArray = this.state.callconnectionArray;
      let isexistingcall = false;
      for (let i in callconnectionArray) {
        if (callconnectionArray[i].fromphoneno == data.From) {
          callconnectionArray[i].callstatus = "ringing";
          callconnectionArray[i].callSid = data.CallSid;
          isexistingcall = true;
        }
      }
      if (isexistingcall == false) {
        let callconnection = {};
        callconnection.fromphoneno = data.From;
        callconnection.callstatus = "ringing";
        callconnection.callSid = data.CallSid;
        callconnectionArray.push(callconnection);
      }

      this.setState({ callconnectionArray: callconnectionArray });
    });

    socket.on("call-inque", (req) => {
      console.log(" call is in queue");
      console.log(req.data);
      console.log(req.data.CallStatus);
      let callconnectionArray = this.state.callconnectionArray;
      for (let i in callconnectionArray) {
        if (callconnectionArray[i].fromphoneno == req.data.From) {
          callconnectionArray[i].callstatus = "inqueue";
        }
      }
      this.setState({ callconnectionArray: callconnectionArray });
    });

    socket.on("call-answer", (req) => {
      console.log(" call is in answer");
      console.log(req.data);
      console.log(req.data.CallStatus);
      let callconnectionArray = this.state.callconnectionArray;
      for (let i in callconnectionArray) {
        if (callconnectionArray[i].callSid == req.data.callsid) {
          callconnectionArray[i].callstatus = "answering";
          callconnectionArray[i].answeringuser = req.data.client;
        }
      }
      this.setState({ callconnectionArray: callconnectionArray });
    });

    socket.on("call-disc", (req) => {
      console.log(" call disc from twilio server");
      console.log(req.data);
      console.log(req.data.CallStatus);
      console.log(req.data.Duration);

      let callconnectionArray = this.state.callconnectionArray;
      for (let i in callconnectionArray) {
        if (callconnectionArray[i].fromphoneno == req.data.From) {
          callconnectionArray[i].callstatus = "disconnected";
        }
      }
      this.setState({ callconnectionArray: callconnectionArray });
    });

    socket.on("dialowncall", (req) => {
      console.log(" dialowncall");
      console.log(req.data.CallSid);
      console.log(req.data.client);
      let callconnectionArray = this.state.username;
      if (this.state.username == req.data.client) {
        this.setState({ dialstatus: "dialing", dialcallsid: req.data.CallSid });
      }
    });
  }

  login = async () => {
    await axios
      .post(ENDPOINT + "/login", {
        usernumber: this.state.usernumber,
      })
      .then((res) => {
        console.log(res);
      });
  };

  verify = async () => {
    socket.emit("sendverifycheck", {
      usernumber: this.state.usernumber,
      code: this.state.code,
      username: this.state.username,
    });

    // let res = await axios
    //   .post("http://localhost:4001/sendverifycheck", {
    //     phone: this.state.usernumber,
    //     code: this.state.code,
    //   })
    //   .then((res) => {
    //     console.log(JSON.stringify(res));
    //    // socket.emit("gettwilioclienttoken", { username: this.state.username });
    //     return res;
    //   });
    // console.log(JSON.stringify(res));
  };

  handleChange = (e) => {
    console.log(e.target.name);
    let x = e.target.name;
    if (x == "tophoneno") {
      this.setState({ tophoneno: e.target.value });
    }
    if (x == "code") {
      this.setState({ code: e.target.value });
    }
    if (x == "usernumber") {
      this.setState({ usernumber: e.target.value });
    }
    if (x == "username") {
      this.setState({ username: e.target.value });
    }

    console.log(this.state);
  };

  answerCall = (x) => {
    console.log(x);
    socket.emit("answercall", {
      callSid: x,
      client: this.state.username,
    });
  };

  rejectCall = (x) => {
    socket.emit("rejectcall", { callSid: x });
  };

  disconnectCall = (x) => {
    console.log(x);
    socket.emit("disconnectcall", {
      callSid: x,
      client: this.state.username,
    });
  };

  dialCall = () => {
    socket.emit("dialcall", {
      phoneno: this.state.tophoneno,
      client: this.state.username,
    });
  };

  disconnectOwnCall = (x) => {
    console.log(this.state.dialcallsid);
    console.log(this.state.username);
    socket.emit("disconnectownCall", {
      callSid: this.state.dialcallsid,
      client: this.state.username,
    });
  };

  connectTwilioClienttoServer = (twilioClientToken) => {
    console.log(twilioClientToken);
    device = new Twilio.Device(twilioClientToken, { debug: true });
    device.on("error", (err) => {
      console.log(err);
    });
    device.on("incoming", (connection) => {
      console.log("incoming frm twilio");
      console.log(connection.parameters.CallSid);
      this.setState({ callSid: connection.parameters.CallSid });
      connection.accept();
    });
  };

  render() {
    let { callconnectionArray } = this.state;
    let callconnectionArrayHtml = [];
    for (let i in callconnectionArray) {
      console.log(callconnectionArray[i]);
      callconnectionArrayHtml.push(
        <div>
          {callconnectionArray[i].callstatus == "ringing" ? (
            <>{callconnectionArray[i].fromphoneno} is calling</>
          ) : (
            ""
          )}
          {callconnectionArray[i].callstatus == "inqueue" ? (
            <>{callconnectionArray[i].fromphoneno} is inqueue</>
          ) : (
            ""
          )}
          {callconnectionArray[i].callstatus == "disconnected" ? (
            <>{callconnectionArray[i].fromphoneno} is disconnected</>
          ) : (
            ""
          )}
          {callconnectionArray[i].callstatus == "answering" ? (
            <>
              {callconnectionArray[i].fromphoneno} is answering by{" "}
              {callconnectionArray[i].answeringuser}
            </>
          ) : (
            ""
          )}
          <div>
            <button
              onClick={() => this.answerCall(callconnectionArray[i].callSid)}
            >
              Answer call
            </button>
            <button
              onClick={() =>
                this.disconnectCall(callconnectionArray[i].callSid)
              }
            >
              Disconnect call
            </button>
            <button
              onClick={() => this.suggestCall(callconnectionArray[i].callSid)}
            >
              Suggest call
            </button>
            <button
              onClick={() => this.rejectCall(callconnectionArray[i].callSid)}
            >
              Reject call
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="App">
        <div>
          Myusername <input name="username" onChange={this.handleChange} />
          Mynumber
          <input
            type="text"
            name="usernumber"
            list="exampleList"
            onChange={this.handleChange}
          />
          <datalist id="exampleList">
            <option value="+15102400591" />
            <option value="+1‪5107365704‬" />
          </datalist>
          <button
            onClick={this.login}
            name="usernumber"
            onChange={this.handleChange}
          >
            Login
          </button>
        </div>
        <br />
        <div>
          Verify code <input name="code" onChange={this.handleChange} />{" "}
          <button onClick={this.verify}>verify</button>
        </div>
        <br />
        <div>
          Dialing Number
          <input name="tophoneno" onChange={this.handleChange} />
          <button onClick={this.dialCall}>Dial</button>
          <button onClick={this.disconnectOwnCall}>Disconnect call</button>
          {this.state.dialstatus}
        </div>
        <br />

        <br />
        <br />
        <br />
        <br />
        <br />
        {callconnectionArrayHtml}
      </div>
    );
  }
}

export default App;
