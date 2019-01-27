function getPersonmance()
{
    var userid=null;
    var v=$("#handler").val();
    var createTimeStart = $("#createTimeStart").val();
    var createTimeEnd = $("#createTimeEnd").val();
    var commitTimeStart = $("#commitTimeStart").val();
    var commitTimeEnd = $("#commitTimeEnd").val();
    if (v!="") {
        var option=$("option[value='"+v+"']");
        if (option.length!=1) console.log("处理人 非法输入");
        else userid=option[0].getAttribute("tag");
        if (userid==null){
            $.messager.alert("提示", "请输入给定范围内的合法用户!", "warning");
            return;
        }
    }
    $('#tt').datagrid(
    {
        url: 'getData',
        title: '个人绩效',
        pagination: true,
    	rownumbers: true,
    	queryParams:{
    		    "handler": userid,
                "createTimeStart":createTimeStart,
                "createTimeEnd":createTimeEnd,
                "commitTimeStart":commitTimeStart,
                "commitTimeEnd":commitTimeEnd
                    },
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
                { field: 'createTime', width: '200', align: 'center', title: '创建时间'},
    		    { field: 'handler', width: '200', align: 'center', title: '任务处理人', formatter:function(value,row,index){ return sessionStorage.getItem(row.handler);}},
    			{ field: 'cscNum', width: '160', align: 'center', title: 'CSC号'},
    			{ field: 'projectName', width: '200', align: 'center', title: '项目名称'},
    		    { field: 'count', width: '120', align: 'center', title: '台量'},
    		    { field: 'taskName', width: '200', align: 'center', title: '任务名称'},
    		    { field: 'taskType', width: '200', align: 'center', title: '任务类型'},
    		    { field: 'subTaskType', width: '200', align: 'center', title: '任务子类型'},
    	        { field: 'holdingTime', width: '200', align: 'center', title: '占用时间(h)'},
    	        { field: 'commitTime', width: '200', align: 'center', title: '任务完成时间'},
    	        { field: 'finishType', width: '120', align: 'center', title: '完成类型'}
                ]]
    });
}
function fillDataList()
{
    $.ajax({
        url: '/performance/getHandler',
        type:'post',
        timeout:3000,
        success: function(data) {
     	    if (data==null || data=='null') {
     		    console.log("can't get handlers");
     		    return;
     	    }
     	    var handlers=JSON.parse(data);
     	    $("#users").empty();
     	    for (var i in handlers)
     	        $("#users").append("<option tag='"+handlers[i]+"' value='"+sessionStorage.getItem(handlers[i])+"'></option>");
     	}
    });
}
function getReport()
{
    var v=$("#handler").val();
    var createTimeStart = $("#createTimeStart").val();
    var createTimeEnd = $("#createTimeEnd").val();
    var commitTimeStart = $("#commitTimeStart").val();
    var commitTimeEnd = $("#commitTimeEnd").val();
    if (v!="") {
        var option=$("option[value='"+v+"']");
        if (option.length!=1) console.log("处理人 非法输入");
        else v=option[0].getAttribute("tag")
        if (v==null){
            $.messager.alert("提示", "请输入给定范围内的合法用户!","warning");
            return;
        }
    }
    var url='http://'+location.hostname+':'+location.port+'/personmance/reporter?handler='+v+'&createTimeStart='+createTimeStart+'&createTimeEnd='+createTimeEnd
        +'&commitTimeStart='+commitTimeStart+'&commitTimeEnd='+commitTimeEnd;
    location.href=url;
}
