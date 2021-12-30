$(document).ready(function () {

        });


        function get_profile() {
            $.ajax({
                type: 'GET',
                url: `/profile?username=`,
                data: {},
                success: function (response) {
                    console.log(response)
                }
            })
        }

        /*메인페이지로 돌아가는 함수.*/

        function to_main() {
            window.location.href = "/"
        }