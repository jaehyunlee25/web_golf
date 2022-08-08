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
let engName;
getGolfClub(golf_club_id, (data) => {
  elClubName.innerHTML = data.name + "::" + data.eng_id;
  engName = data.eng_id;
  post(
    "http://dev.mnemosyne.co.kr:1009/get_pure_search_core", 
    { club: engName }, 
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
    "http://dev.mnemosyne.co.kr:1009/set_pure_search_core", 
    { club: engName, part }, 
    {'Content-Type': 'application/json'}, 
    data => {
      log(data);
    }
  );
};
function getGolfClub(golf_club_id, callback) {
  const addr = ADDR_HEADER + '/api/reservation/getGolfClubs';
  post(
    addr,
    { golf_club_id },
    { 'Content-Type': 'application/json' },
    (data) => {
      const json = JSON.parse(data);
      json.golfClubs.forEach(club => {
        if(club.id == golf_club_id) if(callback) callback(club);
      });
      
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
