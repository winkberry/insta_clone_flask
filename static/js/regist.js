// 회원가입버튼을 누르면 함수가 실행됩니다.
// id와 pw validation 검사하고 이상없는 경우 최종적으로 register 함수 실행합니다.
function registerCheck() {
    
    let pw = $("#pw").val();
    let id = $("#id").val();       

    if ((id == "") || $("#help-id").hasClass("is-danger")) {
        alert("아이디를 다시 확인해주세요.")
        return;
    } else if (!$("#help-id").hasClass("is-success")) {
        alert("아이디 중복확인을 해주세요.")
        return;
    }    
    if (pw == "") {
        alert("비밀번호를 확인 해주세요.")   
        return;     
    } else if (!is_pw(pw)) {
        alert("영문과 숫자 조합의 8-20자의 비밀번호를 설정해주세요.")
        return; 
    }  

    register()       
}


// 회원가입에 필요한 정보를 사용자로 부터 전달받고, 이를 이용해 data 객체를 생성합니다.
// 만든 data를 JSON 문자열로 포맷팅하여 POST 방식으로 url에 전달하고, 서버(app.py)에서 받아 DB에 저장합니다.
// 서버에서 응답(response)으로 result를 보내주고, 로그인 페이지로 전환합니다.
function register() {           
    
    let id = $("#id").val();
    let pw = $("#pw").val();
    let email = $("#email").val();
    let profile_img = $("#profile-img")[0].files[0];

    // 이미지 파일을 서버로 보낼 때 JSON 객체가 아닌 자바스크립트 FormData 객체를 사용합니다.
    let formData = new FormData()
    formData.append("id", id)
    formData.append("pw", pw)
    formData.append("email", email)
    formData.append("profile_img", profile_img)   

    $.ajax({
        type: 'POST',
        url: '/register',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            alert(response['result'])
            window.location.replace('/login')            
        }
    })

}

// function is_id(id) {
//     let re = new RegExp("/^[a-zA-Z][-a-zA-Z0-9_.]{4,14}$/");
//     return re.test(id);
// }

function is_id(id) {
    var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{4,14}$/;
    return regExp.test(id);
}

function is_pw(pw) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(pw);
}

// function is_pw(pw) {
//     let re = new RegExp("/^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/");
//     return re.test(pw);
// }

function check_duplicate() {
    let id = $("#id").val()    
    if (id == "") {
        $("#help-id").text("아이디를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-username").focus()
        return;
    }
    if (!is_id(id)) {
        $("#help-id").text("아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 3-15자 길이").removeClass("is-safe").addClass("is-danger")
        $("#input-username").focus()
        return;
    }
    $("#help-id").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/register/check_id",
        data: {id: id},
        success: function (response) {

            if (response["duplicated"]) {
                $("#help-id").text("이미 존재하는 아이디입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-username").focus()
            } else {
                $("#help-id").text("사용할 수 있는 아이디입니다.").removeClass("is-danger").addClass("is-success")
                $("#btn-check-dup").hide()  // 아이디 사용이 가능하면 버튼 숨김
                $("#create-btn").attr('disabled', false)    // 중복확인을 해야 회원가입 버튼이 활성화 됩니다.
            }
            $("#help-id").removeClass("is-loading")
            

        }
    });
}