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

function wsopen() {
  console.log('socket server opened!');
  socket.send(
    JSON.stringify({
      command: 'subscribe',
      topic: 'TZLOG',
    }),
  );
}
function wsclose(event) {
  console.log('socket server cloded!', event.code, envent.reason);
}
function wserror(e) {
  console.log(e.message);
}
function wsmessage(event) {
  let json;
  try {
    json = JSON.parse(event.data);
  } catch (e) {
    console.log(event.data);
    return;
  }
  try{
    json.message = JSON.parse(json.message);
  } catch (e) {
    console.log("log >", json.message);
    return;
  }
  console.log(json.message);
  if (json.message.subType != 'search') return;
  json.message.parameter = JSON.parse(json.message.parameter);
  const param = json.message.parameter;
  
  if(param.total == 0) {
    procNoTee(json);
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
    console.log('search end:', json.message.golfClubId);
  }
}
function procNoTee(json) {
  const obj = CLUBS[json.message.golfClubId];
  const param = json.message.parameter;
  box.style.cssText = 'background-color: white;';
  box.children[2].innerHTML = '조회: ' + '빈 티 없음';
};
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
  if(param.total > 0) getSchedule();
};
function btnclick() {
  this.disabled = 'disabled';
  this.innerHTML = '조회중';
  const addr = 'http://mnemosynesolutions.co.kr:8080/control';
  console.log(this.club);
  post(
    addr,
    { club: this.club },
    { 'Content-Type': 'application/json' },
    (data) => {
      console.log(data);
      this.disabled = false;
      this.innerHTML = 'search';
    },
  );
}
function timer() {
  count = boxes.children.length - 1;
  getSchedule();
  /* const t = setInterval(() => {
    log('timer');
    count = boxes.children.length - 1;
    getSchedule();
  }, 1000 * 10); */
}
function getSchedule() {
  const lmt = boxes.children.length - 1;
  const box = boxes.children[lmt - count];
  const club_id = box.id;
  const addr = ADDR_HEADER + '/api/reservation/getSchedule';
  post(
    addr,
    { golf_club_id: club_id },
    { 'Content-Type': 'application/json' },
    (data) => {
      const result = JSON.parse(data);
      const time = new Date() - new Date(result.timeStamp);
      let tDate = time.ago();
      if (!tDate) tDate = '조회불가';
      box.children[2].innerHTML = '조회: ' + tDate;
      box.style.cssText = 'background-color:' + time.getColor();
      count--;
      if (count < 0) return;
      getSchedule();
    },
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
      btn.onclick = btnclick;

      obj.BOX = box;
      obj.button = btn;
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
