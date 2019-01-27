function loadSaler()
{
    $('#tt').datagrid(
	{
			    url: 'list',
			    title: '销售管理',
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
			                 { field: 'saler', width: '150', align: 'center', title: '销售名'},
			                 { field: 'region', width: '120', align: 'center', title: '地区', formatter:function(value,row,index){ return sessionStorage.getItem(row.region);} },
                             { field: 'branch', width: '150', align: 'center', title: '分公司', formatter:function(value,row,index){ return sessionStorage.getItem(row.branch);} },
			                 { field: 'creator', width: '150', align: 'center', title: '创建者', formatter:function(value,row,index){ return sessionStorage.getItem(row.creator);} },
			                 { field: 'createDate', width: '160', align: 'center', title: '创建时间'},
			                 { field: 'modifier', width: '150', align: 'center', title: '修改者', formatter:function(value,row,index){ return sessionStorage.getItem(row.modifier);} },
			                 { field: 'modifyDate', width: '160', align: 'center', title: '修改时间'}
							]],
	});
	// 获取区域分公司信息
	$.ajax({
        url: '/group/regions',
        type:'post', //HTTP请求类型
        timeout:3000, //超时时间设置为3s
        success: function(data) {
            if (data==null || data=='null') {
                console.log("Can't get regions data");
            }
            var regions=JSON.parse(data);
            $("#regionselecta").empty();
            $("#regionselectu").empty();
            for (var i in regions)
            {
                sessionStorage.setItem(regions[i].guid,regions[i].name);
                $("#regionselecta").append("<option value='"+regions[i].guid+"'>"+regions[i].name+"</option>");
                $("#regionselectu").append("<option value='"+regions[i].guid+"'>"+regions[i].name+"</option>");
            }
        },
        error:function(retMsg){
            console.log(retMsg);
        }
    });
}

function doSearch()
{
    $('#tt').datagrid(
    	{
    			    url: 'search',
    			    title: '销售管理',
    			    pagination: true,
    			    rownumbers: true,
    			    queryParams:{
                                "saler": $('#inname').val()
                        		},
    			    pageSize: 25,
                    pageList: [25, 50, 100],
    			    nowrap: true,
    			    fitColumns: true,
    			    iconCls: 'icon-view',
    			    loadMsg: "正在努力加载数据，请稍后...",
    			    onLoadSuccess: function (data)
    			    {
    			        if (data==null || data=="null")
    			            $.messager.alert(
                            	    	{
                                            title: '加载失败',
                                            msg: '数据加载失败! 请稍后重试!!',
                                            icon: 'warning',
                                            width: 360,
                                            top: 300
                                        });
    			        if (data.total == 0)
    			        {
    			          $.messager.alert({title: '检索结果',msg: '无相关结果!',icon: 'info',width: 300, top: 300 });
    			          $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').hide();
    			        }
    			        else $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').show();
    			      },
    			     columns: [[
                     		 { field: 'guid', width: '233', align: 'center', title: '唯一编号'},
			                 { field: 'saler', width: '150', align: 'center', title: '销售名'},
			                 { field: 'region', width: '120', align: 'center', title: '地区', formatter:function(value,row,index){ return sessionStorage.getItem(row.region);} },
                             { field: 'branch', width: '150', align: 'center', title: '分公司', formatter:function(value,row,index){ return sessionStorage.getItem(row.branch);} },
			                 { field: 'creator', width: '150', align: 'center', title: '创建者', formatter:function(value,row,index){ return sessionStorage.getItem(row.creator);} },
			                 { field: 'createDate', width: '160', align: 'center', title: '创建时间'},
			                 { field: 'modifier', width: '150', align: 'center', title: '修改者', formatter:function(value,row,index){ return sessionStorage.getItem(row.modifier);} },
			                 { field: 'modifyDate', width: '160', align: 'center', title: '修改时间'}
                     		]],
    			});
}

function addItem()
{
    $('#saleradd').form('submit',
    {
        url : 'add',
        timeout: 3000,
        onSubmit: function(param){
            $('input.easyui-validatebox[data-options]').eq(0).focus();
    	    var isValid = $(this).form('validate');
    		if (!isValid) return false;
    		if ($("#branchselecta").val()==null || $("#branchselecta").val()==''){
    		    $.messager.alert("提示", "分公司不可以为空!","error");
    		    return false;
    		}
    		everPost=1;
    	},
        success:function(data) {
            everPost=0;
            if (data=="-3") {
                $.messager.alert("提示", "同一地区分公司下已有此销售名!","error");
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "记录添加失败!","error");
    		    return;
    		}
    		$('#saleradd').form('reset');
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
    $('#salerupdate').form('submit',
    {
        url : 'update',
        timeout:3000,
        onSubmit: function(param){
    	    var isValid = $(this).form('validate');
    		if (!isValid) return false;
    		if ($("#branchselectu").val()==null || $("#branchselectu").val()==''){
    		    $.messager.alert("提示", "分公司不可以为空!","error");
    		    return false;
    		}
    		everPost=1;
    	},
        success:function(data) {
            everPost=0;
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "记录修改失败!","error");
    			return;
    		}
    		if (data=="-3") {
    		    $.messager.alert("提示", "同一地区分公司下已有此销售名!","error");
    		    return;
    		}
    		$('#salerupdate').form('reset');
    		$.messager.alert("提交结果", "修改成功!","info");
    		$('#update').dialog('close');
    		$('#tt').datagrid('reload');
    	},
    	error:function(xhr,type,errorThrown) {
    	    //异常处理
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

function getBranches(pguid,op)
{
    $.ajax({
        url: '/group/branches',
        type:'post', //HTTP请求类型
        async: false,
        data: { 'pguid': pguid },
        timeout:3000, //超时时间设置为3s
        success: function(data) {
                            if (data==null || data=='null') {
                                console.log("Can't get branches data");
                            }
                            var branches=JSON.parse(data);
                            if (op=="add")
                            {
                                $("#branchselecta").empty();
                                for (var i in branches) {
                                    sessionStorage.setItem(branches[i].guid,branches[i].name);
                                    $("#branchselecta").append("<option value='"+branches[i].guid+"'>"+branches[i].name+"</option>");
                                }
                            }
                            else if (op=="update")
                            {
                                $("#branchselectu").empty();
                                for (var i in branches) {
                                    sessionStorage.setItem(branches[i].guid,branches[i].name);
                                    $("#branchselectu").append("<option value='"+branches[i].guid+"'>"+branches[i].name+"</option>");
                                }
                            }

        },
        error:function(retMsg){
            console.log(retMsg);
        }
     });
}

function getAllBranches()
{
    $.ajax({
        url: '/group/branchesA',
        type:'post', //HTTP请求类型
        timeout:3000, //超时时间设置为3s
        success: function(data) {
            if (data==null || data=='null') {
                console.log("Can't get all branches data");
            }
            var branches=JSON.parse(data);
            for (var i in branches) {
                sessionStorage.setItem(branches[i].guid,branches[i].name);
            }
        },
        error:function(retMsg){
            console.log(retMsg);
        }
    });
}
