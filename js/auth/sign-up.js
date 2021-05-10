let formsSignUp = document.querySelector('#form-sign-up');

formsSignUp.onsubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    let email = document.querySelector('#email');
    let password = document.querySelector('#password');
    let username = document.querySelector('#username');
    let repassword = document.querySelector('#repassword');

    let userData;
    let flag = false;

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

        if (userData) {
            email.nextElementSibling.innerText =
                'Email has exist, please try again with other email.';
            email.classList.add('is-invalid');
        } else {
            email.classList.remove('is-invalid');
            email.classList.add('is-valid');
        }
    }

    // Kiểm tra username
    if (!username.value) {
        username.nextElementSibling.innerText = 'Please enter your username.';
        username.classList.add('is-invalid');
    } else if (username.value.length < 4) {
        // Kiểm tra username độ dài lớn hơn 4 kí tự
        username.nextElementSibling.innerText =
            'Username length has minium length of 4 characters.';
        username.classList.add('is-invalid');
    } else if (username.value.length > 20) {
        // Kiểm tra username độ dài nhỏ hơn 20 kí tự
        username.nextElementSibling.innerText =
            'Username length has maximum length of 20 characters.';
        username.classList.add('is-invalid');
    } else {
        // Kiểm tra username đã tồn tại chưa
        userData = await getUserByUserName(username.value);

        if (userData) {
            username.nextElementSibling.innerText =
                'Username already exists. Try again with other username.';
            username.classList.add('is-invalid');
        } else {
            username.classList.remove('is-invalid');
            username.classList.add('is-valid');
        }
    }

    // Kiểm tra password
    if (!password.value) {
        password.nextElementSibling.innerText = 'Please enter your password.';
        password.classList.add('is-invalid');
    } else if (password.value.length < 4) {
        // Kiểm tra password
        password.nextElementSibling.innerText =
            'Password length has minium length of 4 characters.';
        password.classList.add('is-invalid');
    } else {
        password.classList.remove('is-invalid');
        password.classList.add('is-valid');
    }

    // Kiểm tra repassword
    if (!repassword.value) {
        repassword.nextElementSibling.innerText = 'Please enter your password.';
        repassword.classList.add('is-invalid');
    } else if (repassword.value !== password.value) {
        // Kiểm tra repassword có trùng với password không
        repassword.nextElementSibling.innerText =
            'Re password not match password.';
        repassword.classList.add('is-invalid');
    } else {
        repassword.classList.remove('is-invalid');
        repassword.classList.add('is-valid');
        flag = true;
    }

    // Lưu dữ liệu người dùng đăng ký
    if (flag) {
        // Hash password người dùng nhập
        let hashPassword = CryptoJS.MD5(password.value).toString(
            CryptoJS.enc.Base64
        );

        let newUserData = {
            id: randomUserID(),
            email: email.value,
            username: username.value,
            password: hashPassword,
            address: '',
            bod: '',
            telephone: '',
            about: '',
            avatar: defaultAvatar,
            settings: {
                colorTemplate: 0,
                status: 0,
            },
            bookmark: {
                pokedex: [],
                card: [],
            },
        };

        let result = await addUser(newUserData);
        if (result) {
            redirectTo(
                homeUrl +
                    '/views/auth/login/?toast=true&type=Success&msg=Welcom to Pokebook! Login to explore everything.'
            );
        }
    }
};
