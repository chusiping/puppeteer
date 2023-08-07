$(function () {
    function submitForm(buttonID,FormID) {
        $(buttonID).on('click', function (e) {
            e.preventDefault();
            const formData = $(FormID).serializeArray().reduce((obj, item) => {
                obj[item.name] = item.value.trim();
                return obj;
            }, {});

            $.ajax({
                type: 'POST',
                url: 'http://127.0.0.1:3000/insert',
                data: JSON.stringify(formData),
                contentType: 'application/json',
                success: function (res) {
                    const rt = res.success ? "添加成功" : "操作失败"
                    const successMessage = $('<div>').text(rt).addClass('success-message');
                    $('body').prepend(successMessage);
                    setTimeout(() => successMessage.remove(), 2000);
                },
                error: function (error) {
                    console.error('Failed to submit form:', error);
                }
            });
        });
    }
    submitForm('#submitBtn','#myForm');
});

