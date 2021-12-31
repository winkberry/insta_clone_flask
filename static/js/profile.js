$(document).ready(function () {

});

/*로그아웃 하기*/
function sign_out(del) {
    $.removeCookie('token', {path: '/'});
    if (del === "del") {
        alert('정상적으로 회원탈퇴 되었습니다!')
    } else {
        alert('정상적으로 로그아웃 되었습니다!')
    }
    window.location.href = "/login"
}

/*메인페이지로 돌아가는 함수.*/

function to_main() {
    window.location.href = "/"
}

/*프로필 편집 창으로 가는 함수.*/

function to_profile_edit() {
    window.location.href = "/profile/update"
}

function remove() {
    check = confirm('정말 삭제 하겠습니까?')
        if(!check){
            return
        }
    $.ajax({
        type: "POST",
        url: "/api/user_delete",
        data: {},
        success: function (response) {
            sign_out("del")
        }
    });
}

/*프로필편집 기능 함수*/




