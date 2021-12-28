 $(document).ready(function () {

        });


         function feed() {
            $.ajax({
                type: 'GET',
                url: '/api/feed',
                data: {},
                success: function (response) {

                }
            })
        }