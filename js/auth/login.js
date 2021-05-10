let formsLogin = document.querySelector('#form-login');

formsLogin.onsubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    let email = document.querySelector('#email');
    let password = document.querySelector('#password');
    let userData;
    let flag = false;
    let userIdLogged;

    // Xóa user id đã đăng nhập cũ
    localStorage.removeItem('userId');

    // Kiểm tra email
    if (!email.value) {
        email.nextElementSibling.innerText = 'Please enter your email address.';
        email.classList.add('is-invalid');
    } else if (!validateEmail(email.value)) {
        // Kiểm tra định dạng email có đúng không
        email.nextElementSibling.innerText = 'Email format is incorrect.';
        email.classList.add('is-invalid');
    } else {
        // Kiểm tra email có tồn tại không
        userData = await getUserByEmail(email.value);
        if (!userData) {
            email.nextElementSibling.innerText =
                'Email does not exist, please check again.';
            email.classList.add('is-invalid');
        } else {
            email.classList.remove('is-invalid');
            email.classList.add('is-valid');
        }
    }

    //Kiểm tra password
    if (!password.value) {
        password.nextElementSibling.innerText = 'Please enter your password.';
        password.classList.add('is-invalid');
    } else {
        // Kiểm tra password trùng khớp không
        // Hash password người dùng nhập
        let hashPassword = CryptoJS.MD5(password.value).toString(
            CryptoJS.enc.Base64
        );

        if (userData) {
            if (hashPassword !== userData.password) {
                password.nextElementSibling.innerText =
                    'Wrong password, please try again.';
                password.classList.add('is-invalid');
            } else {
                password.classList.remove('is-invalid');
                password.classList.add('is-valid');
                flag = true;
                userIdLogged = userData.id;
            }
        } else {
            password.nextElementSibling.innerText =
                'Wrong password, please try again.';
            password.classList.add('is-invalid');
        }
    }

    // Lưu dữ liệu người dùng đăng nhập
    if (flag) {
        // Thay đổi trạng thái người dùng
        setUserDataLogged(userData);
        await updateUserDataById(userData.id, {
            settings: {
                colorTemplate: userData.settings.colorTemplate,
                status: 1,
            },
        });
        redirectTo(homeUrl + '?toast=true&type=Success&msg=Welcom back!!!');
    }
};
