// 회원 배열 선언
//[ID, PASSWORD] 형태
var user = [
    [{
        ID: 'beom17'
    }, {
        PASSWORD: "0000"
    }],
    [{
        ID: "yeon18"
    }, {
        PASSWORD: "1111"
    }],
    [{
        ID: "jin18"
    }, {
        PASSWORD: "2222"
    }]
];
//var user = [{ID:'beom17', PASSWORD : "0000"}, {ID:"yeon18", PASSWORD :"1111"}, {ID:"jin18", PASSWORD:"2222"}];
//var user = [[{ID:'beom17'}, {PASSWORD : "0000"}], [{ID:"yeon18"}, {PASSWORD :"1111"}], [{ID:"jin18"}, {PASSWORD:"2222"}]];
//var user = new Array();
console.log(user[0][1].PASSWORD);
console.log(user[0][0].ID);


// function idCheck(element) {
//     var paramID = document.getElementById('id').value;

//     if(element.ID ===paramID) {
//         return true;
//     }
// }

function login() {
        var paramID = document.getElementById('id').value;
        alert(paramID+'는?');
        var id = user.find((item, idx)=>{ return item.ID===paramID;});
        alert(id+'는?');
        var paramPASSWORD = document.getElementById('password').value;
       // for (var i = 0; i < user.length; i++) {
            //var id = user.find((item, idx)=>{ return item.ID===paramID;});
            //if (user.find(paramID === user[i][0].ID)) {
            //if(user.find(idCheck)) {
           
            if(id!=null) {
                alert("로그인 성공!");
                return;
            } else {
                alert("로그인 실패!");
                continue;
            }
       // }
}