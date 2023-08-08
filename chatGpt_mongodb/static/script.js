$(function () {
    function submitOrFindData(buttonID, formID, api, tableName, isSubmit) {
        $(buttonID).on('click', function (e) {
            e.preventDefault();
            const formData = $(formID).serializeArray().reduce((obj, item) => {
                let v = item.value.trim();
                if (v) obj[item.name] = v;
                return obj;
            }, {});

            $.ajax({
                type: 'POST',
                url: api,
                data: JSON.stringify(formData),
                contentType: 'application/json',
                success: function (res) {
                    if (isSubmit) {
                        const successMessage = $('<div>').text(res.message).addClass('success-message');
                        $('body').prepend(successMessage);
                        setTimeout(() => successMessage.remove(), 2000);
                    } else {
                        displayData(tableName, res.data);
                    }
                },
                error: function (error) {
                    console.error('Failed to submit form:', error);
                }
            });
        });
    }

    function displayData(tableName, data) {
        var tableBody = $(tableName + " tbody");
        tableBody.empty();
        $.each(data, function (index, obj) {
            var row = $("<tr>");
            row.append($("<td>").text(index));
            for (var key in obj) {
                row.append($("<td>").text(key + ": " + obj[key]));
            }
            tableBody.append(row);
        });
    }
    submitOrFindData('#submitBtn', '#myForm', 'http://127.0.0.1:3000/insert', '#dataTable',true);
    submitOrFindData('#deleteBtn', '#myForm', 'http://127.0.0.1:3000/delete', '#dataTable',true);
    submitOrFindData('#editBtn',   '#myForm', 'http://127.0.0.1:3000/update', '#dataTable',true);
    submitOrFindData('#findBtn',   '#myForm', 'http://127.0.0.1:3000/find',   '#dataTable',false);
});

