/* eslint-disable no-shadow */
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
String.prototype.proc = function() {
  return this.replaceAll('\r', '');
};
const cf = new jCommon();
const ADDR_HEADER = 'http://dev.mnemosyne.co.kr:1006';
const WS_HEADER = 'ws://dev.mnemosyne.co.kr:9001';

// eslint-disable-next-line camelcase
const golf_club_id = cf.getGet().club_id;
getGolfClub(golf_club_id, (data) => {
  const engName = data;
  console.dir(data);
  return;
  post(
    "http://mnemosynesolutions.co.kr:8080/get_pure_search_core", 
    { club: 'tgv_KMH' }, 
    {'Content-Type': 'application/json'}, 
    data => {
      const json = JSON.parse(data);
      dir(json);
      taMneCall.value = json.part.mneCall.proc();
      taMneCallDetail.value = json.part.mneCallDetail.proc();
      taFunction.value = json.part.function.proc();
      taCommand.value = json.part.command.proc();
    }
  );
});
btnSubmit.onclick = function() {
  const part = {
    mneCall: "",
    mneCallDetail: "",
    function: "",
    command: "",
  };
  part.mneCall = taMneCall.value.proc();
  part.mneCallDetail = taMneCallDetail.value.proc();
  part.function = taFunction.value.proc();
  part.command = taCommand.value.proc();
  post(
    "http://mnemosynesolutions.co.kr:8080/set_pure_search_core", 
    { club: 'tgv_KMH', part }, 
    {'Content-Type': 'application/json'}, 
    data => {
      log(data);
    }
  );
};
function getGolfClub(golf_club_id, callback) {
  const addr = ADDR_HEADER + '/api/reservation/getGolfClub';
  post(
    addr,
    { golf_club_id },
    { 'Content-Type': 'application/json' },
    (data) => {
      if(callback) callback(JSON.parse(data));
    }
  );
};
function getSchedule(golf_club_id, callback) {
  const addr = ADDR_HEADER + '/api/reservation/getSchedule';
  post(
    addr,
    { golf_club_id },
    { 'Content-Type': 'application/json' },
    (data) => {
      if(callback) callback(JSON.parse(data));
    }
  );    
}
