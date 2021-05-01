const user = localStorage.getItem('userLoggeData');
if (user) {
    window.location.href = homeUrl;
}
