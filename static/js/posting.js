function get_url(){
    let url = $('#url').val()
    let temp_html = `<div style="width:100px;height:100px;background-image: url('${url}');background-position: center;background-size: cover;">
                
                     </div>`
    $('#img-url').append(temp_html)
}

function create_post() {
    let url = $('#url').val()
    // let username = $('#username').val() //login 하면 받는다
    let title = $('#title').val()
    let content = $('#content').val()

    $.ajax({
        type: 'POST',
        url: '/api/posting',
        data: {title_give: title, url_give: url, content_give: content},
        success: function (response) {
            window.location.reload()
        }
    })



}