$(document).ready(function () {

});

/*회원탈퇴 및 로그아웃 하기*/
function sign_out(del) {
    $.removeCookie('token', {path: '/'}) // $.removeCookie('쿠키이름'); => false, 정상적인 삭제 불가
                                            // $.removeCookie('쿠키이름', { path: '/' }); => true , // 정상적 삭제 가능
    if (del === "del") {
        alert('정상적으로 회원탈퇴 되었습니다!') // "POST 요청에 따라 del(회원탈퇴)이 맞다면 쿠키를 삭제하도록 한다.
    } else {
        alert('정상적으로 로그아웃 되었습니다!') // 그게 아니라면 로그아웃만 하도록 한다.
    }
    window.location.href = "/login" // 로그인 페이지로 이동합니다.
}

/*메인페이지로 돌아가는 함수.*/

function to_main() {
    window.location.href = "/"
}

/*프로필 편집 창으로 가는 함수.*/

function to_profile_edit() {
    window.location.href = "/profile/update"
}

/*회원탈퇴 진행*/
function remove() {
    check = confirm('정말 삭제 하겠습니까?') // 데이터 삭제 전에 확인 메시지 창을 띄워줍니다.
    // !x 부정연산자 방식으로 모든 falsy 값(빈 문자열, 0, null, false, undefined 등)을 true로 return 합니다.
    // 즉 확인을 누르지 않는다면 아무일도 회원탈퇴는 일어나지 않습니다.
        if(!check){
            return
        }
    $.ajax({
        type: "POST", //POST 요청은 서버의 상태나 데이터를 변경시킬 때 사용합니다. 데이터를 삭제하기 위해 POST 요청을 하는 것이 바람직합니다.
        url: "/api/user_delete", // GET요청과 달리 ?를 사용하지 않습니다.
        data: {},
        success: function (response) {
            sign_out("del")
        }
    });
}





