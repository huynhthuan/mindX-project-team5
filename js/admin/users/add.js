$(function () {
    //Get user by ID
    let email = $('#email');
    let username = $('#username');
    let password = $('#password');
    let role = $('#role');

    //Custom validator
    var response;
    $.validator.addMethod(
        'uniqueEmail',
        function (value) {
            $.ajax({
                type: 'GET',
                url: userApiUrl + '?email=' + value,
                async: false,
                success: function (msg) {
                    response = msg.length !== 1;
                },
            });
            return response;
        },
        'Email already exists! Try other email.'
    );

    $.validator.addMethod(
        'uniqueUsername',
        function (value) {
            $.ajax({
                type: 'GET',
                url: userApiUrl + '?username=' + value,
                async: false,
                success: function (msg) {
                    response = msg.length !== 1;
                },
            });
            return response;
        },
        'Username already exists! Try other username.'
    );

    $.validator.setDefaults({
        submitHandler: function () {
            // Hash password người dùng nhập
            let hashPassword = CryptoJS.MD5(password.val()).toString(CryptoJS.enc.Base64);

            addUser({
                id: randomUserID(),
                email: email.val(),
                username: username.val(),
                password: hashPassword,
                address: '',
                bod: '',
                telephone: '',
                role: Number(role.val()),
                about: '',
                avatar: defaultAvatar,
                settings: {
                    colorTemplate: 0,
                    status: 0,
                },
                bookmark: {
                    pokedex: [],
                    cards: [],
                },
            }).then(() => {
                window.location.href = view + 'admin/users/';
            });
        },
    });

    $('#addForm').validate({
        rules: {
            email: {
                required: true,
                email: true,
                uniqueEmail: true,
            },
            username: {
                required: true,
                uniqueUsername: true,
            },
            password: {
                required: true,
                minlength: 4,
            },
            repassword: {
                required: true,
                minlength: 4,
                equalTo: '#password',
            },
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
    });
});
