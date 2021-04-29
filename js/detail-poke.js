let scene = document.getElementById('scene');
let parallaxInstance = new Parallax(scene);
let addBookMark = document.getElementById('addBookmark');

addBookMark.onclick = () => {
    Swal.fire({
        title: 'Done!',
        text: 'Add bookmark succesfull!',
        icon: 'success',
        confirmButtonText: 'Oki',
    });
};
