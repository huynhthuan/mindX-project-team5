// Hỗ trợ xử lý =============================
// Xử lý chuyển hướng
function redirectTo(url) {
    window.location.href = url;
}

// Set user data đăng nhập vào localStorge
function setUserDataLogged(user) {
    let userData = {
        id: user.id,
        email: user.email,
        username: user.username,
        address: user.address,
        bod: user.bod,
        telephone: user.telephone,
        about: user.about,
        avatar: user.avatar,
        settings: {
            colorTemplate: user.settings.colorTemplate,
            status: user.settings.status,
        },
        bookmark: {
            pokedex: user.bookmark.pokedex,
            card: user.bookmark.card,
        },
    };

    localStorage.setItem('userLoggeData', JSON.stringify(userData));
}

// Get user data đăng nhập ở localStorge
function getUserDataLogged() {
    let userLogged = localStorage.getItem('userLoggeData');
    return JSON.parse(userLogged);
}

// Lấy url paramater
function getAllUrlParams(url) {
    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {
        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof a[1] === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string')
                paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {
                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (
                    obj[paramName] &&
                    typeof obj[paramName] === 'string'
                ) {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}

// Hiển thị thông báo
function showNotice(type, msg) {
    let toastWrap = document.querySelector('.toast__wrap');
    toastWrap.innerHTML += `<div class="position-fixed top-0 end-0 p-3" style="z-index: 999999">
    <div id="liveToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header bg-primary text-white">
        <strong class="me-auto">${type.toUpperCase()}</strong>
        <small>just nows</small>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body bg-white">${msg}</div>
    </div>
  </div>`;

    let toastEl = document.querySelector('#liveToast');
    let toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Check login
function isLogin() {
    const user = localStorage.getItem('userLoggeData');
    return user;
}

// Đăng xuất
function logOut() {
    localStorage.removeItem('userLoggeData');
    redirectTo(homeUrl);
}

// Lấy ngày hiện tại
function getDateNow() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    return (today = yyyy + '-' + mm + '-' + dd);
}

// Validate data =============================
// Validate định dạng email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Validate số điện thoại

function validateTelephoneNumber(telephone) {
    const rete = /(03[2|3|4|5|6|7|8|9])+([0-9]{7})\b/;
    return rete.test(telephone);
}

// CRUD user =============================
// Lấy data user theo email
async function getUserByEmail(email) {
    let response = await fetch(userApiUrl + '?email=' + email);
    userData = await response.json();
    return userData[0];
}

// Cập nhật data user theo id
async function updateUserDataById(id, data) {
    let response = await fetch(userApiUrl + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return await response.json();
}
