function getBranches(regionGuid)
{
     $.ajax({
        url: '/group/branches',
        type: 'post', //HTTP请求类型
        async: false,
        data: { 'pguid': regionGuid },
        timeout:3000, //超时时间设置为3s
        success: function(data) {
            if (data==null || data=='null') {
                console.log("Can't get branches data");
            }
            var branches=JSON.parse(data);
            $("#branch").empty();
            for (var i in branches) {
                $("#branch").append("<option value='"+branches[i].guid+"'>"+branches[i].name+"</option>");
            }
        },
        error:function(retMsg){
            console.log(retMsg);
        }
     });
}
function getSalerByGroup(regionGuid, branchGuid)
{
    $.ajax({
            url: '/saler/searchByGroup',
            type:'post', //HTTP请求类型
            async:false,
            timeout:3000, //超时时间设置为3s
            data:{
                    'region': regionGuid,
                    'branch': branchGuid
                },
            success: function(data) {
                if (data==null || data=='null') {
                    console.log("Can't get salers data by group");
                }
                var salers=JSON.parse(data);
                $("#salerselect").empty();
                $("#saler").val("");
                if (salers.length<1) {
                    $("#saler").attr("placeholder","当前组织下没有可选销售员");
                }else{
                    $("#saler").attr("placeholder","请输入或选择销售员");
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
function updateItem()
{
    $('#projectupdate').form('submit',
    {
        url : '/project/update',
        onSubmit: function(param){
            var isValid = $(this).form('validate');
            if ($("#cscNum").hasClass("validatebox-invalid")){ $.messager.alert("提示", "CSC号不能为空且为纯数字!","error"); return false; }
    	    if ($("#projectName").val().length<1){ $.messager.alert("提示", "项目名称不可为空!","error"); return false; }
    	    if ($("#saleType").val().length<1) return false;
    	    return isValid;
    	},
        success:function(data) {
            if (data=="-3") {
                $.messager.alert("提交结果", "修改失败! CSC号已重复!","error");
                return;
            }
            if (data=="-4") {
                $.messager.alert("提交结果", "修改失败! 字段长度不合法!","error");
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "记录修改失败!","error");
    			return;
    		}
    		$.messager.alert("提交结果", "修改成功!","info");
    	},
    	error:function(xhr,type,errorThrown) {
    	    console.log("异常"+type);
    	}
    });
}
// 任务
$(function()
{
    var task = document.getElementsByClassName("nps_task");
    var n = task.length;
    //状态
    var states = $(".task_state");
    var minus=$("button[data='edi']").length>0?2:1;
    for(var i=0;i<n;i++) {
        var flow=$(".flowchart");
        var task_state=parseInt(states[i].getAttribute("value"));
        var guid=states[i].getAttribute("tag");
        $("select[tag='"+guid+"']").val(task_state);
        var buttons=$("button[tag='"+guid+"']");
        for (var j=0; j<task_state; j++) {
            $(flow).eq(i).find(".flowchart-text").eq(j).addClass("pass");
            $(flow).eq(i).find(".flowchart-circle").eq(j).addClass("pass");
        }
        if (buttons.length-minus>task_state) { //button状态递进
            buttons.eq(task_state).addClass("active");
        }
        if ($("form[tag='"+guid+"']").attr("action")=="1") {
            if (task_state>=5) continue;
            if (task_state==2) { //价格审核任务提交状态 允许点击完成
                 buttons.eq(4).addClass("active");
            }else if (task_state==4){ //价格审核任务收到回复状态 只可以重复提交
                buttons.eq(4).removeClass("active");
                buttons.eq(1).addClass("active");
                buttons.eq(2).addClass("active");
            }else if (task_state!=3) { // 只要没完成就可以暂停 暂停状态只可以收到回复
                buttons.eq(2).addClass("active");
            }
        }else if ($("form[tag='"+guid+"']").attr("action")=="2") {
            if (task_state==2) { //合同任务提交状态可以直接提交财务或者完成
                buttons.eq(4).addClass("active");
                buttons.eq(5).addClass("active");
            }else if (task_state==4){ //合同任务收到回复状态 只可以重复提交
                buttons.eq(4).removeClass("active");
                buttons.eq(1).addClass("active");
                buttons.eq(2).addClass("active");
            }else if (task_state==6){ //合同任务完成状态可以收到正本或者转交DSC
//                $("button[tag='"+guid+"']").eq(7).addClass("active");
            }else if (task_state==7){ // 收到正本时可以点转交DSC 之前已经激活了 但是从2018年5月8日起不可以升到转交DSC状态
//                if ($("input[zjdsc='"+guid+"']").eq(0).val().length>8){
//                    $(flow).eq(i).find(".flowchart-text").eq(7).addClass("pass");
//                    $(flow).eq(i).find(".flowchart-circle").eq(7).addClass("pass");
//                    $("button[tag='"+guid+"']").eq(7).removeClass("active");
//                }
            }else if (task_state==8){ // 转交DSC状态时要判断下是否有收到正本时间 没有的话要操作一波
                if ($("input[sdzb='"+guid+"']").eq(0).val().length<8){
                    $(flow).eq(i).find(".flowchart-text").eq(6).removeClass("pass");
                    $(flow).eq(i).find(".flowchart-circle").eq(6).removeClass("pass");
                    buttons.eq(6).addClass("active");
                }
            }else if(task_state!=3){ // 只要没完成就可以暂停 暂停状态只可以收到回复
                buttons.eq(2).addClass("active");
            }
            // 2018年5月8日新需求变更 合同任务当子类型是转交DSC时 无法提交财务和收到正本
            var sub=$("form[tag='"+guid+"']").find("select[name='contractType']").val();
            if (sub=='5'){
                buttons.eq(4).removeClass("active");
                buttons.eq(6).removeClass("active");
                $(flow).eq(i).find(".flowchart-text").eq(4).removeClass("pass");
                $(flow).eq(i).find(".flowchart-circle").eq(4).removeClass("pass");
                $(flow).eq(i).find(".flowchart-text").eq(6).removeClass("pass");
                $(flow).eq(i).find(".flowchart-circle").eq(6).removeClass("pass");
            }
        }
    }
    arrowTagInit();
    showChineseName();
    $("form[tag='"+sessionStorage.getItem("lasT")+"']").find(".closeTag").click();
});
//打开或关闭标签
function arrowTagInit()
{
    var task = document.getElementsByClassName("nps_task");
    var n = task.length;
    var flag = new Array(n);
    for(var i=0; i<n;i++){
        flag[i]=1;
    }
    $(".closeTag").click(function(){
        var i = $(".closeTag").index(this);
        if(flag[i] == 0) {
            $(this).addClass("openTag");
            $(task).eq(i).addClass("nps_task_hidden");
            $(task).eq(i).find(".task_hidden").addClass("invisible");
            //$(task).eq(i).find(".close_show").removeClass("invisible");
            flag[i] = 1;
        }else{
            $(this).removeClass("openTag");
            $(task).eq(i).removeClass("nps_task_hidden");
            $(task).eq(i).find(".task_hidden").removeClass("invisible");
            //$(task).eq(i).find(".close_show").addClass("invisible");
            flag[i] = 0;
            $('html, body').animate({
                scrollTop: $(this).offset().top-100
            }, 888);
        }
    });
}
function addTask()
{
    var type=$("#taskType").val();
    var taskDiv;
    var taskhtml;
    var userid=JSON.parse(sessionStorage.getItem("user")).userid;
    var projectGUID=$("input[name='GUID']").val();
    taskDiv=$("#newTaskDiv");
    if (type=='1') {
        taskhtml='<div class="nps_task col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><form id="newTask" action="/task_pricing/add" method="post" class="form-horizontal" style="position: relative;"><div class="form-group nps_form-group nps_task_info"><div class="row"><div class="col-sm-1 nps_input pull-left"><input name="projectGUID" class="invisible" value="'+projectGUID+'"><input name="taskName" class="form-control nps_form-control" value="价格审核"></div><label class="col-sm-1 control-label nps_task_label">子类型:</label><div class="col-sm-1 nps_input "><select name="pricingType" class="form-control nps_select"><option value="1">降价</option><option value="2">VO</option><option value="3">VO 降价</option></select></div><label class="col-sm-1 control-label nps_task_label">版本:</label><div class="col-sm-1 nps_input"><input name="revision" type="text" class="form-control nps_form-control" value=""></div><label class="col-sm-1 control-label nps_task_label">状态:</label><div class="col-sm-1 nps_input"><select name="pricingStatus" class="form-control nps_form-control nps_select task_state" readonly="true"><option value="1">创建</option></select></div><label class="col-sm-1 control-label nps_task_label">处理人:</label><div class="col-sm-1 nps_input"><input name="creator" type="text" class="form-control nps_form-control invisible" value="'+userid+'" readonly="true"><input id="fakecreator" type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">创建/收到时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label ">提交时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control"  readonly="true"></div><label class="col-sm-1 control-label nps_task_label ">最后修改人:</label><div class="col-sm-1 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-2 control-label nps_task_label">最后一次暂停时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label ">修改时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row " style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label ">完成时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label ">退单数:</label><div class="col-sm-1 nps_input "><input name="backSheet" type="number" min="0" value="0" class="form-control nps_form-control" id="bs" readonly="true"></div><label class="col-sm-2 control-label nps_task_label ">暂停总时长:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row " style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label ">备注:</label><div class="col-sm-11 nps_input "><textarea class="form-control" rows="2" name="remark"></textarea></div></div></div></form></div><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-top: 50px; margin-bottom: 4px;"><div class="pull-left flow"><button id="create" type="button" class="btn nps_but btn-info active">创建/收到</button>&nbsp;<button type="button" class="btn nps_but btn-info ">提交</button>&nbsp;<button type="button" class="btn nps_but btn-info ">暂停</button>&nbsp;<button type="button" class="btn nps_but btn-info ">收到回复</button>&nbsp;<button type="button" class="btn nps_but btn-info ">完成</button></div></div></div></div><div class="iconfont closeTag pull-right openTag" style="cursor: default"></div>';
    }else if (type=='7'){
        taskhtml='<div class="nps_task col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><form id="newTask" action="/task_enquiry/add" method="post" class="form-horizontal" style="position: relative;"><div class="form-group nps_form-group nps_task_info"><div class="row"><div class="col-sm-1 nps_input pull-left"><input name="projectGUID" class="invisible" value="'+projectGUID+'"><input name="taskName" class="form-control nps_form-control" value="询价"></div><label class="col-sm-1 control-label nps_task_label">子类型:</label><div class="col-sm-1 nps_input "><select name="enquiryType" class="form-control nps_select"><option value="1">进口梯询价</option><option value="2">ACS询价</option><option value="3">DCS询价</option></select></div><label class="col-sm-1 control-label nps_task_label">版本:</label><div class="col-sm-1 nps_input"><input name="revision" type="text" class="form-control nps_form-control" value=""></div><label class="col-sm-1 control-label nps_task_label">状态:</label><div class="col-sm-1 nps_input"><select name="enquiryStatus" class="form-control nps_form-control nps_select task_state" readonly="true"><option value="1">创建</option></select></div><label class="col-sm-1 control-label nps_task_label">处理人:</label><div class="col-sm-1 nps_input"><input name="creator" type="text" class="form-control nps_form-control invisible" value="'+userid+'" readonly="true"><input id="fakecreator" type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">创建/收到时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 col-sm-offset-1 control-label nps_task_label">是否出图:</label><div class="col-sm-1 nps_input"><select name="enquiryPlot" class="form-control nps_select task_state"><option value="0">否</option><option value="1">是</option></select></div><label class="col-sm-1 control-label nps_task_label ">最后修改人:</label><div class="col-sm-1 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-5 control-label nps_task_label ">修改时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true" ></div></div><div class="row" style="padding-top:5px"><label class="col-sm-2 control-label nps_task_label ">递交组长时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true" ></div><label class="col-sm-6 control-label nps_task_label ">递交客服时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row " style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label ">备注:</label><div class="col-sm-11 nps_input "><textarea class="form-control" rows="2" name="remark"></textarea></div></div></div></form></div><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-top: 50px; margin-bottom: 4px;"><div class="pull-left flow"><button id="create" type="button" class="btn nps_but btn-info active">创建/收到</button>&nbsp;<button type="button" class="btn nps_but btn-info ">递交组长</button>&nbsp;<button type="button" class="btn nps_but btn-info ">递交客服</button></div></div></div><div class="iconfont closeTag pull-right openTag" style="cursor: default"></div>';
    }else if (type=='2'){
        taskhtml='<div class="nps_task col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><form id="newTask" action="/task_contract/add" method="post" class="form-horizontal" style="position: relative;"><div class="form-group nps_form-group nps_task_info"><div class="row"><div class="col-sm-1 nps_input pull-left"><input name="projectGUID" class="invisible" value="'+projectGUID+'"><input name="taskName" class="form-control nps_form-control" value="合同"></div><label class="col-sm-1 control-label nps_task_label">子类型:</label><div class="col-sm-1 nps_input "><select name="contractType" class="form-control nps_select"><option value="1">合同评审</option><option value="2">补充协议</option><option value="3">预评审</option><option value="4">投标评审</option><option value="5">转交DSC</option></select></div><label class="col-sm-1 control-label nps_task_label">版本:</label><div class="col-sm-1 nps_input"><input name="revision" type="text" class="form-control nps_form-control" value=""></div><label class="col-sm-1 control-label nps_task_label">状态:</label><div class="col-sm-1 nps_input"><select name="contractStatus" class="form-control nps_form-control nps_select task_state" readonly="true"><option value="1">创建</option></select></div><label class="col-sm-1 control-label nps_task_label">处理人:</label><div class="col-sm-1 nps_input"><input name="creator" type="text" class="form-control nps_form-control invisible" value="'+userid+'" readonly="true"><input id="fakecreator" type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">创建/收到时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label ">提交时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label ">最后修改人:</label><div class="col-sm-1 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-2 control-label nps_task_label">最后一次暂停时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label ">修改时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label">完成时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">提交财务时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">暂停时间段:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">收到正本时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row " style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label ">备注:</label><div class="col-sm-11 nps_input "><textarea class="form-control" rows="2" name="remark"></textarea></div></div></div></form></div><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-top: 50px; margin-bottom: 4px;"><div class="pull-left flow"><button id="create" type="button" class="btn nps_but btn-info active">创建/收到</button>&nbsp;<button type="button" class="btn nps_but btn-info ">提交</button>&nbsp;<button type="button" class="btn nps_but btn-info ">暂停</button>&nbsp;<button type="button" class="btn nps_but btn-info ">收到回复</button>&nbsp;<button type="button" class="btn nps_but btn-info ">提交财务</button>&nbsp;<button type="button" class="btn nps_but btn-info ">完成</button>&nbsp;<button type="button" class="btn nps_but btn-info ">收到正本</button>&nbsp;</div></div></div><div class="iconfont closeTag pull-right openTag" style="cursor: default"></div>';
    }else if (type=='3'){
        taskhtml='<div class="nps_task col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><form id="newTask" action="/task_backletter/add" method="post" class="form-horizontal" style="position: relative;"><div class="form-group nps_form-group nps_task_info"><div class="row"><div class="col-sm-1 nps_input pull-left"><input name="projectGUID" class="invisible" value="'+projectGUID+'"><input name="taskName" class="form-control nps_form-control" value="保函"></div><label class="col-sm-1 control-label nps_task_label">子类型:</label><div class="col-sm-1 nps_input "><select name="backletterType" class="form-control nps_select"><option value="1">投标保函</option><option value="2">履约保函</option><option value="3">预付款保函</option><option value="4">质量保函</option></select></div><label class="col-sm-1 control-label nps_task_label">版本:</label><div class="col-sm-1 nps_input"><input name="revision" type="text" class="form-control nps_form-control" value=""></div><label class="col-sm-1 control-label nps_task_label">状态:</label><div class="col-sm-1 nps_input"><select name="backletterStatus" class="form-control nps_form-control nps_select task_state" readonly="true"><option value="1">创建</option></select></div><label class="col-sm-1 control-label nps_task_label">处理人:</label><div class="col-sm-1 nps_input"><input name="creator" type="text" class="form-control nps_form-control invisible" value="'+userid+'" readonly="true"><input id="fakecreator" type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">创建/收到时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label ">非标类型:</label><div class="col-sm-2 nps_input"><select name="backletterNonstandardType" class="form-control nps_select"><option value="1">非标</option><option value="2">见索即付</option></select></div><label class="col-sm-1 control-label nps_task_label ">最后修改人:</label><div class="col-sm-1 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-2 control-label nps_task_label ">TO昆山时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label ">修改时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label">快递号:</label><div class="col-sm-2 nps_input "><input name="backletterExpressCode" type="text" class="form-control nps_form-control" ></div><label class="col-sm-1 control-label nps_task_label">保证金:</label><div class="col-sm-1 nps_input"><input name="backletterCautionMoney" type="number" min="0" value="0" class="form-control nps_form-control"></div><label class="col-sm-2 control-label nps_task_label">TO分公司时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">到期时间:</label><div class="col-sm-2 nps_input"><input type="date" name="backletterDueDate" class="form-control nps_form-control" ></div></div><div class="row " style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label">备注:</label><div class="col-sm-11 nps_input"><textarea class="form-control" rows="2" name="remark"></textarea></div></div></div></form></div><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-top: 50px; margin-bottom: 4px;"><div class="pull-left flow"><button id="create" type="button" class="btn nps_but btn-info active">创建/收到</button>&nbsp;<button type="button" class="btn nps_but btn-info ">递交昆山</button>&nbsp;<button type="button" class="btn nps_but btn-info ">寄回分公司</button></div></div></div><div class="iconfont closeTag pull-right openTag" style="cursor: default"></div>';
    }else if (type=='4'){
        taskhtml='<div class="nps_task col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><form id="newTask" action="/task_tender/add" method="post" class="form-horizontal" style="position: relative;"><div class="form-group nps_form-group nps_task_info"><div class="row"><div class="col-sm-1 nps_input pull-left"><input name="projectGUID" class="invisible" value="'+projectGUID+'"><input name="taskName" class="form-control nps_form-control" value="投标保证金"></div><label class="col-sm-1 control-label nps_task_label">子类型:</label><div class="col-sm-1 nps_input "><select name="tenderType" class="form-control nps_select"><option value="1">投标保证金</option></select></div><label class="col-sm-1 control-label nps_task_label">版本:</label><div class="col-sm-1 nps_input"><input name="revision" type="text" class="form-control nps_form-control" value=""></div><label class="col-sm-1 control-label nps_task_label">状态:</label><div class="col-sm-1 nps_input"><select name="tenderStatus" class="form-control nps_form-control nps_select task_state" readonly="true"><option value="1">创建</option></select></div><label class="col-sm-1 control-label nps_task_label">处理人:</label><div class="col-sm-1 nps_input"><input name="creator" type="text" class="form-control nps_form-control invisible" value="'+userid+'" readonly="true"><input id="fakecreator" type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">创建/收到时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label ">金额:</label><div class="col-sm-2 nps_input "><input type="number" name="tenderAmount" class="form-control" value="0" min="0"></div><label class="col-sm-1 control-label nps_task_label ">最后修改人:</label><div class="col-sm-1 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-2 control-label nps_task_label">递交审批时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">修改时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label">递交VP时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">递交财务时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label">备注:</label><div class="col-sm-11 nps_input"><textarea class="form-control" rows="2" name="remark"></textarea></div></div></div></form></div><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-top: 50px; margin-bottom: 4px;"><div class="pull-left flow"><button id="create" type="button" class="btn nps_but btn-info active">创建/收到</button>&nbsp;<button type="button" class="btn nps_but btn-info ">递交信控</button>&nbsp;<button type="button" class="btn nps_but btn-info ">递交VP</button>&nbsp;<button type="button" class="btn nps_but btn-info ">递交财务</button></div></div></div><div class="iconfont closeTag pull-right openTag" style="cursor: default"></div>';
    }else if (type=='5'){
        taskhtml='<div class="nps_task col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><form id="newTask" action="/task_agencyfee/add" method="post" class="form-horizontal" style="position: relative;"><div class="form-group nps_form-group nps_task_info"><div class="row"><div class="col-sm-1 nps_input pull-left"><input name="projectGUID" class="invisible" value="'+projectGUID+'"><input name="taskName" class="form-control nps_form-control" value="代理费"></div><label class="col-sm-1 control-label nps_task_label">子类型:</label><div class="col-sm-1 nps_input "><select name="agencyfeeType" class="form-control nps_select"><option value="1">项目佣金</option></select></div><label class="col-sm-1 control-label nps_task_label">版本:</label><div class="col-sm-1 nps_input"><input name="revision" type="text" class="form-control nps_form-control" value=""></div><label class="col-sm-1 control-label nps_task_label">状态:</label><div class="col-sm-1 nps_input"><select name="agencyfeeStatus" class="form-control nps_form-control nps_select task_state" readonly="true"><option value="1">创建</option></select></div><label class="col-sm-1 control-label nps_task_label">处理人:</label><div class="col-sm-1 nps_input"><input name="creator" type="text" class="form-control nps_form-control invisible" value="'+userid+'" readonly="true"><input id="fakecreator" type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">创建/收到时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label ">PO号:</label><div class="col-sm-2 nps_input"><input name="agencyfeePo" type="text" class="form-control nps_form-control" ></div><label class="col-sm-1 control-label nps_task_label ">最后修改人:</label><div class="col-sm-1 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">申请次数:</label><div class="col-sm-1 nps_input "><input name="agencyfeeApplyCount" type="number" value="0" min="0"class="form-control nps_form-control" ></div><label class="col-sm-1 control-label nps_task_label ">申请比例:</label><div class="col-sm-1 nps_input "><input name="agencyfeeApplyProportion" type="text" class="form-control nps_form-control" ></div><label class="col-sm-1 control-label nps_task_label ">修改时间:</label><div class="col-sm-2 nps_input "><input  type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label">发票号:</label><div class="col-sm-2 nps_input"><input name="agencyfeeInvoice" type="text" class="form-control nps_form-control" ></div><label class="col-sm-1 control-label nps_task_label">总代理费:</label><div class="col-sm-1 nps_input "><input name="agencyfeeMoney" type="number" value="0" min="0" class="form-control nps_form-control" ></div><label class="col-sm-1 control-label nps_task_label">申请金额:</label><div class="col-sm-1 nps_input "><input name="agencyfeeApplyAmount" type="number" value="0" min="0" class="form-control nps_form-control"></div><label class="col-sm-3 control-label nps_task_label">递交审批时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-10 control-label nps_task_label">递交财务时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label">备注:</label><div class="col-sm-11 nps_input "><textarea class="form-control" rows="2" name="remark"></textarea></div></div></div></form></div><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-top: 50px; margin-bottom: 4px;"><div class="pull-left flow"><button id="create" type="button" class="btn nps_but btn-info active">创建/收到</button>&nbsp;<button type="button" class="btn nps_but btn-info ">递交审批</button>&nbsp;<button type="button" class="btn nps_but btn-info ">递交财务</button></div></div></div><div class="iconfont closeTag pull-right openTag" style="cursor: default"></div>';
    }else if (type=='6'){
        taskhtml='<div class="nps_task col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><form id="newTask" action="/task_agreement/add" method="post" class="form-horizontal" style="position: relative;"><div class="form-group nps_form-group nps_task_info"><div class="row"><div class="col-sm-1 nps_input pull-left"><input name="projectGUID" class="invisible" value="'+projectGUID+'"><input name="taskName" class="form-control nps_form-control" value="协议"></div><label class="col-sm-1 control-label nps_task_label">子类型:</label><div class="col-sm-1 nps_input "><select name="agreementType" class="form-control nps_select"><option value="1">代理协议</option><option value="2">变更协议</option></select></div><label class="col-sm-1 control-label nps_task_label">版本:</label><div class="col-sm-1 nps_input"><input name="revision" type="text" class="form-control nps_form-control" value=""></div><label class="col-sm-1 control-label nps_task_label">状态:</label><div class="col-sm-1 nps_input"><select name="agreementStatus" class="form-control nps_form-control nps_select task_state" readonly="true"><option value="1">创建</option></select></div><label class="col-sm-1 control-label nps_task_label">处理人:</label><div class="col-sm-1 nps_input"><input name="creator" type="text" class="form-control nps_form-control invisible" value="'+userid+'" readonly="true"><input id="fakecreator" type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">创建/收到时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label ">快递号:</label><div class="col-sm-2 nps_input "><input name="agreementExpressCode" type="text" class="form-control nps_form-control"></div><label class="col-sm-1 control-label nps_task_label ">最后修改人:</label><div class="col-sm-1 nps_input"><input type="text" class="form-control nps_form-control" readonly="true" ></div><label class="col-sm-1 control-label nps_task_label">台量变更:</label><div class="col-sm-1 nps_input "><input name="agreementCountChange" type="number" min="0" value="0" class="form-control nps_form-control" ></div><label class="col-sm-3 control-label nps_task_label">修改时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label">PO号:</label><div class="col-sm-2 nps_input "><input name="agreementPo" type="text" class="form-control nps_form-control"></div><label class="col-sm-1 control-label nps_task_label">原代理商:</label><div class="col-sm-2 nps_input"><input name="agreementAgent" type="text" class="form-control nps_form-control" ></div><label class="col-sm-1 control-label nps_task_label">递交审批时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">领导签字时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label">新PO号:</label><div class="col-sm-2 nps_input"><input name="agreementPoNew" type="text" class="form-control nps_form-control"></div><label class="col-sm-1 control-label nps_task_label">新代理商:</label><div class="col-sm-2 nps_input"><input name="agreementAgentNew" type="text" class="form-control nps_form-control"></div><label class="col-sm-1 control-label nps_task_label">递交财务时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true"></div><label class="col-sm-1 control-label nps_task_label">寄回分公司时间:</label><div class="col-sm-2 nps_input "><input type="text" class="form-control nps_form-control" readonly="true"></div></div><div class="row" style="padding-top:5px"><label class="col-sm-10 control-label nps_task_label ">协议正本收回时间:</label><div class="col-sm-2 nps_input"><input type="text" class="form-control nps_form-control" readonly="true" ></div></div><div class="row" style="padding-top:5px"><label class="col-sm-1 control-label nps_task_label">备注:</label><div class="col-sm-11 nps_input"><textarea class="form-control" rows="2" name="remark"></textarea></div></div></div></form></div><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-top: 50px; margin-bottom: 4px;"><div class="pull-left flow"><button id="create" type="button" class="btn nps_but btn-info active">创建/收到</button>&nbsp;<button type="button" class="btn nps_but btn-info ">递交审批</button>&nbsp;<button type="button" class="btn nps_but btn-info ">领导签字</button>&nbsp;<button type="button" class="btn nps_but btn-info ">递交财务</button>&nbsp;<button type="button" class="btn nps_but btn-info ">寄回分公司</button>&nbsp;<button type="button" class="btn nps_but btn-info ">协议正本回收</button></div></div></div><div class="iconfont closeTag pull-right openTag" style="cursor: default"></div>';
    }
    taskDiv.html(taskhtml);
    if (type=="1"){
        var rt=window.parent.document.getElementById("roleTop").text;
        if (rt=="管理员A" || rt=="管理员B" || rt=="计价高级用户") $("#bs").removeAttr("readonly");
    }
    $("#fakecreator").val(sessionStorage.getItem(userid));
    $('input[type="number"]').keydown(function(event){
        if (event.keyCode==69 || event.keyCode==229 || event.keyCode==187 || event.keyCode==189 || event.keyCode==190) {
            return false;
        }
    });
    $("#newTask").submit(function(){
        if ($("input[name='taskName']").val().length<1){
            $.messager.alert({title: '拒绝请求',msg: '请输入任务名!',icon: 'info',width: 300, top: 300 });
            return false;
        }
        // 取得表单里的元素
        var params = $('#newTask').serializeArray();
        var values = {};
        for(var  x in params ){
            values[params[x].name] = params[x].value;
        }
        if (type=="1" || type=="2" || type=="7"){
            if ($("input[name='revision']").val().length<1) {
                $.messager.alert({title: '拒绝请求',msg: '版本号不能为空!',icon: 'warning',width: 300, top: 300 });
                return false;
            }
        }
        $("#create").attr("disabled","true");
        $.ajax({
            url: $("#newTask").attr("action"),
            type:'post', //HTTP请求类型
            data: values,
            timeout:3000, //超时时间设置为3s
            success: function(data) {
                $("#create").removeAttr("disabled");
                if (data=="-1") {
                    $.messager.alert("操作禁止", "没有相应权限!","warning");
                    return;
                }
                if (data=="0" || data=='null') {
                    $.messager.alert({title: '拒绝请求',msg: '字段有效性不合法!',icon: 'error',width: 300, top: 300 });
                    return ;
                }
                sessionStorage.setItem("lasT",data.replace(/\"/g, ""));
                location.reload();
            },
            error:function(retMsg){
                console.log(retMsg);
            }
        });
        return false;
    });
    $("#create").click(function(){
        $("#newTask").submit();
        return false;
    });
}
function showChineseName()
{
    var creators=$("input[tag='fakecreator']");
    var modifiers=$("input[tag='modifier']");
    for (var i in creators) {
        creators[i].value=(sessionStorage.getItem(creators[i].value));
    }
    for (var i in modifiers) {
        modifiers[i].value=(sessionStorage.getItem(modifiers[i].value));
    }
}
function pushPricingTaskProcess(taskid,no)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_pricing/update',
        onSubmit: function(param){
    	    if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
    	        $.messager.alert("拒绝修改", "任务名不能为空!","error");
    	        return false;
    	    }
    	    var state=no;
    	    if (state==4) param.pricingStatus=2;
    	    else param.pricingStatus=state+1;
    	    param.guid=taskid;
    	    param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
    	    param.isback="false";
    	    var subT=$("form[tag='"+taskid+"']").find('select[name="pricingType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
    	},
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="-20") {
                $.messager.alert("缺少前置字段", "请选择完成类型!","warning");
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "任务更新状态失败!","error");
    			return;
    		}
    		location.reload();
    	},
    	error:function(xhr,type,errorThrown) {
    	    console.log("异常"+type);
    	}
    });
}
function pushContractTaskProcess(taskid,no)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_contract/update',
        onSubmit: function(param){
    	    if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
    	        $.messager.alert("拒绝修改", "任务名不能为空!","error");
    	        return false;
    	    }
    	    var state=no;
    	    if (state=="4") param.contractStatus=2;
            else param.contractStatus=state+1;
            param.guid=taskid;
            param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
            param.isback="false";
            var subT=$("form[tag='"+taskid+"']").find('select[name="contractType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
    	},
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "任务更新状态失败!","error");
    			return;
    		}
    		location.reload();
    	},
    	error:function(xhr,type,errorThrown) {
    	    console.log("异常"+type);
    	}
    });
}
function pushBackletterTaskProcess(taskid,no)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_backletter/update',
        onSubmit: function(param){
            if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
        	    $.messager.alert("拒绝修改", "任务名不能为空!","error");
        	    return false;
        	}
            var state=no;
            param.backletterStatus=state+1;
            param.guid=taskid;
            param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
            param.isback="false";
            var subT=$("form[tag='"+taskid+"']").find('select[name="backletterType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
        },
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="null" || data=='0') {
                $.messager.alert("提示", "任务更新状态失败!","error");
                return;
        	}
            location.reload();
        },
        error:function(xhr,type,errorThrown) {
            console.log("异常"+type);
        }
    });
}
function pushTenderTaskProcess(taskid,no)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_tender/update',
        onSubmit: function(param){
            if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
        	    $.messager.alert("拒绝修改", "任务名不能为空!","error");
        	    return false;
        	}
            var state=no;
            param.tenderStatus=state+1;
            param.guid=taskid;
            param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
            param.isback="false";
            var subT=$("form[tag='"+taskid+"']").find('select[name="tenderType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
        },
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="null" || data=='0') {
                $.messager.alert("提示", "任务更新状态失败!","error");
                return;
        	}
            location.reload();
        },
        error:function(xhr,type,errorThrown) {
            console.log("异常"+type);
        }
    });
}
function pushAgencyfeeTaskProcess(taskid,no)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_agencyfee/update',
        onSubmit: function(param){
            if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
        	    $.messager.alert("拒绝修改", "任务名不能为空!","error");
        	    return false;
        	}
            var state=no;
            param.agencyfeeStatus=state+1;
            param.guid=taskid;
            param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
            param.isback="false";
            var subT=$("form[tag='"+taskid+"']").find('select[name="agencyfeeType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
        },
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="null" || data=='0') {
                $.messager.alert("提示", "任务更新状态失败!","error");
                return;
        	}
            location.reload();
        },
        error:function(xhr,type,errorThrown) {
            console.log("异常"+type);
        }
    });
}
function pushAgreementTaskProcess(taskid,no)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_agreement/update',
        onSubmit: function(param){
            if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
        	    $.messager.alert("拒绝修改", "任务名不能为空!","error");
        	    return false;
        	}
            var state=no;
            param.agreementStatus=state+1;
            param.guid=taskid;
            param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
            param.isback="false";
            var subT=$("form[tag='"+taskid+"']").find('select[name="agreementType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
        },
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="null" || data=='0') {
                $.messager.alert("提示", "任务更新状态失败!","error");
                return;
        	}
            location.reload();
        },
        error:function(xhr,type,errorThrown) {
            console.log("异常"+type);
        }
    });
}
function pushEquiryTaskProcess(taskid,no)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_enquiry/update',
        onSubmit: function(param){
            if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
        	    $.messager.alert("拒绝修改", "任务名不能为空!","error");
        	    return false;
        	}
            var state=no;
            param.enquiryStatus=state+1;
            param.guid=taskid;
            param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
            param.isback="false";
            var subT=$("form[tag='"+taskid+"']").find('select[name="enquiryType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
        },
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="-20") {
                $.messager.alert("缺少前置字段", "请选择完成类型!","warning");
                return;
            }
            if (data=="null" || data=='0') {
                $.messager.alert("提示", "任务更新状态失败!","error");
                return;
        	}
            location.reload();
        },
        error:function(xhr,type,errorThrown) {
            console.log("异常"+type);
        }
    });
}
function jumpPricingTask(taskid)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_pricing/update',
        onSubmit: function(param){
    	    if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
    	        $.messager.alert("拒绝修改", "任务名不能为空!","error");
    	        return false;
    	    }
    	    param.pricingStatus=5;
    	    param.guid=taskid;
    	    param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
    	    param.isback="false";
    	    var subT=$("form[tag='"+taskid+"']").find('select[name="pricingType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
    	},
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="-20") {
                $.messager.alert("缺少前置字段", "请选择完成类型!","warning");
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "任务更新状态失败!","error");
    			return;
    		}
    		location.reload();
    	},
    	error:function(xhr,type,errorThrown) {
    	    console.log("异常"+type);
    	}
    });
}
function jumpContractTask(taskid,mark)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_contract/update',
        onSubmit: function(param){
    	    if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
    	        $.messager.alert("拒绝修改", "任务名不能为空!","error");
    	        return false;
    	    }
    	    if (mark=='finance') param.contractStatus=5;
    	    else if (mark=='done') param.contractStatus=6;
    	    else if (mark=='sdzb') param.contractStatus=7;
    	    else if (mark=='zjdsc') param.contractStatus=8;
    	    else {
    	        $.messager.alert("信息异常", "请刷新页面再试!","error");
                return false;
    	    }
    	    param.guid=taskid;
    	    param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
    	    param.isback="false";
    	    var subT=$("form[tag='"+taskid+"']").find('select[name="contractType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
    	},
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "任务更新状态失败!","error");
    			return;
    		}
    		location.reload();
    	},
    	error:function(xhr,type,errorThrown) {
    	    console.log("异常"+type);
    	}
    });
}
function pausePricingTask(taskid)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_pricing/update',
        onSubmit: function(param){
    	    if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
    	        $.messager.alert("拒绝修改", "任务名不能为空!","error");
    	        return false;
    	    }
    	    param.pricingStatus=3;
    	    param.guid=taskid;
    	    param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
    	    param.isback="false";
    	    var subT=$("form[tag='"+taskid+"']").find('select[name="pricingType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
    	},
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="-20") {
                $.messager.alert("缺少前置字段", "请选择完成类型!","warning");
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "任务更新状态失败!","error");
    			return;
    		}
    		location.reload();
    	},
    	error:function(xhr,type,errorThrown) {
    	    console.log("异常"+type);
    	}
    });
}
function pauseContractTask(taskid)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_contract/update',
        onSubmit: function(param){
    	    if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
    	        $.messager.alert("拒绝修改", "任务名不能为空!","error");
    	        return false;
    	    }
    	    param.contractStatus=3;
    	    param.guid=taskid;
    	    param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
    	    param.isback="false";
    	    var subT=$("form[tag='"+taskid+"']").find('select[name="contractType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
    	},
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "任务更新状态失败!","error");
    			return;
    		}
    		location.reload();
    	},
    	error:function(xhr,type,errorThrown) {
    	    console.log("异常"+type);
    	}
    });
}
function deleteTask(taskid,type)
{
    $.ajax({
        url: 'delete',
        type:'post', //HTTP请求类型
        data:   {
    	    'taskGuid': taskid,
    	    'type': type,
    	    'handler': JSON.parse(sessionStorage.getItem("user")).userid
    	        },
    	timeout:3000,
        success: function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","error");
    			return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "删除失败! 请刷新后重试! ","error");
    			return;
    	    }
    	    location.reload();
    	}
    });
}
function ediPricingTaskProcess(taskid)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_pricing/update',
        onSubmit: function(param){
    	    if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
    	        $.messager.alert("拒绝修改", "任务名不能为空!","error");
    	        return false;
    	    }
    	    param.pricingStatus=$("select[tag='"+taskid+"']").val();
    	    param.guid=taskid;
    	    param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
    	    param.isback="true";
    	},
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="-20") {
                $.messager.alert("缺少前置字段", "请选择完成类型!","warning");
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "任务更新状态失败!","error");
    			return;
    		}
    		location.reload();
    	},
    	error:function(xhr,type,errorThrown) {
    	    console.log("异常"+type);
    	}
    });
}
function ediContractTaskProcess(taskid)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_contract/update',
        onSubmit: function(param){
    	    if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
    	        $.messager.alert("拒绝修改", "任务名不能为空!","error");
    	        return false;
    	    }
            param.contractStatus=$("select[tag='"+taskid+"']").val();
            param.guid=taskid;
            param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
            param.isback="true";
    	},
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="-100") {
                $.messager.alert("操作禁止", "不允许回退到此状态!","warning");
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "任务更新状态失败!","error");
    			return;
    		}
    		location.reload();
    	},
    	error:function(xhr,type,errorThrown) {
    	    console.log("异常"+type);
    	}
    });
}
function ediBackletterTaskProcess(taskid)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_backletter/update',
        onSubmit: function(param){
            if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
        	    $.messager.alert("拒绝修改", "任务名不能为空!","error");
        	    return false;
        	}
            param.backletterStatus=$("select[tag='"+taskid+"']").val();
            param.guid=taskid;
            param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
            param.isback="true";
        },
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="null" || data=='0') {
                $.messager.alert("提示", "任务更新状态失败!","error");
                return;
        	}
            location.reload();
        },
        error:function(xhr,type,errorThrown) {
            console.log("异常"+type);
        }
    });
}
function ediTenderTaskProcess(taskid)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_tender/update',
        onSubmit: function(param){
            if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
        	    $.messager.alert("拒绝修改", "任务名不能为空!","error");
        	    return false;
        	}
            param.tenderStatus=$("select[tag='"+taskid+"']").val();
            param.guid=taskid;
            param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
            param.isback="true";
        },
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="null" || data=='0') {
                $.messager.alert("提示", "任务更新状态失败!","error");
                return;
        	}
            location.reload();
        },
        error:function(xhr,type,errorThrown) {
            console.log("异常"+type);
        }
    });
}
function ediAgencyfeeTaskProcess(taskid)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_agencyfee/update',
        onSubmit: function(param){
            if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
        	    $.messager.alert("拒绝修改", "任务名不能为空!","error");
        	    return false;
        	}
            param.agencyfeeStatus=$("select[tag='"+taskid+"']").val();
            param.guid=taskid;
            param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
            param.isback="true";
        },
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="null" || data=='0') {
                $.messager.alert("提示", "任务更新状态失败!","error");
                return;
        	}
            location.reload();
        },
        error:function(xhr,type,errorThrown) {
            console.log("异常"+type);
        }
    });
}
function ediAgreementTaskProcess(taskid)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_agreement/update',
        onSubmit: function(param){
            if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
        	    $.messager.alert("拒绝修改", "任务名不能为空!","error");
        	    return false;
        	}
            param.agreementStatus=$("select[tag='"+taskid+"']").val();
            param.guid=taskid;
            param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
            param.isback="true";
        },
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="null" || data=='0') {
                $.messager.alert("提示", "任务更新状态失败!","error");
                return;
        	}
            location.reload();
        },
        error:function(xhr,type,errorThrown) {
            console.log("异常"+type);
        }
    });
}
function ediEquiryTaskProcess(taskid)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_enquiry/update',
        onSubmit: function(param){
            if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
        	    $.messager.alert("拒绝修改", "任务名不能为空!","error");
        	    return false;
        	}
            param.enquiryStatus=$("select[tag='"+taskid+"']").val();
            param.guid=taskid;
            param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
            param.isback="true";
        },
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="-20") {
                $.messager.alert("缺少前置字段", "请选择完成类型!","warning");
                return;
            }
            if (data=="null" || data=='0') {
                $.messager.alert("提示", "任务更新状态失败!","error");
                return;
        	}
            location.reload();
        },
        error:function(xhr,type,errorThrown) {
            console.log("异常"+type);
        }
    });
}
// 回退启动
function editTask(e)
{
    if ($(e).hasClass("active")){
        var tag=$(e).attr("tag");
        var type=$("form[tag='"+tag+"']").attr("action");
        sessionStorage.setItem("lasT",tag);
        if (type=="1" || type.indexOf("task_pricing")!=-1) ediPricingTaskProcess(tag);
        else if (type=="2" || type.indexOf("task_contract")!=-1) ediContractTaskProcess(tag);
        else if (type=="3" || type.indexOf("task_backletter")!=-1) ediBackletterTaskProcess(tag);
        else if (type=="4" || type.indexOf("task_tender")!=-1) ediTenderTaskProcess(tag);
        else if (type=="5" || type.indexOf("task_agencyfee")!=-1) ediAgencyfeeTaskProcess(tag);
        else if (type=="6" || type.indexOf("task_agreement")!=-1) ediAgreementTaskProcess(tag);
        else if (type=="7" || type.indexOf("task_enquiry")!=-1) ediEquiryTaskProcess(tag);
    }else{

    }
}

