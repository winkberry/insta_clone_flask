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



function del_comment(comment_id,post_id) {
    $.ajax({
        type: 'POST',
        url: '/api/deletecomment',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({comment_id:comment_id,post_id:post_id}),
        success: function (response) {
            alert(response['msg'])
            window.location.replace('/')
        }
    })
}