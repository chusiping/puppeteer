function handleInput(value) {
  if (value.length >= 2) {

    var dropdownList = $('#dropdown-list');
    dropdownList.empty();

    var inputParam = $('#input-id').val();
    $.ajax({
      url: '/all?seleItem='+ inputParam,
      dataType: 'json',
      success: function(data) {
          $.each(data, function(index, item) {
            var option = $('<div>').text(item.sname).click(function() {
              $('#input-id').val(item.id);
              dropdownList.empty();
              $('#dropdown-list').empty().hide();
            });
            dropdownList.append(option);
          });
      },
      error: function(error) {
          console.log('获取数据失败:', error);
      }
    });
    dropdownList.show();
  } else {
    // 隐藏下拉列表
    $('#dropdown-list').empty().hide();
  }
}

function handleButtonClick() {
  var value = $('#input-id').val();
  $.ajax({
    url: '/all?seleItem='+ value,
    success: function(data) {
      // 处理查询结果
      console.log(data);
    }
  });
}



function setFormattedDateToInput(inputId) {
  var today = new Date();
  var month = today.getMonth() + 1; 
  month = month -1;
  if (month < 10) {
    month = '0' + month;
  }
  var formattedDate = today.getFullYear() + '-' + month;
  $('#' + inputId).val(formattedDate);
}

function fetchJson() {
  var seleItem = $('#mySelect').val();
  var workBaseID = $('#input-id').val();

  // 清空表格内容
  $('tbody').empty();
  $('thead tr').empty();

  // 获取输入框的值作为参数
  var inputParam = $('#inputParam').val();

  $.ajax({
     url: '/all?seleItem='+ seleItem +'&data=' + inputParam + '&workBaseID='+workBaseID,
     dataType: 'json',
     success: function(data) {
        var tableHeaders = Object.keys(data[0]);
        var tableRows = '';

        // 创建表头
        $('thead tr').append('<th>序号</th>');
        for (var i = 0; i < tableHeaders.length; i++) {
           $('thead tr').append('<th>' + tableHeaders[i] + '</th>');
        }
        // 创建表格内容
        for (var j = 0; j < data.length; j++) { 
           var rowData = Object.values(data[j]);

           tableRows += '<tr>';
           tableRows += '<td>' + parseInt(j+1) + '</td>';
           for (var k = 0; k < rowData.length; k++) {
              if(k==0){
                tableRows += '<td>' + rowData[k] + '</td>';
                //tableRows += '<td><a href="content.html?flowCode=' + rowData[k] + '" target="_blank">' + rowData[k] + '</a></td>';
              }else{
                 tableRows += '<td>' + rowData[k] + '</td>';
              }
              
           }
           tableRows += '</tr>';
        }

       $('tbody').append(tableRows);
    },
    error: function(error) {
       console.log('获取数据失败:', error);
    }
  });
}