         function create_post() {
            $.ajax({
                type: 'POST',
                url: '/api/posting',
                data: {},
                success: function (response) {
                    console.log(response)
                }
            })

        }