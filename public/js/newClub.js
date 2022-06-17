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
btnReg.onclick = function() {
    this.disabled = true;
    const ipts = [
        iptName, 
        iptAddress, 
        iptRegion, 
        iptPhone, 
        iptEmail, 
        iptHomepage, 
        iptRegNumber, 
        iptIntro,
        iptEngId,
        iptCourse,
    ];
    const param = {};
    ipts.forEach(ipt => {
        param[ipt.name] = ipt.value.replace(/\s/g, '');
        ipt.value = "";
    });
    const addr = "http://dev.mnemosyne.co.kr:1006/api/reservation/newGolfClub";
    const header = { 'Content-Type': 'application/json' };
    post(addr, param, header, data => {
        console.log(data);
        btnReg.disabled = false;
    })
};