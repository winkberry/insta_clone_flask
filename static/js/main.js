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
            // console.log(response)
            let rows = JSON.parse(response)
            for (let i = rows.length-1; i >= 0; i--){
                let post_photo = rows[i]['file']
                let post_photo_content = rows[i]['content']
                let username = rows[i]['user']['id']
                let profile_photo = rows[i]['user']['img']
                let create_time = rows[i]['create_time']


                let temp_html = `<div class="post-wrapper">
                                     <div class="post-header">
                                        <div class="left-wrapper">
                                            <img src="${profile_photo}"/>
                                            <p>${username}</p>
                                        </div>
                                        <div class="right-wrapper">
                                            <img src="/static/img/more@3x.png">
                                        </div>
                                    </div>
                                    <div class="post-body">
                                        <div class="post-img">
                                        <img src="/static/post/${post_photo}">
                                            </div>
                                        <div class="post-icons-wrapper">
                                            <div class="left-wrapper">

                                                <i class="far fa-heart post-icon fa-3x"></i>
                                                <i class="far fa-comment post-icon-2 fa-3x"></i>
                                                <i class="far fa-paper-plane post-icon-3 fa-3x"></i>
                                            </div>
                                            <div class="right-wrapper">
                                                <i class="far fa-star fa-3x"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="post-footer">
                                        <div class="post-like-wrapper">
                                            <img src="${profile_photo}">
                                            <p><strong>${username}</strong>님 <strong>외 6,671명</strong>이 좋아합니다</p>
                                        </div>
                                        <div class="post-content-wrapper">
                                            <p class="post-author">${username}</p>
                                            <p class="post-content">${post_photo_content}</p>
                                        </div>
                                        <p class="post-time">
                                            ${create_time}
                                        </p>
                                    </div>
                                </div>`

                $('#post-container').append(temp_html)

            }
        }
    });
    //여기다가 포스트 html 을 foreach
}

//로그인한 유저의 이름을 보내준다
function go_profile(username) {
    window.location.href = `/profile` //일단은 123으로 보내준다
}

function go_posting(id) {
    window.location.href = `/post/create`
}
