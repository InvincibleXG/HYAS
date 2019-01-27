function loadSeal()
{
    $('#tt').datagrid(
	{
        url: 'list',
        title: '盖章统计',
        pagination: true,
        rownumbers: true,
        queryParams:{ "handler": JSON.parse(sessionStorage.getItem("user")).userid },
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
            if (data=="-1") { $.messager.alert("操作禁止", "没有相应权限!","warning"); return; }
            if (data.total == 0) {
              var body = $(this).data().datagrid.dc.body2;
              body.find('table tbody').append('<tr><td width="' + body.width() + '" style="height: 35px; text-align: center;"><h1>暂无数据</h1></td></tr>');
              $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').hide();
            }
            else $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').show();
          },
          columns: [[
                   { field: 'region', width: '120', align: 'center', title: '地区'},
                   { field: 'branch', width: '150', align: 'center', title: '分公司'},
                   { field: 'projectName', width: '150', align: 'center', title: '项目名称'},
                   { field: 'projectCsc', width: '120', align: 'center', title: '项目CSC号'},
                   { field: 'type', width: '150', align: 'center', title: '类型', formatter:function(value,row,index){if(row.type=="1") return "仅投标函件（标准）"; else if(row.type=="2") return "仅投标函件（非标）"; else if(row.type=="3") return "投标文件"; else if(row.type=="4") return "邀请函"; else if (row.type=="6") return "联合体投标协议"; else return "其他";}},
                   { field: 'applicant', width: '150', align: 'center', title: '申请人' },
                   { field: 'page', width: '120', align: 'center', title: '文件页数' },
                   { field: 'sharepoint', width: '180', align: 'center', title: '是否上传Sharepoint', formatter:function(value,row,index){ if(row.sharepoint=="true") return "是"; else return "否";} },
                   { field: 'creator', width: '150', align: 'center', title: '创建者' },
                   { field: 'createTime', width: '160', align: 'center', title: '创建时间' },
                   { field: 'modifier', width:'150', align: 'center', title: '修改者' },
                   { field: 'modifyTime', width:'160', align: 'center', title: '修改时间' },
                   { field: 'remark', width: '200', align: 'center', title: '备注' }
                   ]]
	});
}
function getRegions()
{
	$.ajax({
        url: '/group/regions',
        type:'post', //HTTP请求类型
        timeout:3000, //超时时间设置为3s
        success: function(data) {
            if (data==null || data=='null') {
                console.log("Can't get regions data");
            }
            var regions=JSON.parse(data);
            $("#r").empty();
            for (var i in regions) {
                sessionStorage.setItem(regions[i].name,regions[i].guid);
                $("#r").append("<option value='"+regions[i].name+"'></option>");
            }
        },
        error:function(retMsg){
            console.log(retMsg);
        }
    });
}
function getAllBranches()
{
    $("#b").empty();
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
                $("#b").append("<option value='"+branches[i].name+"'></option>");
            }
        },
        error:function(retMsg){
            console.log(retMsg);
        }
    });
}
function getBranches(pguid,op)
{
    $.ajax({
        url: '/group/branches',
        type:'post', //HTTP请求类型
        data: { 'pguid': pguid },
        async: false,
        timeout:3000, //超时时间设置为3s
        success: function(data) {
                            if (data==null || data=='null') {
                                console.log("Can't get branches data");
                            }
                            var branches=JSON.parse(data);
                            if (op=="add") {
                                $("#branchselecta").empty();
                                $("#branchselecta").append("<option value=''></option>");
                                for (var i in branches) {
                                    $("#branchselecta").append("<option value='"+branches[i].name+"'>"+branches[i].name+"</option>");
                                }
                            }
                            else if (op=="update") {
                                $("#branchselectu").empty();
                                $("#branchselectu").append("<option value=''></option>");
                                for (var i in branches) {
                                    $("#branchselectu").append("<option value='"+branches[i].name+"'>"+branches[i].name+"</option>");
                                }
                            }
                            else if (op=="search"){
                                $("#b").empty();
                                for (var i in branches) {
                                    $("#b").append("<option value='"+branches[i].name+"'></option>");
                                }
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
            title: '盖章统计',
            pagination: true,
            rownumbers: true,
            queryParams:{
                        "projectCSC": $('#incsc').val(),
                        "projectName": $('#inproject').val(),
                        "creator": $('#increator').val(),
                        "region": $('#inregion').val(),
                        "branch": $('#inbranch').val(),
                        "type": $('#intype').val(),
                        "start": $('#instart').val(),
                        "end": $('#inend').val(),
                        "sp": $('#insp').val(),
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
                else if (data=="-1") { $.messager.alert("操作禁止", "没有相应权限!","warning"); return; }
                else $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').show();
            },
            columns: [[
                   { field: 'region', width: '120', align: 'center', title: '地区'},
                   { field: 'branch', width: '150', align: 'center', title: '分公司'},
                   { field: 'projectName', width: '150', align: 'center', title: '项目名称'},
                   { field: 'projectCsc', width: '120', align: 'center', title: '项目CSC号'},
                   { field: 'type', width: '150', align: 'center', title: '类型', formatter:function(value,row,index){if(row.type=="1") return "仅投标函件（标准）"; else if(row.type=="2") return "仅投标函件（非标）"; else if(row.type=="3") return "投标文件"; else if(row.type=="4") return "邀请函"; else if (row.type=="6") return "联合体投标协议"; else return "其他";}},
                   { field: 'applicant', width: '150', align: 'center', title: '申请人' },
                   { field: 'page', width: '120', align: 'center', title: '文件页数' },
                   { field: 'sharepoint', width: '180', align: 'center', title: '是否上传Sharepoint', formatter:function(value,row,index){ if(row.sharepoint=="true") return "是"; else return "否";} },
                   { field: 'creator', width: '150', align: 'center', title: '创建者' },
                   { field: 'createTime', width: '160', align: 'center', title: '创建时间' },
                   { field: 'modifier', width:'150', align: 'center', title: '修改者' },
                   { field: 'modifyTime', width:'160', align: 'center', title: '修改时间' },
                   { field: 'remark', width: '200', align: 'center', title: '备注' }
                   ]]
        });
}
function report()
{
    var user=JSON.parse(sessionStorage.getItem("user"));
    if (user==null) return;
    var url='http://'+location.hostname+':'+location.port+'/seal/reporter?handler='+user.userid+
    '&projectCSC='+$("#incsc").val()+'&projectName='+$("#inproject").val()+'&region='+$("#inregion").val()+'&branch='+$("#inbranch").val()+
    '&creator='+$("#increator").val()+'&type='+$("#intype").val()+'&start='+$("#instart").val()+'&end='+$("#inend").val()+
    '&sp='+$("#insp").val();
    location.href=url;
}
