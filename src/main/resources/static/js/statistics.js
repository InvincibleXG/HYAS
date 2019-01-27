function loadStatistics()
{
    $('#tt').datagrid(
    	{
    	    url: 'list',
    	    title: '项目统计',
    	    pagination: true,
    		rownumbers: true,
    	    queryParams:{
    		        "handler": JSON.parse(sessionStorage.getItem("user")).userid
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
    		    }else $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').show();
    	    },
    	    columns: [[
    	                { field: 'taskCount', width: '150', align: 'center', title: '创建时间'},
    			        { field: 'region', width: '120', align: 'center', title: '地区'},
    			        { field: 'branch', width: '150', align: 'center', title: '分公司'},
    			        { field: 'cscNum', width: '120', align: 'center', title: 'CSC号'},
    			        { field: 'projectName', width: '150', align: 'center', title: '项目名称'},
    			        { field: 'count', width:'100', align: 'center', title: '台量'},
    			        { field: 'creator', width: '150', align: 'center', title: '处理人', formatter:function(value,row,index){ return sessionStorage.getItem(row.creator);} },
    			        { field: 'type', width: '120', align: 'center', title: '任务类型'},
    			        { field: 'subtype', width: '120', align: 'center', title: '任务子类型'},
    			        { field: 'backSheet', width: '80', align: 'center', title: '退单数'},
                        { field: 'remark', width: '200', align: 'center', title: '任务备注信息'}
    				]]
        });
}
function searchStatistics()
{
     $('#tt').datagrid(
    	{
    			    url: 'getData',
    			    title: '项目统计',
    			    pagination: true,
    			    rownumbers: true,
    			    queryParams:{
    			                "csc": $('#csc').val(),
    			                "project": $('#project').val(),
    			                "region": $('#region').val(),
    			                "branch": $('#branch').val(),
    			                "start": $('#instart').val(),
                                "end": $('#inend').val(),
    			                "handler": JSON.parse(sessionStorage.getItem("user")).userid
    			                },
    			    pageSize: 25,
    			    pageList: [25, 50, 100],
    			    nowrap: true,
    			    fitColumns: true,
    			    iconCls: 'icon-view',
    			    loadMsg: "正在努力加载数据，请稍后...",
    			    onLoadSuccess: function (data)
    			    {
    			        if (data==null || data=="null" || data.total == 0)
    			        {
    			          $.messager.alert({title: '检索结果',msg: '无相关结果!',icon: 'info',width: 300, top: 300 });
    			          $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').hide();
    			        }
    			        else $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').show();
    			      },
    			      columns: [[
    			                 { field: 'taskCount', width: '150', align: 'center', title: '创建时间'},
    			                 { field: 'region', width: '120', align: 'center', title: '地区'},
    			                 { field: 'branch', width: '150', align: 'center', title: '分公司'},
    			                 { field: 'cscNum', width: '120', align: 'center', title: 'CSC号'},
    			                 { field: 'projectName', width: '150', align: 'center', title: '项目名称'},
    			                 { field: 'count', width:'80', align: 'center', title: '台量'},
    			                 { field: 'creator', width: '150', align: 'center', title: '处理人', formatter:function(value,row,index){ return sessionStorage.getItem(row.creator);} },
    			                 { field: 'type', width: '120', align: 'center', title: '任务类型'},
    			                 { field: 'subtype', width: '120', align: 'center', title: '任务子类型'},
    			                 { field: 'backSheet', width: '80', align: 'center', title: '退单数'},
                                { field: 'remark', width: '200', align: 'center', title: '任务备注信息'}
    							]]
    			});
}
function getReport()
{
    var user=JSON.parse(sessionStorage.getItem("user"));
    if (user==null) return;
    var url='http://'+location.hostname+':'+location.port+'/statistics/reporter?handler='+user.userid+
    '&csc='+$("#csc").val()+'&project='+$("#project").val()+'&region='+$("#region").val()+'&branch='+$("#branch").val()+'&start='+$("#instart").val()+'&end='+$("#inend").val();
    location.href=url;
}
function getNeedInfo()
{
    $.ajax({
        url: '/group/regions',
        type:'post',
        timeout:3000,
        success: function(data) {
     	    if (data==null || data=='null') {
     		    console.log("can't get regions");
     		    return;
     	    }
     	    var regions=JSON.parse(data);
     	    $("#r").empty();
     	    for (var i in regions)
     	        $("#r").append("<option tag='"+regions[i].guid+"' value='"+regions[i].name+"'></option>");
     	}
    });
}
function getBranches()
{
    $("#b").empty();
    var regionselected=$("#region").val();
    if(regionselected=="") return;
    var pguid=$("option[value='"+regionselected+"']").attr("tag");
    if (pguid==null) return;
    $.ajax({
        url: '/group/branches',
        type:'post', //HTTP请求类型
        data: { 'pguid': pguid },
        timeout:3000, //超时时间设置为3s
        success: function(data) {
            if (data==null || data=='null') {
                console.log("Can't get branches");
            }
            var branches=JSON.parse(data);
            for (var i in branches) {
                $("#b").append("<option value='"+branches[i].name+"'></option>");
            }
        },
        error:function(retMsg){
            console.log(retMsg);
        }
    });
}
