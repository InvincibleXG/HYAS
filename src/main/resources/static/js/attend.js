
function loadMyAttend()
{
    $('#tableAttendance').datagrid({
		url: contextPath+'/attend/statistics',
		title: '考勤统计',
        queryParams:{
            'loginTime': $("#startDate").val(),
            'logoutTime':$("#endDate").val()
        },
		pagination: true,
		singleSelect: true,
		rownumbers: true,
		pageSize: 25,
		pageList: [25, 50, 100],
		nowrap: true,
		// fitColumns: true,
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
					  { field: 'userId', width: '150', align: 'center', title: '账号'},
					  { field: 'userName', width: '150', align: 'center', title: '姓名'},
					  { field: 'loginTime', width: '200', align: 'center', title: '上班时间'},
					  { field: 'logoutTime', width: '200', align: 'center', title: '结束时间'},
				   		]]
	});
}
$(function () {
    $("#reloadItem").click(function () {
        loadMyAttend();
    });
    $("#search").click(function () {
        loadMyAttend();
    });
    $("#report").click(function () {
        window.location.href="./attend/report?loginTime="+$("#startDate").val()+"&logoutTime="+$("#endDate").val();
    });

    loadMyAttend();
});
