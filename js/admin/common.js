if (isLogin()) {
    getUserById(getUserDataLogged().id).then((data) => {
        setUserDataLogged(data);
    });
    console.log('Save user successfully');
}

$('#adminLogout').click(function () {
    logOut(getUserDataLogged());
});

let imguserAdmin = $('.user-panel .image img');
let nameadmin = $('.user-panel .info a');

imguserAdmin.attr('src', uploadFolderUserUrl + getUserDataLogged().avatar);
nameadmin.html(getUserDataLogged().username);

imguserAdmin.css({ width: '33px', height: '33px' });
