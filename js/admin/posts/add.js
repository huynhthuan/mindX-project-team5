//Get data post
let title = $('#title');
let content = $('#content');
let desc = $('#desc');
let img = $('#image');
let imgUpload = $('#imgUpload');

// DropzoneJS Demo Code Start
Dropzone.autoDiscover = false;

// Get the template HTML and remove it from the doumenthe template HTML and remove it from the doument
var previewNode = document.querySelector('#template');
previewNode.id = '';
var previewTemplate = previewNode.parentNode.innerHTML;
previewNode.parentNode.removeChild(previewNode);

var myDropzone = new Dropzone(document.body, {
    // Make the whole body a dropzone
    url: domain + 'server/upload-post.php', // Set the url
    thumbnailWidth: 80,
    paramName: 'file',
    maxFiles: 1,
    thumbnailHeight: 80,
    parallelUploads: 20,
    previewTemplate: previewTemplate,
    autoQueue: false, // Make sure the files aren't queued until manually added
    previewsContainer: '#previews', // Define the container to display the previews
    clickable: '.fileinput-button', // Define the element that should be used as click trigger to select files.
});

myDropzone.on('addedfile', function (file) {
    // Hookup the start button
    file.previewElement.querySelector('.start').onclick = function () {
        myDropzone.enqueueFile(file);
    };
});

// Update the total progress bar
myDropzone.on('totaluploadprogress', function (progress) {
    document.querySelector('#total-progress .progress-bar').style.width = progress + '%';
});

myDropzone.on('sending', function (file) {
    // Show the total progress bar when upload starts
    document.querySelector('#total-progress').style.opacity = '1';
    // And disable the start button
    file.previewElement.querySelector('.start').setAttribute('disabled', 'disabled');
});

// Hide the total progress bar when nothing's uploading anymore
myDropzone.on('queuecomplete', function (progress) {
    document.querySelector('#total-progress').style.opacity = '0';
});

myDropzone.on('success', function (file, response) {
    img.attr('src', file.dataURL);
    imgUpload.val(JSON.parse(response).url);
});

// Setup the buttons for all transfers
// The "add files" button doesn't need to be setup because the config
// `clickable` has already been specified.
document.querySelector('#actions .start').onclick = function () {
    myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
};
document.querySelector('#actions .cancel').onclick = function () {
    myDropzone.removeAllFiles(true);
};
// DropzoneJS Demo Code End

//Add post
$.validator.setDefaults({
    submitHandler: function () {
        let lastId;
        fetch(postApiUrl)
            .then((response) => response.json())
            .then((data) => {
                lastId = data.pop().id;
            });

        fetch(postApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: lastId++,
                title: title.val(),
                desc: desc.val(),
                author: getUserDataLogged().username,
                authorava: getUserDataLogged().avatar,
                views: 0,
                date: moment().format('MMMM D, YYYY'),
                img: imgUpload.val(),
                content: postEditor.getData(),
                comments: [],
            }),
        }).then(() => {
            window.location.href = view + 'admin/posts/';
        });
    },
});

$('#editForm').validate({
    rules: {
        title: {
            required: true,
        },
    },
    errorElement: 'span',
    errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        element.closest('.form-group').append(error);
    },
    highlight: function (element, errorClass, validClass) {
        $(element).addClass('is-invalid');
    },
    unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass('is-invalid');
    },
});

//========================== CK editor
let postEditor;
var KTCkeditor = (function () {
    // Private functions
    var demos = function () {
        ClassicEditor.create(document.querySelector('#content'), {
            toolbar: {
                items: ['heading', '|', 'bold', 'italic', '|', 'undo', 'redo', 'ckfinder', 'imageUpload', 'numberedList', 'bulletedList'],
                viewportTopOffset: 30,
                shouldNotGroupWhenFull: true,
            },
            ckfinder: {
                // Upload the images to the server using the CKFinder QuickUpload command.
                uploadUrl: view + 'admin/plugins/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json',
            },
        })
            .then((editor) => {
                postEditor = editor;
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return {
        // public functions
        init: function () {
            demos();
        },
    };
})();

KTCkeditor.init();
