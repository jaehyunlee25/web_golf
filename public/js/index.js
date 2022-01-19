/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */
/* eslint-disable new-cap */
/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prefer-template */
const cf = new jCommon();
const ADDR_HEADER = 'http://dev.mnemosyne.co.kr:1006';
setClubs();

selClubs.onchange = function () {
  const info = JSON.parse(this.value);
  elAddr.innerHTML = info.address;
  elCorpNum.innerHTML = info.corp_reg_number;
  elPhone.innerHTML = info.phone;
  elEmail.innerHTML = info.email;
};
btnSearch.onclick = function () {
  const addr = ADDR_HEADER + '/api/reservation/getClubInfo';
  const info = JSON.parse(selClubs.value);
  post(
    addr,
    { golf_club_id: info.id },
    { 'Content-Type': 'application/json' },
    (data) => {
      const result = JSON.parse(data);
      const res = [['date', 'time_slot', 'course_name', 'teams', 'green_fee']];
      result.info.forEach((obj) => {
        const { date, time_slot, course_name, teams, green_fee } = obj;
        res.push([
          date.gh(10),
          time_slot,
          course_name,
          teams,
          cf.commify(green_fee),
        ]);
      });
      makeTable(res);
      // alert('예약 정보를 성공적으로 조회하였습니다.');
    },
  );
};
function makeTable(res) {
  tblMain.innerHTML = '';
  let prev;
  res.forEach((arr, i) => {
    const tr = document.createElement('tr');
    tblMain.appendChild(tr);
    let date_flg = false;
    let time_flg = false;
    arr.forEach((el, j) => {
      const td = document.createElement('td');
      tr.appendChild(td);
      td.style.padding = '5px';
      if (i === 0) {
        td.style.textAlign = 'center';
        td.style.backgroundColor = '#eee';
      }
      if (j === 3 || j === 4) td.style.textAlign = 'right';
      else td.style.textAlign = 'center';

      if (i > 1 && j === 0 && el !== prev[j]) date_flg = true;
      if (i > 1 && j === 1 && el !== prev[j]) time_flg = true;

      td.innerHTML = el;
    });
    
    if (date_flg)
      [...tr.children].forEach((tdd) => {
        tdd.style.borderTop = '1px solid gray';
      });

    if (time_flg)
      [...tr.children].forEach((tdd, k) => {
        if (k > 0) tdd.style.borderTop = '1px solid gray';
      });

    if (i > 0) prev = arr;
  });
}
function setClubs() {
  const addr = ADDR_HEADER + '/api/reservation/getGolfClubs';
  post(addr, {}, { 'Content-Type': 'application/json' }, (data) => {
    const result = JSON.parse(data);
    dir(result);
    selClubs.innerHTML = '';
    result.golfClubs.forEach((obj) => {
      const opt = document.createElement('option');
      selClubs.appendChild(opt);
      opt.value = JSON.stringify(obj);
      opt.innerHTML = obj.name;
    });
    selClubs.onchange();
  });
}
