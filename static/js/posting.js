function create_post() {
    let content = $("#content").val();
    let file = $('#file')[0].files[0]
    if (content === "" && !file) {
        alert('내용을 작성해 주세요!')
        return;
    }

    let form_data = new FormData()
    form_data.append("content", content);
    form_data.append("file", file);    

    $.ajax({
        type: 'POST',
        url: '/post/create',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        success: function (response) {
            alert(response['msg'])
            window.location.replace('/')
        }
        
    })
}

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
//
//
// var  sel_files=[]
//
// $(document).ready(function (){
//     $('#input_imgs').on('change',handleImgFileSelect)
// })
//
// function fileUploadAction(){
//     console.log('fileUploadAction')
//     $('#input_imgs').trigger('click')
// }
//
// function handleImgFileSelect(e){
//     sel_files=[];
//     $('.imgs_wrap').empty()
//
//     var files = e.target.files;
//     var filesArr = Array.prototype.slice.call(files)
//
//     var index = 0
//     filesArr.forEach(function (f){
//         if(!f.type.match('image.*')){
//             alert('확장자는 이미지 확장자만 가능합니다')
//             return
//         }
//         sel_files.push(f) //파일 저장
//         var reader = new FileReader()
//
//         // 이미지 미리보기 기능
//         reader.onload = function (e){
//             var html = `<a>
//
//                         </a>` // html 로 설정가능
//             $('.imgs_wrap').append(html)
//             index++
//         }
//         reader.readAsDataURL(f)
//     })
//     console.log(sel_files)
// }
//
// function upload_file() {
//     var data = new FormData();
//     console.log(sel_files[0])
//     data.append('image',sel_files[0])
//     $.ajax({
//         type: 'POST',
//         url: '/api/fileupload',
//         contentType: false,
//         processData: false,
//         data: data,
//         success: function (result) {
//             alert("업로드 성공!!");
//         }
//     });
// }
