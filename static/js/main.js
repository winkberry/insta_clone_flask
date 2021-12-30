$(document).ready(function () {
    get_feed();
});

//feed 는 메인 화면에 들어갈 post를 받아서 뿌리는 역할입니다
function get_feed() {
    $.ajax({
        type: 'GET',
        url: '/api/feed',
        data: {},
        success: function (response) {
            let row = JSON.parse(response)

        }
    })
    //여기다가 포스트 html 을 foreach
}

//로그인한 유저의 이름을 보내준다
function go_profile() {
    window.location.href = `/profile?username=${'123'}` //일단은 123으로 보내준다
}

function go_posting(id) {
    window.location.href = `/posting?id=${id}`
}
