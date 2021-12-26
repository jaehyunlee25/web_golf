/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable prefer-template */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
$.ajax({
  async: false,
  type: 'post',
  url: './real_timelist_ajax_list.asp',
  data: 'golfrestype=real&courseid=0&usrmemcd=10&pointdate=20211228&openyn=1&dategbn=3&choice_time=00&cssncourseum=&inputtype=',
  dataType: 'html',
  success: function (obj) {
    console.dir(obj);
    // $("#input_ajax").html(obj);
    // 사이즈 재설정부분
    // getgolfreschagsize();
  },
  error: function (xhr, option, error) {
    alert(xhr.status + ' | ' + error); // 오류코드 | 오류내용
  },
  /* error : function(success){
        meg = "서버와 통신중 에러가 발생하였습니다."
        alert("처리결과 : "+meg);
    } */
});
