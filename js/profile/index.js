// Form upload avatar
let formUpload = document.querySelector('#fileAvatar');
let btnUpload = document.querySelector('#btnUploadFile');
let previewUpload = document.querySelector('#previewUpload');
let modalUplopadEl = document.querySelector('#uploadImage');
let modalUplopad = new bootstrap.Modal(modalUplopadEl);

// Form color template
let colorTemplate = document.querySelector('#colorTemplate');
let btnSaveColor = document.querySelector('#btn__saveColor');

// Form tab information
let formInfo = document.querySelector('#form-tabinformation');
let formInfoInput = document.querySelectorAll(
    '#form-tabinformation input, #form-tabinformation textarea'
);

// Lấy element ở sidebar
let profileAva = document.querySelector('.profile__image img');
let profileName = document.querySelector('.profile__username');
let profileEmail = document.querySelector('.profile__email');

// Lấy element ở tab
let profileTabEmail = document.querySelector('.info__value #email');
let profileTabUsername = document.querySelector('.info__value #username');
let profileTabAddress = document.querySelector('.info__value #address');
let profileTabBod = document.querySelector('.info__value #bod');
let profileTabTelephone = document.querySelector('.info__value #telephone');
let profileTabAbout = document.querySelector('.info__value #about');

function renderDataProfile() {
    // Set data ở sidebar
    profileAva.src = getUserDataLogged().avatar;
    profileName.innerText = getUserDataLogged().username;
    profileEmail.innerText = getUserDataLogged().email;

    // Set data ở sidebar
    profileTabEmail.value = getUserDataLogged().email;
    profileTabUsername.value = getUserDataLogged().username;
    profileTabAddress.value = getUserDataLogged().address;
    profileTabBod.value = getUserDataLogged().bod;
    profileTabTelephone.value = getUserDataLogged().telephone;
    profileTabAbout.value = getUserDataLogged().about;
    colorTemplate.selectedIndex = getUserDataLogged().settings.colorTemplate;
}

renderDataProfile();

// Lưu dữ liệu thông tin người dùng
formInfo.onsubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Kiểm tra input username
    if (!profileTabUsername.value) {
        profileTabUsername.nextElementSibling.innerText =
            'Please enter your username.';
        profileTabUsername.classList.add('is-invalid');
    } else if (profileTabUsername.value.length < 4) {
        profileTabUsername.nextElementSibling.innerText =
            'Username has minium length of 4 characters.';
        profileTabUsername.classList.add('is-invalid');
    } else if (profileTabUsername.value.length > 15) {
        profileTabUsername.nextElementSibling.innerText =
            'Username has maximum length of 15 characters.';
        profileTabUsername.classList.add('is-invalid');
    } else {
        profileTabUsername.classList.remove('is-invalid');
        profileTabUsername.classList.add('is-valid');
    }

    // Kiểm tra input address
    if (!profileTabAddress.value) {
        profileTabAddress.nextElementSibling.innerText =
            'Please enter your address.';
        profileTabAddress.classList.add('is-invalid');
    } else if (profileTabAddress.value.length < 4) {
        profileTabAddress.nextElementSibling.innerText =
            'Address has minium length of 4 characters.';
        profileTabAddress.classList.add('is-invalid');
    } else if (profileTabAddress.value.length > 65) {
        profileTabAddress.nextElementSibling.innerText =
            'Address has maximum length of 65 characters.';
        profileTabAddress.classList.add('is-invalid');
    } else {
        profileTabAddress.classList.remove('is-invalid');
        profileTabAddress.classList.add('is-valid');
    }

    // Kiểm tra input date
    if (!profileTabBod.value) {
        profileTabBod.nextElementSibling.innerText =
            'Please enter your birth of day.';
        profileTabBod.classList.add('is-invalid');
    } else if (profileTabBod.value > getDateNow()) {
        profileTabBod.nextElementSibling.innerText =
            'Birth of day not larger than date now.';
        profileTabBod.classList.add('is-invalid');
    } else {
        profileTabBod.classList.remove('is-invalid');
        profileTabBod.classList.add('is-valid');
    }

    // Kiểm tra input telephone
    if (!profileTabTelephone.value) {
        profileTabTelephone.nextElementSibling.innerText =
            'Please enter your telephone';
        profileTabTelephone.classList.add('is-invalid');
    } else if (!validateTelephoneNumber(profileTabTelephone.value)) {
        profileTabTelephone.nextElementSibling.innerText =
            'Telephone format not valid.';
        profileTabTelephone.classList.add('is-invalid');
    } else {
        profileTabTelephone.classList.remove('is-invalid');
        profileTabTelephone.classList.add('is-valid');
    }

    // Kiểm tra input about
    if (!profileTabAbout.value) {
        profileTabAbout.nextElementSibling.innerText =
            'Please enter your about';
        profileTabAbout.classList.add('is-invalid');
    } else if (profileTabAbout.value.length > 255) {
        profileTabAbout.nextElementSibling.innerText =
            'About has maximum length of 255 characters.';
        profileTabAbout.classList.add('is-invalid');
    } else {
        profileTabAbout.classList.remove('is-invalid');
        profileTabAbout.classList.add('is-valid');
    }

    if (!document.querySelectorAll('#form-tabinformation .is-invalid').length) {
        let newData = {
            username: profileTabUsername.value,
            address: profileTabAddress.value,
            bod: profileTabBod.value,
            telephone: profileTabTelephone.value,
            about: profileTabAbout.value,
        };

        let result = await updateUserDataById(getUserDataLogged().id, newData);

        if (Object.keys(result).length !== 0) {
            // Đặt lại data người dùng sau khi update ở localStorage
            let newData = await getUserById(getUserDataLogged().id);
            setUserDataLogged(newData);
            renderDataProfile();
            formInfoInput.forEach((item) => {
                item.classList.remove('is-valid');
            });
            showNotice('success', 'Update data success!!!');
        } else {
            showNotice('error', 'Update data error! Try again.');
        }
    }
};

// Show preview image upload
formUpload.onchange = () => {
    let file = formUpload.files[0];
    let reader = new FileReader();
    reader.onloadend = function () {
        newDataAva = reader.result;
        previewUpload.src = newDataAva;
    };

    reader.readAsDataURL(file);
};

// Upload avatar
btnUpload.onclick = () => {
    let newDataAva;
    if (formUpload.files[0] === undefined) {
        formUpload.nextElementSibling.innerText = 'Please chossen file upload!';
        formUpload.classList.add('is-invalid');
    } else {
        let file = formUpload.files[0];
        let reader = new FileReader();
        reader.onloadend = async function () {
            newDataAva = reader.result;
            previewUpload.src = newDataAva;
            let response = await updateUserDataById(getUserDataLogged().id, {
                avatar: newDataAva,
            });
            console.log(previewUpload);
            setUserDataLogged(response);
            renderDataProfile();
            setDataMenu();
            showNotice('success', 'Upload image successfully!');
            modalUplopad.hide();
        };

        reader.readAsDataURL(file);
    }
};

// Thay đổi color template
btnSaveColor.onclick = async () => {
    let newData = await updateUserDataById(getUserDataLogged().id, {
        settings: {
            colorTemplate: Number(colorTemplate.value),
            status: getUserDataLogged().settings.status,
        },
    });

    setUserDataLogged(newData);
    renderDataProfile();
    changeColorTemplate();
    showNotice('success', 'Change color template successfully!');
};
