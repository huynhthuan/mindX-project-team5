let scene = document.querySelector('#scene');
let parallaxInstance = new Parallax(scene);
let addBookMark = document.querySelector('#addBookmark');

addBookMark.onclick = () => {
    Swal.fire({
        title: 'Done!',
        text: 'Add bookmark succesfull!',
        icon: 'success',
        confirmButtonText: 'Oki',
    });
};
