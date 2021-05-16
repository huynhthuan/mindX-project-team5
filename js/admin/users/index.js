$(function () {
    let tableData = $('#tableData').DataTable({
        ajax: {
            url: userApiUrl,
            dataSrc: '',
        },
        columns: [
            { data: 'id' },
            { data: 'email' },
            { data: 'username', className: 'text-center' },
            { data: 'address', className: 'text-center' },
            { data: 'bod', className: 'text-center' },
            {
                data: 'role',
                className: 'text-center',
                render: function (data, type, row, meta) {
                    return data < 450 ? 'Memmber' : 'Admin';
                },
            },
            {
                data: null,
                className: 'dt-center table-action d-flex justify-content-around',
                defaultContent: `<button class="btn btn-success" id="btn-edit"><i class="fas fa-pen-square"></i></button><button id="btn-delete" data-id= href="javascript:void(0)" class="btn btn-danger"><i class="fa fa-trash"></i></button>`,
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
            text: 'Do you want to delete account',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'red',
            confirmButtonText: 'Yes, delete account!',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(userApiUrl + dataRow.id, {
                    method: 'DELETE',
                })
                    .then((response) => {
                        return response.ok;
                    })
                    .then((data) => {
                        if (data) {
                            tableData.row(row).remove().draw();
                            Swal.fire('Delete account success!', '', 'success');
                        } else {
                            Swal.fire('Error when trying to delete user!', '', 'warning');
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

        window.location.href = view + 'admin/users/edit/?id=' + dataRow.id;
    });
});
