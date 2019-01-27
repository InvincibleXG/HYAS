function loadAuthority()
{
    //先加载role信息
    $.ajax({
        url: '/role/getall',
        type: 'POST',
        async: false,
        timeout: 1000,
        dataType: 'json',
        data: {},
        success: function(data){
            var roles=data; //传过来就是object
            $("#roleselecta").empty();
            $("#roleselectu").empty();
            for (var i in roles){
                $("#roleselecta").append("<option value='"+roles[i].guid+"'>"+roles[i].name+"</option>");
                $("#roleselectu").append("<option value='"+roles[i].guid+"'>"+roles[i].name+"</option>");
                sessionStorage.setItem(roles[i].guid, roles[i].name);
            }
        },
        error:function(retMsg) {
            console.log(retMsg);
        }
    });
    $('#tt').datagrid(
	{
			    url: 'list',
			    title: '权限管理',
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
			                 //{ field: 'roleGuid', width: '233', align: 'center', title: '角色编号'},
			                 { field: 'roleGuid', width: '100', align: 'center', title: '角色类型', formatter:function(value,row,index){ return sessionStorage.getItem(row.roleGuid);} },
			                 { field: 'authorityBackgroundData', width: '100', align: 'center', title: '后台数据维护', formatter:function(value,row,index){ if(row.authorityBackgroundData=="true") return "是"; else return "否";} },
			                 { field: 'authorityCreateProject', width: '100', align: 'center', title: '创建项目', formatter:function(value,row,index){ if(row.authorityCreateProject=="true") return "是"; else return "否";} },
			                 { field: 'authorityPricingEdit', width: '100', align: 'center', title: '编辑计价任务', formatter:function(value,row,index){ if(row.authorityPricingEdit=="true") return "是"; else return "否";} },
			                 { field: 'authorityPricingReport', width: '100', align: 'center', title: '计价任务报表', formatter:function(value,row,index){ if(row.authorityPricingReport=="true") return "是"; else return "否";} },
			                 { field: 'authorityContractEdit', width: '100', align: 'center', title: '编辑合同任务', formatter:function(value,row,index){ if(row.authorityContractEdit=="true") return "是"; else return "否";} },
			                 { field: 'authorityContractReport', width: '100', align: 'center', title: '合同任务报表', formatter:function(value,row,index){ if(row.authorityContractReport=="true") return "是"; else return "否";} },
			                 { field: 'authorityBackletterEdit', width: '100', align: 'center', title: '编辑保函任务', formatter:function(value,row,index){ if(row.authorityBackletterEdit=="true") return "是"; else return "否";} },
			                 { field: 'authorityBackletterReport', width: '100', align: 'center', title: '保函任务报表', formatter:function(value,row,index){ if(row.authorityBackletterReport=="true") return "是"; else return "否";} },
			                 { field: 'authorityAgreementEdit', width: '100', align: 'center', title: '编辑协议任务', formatter:function(value,row,index){ if(row.authorityAgreementEdit=="true") return "是"; else return "否";} },
			                 { field: 'authorityAgreementReport', width: '100', align: 'center', title: '协议任务报表', formatter:function(value,row,index){ if(row.authorityAgreementReport=="true") return "是"; else return "否";} },
			                 { field: 'authorityAgencyfeeEdit', width: '100', align: 'center', title: '编辑代理费任务', formatter:function(value,row,index){ if(row.authorityAgencyfeeEdit=="true") return "是"; else return "否";} },
			                 { field: 'authorityAgencyfeeReport', width: '100', align: 'center', title: '代理费任务报表', formatter:function(value,row,index){ if(row.authorityAgencyfeeReport=="true") return "是"; else return "否";} },
			                 { field: 'authorityTenderEdit', width: '120', align: 'center', title: '编辑投标保证金任务', formatter:function(value,row,index){ if(row.authorityTenderEdit=="true") return "是"; else return "否";} },
			                 { field: 'authorityTenderReport', width: '120', align: 'center', title: '投标保证金任务报表', formatter:function(value,row,index){ if(row.authorityTenderReport=="true") return "是"; else return "否";} },
			                 { field: 'authorityEnquiryEdit', width: '100', align: 'center', title: '编辑询价任务', formatter:function(value,row,index){ if(row.authorityEnquiryEdit=="true") return "是"; else return "否";} },
			                 { field: 'authorityEnquiryReport', width: '100', align: 'center', title: '询价任务报表', formatter:function(value,row,index){ if(row.authorityEnquiryReport=="true") return "是"; else return "否";} },
			                 { field: 'authoritySealRead', width: '100', align: 'center', title: '盖章任务查看', formatter:function(value,row,index){ if(row.authoritySealRead=="true") return "是"; else return "否";} },
			                 { field: 'authoritySealEdit', width: '100', align: 'center', title: '盖章任务编辑', formatter:function(value,row,index){ if(row.authoritySealEdit=="true") return "是"; else return "否";} },
			                 { field: 'authoritySealReport', width: '100', align: 'center', title: '盖章任务报表', formatter:function(value,row,index){ if(row.authoritySealReport=="true") return "是"; else return "否";} }
							]],
			});
}
function addItem()
{
    $('#authorityadd').form('submit',
    {
        url : 'add',
        timeout: 3000,
        onSubmit: function(param){
            $('input.easyui-validatebox[data-options]').eq(0).focus();
    	    var isValid = $(this).form('validate');
    		if (!isValid) return false;
    		everPost=1;
    	},
        success:function(data) {
            everPost=0;
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "记录添加失败! 请不要重复添加角色权限!","error");
    		    $('#add').dialog('close');
    			return;
    		}
    		$('#authorityadd').form('reset');
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
    $('#authorityupdate').form('submit',
    {
        url : 'update',
        timeout: 3000,
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
    		$('#authorityupdate').form('reset');
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
    				data:   {
    				        'id': rows[i].id
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
