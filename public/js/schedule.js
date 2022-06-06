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
const ADDR_HEADER = 'http://dev.mnemosyne.co.kr:1006';
setClubs();

selClubs.onchange = function () {
  const info = JSON.parse(this.value);
  elAddr.innerHTML = info.address;
  elCorpNum.innerHTML = info.corp_reg_number;
  elPhone.innerHTML = info.phone;
  elEmail.innerHTML = info.email;
  btnSearch.onclick();
};
btnSearch.onclick = function () {
  const addr = ADDR_HEADER + '/api/reservation/getSchedule';
  const info = JSON.parse(selClubs.value);
  post(
    addr,
    { golf_club_id: info.id },
    { 'Content-Type': 'application/json' },
    (data) => {
      const result = JSON.parse(data);
      const tDate = new Date(result.timeStamp);
      elLastUpdated.innerHTML = new Date(tDate.setHours(tDate.getHours() + 0));
      mkTable(result.schedule);
    },
  );
};
function mkTable(schedule) {
  divMain.innerHTML = '';
  Object.keys(schedule).forEach((date) => {
    const elDate = document.createElement("div");
    divMain.appendChild(elDate);
    divMain.style.paddingLeft = 120 + 'px';
    elDate.innerHTML=date;
    elDate.style.marginTop = 20 + 'px';
    
    const obDate = schedule[date];
    Object.keys(obDate).sort().forEach((course) => {
      const elCourse = document.createElement("div");
      elDate.appendChild(elCourse);
      elCourse.innerHTML=course;
      elCourse.style.paddingLeft = 10 + 'px';
      elCourse.style.marginTop = 10 + 'px';
      
      const obCourse = obDate[course];
      Object.keys(obCourse).sort().forEach((timeSlot) => {
        const elTimeSlot = document.createElement("div");
        elCourse.appendChild(elTimeSlot);
        elTimeSlot.innerHTML=timeSlot;
        elTimeSlot.style.paddingLeft = 10 + 'px';

        const arTimeSlot = obCourse[timeSlot];
        arTimeSlot.forEach((ob) => {
          const elTime = document.createElement("span");
          elTimeSlot.appendChild(elTime);
          elTime.innerHTML=ob.time.ct(3);
          elTime.style.paddingLeft = 10 + 'px';
        });
      });
    });
  });
};
function setClubs() {
  const addr = ADDR_HEADER + '/api/reservation/getGolfClubs';
  post(addr, {}, { 'Content-Type': 'application/json' }, (data) => {
    const result = JSON.parse(data);
    
    selClubs.innerHTML = '';
    result.golfClubs.sort((a, b) => { 
      if(a.name > b.name) return 1;
      if(a.name < b.name) return -1;
      return 0;
    });

    dir(result.golfClubs);

    result.golfClubs.forEach((obj) => {
      const opt = document.createElement('option');
      selClubs.appendChild(opt);
      opt.value = JSON.stringify(obj);
      opt.innerHTML = obj.name;
    });
    selClubs.onchange();
  });
}
