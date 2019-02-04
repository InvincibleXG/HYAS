$("#reloadItem").click(function () {
	loadMyWork();
});
function loadMyWork()
{
    $('#tableWork').datagrid({
		url: contextPath+'/work/list',
		title: '今日接单',
		pagination: true,
		singleSelect: true,
		rownumbers: true,
		pageSize: 25,
		pageList: [25, 50, 100],
		nowrap: true,
		fitColumns: true,
		iconCls: 'icon-view',
		loadMsg: "正在努力加载数据，请稍后...",
		onLoadSuccess: function (data) {
			if (data==null || data=="null") $.messager.alert({ title: '加载失败',msg: '数据加载失败! 请稍后重试!!', icon: 'warning', width: 360, top: 300 });
			if (data.total == 0) {
			  var body = $(this).data().datagrid.dc.body2;
			  body.height(50);
			  body.find('table tbody').append('<tr><td width="' + body.width() + '" style="height: 35px; text-align: center;"><h1>暂无数据</h1></td></tr>');
			//   $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').hide();
			// }else{
			// 	$(this).closest('div.datagrid-wrap').find('div.datagrid-pager').show();
            }
        },
		  columns: [[
					  { field: 'guid', width: '233', align: 'center', title: '唯一编号', hidden:'true'},
					  { field: 'userId', width: '150', align: 'center', title: '账号'},
					  { field: 'userName', width: '150', align: 'center', title: '姓名'},
					  { field: 'role', width: '120', align: 'center', title: '角色'},
					  { field: 'createTime', width: '160', align: 'center', title: '创建时间'},
					  { field: 'phone', width: '150', align: 'center', title: '手机号'},
					  { field: 'email', width: '150', align: 'center', title: '邮箱'}
				   		]]
	});
}
function doSearch()
{
    loadMyWork();
}
function deleteItem()
{
    var rows = $('#tableWork').datagrid('getSelections');
    if (rows.length!=1) {
        $.messager.alert("提示", "请选择一条记录进行订单取消操作!","warning");
        return;
    }
    $.messager.confirm("确认", "您确认要取消选中订单吗?", function (r){
        if (r) {
    	    for (var i in rows) {
    		    $.ajax({
    			    url: contextPath+'/work/cancel',
    				type:'post', //HTTP请求类型
    				async: false,
    				data:   {
    				        'guid': rows[i].guid
    				        },
    				timeout:10000, //超时时间设置为10
    				success: function(data) {
    				    if (data=="null" || data=='0') {
    				        $.messager.alert("提示", "取消失败! 请刷新后重试! ", "error");
    				    	return;
    				    }
    				    if (i>=rows.length-1) $('#tableWork').datagrid('reload');
    				}
    		    });
    		}
    	 }
    });
}
