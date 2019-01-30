$("#reloadItem").click(function () {
	loadUser();
});
function loadUser()
{
    $('#tableUser').datagrid({
		url: contextPath+'/user/list',
		title: '用户管理',
		pagination: true,
		rownumbers: true,
		pageSize: 25,
		pageList: [25, 50, 100],
		nowrap: true,
		fitColumns: true,
		iconCls: 'icon-view',
		loadMsg: "正在努力加载数据，请稍后...",
		onLoadSuccess: function (data) {
			// 加载完role再获取user
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
    loadUser();
}
function addItem()
{
    $('#useradd').form('submit',
    {
        url : contextPath+'/user/add',
        timeout: 3000,
        onSubmit: function(param){
            $('input.easyui-validatebox[data-options]').eq(0).focus();
    	    var isValid = $(this).form('validate');
    		if (!isValid) return false;
    		everPost=1;
    	},
        success:function(data) {
            everPost=0;
            if (data=="1"){
                $('#useradd').form('reset');
                $.messager.alert("提交结果", "添加成功!", "info");
                $('#add').dialog('close');
                $('#tableUser').datagrid('reload');
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "记录添加失败!", "error");
    			return;
    		}
            if (data=="-1") {
                $.messager.alert("提示", "权限不足!", "error");
                return;
            }
    		if (data=="-2") {
    		    $.messager.alert("提示", "用户名已存在!", "error");
    			return;
    		}
            $.messager.alert("提示", data, "error");
    	},
    	error:function(xhr,type,errorThrown) {
    	    //异常处理
    	    console.log(xhr.status+type+errorThrown);
    	}
    });
}
function updateItem()
{
    $('#userupdate').form('submit',
    {
        url : contextPath+'/user/update',
        timeout: 3000,
        onSubmit: function(param){
    	    var isValid = $(this).form('validate');
    		if (!isValid) return false;
    		everPost=1;
    	},
        success:function(data) {
            everPost=0;
            if (data=="1"){
                $('#userupdate').form('reset');
                $.messager.alert("提交结果", "修改成功!","info");
                $('#update').dialog('close');
                $('#tableUser').datagrid('reload');
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "记录修改失败!","error");
    			return;
    		}
            if (data=="-1") {
                $.messager.alert("提示", "权限不足!", "error");
                return;
            }
            if (data=="-2") {
                $.messager.alert("提示", "用户名已存在!", "error");
                return;
            }
            $.messager.alert("提示", data, "error");

    	},
    	error:function(xhr,type,errorThrown) {
    	    //异常处理
            console.log(xhr.status+type+errorThrown);
    	}
    });
}
function deleteItem()
{
    var rows = $('#tableUser').datagrid('getSelections');
    if (rows.length==0) {
        $.messager.alert("提示", "您还没选择要删除的数据项!","warning");
        return;
    }
    $.messager.confirm("确认", "您确认要删除选中数据项吗?", function (r){
        if (r) {
    	    for (var i in rows) {
    		    $.ajax({
    			    url: contextPath+'/user/delete',
    				type:'post', //HTTP请求类型
    				async: false,
    				data:   {
    				        'guid': rows[i].guid
    				        },
    				timeout:10000, //超时时间设置为10
    				success: function(data) {
    				    if (data=="null" || data=='0') {
    				        $.messager.alert("提示", "删除失败! 请刷新后重试! ", "error");
    				    	return;
    				    }
    				    if (i>=rows.length-1) $('#tableUser').datagrid('reload');
    				}
    		    });
    		}
    	 }
    });
}
