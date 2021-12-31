function login() {
    let data = {
        id : $("#id").val(),
        pw : $("#pw").val()
    };

    $.ajax({
        type: 'POST',
        url: '/login',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function (response) {
            if (response["result"] == "success") {                
                $.cookie('token', response['token']);
                alert('로그인 하였습니다.');
                window.location.href = '/';
            } else {
                alert(response['msg']);
            }                    
        }
    })
}