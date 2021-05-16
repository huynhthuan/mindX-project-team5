const user = localStorage.getItem('userLoggeData');
if (!user) {
    window.location.href = homeUrl;
} else if (JSON.parse(user).role < 500) {
    window.location.href = homeUrl;
}
