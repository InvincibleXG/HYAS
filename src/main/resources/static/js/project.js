function doSearch()
{
    $('#tt').datagrid(
    {
        url: 'search',
        title: '项目管理',
        pagination: true,
        rownumbers: true,
        queryParams:{
                    "csc": $('#incsc').val(),
                    "project": $('#inproject').val(),
                    "region": $('#inregion').val(),
                    "branch": $('#inbranch').val(),
                    "contract": $('#incontract').val(),
                    "order": $('#inorder').val()
                    },
        pageSize: 25,
        pageList: [25, 50, 100],
        nowrap: true,
        fitColumns: false,
        singleSelect: true,
        iconCls: 'icon-view',
        loadMsg: "正在努力加载数据，请稍后...",
        onLoadSuccess: function (data) {
            if (data==null || data=="null" || data.total == 0) {
              $.messager.alert({title: '检索结果',msg: '无相关结果!',icon: 'info',width: 300, top: 300 });
              $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').hide();
            }
            else $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').show();
          },
          columns: [[
                     { field: 'cscNum', width: '120', align: 'center', title: 'CSC号'},
                     { field: 'contractNum', width: '120', align: 'center', title: '合同号'},
                     { field: 'projectName', width: '150', align: 'center', title: '项目名称'},
                     { field: 'customerName', width: '150', align: 'center', title: '客户名称'},
                     { field: 'saleType', width: '80', align: 'center', title: '销售类型', formatter:function(value,row,index){if(row.saleType=="1") return "直销"; else if(row.saleType=="2") return "代销"; else if(row.saleType=="3") return "经销"; else return "null";}},
                     { field: 'region', width: '120', align: 'center', title: '地区' },
                     { field: 'branch', width: '150', align: 'center', title: '分公司' },
                     { field: 'saler', width: '150', align: 'center', title: '销售员' },
                     { field: 'agent', width: '150', align: 'center', title: '代理商' },
                     { field: 'creator', width: '150', align: 'center', title: '创建者', formatter:function(value,row,index){ let name=sessionStorage.getItem(row.creator); return name==null?row.creator:name; } },
                     { field: 'createTime', width: '160', align: 'center', title: '创建时间'},
                     { field: 'count', width:'100', align: 'center', title: '台量'},
                     { field: 'remark', width:'240', align: 'center', title: '备注'}
                    ]]
    });
}
function addItem()
{
    $('#projectadd').form('submit',
    {
        url : 'add',
        timeout: 3000,
        onSubmit: function(param){
            var validates=$('#projectadd').find('.easyui-validatebox');
            var len=validates.length;
            for (var i=0; i<len; i++){
                validates.eq(i).focus();
                validates.validatebox('validate');
            }
            validates.eq(i-1).blur();
    	    var isValid = $(this).form('validate');
            // 这里手动验证 其余字段
    		if (!isValid) return false;
    		everPost=1;
    	},
        success:function(data) {
            everPost=0;
            if (data=="-3") { $.messager.alert("提示","CSC号已经存在!","error"); return; }
            if (data=="-4") { $.messager.alert("提示","字段长度超过允许范围!","error"); return; }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "记录添加失败!","error");
    			return;
    		}
    		$('#projectadd').form('reset');
    		$.messager.alert("提交结果", "添加成功!","info");
    		var guid=data.replace(/\"/g, "");
    		afterAdd(); //同步saler和agent前后端数据
    		$('#tt').datagrid( {
    			    url: 'getByGuid',
    			    title: '项目管理',
    			    pagination: false,
    			    rownumbers: true,
    			    queryParams:{
    			                "guid": guid
    			                },
    			    nowrap: true,
    			    fitColumns: false,
    			    singleSelect: true,
    			    iconCls: 'icon-view',
    			    loadMsg: "正在努力加载数据，请稍后...",
    			    onLoadSuccess: function (data) {
    			        if (data==null || data=="null") {
    			          $.messager.alert({title: '网络异常',msg: '服务器返回数据不足一条!',icon: 'info',width: 300, top: 300 });
    			        }
    			      },
    			      columns: [[
    			                 { field: 'cscNum', width: '120', align: 'center', title: 'CSC号'},
    			                 { field: 'contractNum', width: '120', align: 'center', title: '合同号'},
    			                 { field: 'projectName', width: '150', align: 'center', title: '项目名称'},
    			                 { field: 'customerName', width: '150', align: 'center', title: '客户名称'},
    			                 { field: 'saleType', width: '80', align: 'center', title: '销售类型', formatter:function(value,row,index){if(row.saleType=="1") return "直销"; else if(row.saleType=="2") return "代销"; else if(row.saleType=="3") return "经销"; else return "null";}},
                                 { field: 'region', width: '120', align: 'center', title: '地区', formatter:function(value,row,index){ return sessionStorage.getItem(row.region);}  },
                                 { field: 'branch', width: '150', align: 'center', title: '分公司', formatter:function(value,row,index){ return sessionStorage.getItem(row.branch);}  },
                                 { field: 'saler', width: '150', align: 'center', title: '销售员', formatter:function(value,row,index){ return sessionStorage.getItem(row.saler);}  },
                                 { field: 'agent', width: '150', align: 'center', title: '代理商', formatter:function(value,row,index){ return sessionStorage.getItem(row.agent);}  },
                                 { field: 'creator', width: '150', align: 'center', title: '创建者', formatter:function(value,row,index){ return sessionStorage.getItem(row.creator);} },
                                 { field: 'createTime', width: '160', align: 'center', title: '创建时间'},
    			                 { field: 'count', width:'100', align: 'center', title: '台量'},
    			                 { field: 'remark', width:'240', align: 'center', title: '备注'}
    						    ]]
    			});
    		$('#add').dialog('close');
    	},
    	error:function(xhr,type,errorThrown) {
    	    everPost=0;
    	    console.log("异常"+type);
    	}
    });
}
// 在开始时调用 获取全部需要的数据并缓存在sessionStorage
function getNeedInfo()
{   //saler要和group联动 因此下拉框此时不动态生成option
    $.ajax({
            url: '/saler/getall',
            type:'post', //HTTP请求类型
            timeout:3000, //超时时间设置为3s
            success: function(data) {
                if (data==null || data=='null') {
                    console.log("Can't get salers data");
                }
                var salers=JSON.parse(data);
                for (var i in salers) {
                    sessionStorage.setItem(salers[i].guid,salers[i].saler);
                }
            },
            error:function(retMsg){
                console.log(retMsg);
            }
    });
    // agent可以预先加载好select
    $.ajax({
            url: '/agent/getall',
            type:'post', //HTTP请求类型
            timeout:3000, //超时时间设置为3s
            success: function(data) {
                if (data==null || data=='null') {
                    console.log("Can't get agents data");
                }
                var agents=JSON.parse(data);
                $("#agentselect").empty();
                if (agents.length<1) {
                    $("#agentinput").attr("placeholder","暂无可选代理商 请添加");
                }else{
                    $("#agentinput").attr("placeholder","请输入或选择代理商");
                }
                for (var i in agents){
                    sessionStorage.setItem(agents[i].guid,agents[i].agent);
                    $("#agentselect").append("<option tag='"+agents[i].guid+"' value='"+agents[i].agent+"'></option>");
                }
            },
            error:function(retMsg){
                console.log(retMsg);
            }
    });
    // 先拿region然后拿branch
    $.ajax({
        url: '/group/regions',
        type:'post', //HTTP请求类型
        timeout:3000, //超时时间设置为3s
        success: function(data) {
            if (data==null || data=='null') {
                console.log("Can't get regions data");
            }
            var regions=JSON.parse(data);
            $("#regionselect").empty();
            $("#regionselect").append("<option value=''></option>");
            $("#r").empty();
            for (var i in regions){
                sessionStorage.setItem(regions[i].guid,regions[i].name);
                $("#regionselect").append("<option value='"+regions[i].guid+"'>"+regions[i].name+"</option>");
                $("#r").append("<option tag='"+regions[i].guid+"' value='"+regions[i].name+"'></option>");
            }
        },
        error:function(retMsg){
            console.log(retMsg);
        }
    });
    getAllBranches();
}
// 点击add时获取所需数据
function getNeedInfoWhenAdd()
{
    $.ajax({
            url: '/agent/getall',
            type:'post', //HTTP请求类型
            timeout:3000, //超时时间设置为3s
            success: function(data) {
                if (data==null || data=='null') {
                    console.log("Can't get agents data");
                }
                var agents=JSON.parse(data);
                $("#agentselect").empty();
                if (agents.length<1){
                    $("#agentinput").attr("placeholder","没有可选代理商 输入添加");
                }
                for (var i in agents) {
                    sessionStorage.setItem(agents[i].guid,agents[i].agent);
                    $("#agentselect").append("<option tag='"+agents[i].guid+"' value='"+agents[i].agent+"'></option>");
                }
            },
            error:function(retMsg){
                console.log(retMsg);
            }
    });
    $.ajax({
        url: '/group/regions',
        type:'post', //HTTP请求类型
        async:false,
        timeout:3000, //超时时间设置为3s
        success: function(data) {
            if (data==null || data=='null') {
                console.log("Can't get regions data");
            }
            var regions=JSON.parse(data);
            $("#regionselect").empty();
            $("#regionselect").append("<option value=''></option>");
            for (var i in regions) {
                sessionStorage.setItem(regions[i].guid,regions[i].name);
                $("#regionselect").append("<option value='"+regions[i].guid+"'>"+regions[i].name+"</option>");
            }
        },
        error:function(retMsg){
            console.log(retMsg);
        }
    });
    getBranches();
    getSalerByGroup();
}
// 获取全部branch 进行缓存 不填充下拉
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
// 获取branch by region 刷新缓存并填充select !join获取region的ajax
function getBranches()
{
    $.ajax({
        url: '/group/branches',
        type:'post', //HTTP请求类型
        async: false,
        data: { 'pguid': $("#regionselect").val()},
        timeout:3000, //超时时间设置为3s
        success: function(data) {
            if (data==null || data=='null') {
                console.log("Can't get branches data");
            }
            var branches=JSON.parse(data);
            $("#branchselect").empty();
            $("#branchselect").append("<option value=''></option>");
            for (var i in branches) {
                sessionStorage.setItem(branches[i].guid,branches[i].name);
                $("#branchselect").append("<option value='"+branches[i].guid+"'>"+branches[i].name+"</option>");
            }
        },
        error:function(retMsg){
            console.log(retMsg);
        }
    });
}
// 根据region-branch获取saler !join获取branch的ajax
function getSalerByGroup()
{
    $.ajax({
            url: '/saler/searchByGroup',
            type:'post', //HTTP请求类型
            timeout:3000, //超时时间设置为3s
            data:{
                    'region': $("#regionselect").val(),
                    'branch': $("#branchselect").val()
                },
            success: function(data) {
                if (data==null || data=='null') {
                    console.log("Can't get salers data by group");
                }
                var salers=JSON.parse(data);
                $("#salerselect").empty();
                if (salers.length<1) {
                    $("#salerinput").attr("placeholder","当前组织下没有可选销售员");
                }else{
                    $("#salerinput").attr("placeholder","请输入或选择销售员");
                }
                for (var i in salers) {
                    sessionStorage.setItem(salers[i].guid,salers[i].saler);
                    $("#salerselect").append("<option tag='"+salers[i].guid+"' value='"+salers[i].saler+"'></option>");
                }
            },
            error:function(retMsg){
                console.log(retMsg);
            }
    });
}
// 显示未完成任务
function showUnfinishedProjects()
{
    var userid=JSON.parse(sessionStorage.getItem("user")).userid;
    $('#tt').datagrid(
        	{
        	    url: '/project/getUnfinishedProjects',
        	    title: '项目管理',
                pagination: false,
        	    rownumbers: true,
        	    queryParams:{
        			        creator: userid
        			        },
        	    nowrap: true,
        	    fitColumns: false,
        	    singleSelect: true,
                iconCls: 'icon-view',
        	    loadMsg: "正在努力加载数据，请稍后...",
        		onLoadSuccess: function (data)
        	    {
        	        if (data==null || data=="null") {
        			    $.messager.alert({title: '检索结果',msg: '无相关结果!',icon: 'info',width: 300, top: 300 });
        		    }
        		},
        		columns: [[
                         { field: 'cscNum', width: '120', align: 'center', title: 'CSC号'},
                         { field: 'contractNum', width: '120', align: 'center', title: '合同号'},
                         { field: 'projectName', width: '150', align: 'center', title: '项目名称'},
                         { field: 'customerName', width: '150', align: 'center', title: '客户名称'},
                         { field: 'saleType', width: '80', align: 'center', title: '销售类型', formatter:function(value,row,index){if(row.saleType=="1") return "直销"; else if(row.saleType=="2") return "代销"; else if(row.saleType=="3") return "经销"; else return "null";}},
                         { field: 'region', width: '120', align: 'center', title: '地区', formatter:function(value,row,index){ return sessionStorage.getItem(row.region);}  },
                         { field: 'branch', width: '150', align: 'center', title: '分公司', formatter:function(value,row,index){ return sessionStorage.getItem(row.branch);}  },
                         { field: 'saler', width: '150', align: 'center', title: '销售员', formatter:function(value,row,index){ return sessionStorage.getItem(row.saler);}  },
                         { field: 'agent', width: '150', align: 'center', title: '代理商', formatter:function(value,row,index){ return sessionStorage.getItem(row.agent);}  },
                         { field: 'creator', width: '150', align: 'center', title: '创建者', formatter:function(value,row,index){ return sessionStorage.getItem(row.creator);} },
                         { field: 'createTime', width: '160', align: 'center', title: '创建时间'},
                         { field: 'count', width:'100', align: 'center', title: '台量'},
                         { field: 'remark', width:'240', align: 'center', title: '备注'}
        				 ]],
    });
}
// 添加后进行数据同步
function afterAdd()
{
    $.ajax({
            url: '/saler/getall',
            type:'post', //HTTP请求类型
            async: false,
            timeout:3000, //超时时间设置为3s
            success: function(data) {
                if (data==null || data=='null') {
                    console.log("Can't get salers data");
                }
                var salers=JSON.parse(data);
                for (var i in salers) {
                    sessionStorage.setItem(salers[i].guid,salers[i].saler);
                }
            },
            error:function(retMsg){
                console.log(retMsg);
            }
    });
    $.ajax({
            url: '/agent/getall',
            type:'post', //HTTP请求类型
            async: false,
            timeout:3000, //超时时间设置为3s
            success: function(data) {
                if (data==null || data=='null') {
                    console.log("Can't get agents data");
                }
                var agents=JSON.parse(data);
                for (var i in agents) {
                    sessionStorage.setItem(agents[i].guid,agents[i].agent);
                }
            },
            error:function(retMsg){
                console.log(retMsg);
            }
    });
}
// 2018年5月14日新增 因为客户要求搜索栏级联
function getBranchList()
{
    $.ajax({
        url: '/group/branches',
        type:'post', //HTTP请求类型
        async: false,
        data: { 'pguid': $('option[value='+$("#inregion").val()+']').attr('tag')},
        timeout:3000, //超时时间设置为3s
        success: function(data) {
            if (data==null || data=='null') {
                console.log("Can't get branches data");
            }
            var branches=JSON.parse(data);
            $("#b").empty();
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
