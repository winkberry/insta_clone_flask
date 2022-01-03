// $(document).ready(function () {
//     get_feed();
// });

function go_profile(id) {
    if(id){
        window.location.href = `/profile?id=${id}`
        return
    }
    window.location.href = `/profile`
}

function go_posting(id) {
    window.location.href = `/post/create`
}


// //feed 는 메인 화면에 들어갈 post를 받아서 뿌리는 역할입니다
// function get_feed() {
//     $.ajax({
//         type: 'GET',
//         url: '/api/feed',
//         data: {},
//         success: function (response) {
//             // console.log(response)
//             let rows = JSON.parse(response)
//             for (let i = rows.length-1; i >= 0; i--){
//                 let post_photo = rows[i]['file']
//                 let post_photo_content = rows[i]['content']
//                 let username = rows[i]['user']['id']
//                 let profile_photo = rows[i]['user']['img']
//                 let create_time = rows[i]['create_time']
//                 let post_id = rows[i]['_id']
//                 console.log(post_id)
//
//
//                 let temp_html = `<div class="post-wrapper">
//                                      <div class="post-header">
//                                         <div class="left-wrapper" onclick="go_profile('${username}')">
//
//                                             <p>${username}</p>
//                                         </div>
//                                         <div class="right-wrapper">
//                                             <img src="/static/img/more@3x.png">
//                                         </div>
//                                     </div>
//                                     <div class="post-body">
//                                         <div class="post-img">
//                                         <img src="/static/post/${post_photo}">
//                                             </div>
//                                         <div class="post-icons-wrapper">
//                                             <div class="left-wrapper">
//
//                                                 <i class="far fa-heart post-icon fa-3x"></i>
//                                                 <i class="far fa-comment post-icon-2 fa-3x"></i>
//                                                 <i class="far fa-paper-plane post-icon-3 fa-3x"></i>
//                                             </div>
//                                             <div class="right-wrapper">
//                                                 <i class="far fa-star fa-3x"></i>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div class="post-footer">
//                                         <div class="post-like-wrapper">
//
//                                             <p><strong>${username}</strong>님 <strong>외 6,671명</strong>이 좋아합니다</p>
//                                         </div>
//                                         <div class="post-content-wrapper">
//                                             <p class="post-author">${username}</p>
//                                             <p class="post-content">${post_photo_content}</p>
//                                         </div>
//                                         <div class="post-subcontent-wrapper">
//                                             <div class="main-icon-like-text-write">
//                                                 <div class="main-icon-like-text-write-commentbox" id="main-icon-like-text-write-commentbox">
//                                                     <P class="userName" id="userName">${username}</P>
//                                                     <div class="main-icon-like-text-write-subtext" id="main-icon-like-text-write-subtext">댓글기능 구현할거에요!</div>
//                                                 </div>
//
//                                                 <div class='main-icon-like-text-write-comment' id="main-icon-like-text-write-comment">
//
//                                                 </div>
//
//                                                 <div class="main-icon-like-text-write-footer">1시간 전</div>
//                                             </div>
//                                         </div>
//                                         <div class="main-comment">
//                                             <input class="main-comment-text" id="main-comment-text" type="text" placeholder="댓글 달기...">
//                                             <input type="hidden" name='post_id' id='post_id' value="${post_id}">
//                                             <button class="main-comment-submit" onclick="save_comment()">게시</button>
//                                         </div>
//
//                                         <p class="post-time">
//                                             ${create_time}
//                                         </p>
//                                     </div>
//                                 </div>`
//
//                 $('#post-container').append(temp_html)
//
//             }
//         }
//     });
// }
//
// function save_comment() {
//     let comment = $(`#main-comment-text`).val();
//     let post_id = $(`#post_id`).val();
//
//     let form_data = new FormData()
//     form_data.append("comment", comment);
//     form_data.append("post_id", post_id);
//
//     $.ajax({
//         type: 'POST',
//         url: '/comment/create',
//         cache: false,
//         contentType: false,
//         processData: false,
//         data: form_data,
//         success: function (response) {
//             alert(response['msg'])
//             window.location.reload()
//             // show_comment(value)
//             // document.getElementsByClassName(`main-comment-text${value}`)[0].value = "";
//
//         }
//
//     })
// }