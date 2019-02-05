
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
					  // { field: 'userId', width: '150', align: 'center', title: '账号'},
					  { field: 'userName', width: '150', align: 'center', title: '姓名'},
					  { field: 'startTime', width: '120', align: 'center', title: '开始时间'},
					  { field: 'endTime', width: '160', align: 'center', title: '结束时间'},
					  // { field: 'createTime', width: '160', align: 'center', title: '创建时间'},
					  { field: 'status', width: '150', align: 'center', title: '状态', formatter:function(value,row,index){ if (row.status!=0)return "正常"; else return "取消";}},
					  { field: 'remark', width: '150', align: 'center', title: '备注'}
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

    		}
    	 }
    });
}
$(function () {
    $("#reloadItem").click(function () {
        loadMyWork();
    });
    $("#cancelItem").click(function () {
        var rows = $('#tableWork').datagrid('getSelections');
        if (rows.length!=1) {
            $.messager.alert("提示", "请选择一条记录进行订单取消操作!","warning");
            return false;
        }
        $.messager.prompt({
            title: '订单取消',
            msg: '您可以注明取消的原因:',
            fn: function(remark){
                if (remark!=null){ // 点了确定
                    if (everPost==1) {
                        $.messager.alert("提示", "请求已经发出, 请稍等...","warning");
                        return false;
                    }
                    everPost=1;
                    $.ajax({
                        url: contextPath+'/work/cancel',
                        type:'post', //HTTP请求类型
                        data:   {
                            'guid': rows[0].guid,
                            'remark': remark
                        },
                        timeout:10000, //超时时间设置为10
                        success: function(data) {
                            everPost=0;
                            if (data=="null" || data=='0') {
                                $.messager.alert("提示", "取消失败! 请刷新后重试! ", "error");
                                return;
                            }else if (data=="1") {
                                $.messager.alert("提示", "已将此单取消! ", "info");
                                $('#tableWork').datagrid('reload');
                                return
                            }else if(data=="-1") {
                                $.messager.alert("提示", "登录失效", "error");
                                return;
                            }else if(data=="-2") {
                                $.messager.alert("提示", "参数错误", "error");
                                return;
                            }else{
                                $.messager.alert("提示", data, "error");
                            }

                        },
                        error:function(xhr,type,errorThrown) {
                            everPost=0;
                            console.log(xhr.status+type+errorThrown);
                        }
                    });
                }
            }
        });
    });
    $('#add').click(function () {
        var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
        var start=$("#start").val();
        var end=$("#end").val();
        if (start==null || !start.match(reg)) {
            $.messager.alert("提示", "接单起始时间不规范!", "warning");
            return false;
        }
        if (end==null || !end.match(reg)) {
            $.messager.alert("提示", "接单结束时间不规范!", "warning");
            return false;
        }
        if (end<=start){
            $.messager.alert("提示", "结束时间必须大于起始时间!", "warning");
            return false;
        }
        if (everPost==1) {
            $.messager.alert("提示", "请求已经发出, 请稍等...","warning");
            return false;
        }
        everPost=1;
        $.ajax({
            url:contextPath+"/work/record",
            type:'post',
            data:{'start':start, 'end':end},
            timeout:10000,
            success:function (data) {
                everPost=0;
                if (data=="1"){
                    $.messager.alert("提交结果", "录入成功!","info");
                    $('#start').val('');
                    $('#end').val('');
                    $('#tableWork').datagrid('reload');
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
                    $.messager.alert("提示", "参数错误!", "error");
                    return;
                }
                $.messager.alert("提示", data, "error");
            },
            error:function(xhr,type,errorThrown) {
                everPost=0;
                console.log(xhr.status+type+errorThrown);
            }
        });
    });

    loadMyWork();
});