function savePricingTask(taskid)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_pricing/save',
        onSubmit: function(param){
    	    if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
    	        $.messager.alert("拒绝修改", "任务名不能为空!","error");
    	        return false;
    	    }
    	    param.guid=taskid;
    	    param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
    	    var subT=$("form[tag='"+taskid+"']").find('select[name="pricingType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
    	},
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="-20") {
                $.messager.alert("缺少前置字段", "请选择完成类型!","warning");
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "任务更新失败!","error");
    			return;
    		}
    		location.reload();
    	},
    	error:function(xhr,type,errorThrown) {
    	    console.log("异常"+type);
    	}
    });
}
function saveContractTask(taskid)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_contract/save',
        onSubmit: function(param){
    	    if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
    	        $.messager.alert("拒绝修改", "任务名不能为空!","error");
    	        return false;
    	    }
    	    param.guid=taskid;
    	    param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
    	    var subT=$("form[tag='"+taskid+"']").find('select[name="contractType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
    	},
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "任务更新失败!","error");
    			return;
    		}
    		location.reload();
    	},
    	error:function(xhr,type,errorThrown) {
    	    console.log("异常"+type);
    	}
    });
}
function saveBackletterTask(taskid)
{
     $("form[tag='"+taskid+"']").form('submit',
     {
         url : '/task_backletter/save',
         onSubmit: function(param){
     	    if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
     	        $.messager.alert("拒绝修改", "任务名不能为空!","error");
     	        return false;
     	    }
     	    param.guid=taskid;
     	    param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
     	    var subT=$("form[tag='"+taskid+"']").find('select[name="backletterType"]');
             if (subT.prop("disabled")){
                 subT.removeAttr("disabled");
             }
     	},
         success:function(data) {
             if (data=="-1") {
                 $.messager.alert("操作禁止", "没有相应权限!","warning");
                 return;
             }
             if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
             }
     	     if (data=="null" || data=='0') {
     		    $.messager.alert("提示", "任务更新失败!","error");
     			return;
     		 }
     		 location.reload();
     	},
     	error:function(xhr,type,errorThrown) {
     	    console.log("异常"+type);
     	}
     });
 }
