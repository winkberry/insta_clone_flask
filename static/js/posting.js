// function get_url() {
//     let url = $('#url').val()
//     let img_box = $('#img-url')
//     img_box.empty()
//     if (url === '') {
//         alert('빈칸이 있습니다')
//         return
//     }
//     let temp_html = `<div class="img-check" style="background-image: url('${url}');"></div>`
//     img_box.append(temp_html)
// }


var  sel_files=[]

$(document).ready(function (){
    $('#input_imgs').on('change',handleImgFileSelect)
})

function fileUploadAction(){
    console.log('fileUploadAction')
    $('#input_imgs').trigger('click')
}

function handleImgFileSelect(e){
    sel_files=[];
    $('.imgs_wrap').empty()

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files)

    var index = 0
    filesArr.forEach(function (f){
        if(!f.type.match('image.*')){
            alert('확장자는 이미지 확장자만 가능합니다')
            return
        }

        sel_files.push(f)

        var reader = new FileReader()
        reader.onload = function (e){
            var html = `<a></a>`
            $('.imgs_wrap').append(html)
            index++
        }
        reader.readAsDataURL(f)
    })
    console.log(sel_files)
}



function upload_file() {
    var data = new FormData();
    console.log(sel_files[0])
    data.append('image',sel_files[0])
    $.ajax({
        type: 'POST',
        url: '/api/fileupload',
        contentType: false,
        processData: false,
        data: data,
        success: function (result) {
            alert("업로드 성공!!");
        }
    });
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