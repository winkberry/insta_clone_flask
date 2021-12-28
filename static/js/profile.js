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