function saveTenderTask(taskid)
{
     $("form[tag='"+taskid+"']").form('submit',
     {
         url : '/task_tender/save',
         onSubmit: function(param){
     	    if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
     	        $.messager.alert("拒绝修改", "任务名不能为空!","error");
     	        return false;
     	    }
     	    param.guid=taskid;
     	    param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
     	    var subT=$("form[tag='"+taskid+"']").find('select[name="tenderType"]');
             if (subT.prop("disabled")){
                 subT.removeAttr("disabled");
             }
     	},
         success:function(data) {
             if (data=="-1") {
                 $.messager.alert("操作禁止", "没有相应权限!","warning");
                 return;
             }
             if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
             }
     	     if (data=="null" || data=='0') {
     		    $.messager.alert("提示", "任务更新失败!","error");
     			return;
     		 }
     		 location.reload();
     	},
     	error:function(xhr,type,errorThrown) {
     	    console.log("异常"+type);
     	}
     });
 }
function saveAgencyfeeTask(taskid)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_agencyfee/save',
        onSubmit: function(param){
            if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
        	    $.messager.alert("拒绝修改", "任务名不能为空!","error");
        	    return false;
        	}
            param.guid=taskid;
            param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
            var subT=$("form[tag='"+taskid+"']").find('select[name="agencyfeeType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
        },
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="null" || data=='0') {
                $.messager.alert("提示", "任务更新失败!","error");
                return;
        	}
            location.reload();
        },
        error:function(xhr,type,errorThrown) {
            console.log("异常"+type);
        }
    });
}
function saveAgreementTask(taskid)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_agreement/save',
        onSubmit: function(param){
    	    if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
    	        $.messager.alert("拒绝修改", "任务名不能为空!","error");
    	        return false;
    	    }
    	    param.guid=taskid;
    	    param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
    	    var subT=$("form[tag='"+taskid+"']").find('select[name="agreementType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
    	},
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "任务更新失败!","error");
    			return;
    		}
    		location.reload();
    	},
    	error:function(xhr,type,errorThrown) {
    	    console.log("异常"+type);
    	}
    });
}
function saveEnquiryTask(taskid)
{
    $("form[tag='"+taskid+"']").form('submit',
    {
        url : '/task_enquiry/save',
        onSubmit: function(param){
    	    if($("form[tag='"+taskid+"']").find("input[name='taskName']").val().length<1){
    	        $.messager.alert("拒绝修改", "任务名不能为空!","error");
    	        return false;
    	    }
    	    param.guid=taskid;
    	    param.modifier=JSON.parse(sessionStorage.getItem("user")).userid;
    	    var subT=$("form[tag='"+taskid+"']").find('select[name="enquiryType"]');
            if (subT.prop("disabled")){
                subT.removeAttr("disabled");
            }
    	},
        success:function(data) {
            if (data=="-1") {
                $.messager.alert("操作禁止", "没有相应权限!","warning");
                return;
            }
            if (data=="-11") {
                $.messager.alert("缺少有效字段", "请检查是否有敏感字段未填!","warning");
                return;
            }
            if (data=="-20") {
                $.messager.alert("缺少前置字段", "请选择完成类型!","warning");
                return;
            }
    	    if (data=="null" || data=='0') {
    		    $.messager.alert("提示", "任务更新失败!","error");
    			return;
    		}
    		location.reload();
    	},
    	error:function(xhr,type,errorThrown) {
    	    console.log("异常"+type);
    	}
    });
}
//Pilot后 保存任务
function validateTask(e)
{
     var tag=$(e).attr("save");
     var type=$("form[tag='"+tag+"']").attr("action");
     sessionStorage.setItem("lasT",tag);
     //console.log(type+" "+tag);
     if (type=="1" || type.indexOf("task_pricing")!=-1) savePricingTask(tag);
     else if (type=="2" || type.indexOf("task_contract")!=-1) saveContractTask(tag);
     else if (type=="3" || type.indexOf("task_backletter")!=-1) saveBackletterTask(tag);
     else if (type=="4" || type.indexOf("task_tender")!=-1) saveTenderTask(tag);
     else if (type=="5" || type.indexOf("task_agencyfee")!=-1) saveAgencyfeeTask(tag);
     else if (type=="6" || type.indexOf("task_agreement")!=-1) saveAgreementTask(tag);
     else if (type=="7" || type.indexOf("task_enquiry")!=-1) saveEnquiryTask(tag);
}
