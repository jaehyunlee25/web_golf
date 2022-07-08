/* eslint-disable no-script-url */
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
let accounts;
post(
    addr,
    { },
    { 'Content-Type': 'application/json' },
    (data) => {
        const result = JSON.parse(data);
        mkTable(result.golfClubs);
    }
);
post(
    "http://mnemosynesolutions.co.kr:8080/account",
    { },
    { 'Content-Type': 'application/json' },
    (data) => {
        accounts = JSON.parse(data).accounts;
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
            if(key == 'eng_id') {
                tdd.style.textAlign = 'center';
                tdd.innerHTML = "";
                const a = tdd.add("a");
                a.href = 'javascript:getLoginScript("' + val + '");';
                a.innerHTML = val;
            }
            if(key == 'login' || key == 'mobile'){
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
            if(key == 'login') td.onclick = loginClick;
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
function loginClick(e) {
    e.preventDefault();
    const url = this.children[0].innerHTML;
    const ipt = this.add("input");
    ipt.value = url;
    ipt.select();
    document.execCommand("copy");
    this.removeChild(ipt);
};
function getLoginScript(engName) {
    const pop = layerpop();
    const ta = pop.content.add("textarea");
    const account = accounts[engName];
    post(
        "http://mnemosynesolutions.co.kr:8080/" + engName, 
        { key: "value" }, 
        { 'Content-Type': 'application/json' }, 
        data => {
            const json = JSON.parse(data);
            ta.value = json.script.dp({login_id: account.id, login_password: account.pw});
            ta.select();
            document.execCommand("copy");
            pop.close();
        }
    );
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
String.prototype.dp = function (param) {
    let self = this;
    const keys = Object.keys(param);
    keys.forEach((key) => {
        const regex = new RegExp("\\$\\{".add(key).add("\\}"), "g");
        const val = param[key];
        self = self.replace(regex, val);
    });
    return self;
};
String.prototype.add = function add(str) {
    return [this, str].join("");
};
HTMLElement.prototype.add = function(tagName){
    const el = document.createElement(tagName);
    this.appendChild(el);
    return el;
};