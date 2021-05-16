$(function () {
    let tableData = $('#tableData').DataTable({
        ajax: {
            url: postApiUrl,
            dataSrc: '',
        },
        order: [[0, 'desc']],
        columns: [
            { data: 'id' },
            {
                data: 'img',
                className: 'dt-center table-img text-center',
                render: function (data, type, row, meta) {
                    return '<img src="' + uploadImgPost + data + '" width="100px"/>';
                },
                orderable: false,
            },
            { data: 'title' },
            { data: 'author', className: 'text-center' },
            { data: 'views', className: 'text-center' },
            {
                data: 'comments',
                className: 'text-center',
                render: function (data, type, row, meta) {
                    return data.length;
                },
            },
            { data: 'date', className: 'text-center' },
            {
                data: null,
                className: 'dt-center table-action d-flex justify-content-around',
                defaultContent: `<button class="btn btn-secondary" id="btn-view"><i class="fas fa-eye"></i></button><button class="btn btn-success" id="btn-edit"><i class="fas fa-pen-square"></i></button><button id="btn-delete" data-id= href="javascript:void(0)" class="btn btn-danger"><i class="fa fa-trash"></i></button>`,
                orderable: false,
            },
        ],
    });

    // Delete a record
    $('#tableData tbody').on('click', '#btn-delete', function (e) {
        e.preventDefault();
        let row = tableData.row($(this).parents('tr'));
        let dataRow = row.data();

        Swal.fire({
            title: 'Notice!',
            text: 'Do you want to delete posts',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'red',
            confirmButtonText: 'Yes, delete posts!',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(postApiUrl + dataRow.id, {
                    method: 'DELETE',
                })
                    .then((response) => {
                        return response.ok;
                    })
                    .then((data) => {
                        if (data) {
                            tableData.row(row).remove().draw();
                            Swal.fire('Delete posts success!', '', 'success');
                        } else {
                            Swal.fire('Error when trying to delete posts!', '', 'warning');
                        }
                    });
            }
        });
    });

    // Edit a record
    $('#tableData tbody').on('click', '#btn-edit', function (e) {
        e.preventDefault();
        let row = tableData.row($(this).parents('tr'));
        let dataRow = row.data();

        window.location.href = view + 'admin/posts/edit/?id=' + dataRow.id;
    });

    // View a record
    $('#tableData tbody').on('click', '#btn-view', function (e) {
        e.preventDefault();
        let row = tableData.row($(this).parents('tr'));
        let dataRow = row.data();

        window.open(view + 'news/detail/?id=' + dataRow.id, '_blank');
    });
});
