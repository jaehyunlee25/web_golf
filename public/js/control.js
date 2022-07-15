/* eslint-disable no-useless-concat */
/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-extend-native */
/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */
/* eslint-disable new-cap */
/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prefer-template */

// const cf = new jCommon();

const CLUBS = {};
const ADDR_HEADER = 'http://dev.mnemosyne.co.kr:1006';
const WS_HEADER = 'ws://dev.mnemosyne.co.kr:9001';
const socket = new WebSocket(WS_HEADER);
socket.onopen = wsopen;
socket.onmessage = wsmessage;
socket.onclose = wsclose;
socket.onerror = wserror;
let count = 0;

setClubs();

btnAdd.onclick = function() {
  window.open("newClub.html");
};
function wsopen() {
  console.log('socket server opened!');
  socket.send(
    JSON.stringify({
      command: 'subscribe',
      topic: 'TZLOG',
    }),
  );
  socket.send(
    JSON.stringify({
      command: 'subscribe',
      topic: 'TZ_ANDROID_LOG',
    }),
  );
}
function wsclose(event) {
  console.log('socket server cloded!', event.code, event.reason);
}
function wserror(e) {
  console.log(e.message);
}
function wsmessage(event) {
  let json;
  try {
    json = JSON.parse(event.data);
  } catch (e) {
    procMessage(event.data);
    return;
  }
  try {
    json.message = JSON.parse(json.message);
  } catch (e) {
    procMessage(json.message);
    return;
  }
  
  if (json.message.subType != 'search') {
    if(typeof json.message == 'string') {
      procMessage(json.message);
    }else if(json.message.subType == 'login') {
      procMessage("subType" + ": " + json.message.subType);
      procMessage("deviceId" + ": " + json.message.deviceId);
      procMessage("deviceToken" + ": " + json.message.deviceToken);
      procMessage("golf_club" + ": " + json.message.golfClubId);
      procMessage("ip" + ": " + json.message.ip);
      procMessage("message" + ": " + json.message.message);
    } else {
      Object.keys(json.message).forEach(key => {
        procMessage(key + ": " + json.message[key]);
      });
    }
    return;
  }
  // console.log(json.message);
  json.message.parameter = JSON.parse(json.message.parameter);
  const param = json.message.parameter;
  procMessage("subType" + ": " + json.message.subType);
  procMessage("deviceId" + ": " + json.message.deviceId);
  procMessage("deviceToken" + ": " + json.message.deviceToken);
  procMessage("golf_club" + ": " + json.message.golfClubId);
  procMessage("ip" + ": " + json.message.ip);
  procMessage("message" + ": " + json.message.message);
  procMessage("total" + ": " + param.total);
  procMessage("order" + ": " + param.order);
  procMessage("date" + ": " + param.date);

  if (param.total == 0) {
    procNoTee(json);
    return;
  }
  if (param.order == param.total) {
    const addr = ADDR_HEADER + '/api/reservation/getSchedule';
    setTimeout(() => {
      post(
        addr,
        { golf_club_id: json.message.golfClubId },
        { 'Content-Type': 'application/json' },
        (data) => {
          procWSData(data, json);
        },
      );
    }, 1000);
    // console.log('search end:', json.message.golfClubId);
  }
}
function procMessage(data) {
  const div = bulletin.add("div");
  div.innerHTML = "> " + data;
  bulletin.scrollTop = bulletin.scrollHeight;
  if(bulletin.children.length > 500) bulletin.removeChild(bulletin.children[0]);
};
function procNoTee(json) {
  const obj = CLUBS[json.message.golfClubId];
  const param = json.message.parameter;
  const box = obj.BOX;
  box.style.cssText = 'background-color: white;';
  box.children[2].innerHTML = '조회: 빈 티 없음';
}
function procWSData(data, json) {
  const obj = CLUBS[json.message.golfClubId];
  const param = json.message.parameter;
  const result = JSON.parse(data);
  const time = new Date() - new Date(result.timeStamp);
  const box = obj.BOX;
  let tDate = time.ago();
  if (!tDate) tDate = '조회불가';
  box.children[2].innerHTML = '조회: ' + tDate;
  box.style.cssText = 'background-color:' + time.getColor();
  count--;
  if (count < 0) return;
  if (param.total > 0) getSchedule();
}
function btnclick() {
  getSchedule(this.club_id, result => {
    const box = CLUBS[this.club_id].BOX;
    if(result.resultCode === 400) {
      box.children[2].innerHTML = '조회: 결과없음';
      box.style.cssText = 'background-color: white;';
      return;
    }
    const time = new Date() - new Date(result.timeStamp);
    let tDate = time.ago();
    if (!tDate) tDate = '조회불가';
    box.children[2].innerHTML = '조회: ' + tDate;
    box.style.cssText = 'background-color:' + time.getColor();
    
  });
}
function controlclick() {
  const addr = "http://mnemosynesolutions.co.kr:8080/control";
  const header = { 'Content-Type': 'application/json' };
  post(addr, { club: this.club }, header, (data) => { console.log(data) });
}
function timer() {
  Object.keys(CLUBS).forEach(club_id => {
    const obj = CLUBS[club_id];
    obj.button.click();
  });
}
function getSchedule(golf_club_id, callback) {
  const club_id = golf_club_id;
  const addr = ADDR_HEADER + '/api/reservation/getSchedule';
  post(
    addr,
    { golf_club_id: club_id },
    { 'Content-Type': 'application/json' },
    (data) => {
      if(callback) callback(JSON.parse(data));
    }
  );    
}
function setClubs() {
  const addr = ADDR_HEADER + '/api/reservation/getGolfClubs';
  post(addr, {}, { 'Content-Type': 'application/json' }, (data) => {
    const result = JSON.parse(data);

    result.golfClubs.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

    dir(result.golfClubs);

    result.golfClubs.forEach((obj) => {
      CLUBS[obj.id] = obj;
      const box = boxes.add('div');
      box.className = 'box';
      box.id = obj.id;
      box.obj = obj;

      const name = box.add('div');
      name.className = 'name';
      name.innerHTML = obj.name;

      const reg = box.add('div');
      reg.className = 'reg';
      reg.innerHTML = '등록: ' + (new Date() - new Date(obj.created_at)).ago();

      const last = box.add('div');
      last.className = 'reg';
      last.innerHTML = '조회: ';

      const btnCover = box.add('div');
      btnCover.style.textAlign = 'center';
      const btn = btnCover.add('button');
      btn.innerHTML = 'search';
      btn.club = obj.eng_id;
      btn.club_id = obj.id;
      btn.onclick = btnclick;
      
      obj.BOX = box;
      obj.button = btn;

      const btnControl = btnCover.add('button');
      btnControl.innerHTML = 'control';
      btnControl.club = obj.eng_id;
      btnControl.club_id = obj.id;
      btnControl.onclick = controlclick;

      const btnEdit = btnCover.add('button');
      btnEdit.innerHTML = 'editor';
      btnEdit.club = obj.eng_id;
      btnEdit.club_id = obj.id;
      btnEdit.onclick = () => {
        window.open('editor.html?club_id=' + obj.id);
      };

    });
    timer();
  });
}
Number.prototype.getColor = function () {
  const cf = new jCommon();
  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const min = 1000 * 60;
  if (this > day) {
    return 'firebrick';
  } else if (this > hour) {
    return 'lightgreen';
  } else if (this > min) {
    return 'greenyellow';
  } else if (this <= min) {
    return 'greenyellow';
  } else {
    return 'red';
  }
};
Number.prototype.ago = function () {
  const cf = new jCommon();
  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const min = 1000 * 60;
  if (this > day) {
    return cf.rommify(this / day, 0) + ' 일 전';
  } else if (this > hour) {
    return cf.rommify(this / hour, 0) + ' 시간 전';
  } else if (this > min) {
    return cf.rommify(this / min, 0) + ' 분 전';
  } else if (this <= min) {
    return cf.rommify(this / 1000, 0) + ' 초 전';
  }
};
HTMLElement.prototype.add = function (tag) {
  const elm = document.createElement(tag);
  this.appendChild(elm);
  return elm;
};
