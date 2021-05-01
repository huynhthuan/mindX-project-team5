// Form tab information
let formInfo = document.querySelector('#form-tabinformation');

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
    profileAva.src = uploadUrl + getUserDataLogged().avatar;
    profileName.innerText = getUserDataLogged().username;
    profileEmail.innerText = getUserDataLogged().email;

    // Set data ở sidebar
    profileTabEmail.value = getUserDataLogged().email;
    profileTabUsername.value = getUserDataLogged().username;
    profileTabAddress.value = getUserDataLogged().address;
    profileTabBod.value = getUserDataLogged().bod;
    profileTabTelephone.value = getUserDataLogged().telephone;
    profileTabAbout.value = getUserDataLogged().about;
}

renderDataProfile();

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

        let result = updateUserDataById(getUserDataLogged().id, newData);
    }
};
