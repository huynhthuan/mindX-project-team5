$(function () {
    //Get user by ID
    let email = $('#email');
    let username = $('#username');
    let address = $('#address');
    let bod = $('#bod');
    let telephone = $('#telephone');
    let about = $('#about');
    let role = $('#role');
    let userData;

    getUserById(getAllUrlParams().id).then((data) => {
        userData = data;
        email.val(data.email);
        username.val(data.username);
        address.val(data.address);
        bod.val(data.bod);
        telephone.val(data.telephone);
        about.val(data.about);
        role.val(data.role).change();
    });

    //Custom validator
    var response;
    $.validator.addMethod(
        'uniqueUsername',
        function (value) {
            $.ajax({
                type: 'GET',
                url: userApiUrl + '?username=' + value + '&username_ne=' + userData.username,
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
            updateUserDataById(getAllUrlParams().id, {
                username: username.val(),
                address: address.val(),
                bod: bod.val(),
                telephone: telephone.val(),
                about: about.val(),
                role: Number(role.val()),
            }).then(() => {
                toastr.success('Edit user success.');
            });
        },
    });

    $('#editForm').validate({
        rules: {
            email: {
                required: true,
                email: true,
            },
            username: {
                required: true,
                uniqueUsername: true,
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
