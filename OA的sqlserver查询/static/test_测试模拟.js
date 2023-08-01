function handleInput(value) {
  if (value.length > 2) {
    // 模拟JSON数据
    var data = [
      { name: '选项aaa1', value: 'value1' },
      { name: '选项dd2', value: 'value2' }
    ];

    var dropdownList = $('#dropdown-list');
    dropdownList.empty();
    $.each(data, function(index, item) {
      var option = $('<div>').text(item.name).click(function() {
        $('#input-id').val(item.value);
        dropdownList.empty();
        $('#dropdown-list').empty().hide();
      });
      dropdownList.append(option);
    });

    // 显示下拉列表
    dropdownList.show();
  } else {
    // 隐藏下拉列表
    $('#dropdown-list').empty().hide();
  }
}

function handleButtonClick() {
  var value = $('#input-id').val();
  $.ajax({
    url: 'backend-api-url',
    data: { param: value },
    success: function(data) {
      // 处理查询结果
    }
  });
}