var isIE6 = /msie 6/i.test(navigator.userAgent);
if (isIE6)
{
        document.location.href = "/ie6.html";
}

//-----------------Edit jarry----------------------------
//2024-2-4 爬取违章查询用到的通用函数
function postData(url, requestData, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.onload = function() {
                if (xhr.status === 200) {
                var responseJSON = JSON.parse(xhr.responseText);
                callback(null, responseJSON); // Pass null for error and responseJSON for the data
                } else {
                console.log("程序error:", xhr.statusText);
                callback(new Error(xhr.statusText), null); // Pass error and null for the data
                }
        };
        xhr.onerror = function() {
                console.log("Request failed");
                callback(new Error("程序error"), null); // Pass error and null for the data
        };
        xhr.send(requestData);
}
function mapResponseToCustomArray(responseJSON, fields) {
        return responseJSON.data.content.map(item => {
                let mappedItem = {};
                fields.forEach(field => {
                mappedItem[field.label] = item[field.key];
                });
                return mappedItem;
        });
}
//-------------------------------------------------------
    