function getPerformance()
{
    $('#tt').datagrid(
    {
        url: 'getData',
        title: '绩效统计',
        pagination: true,
    	rownumbers: true,
        pageSize: 25,
        pageList: [25, 50, 100],
        nowrap: true,
    	fitColumns: true,
        iconCls: 'icon-view',
        loadMsg: "正在努力加载数据，请稍后...",
        onLoadSuccess: function (data) {
            if (data==null || data=="null" || data.total == 0) {
    		    $.messager.alert({title: '检索结果',msg: '无相关结果!',icon: 'info',width: 300, top: 300 });
    			$(this).closest('div.datagrid-wrap').find('div.datagrid-pager').hide();
    	    } else $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').show();
    	},
        columns: [[
    		    { field: 'handler', width: '200', align: 'center', title: '任务处理人', formatter:function(value,row,index){ return sessionStorage.getItem(row.handler);}},
    			{ field: 'taskCount', width: '200', align: 'center', title: '处理任务数量'},
    		    { field: 'summaryTime', width: '200', align: 'center', title: '总占用时间(h)'},
    		    { field: 'averageTime', width: '200', align: 'center', title: '平均处理时间(h)'}
                ]],
    });
}
function getReport()
{
    var url='http://'+location.hostname+':'+location.port+'/performance/reporter';
    location.href=url;
}
