// Get data post
let title = $('#title');
let url = $('#url');
let type = $('#type');
let img = $('#image');
let desc = $('#desc');
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

//Update post
$.validator.setDefaults({
    submitHandler: function () {
        let lastId;
        fetch(videoApiUrl)
            .then((response) => response.json())
            .then((data) => {
                lastId = data.pop().id;
            });

        fetch(videoApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: lastId++,
                title: title.val(),
                url: url.val(),
                img: imgUpload.val(),
                type: type.val(),
                desc: desc.val(),
                date: moment().format('MMMM D, YYYY'),
                author: getUserDataLogged().username,
                authorava: getUserDataLogged().avatar,
                views: 0,
                comments: [],
            }),
        }).then(() => {
            toastr.success('Update video successfully');
        });
    },
});

$('#editForm').validate({
    rules: {
        title: {
            required: true,
        },
        url: {
            required: true,
        },
        desc: {
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
