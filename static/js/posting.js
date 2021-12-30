function get_url() {
    let url = $('#url').val()
    let img_box = $('#img-url')
    img_box.empty()
    if (url === '') {
        alert('빈칸이 있습니다')
        return
    }
    let temp_html = `<div class="img-check" style="background-image: url('${url}');"></div>`
    img_box.append(temp_html)
}

function create_post() {
    let url = $('#url').val()
    // let username = $('#username').val() //login 하면 받는다
    let title = $('#title').val()
    if (url === "" && title === "") {
        alert('빈칸이 있습니다')
        return
    }

    $.ajax({
        type: 'POST',
        url: '/api/posting',
        data: {title_give: title, url_give: url, content_give: content},
        success: function (response) {
            window.location.reload()
        }
    })


}