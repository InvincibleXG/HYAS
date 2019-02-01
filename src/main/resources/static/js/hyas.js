/**
 * Modified by wangyifan_XG on 2018/3/10
 */
var contextPath="/HYAS";
$(function () {
    /**
    * 设置未来(全局)的AJAX请求默认选项
    * 主要设置了AJAX请求遇到Session过期的情况
    */
    $.ajaxSetup({
        complete: function(xhr,status) {
             if(xhr.status == 401) {
                 location.href = '/';
             }
        }
    });

    $("#attend").click(function () {
        location.href="index?target=home";
    });
    $("#userManage").click(function () {
        location.href="index?target=user";
    });
    // 回车换下一个input
    $('input.easyui-validatebox').keydown(function(event){
        if (event.keyCode == 13){
            var form=this.form.id;
            var validates=$("#"+form).find("input.easyui-validatebox");
            var len=validates.length;
            for (var i=0; i<len; i++){
                if (i<len-1){
                    if (validates.eq(i).attr("name")==$(this).attr("name")){
                        for (var j=i+1; j<len; j++){
                            if (!validates.eq(j).prop("disabled")){ validates.eq(j).focus(); break; }
                        }
                    }
                }
            }
            return false;
        }
    });

    // 阻止向number类型的input输入奇怪字符 但是中文状态下的-+号没有keyCode所以无法拦截
    $('input[type="number"]').keydown(function(event){
        if (event.keyCode==69 || event.keyCode==229 || event.keyCode==187 || event.keyCode==189 || event.keyCode==190) {
            return false;
        }
    });
    
    $("#attendGo").click(function () {
        if (everPost==1) {
            $.messager.alert("提示", "请求已经发出, 请稍等...","warning");
            return false;
        }
        everPost=1;
        $.ajax({
            url: contextPath+'/attend/go',
            type:'post', //HTTP请求类型
            timeout:10000, //超时时间设置为10
            success: function(data) {
                everPost=0;
                if (data=="1"){
                    $.messager.alert("提交结果", "签到成功!", "info");
                    $("#attendGo").attr("disabled","true");
                    $("#attendGo").text("已签");
                    return;
                }
                if (data=="null" || data=='0') {
                    $.messager.alert("提示", "签到! 请刷新后重试! ", "error");
                    return;
                }
                if (data=="-1") {
                    $.messager.alert("提示", "登录失效!", "error");
                    return;
                }
                $.messager.alert("提示", data, "error");
            },
            error: function (xhr) {
                everPost=0;
                $.messager.alert("提示", "请求超时, 请刷新后重试! ", "error");
                console.log(xhr);
            }
        });
    });
});

