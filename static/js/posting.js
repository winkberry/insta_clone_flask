function get_url(){
    let url = $('#url')
    let temp_html = `<div class="img-check" style="background-image: url('${url.val()}');"></div>`
    $('#img-url').append(temp_html)
    url.empty()
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