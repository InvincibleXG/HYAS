function loadRole()
{
    $('#tt').datagrid(
	{
			    url: 'list',
			    title: '角色管理',
			    pagination: true,
			    rownumbers: true,
			    pageSize: 25,
                pageList: [25, 50, 100],
			    nowrap: true,
			    fitColumns: true,
			    iconCls: 'icon-view',
			    loadMsg: "正在努力加载数据，请稍后...",
			    onLoadSuccess: function (data)
			    {
			        if (data==null || data=="null")
			            $.messager.alert({title: '加载失败',msg: '数据加载失败! 请稍后重试!!', icon: 'warning', width: 360, top: 300  });
			        if (data.total == 0)
			        {
			          var body = $(this).data().datagrid.dc.body2;
			          body.find('table tbody').append('<tr><td width="' + body.width() + '" style="height: 35px; text-align: center;"><h1>暂无数据</h1></td></tr>');
			          $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').hide();
			        }
			        else $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').show();
			      },
			      columns: [[
			                 { field: 'guid', width: '233', align: 'center', title: '唯一编号'},
			                 { field: 'name', width: '150', align: 'center', title: '角色类型'},
			                 { field: 'description', width: '300', align: 'center', title: '描述'},
			                 { field: 'creator', width: '150', align: 'center', title: '创建者', formatter:function(value,row,index){ return sessionStorage.getItem(row.creator);} },
			                 { field: 'createDate', width: '160', align: 'center', title: '创建时间'},
			                 { field: 'modifier', width: '150', align: 'center', title: '修改者', formatter:function(value,row,index){ return sessionStorage.getItem(row.modifier);} },
			                 { field: 'modifyDate', width: '160', align: 'center', title: '修改时间'}
							]],
			});
}

function addItem()
{
    $('#roleadd').form('submit',
    {
        url : 'add',
        timeout:3000,
        onSubmit: function(param){
            $('input.easyui-validatebox[data-options]').eq(0).focus();
    	    var isValid = $(this).form('validate');
    		if (!isValid) return false;
    		everPost=1;
    	},
        success:function(data) {
            everPost=0;
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "记录添加失败!","error");
    			    return;
    		}
    		if (data=="-3") {
    		    $.messager.alert("提示", "角色名重复!","error");
    		    return;
    		}
    		$('#roleadd').form('reset');
    		$.messager.alert("提交结果", "添加成功!","info");
    		$('#add').dialog('close');
    		$('#tt').datagrid('reload');
    	},
    	error:function(xhr,type,errorThrown) {
    	    console.log("异常"+type);
    	}
    });
}

function updateItem()
{
    $('#roleupdate').form('submit',
    {
        url : 'update',
        timeout:3000,
        onSubmit: function(param){
    	    var isValid = $(this).form('validate');
    		if (!isValid) return false;
    		everPost=1;
    	},
        success:function(data) {
            everPost=0;
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "记录修改失败!","error");
    		    return;
    		}
    		if (data=="-3") {
    		    $.messager.alert("提示", "角色名重复!","error");
    		    return;
    		}
    		$('#roleupdate').form('reset');
    		$.messager.alert("提交结果", "修改成功!","info");
    		$('#update').dialog('close');
    		$('#tt').datagrid('reload');
    	},
    	error:function(xhr,type,errorThrown) {
    	    console.log("异常"+type);
    	}
    });
}

function deleteItem()
{
    var rows = $('#tt').datagrid('getSelections');
    if (rows.length==0) {
        $.messager.alert("提示", "您还没选择要删除的数据项!","warning");
        return;
    }
    $.messager.confirm("确认", "删除操作不可逆转, 您确认要删除选中数据项吗?", function (r){
        if (r) {
    	    for (var i in rows) {
    		    $.ajax({
    			    url: 'delete',
    				type:'post', //HTTP请求类型
    				async: false,
    				data:   {
    				        'guid': rows[i].guid,
    				    	'modifier': JSON.parse(sessionStorage.getItem("user")).userid
    				        },
    				timeout:10000, //超时时间设置为10
    				success: function(data) {
    				    if (data=="null" || data=='0') {
    				        $.messager.alert("提示", "删除失败! 请刷新后重试! ","error");
    				    	return;
    				    }
    				    if (i>=rows.length-1) $('#tt').datagrid('reload');
    				}
    		    });
    		}
    	 }
    });
}