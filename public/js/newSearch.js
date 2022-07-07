/* eslint-disable no-self-assign */
/* eslint-disable no-restricted-globals */
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
const cf = new jCommon();
const ADDR_HEADER = 'http://dev.mnemosyne.co.kr:1006';
const addr = ADDR_HEADER + '/api/reservation/getGolfClubSearchInfo';
post(
    addr,
    { },
    { 'Content-Type': 'application/json' },
    (data) => {
        const result = JSON.parse(data);
        mkTable(result.golfClubs);
    }
);
function mkTable(result){
    dir(result);
    result.forEach((obj, i) => {
        const tr = tblSearch.add('tr');
        let flg = false;
        const ipts = [];
        const tdd = tr.add("td");
        const td = tdd.add('div');
        td.innerHTML = i + 1;
        Object.keys(obj).forEach(key => {
            if(key == 'created_at' || key == 'updated_at') return;
            const val = obj[key];
            const tdd = tr.add("td");
            const td = tdd.add('div');
            td.innerHTML = val;
            let ipt;
            if(key == 'eng_id') tdd.style.textAlign = 'center';
            if(key == 'homepage' || key == 'mobile'){
                td.style.width = 450 + "px";
                if(val != null){
                    td.innerHTML = '';
                    const a = td.add('a');
                    a.href = val;
                    a.innerHTML = val;
                    a.target = '_blank';
                    td.style.textAlign = 'left';
                }
            }
            if(val == null || val == "") {
                ipt = td.add("input");
                ipt.style.width = '90%';
                ipt.name = key;
                flg = true;
                ipts.push(ipt);
            }
        });
        const btnTd = tr.add('td');
        if(flg) {
            const btn = btnTd.add('button');
            btn.innerHTML = '입력';
            btn.param = obj;
            btn.ipts = ipts;
            btn.style.width = '80px';
            btn.onclick = btnclick;
        }

        const editTd = tr.add('td');
        const btnEdit = editTd.add('button');
        btnEdit.innerHTML = '편집';
        btnEdit.param = obj;
        btnEdit.ipts = ipts;
        btnEdit.style.width = '80px';
        btnEdit.onclick = btnEditclick;
    });
};
function btnEditclick() {
  window.open("editor.html?club_id=" + this.param.id);
};
function btnclick() {
    dir(this.ipts);
    const self = this;
    this.ipts.forEach(ipt => {
        this.param[ipt.name] = ipt.value;
    });
    
    dir(this.param);
    const addr = ADDR_HEADER + '/api/reservation/setGolfClubSearchInfo';
    post(
        addr,
        this.param,
        { 'Content-Type': 'application/json' },
        (data) => {
            const result = JSON.parse(data);
            dir(result);
            // location.href = location.href;
            self.ipts.forEach(ipt => {
                if(ipt.value) ipt.parentNode.innerHTML = ipt.value;
            });
        }
    );
};
HTMLElement.prototype.add = function(tagName){
    const el = document.createElement(tagName);
    this.appendChild(el);
    return el;
};