function loadGroup()
{
    $.ajax({
        url: 'list',
        type: 'POST',
        timeout: 3000,
        dataType: 'json',
        success: function(data)
        {
            if (data==null)
            {
                $.messager.alert({title: '加载失败',msg: '数据加载失败! 请稍后重试!!', icon: 'warning', width: 360, top: 300  });
                return;
            }
            loadTree(data);
        },
        error:function(retMsg)
        {
            console.log(retMsg);
        }
    });
}

function addItem()
{
    $('#groupadd').form('submit',
    {
        url : 'add',
        timeout: 3000,
        onSubmit: function(param){
            $('input.easyui-validatebox[data-options]').eq(0).focus();
    	    var isValid = $(this).form('validate');
    		if (!isValid) return false;
    		if($("#typea").val()=='1' && $("#pguida").val()!="TOP"){
                $.messager.alert("提示", "区域的子节点类型不可以是区域!","error");
    		    return false;
    		}
    		if($("#typea").val()=='2' && $("#pguida").val()=="TOP"){
                $.messager.alert("提示", "分公司必须挂在区域节点下!","error");
    		    return false;
    		}
    		everPost=1;
    	},
        success:function(data) {
            everPost=0;
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "记录添加失败!","error");
    			return;
    		}
    		if (data=="-3") {
    		    $.messager.alert("提示", "同类型的组织名重复!","error");
    			return;
    		}
    		$('#groupadd').form('reset');
    		if (data=="1") $.messager.alert("提交结果", "添加成功!","info");
    		$('#add').dialog('close');
    		loadGroup();
    	},
    	error:function(xhr,type,errorThrown) {
    	    everPost=0;
    	    console.log("异常"+type);
    	}
    });
}

function updateItem()
{
    $('#groupupdate').form('submit',
    {
        url : 'update',
        timeout :3000,
        onSubmit: function(param){
    	    var isValid = $(this).form('validate');
    		if (!isValid) return false;
    		if($("#typeu").val()=='1' && $("#pguidu").val()!="TOP"){
                $.messager.alert("提示", "区域必须挂在根TOP节点下!","error");
    		    return false;
    		}
    		if($("#typeu").val()=='2' && $("#pguidu").val()=="TOP"){
                $.messager.alert("提示", "分公司必须挂在区域节点下!","error");
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
    		    $.messager.alert("提示", "同类型的组织名重复!","error");
    			return;
    		}
    		$('#groupupdate').form('reset');
    		$.messager.alert("提交结果", "修改成功!","info");
    		$('#update').dialog('close');
    		loadGroup();
    	},
    	error:function(xhr,type,errorThrown) {
    	    everPost=0;
    	    console.log("异常"+type);
    	}
    });
}

function deleteItem()
{
    var nodeGuid=$('#iguid').val();
    var nodeType=$('#itype').val();
    var msg="";
    if (nodeType=='1') msg="删除存在子节点的区域节点会导致不可预料的后果，请确保无子节点时再进行删除!";
    else if (nodeType=='2') msg="确认要删除此分公司吗?";
    else{
        $.messager.alert("错误", "请求无效! ","error");
        return;
    }
    $.messager.confirm("确认", msg, function (r){
        if (r) {
    		    $.ajax({
    			    url: 'delete',
    				type:'post', //HTTP请求类型
    				data:   {
    				        'guid': nodeGuid,
    				    	'modifier': JSON.parse(sessionStorage.getItem("user")).userid
    				        },
    				timeout:3000,
    				success: function(data) {
    				    if (data=="null" || data=='0') {
    				        $.messager.alert("提示", "删除失败! 请刷新后重试! ","error");
    				    	return;
    				    }
    				    loadGroup();
    				}
    		    });
    	}
    });
}
