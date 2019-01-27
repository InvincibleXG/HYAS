/**
 * Created by chenweixuan on 2017/8/9.
 * Modified by wangyifan_XG on 2018/3/10
 */
$(function () {
    /**
    * 设置未来(全局)的AJAX请求默认选项
    * 主要设置了AJAX请求遇到Session过期的情况
    */
    $.ajaxSetup({
        complete: function(xhr,status) {
             if(xhr.status == 401) {
                 var top = getTopWinow();
                 top.location.href = '/index';
             }
        }
    });
    //页面跳转
    $(".nps_logo").click(function () {
        window.location.href="/main"
    });
    var n = $(".menu-matrixes").length;
    var flag =  new Array(n);
    for(var i=0; i<n;i++){
        flag[i]=0;
    }
    // 项目管理
     $(".menu-matrixes[id='pp']").click(function() {
        var i = $(".menu-matrixes").index(this);
        if(flag[i]==0){
            for(var j=0; j<n;j++){
                $(".menu-matrixes").eq(j).find(".dropdown").slideUp().addClass("invisible");
                flag[j]=0;
            }
            $(this).find(".dropdown").slideDown('slow').removeClass("invisible");
            flag[i]=1;
        }else{
        }
        // 一级菜单
        $(".aside-menu>li").removeClass("onon");
        $(this).addClass("onon");
        $(".aside-dropdown>li").removeClass("onon");
        document.getElementById("right").src="project/";
    });
    // 数据管理
    $(".menu-matrixes[tag='data']").click(function() {
        if (JSON.parse(sessionStorage.getItem("author")).authorityBackgroundData=="true"){
            var i = $(".menu-matrixes").index(this);
            if(flag[i]==0){
                for(var j=0; j<n;j++){
                    $(".menu-matrixes").eq(j).find(".dropdown").slideUp().addClass("invisible");
                    flag[j]=0;
                }
                $(this).find(".dropdown").slideDown('slow').removeClass("invisible");
                flag[i]=1;
            }else{
            }
        } else {
            $('#myModal').modal('show');
        }
    });
    // 报表
    $(".menu-matrixes[tag='report']").click(function() {
       var a=JSON.parse(sessionStorage.getItem("author"));
       if (a.authorityPricingReport=="true" || a.authorityContractReport=="true" ||
       a.authorityBackletterReport=="true" || a.authorityAgreementReport=="true" ||
       a.authorityAgencyfeeReport=="true" || a.authorityTenderReport=="true" ||
       a.authorityEnquiryReport=="true" ){
            var i = $(".menu-matrixes").index(this);
            if(flag[i]==0){
                for(var j=0; j<n;j++){
                    $(".menu-matrixes").eq(j).find(".dropdown").slideUp().addClass("invisible");
                    flag[j]=0;
                }
                $(this).find(".dropdown").slideDown('slow').removeClass("invisible");
                flag[i]=1;
            }else{
//                $(this).find(".dropdown").slideUp().addClass("invisible");
//                flag[i]=0;
            }
        } else {
            $('#myModal').modal('show');
        }
    });
    // 盖章
    $(".menu-matrixes[id='seal']").click(function() {
        var a=JSON.parse(sessionStorage.getItem("author"));
        if (a.authoritySealRead=="true"){
            var i = $(".menu-matrixes").index(this);
            if(flag[i]==0){
                for(var j=0; j<n;j++){
                    $(".menu-matrixes").eq(j).find(".dropdown").slideUp().addClass("invisible");
                    flag[j]=0;
                }
                $(this).find(".dropdown").slideDown('slow').removeClass("invisible");
                flag[i]=1;
            }else{
            }
            // 一级菜单
            $(".aside-menu>li").removeClass("onon");
            $(this).addClass("onon");
            $(".aside-dropdown>li").removeClass("onon");
            document.getElementById("right").src="seal/";
        }else{
            $('#myModal').modal('show');
        }
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
});
function getAllChineseNames()
{
    $.ajax({
        url: "/user/getAllChineseNames",
        type: 'post',
        timeout: 3000,
        success: function(data){
            if (data==null || data=="null"){
                console.log("warning! can't get user Chinese names");
                return;
            }
            var userNames=JSON.parse(data);
            for (var i in userNames){
                sessionStorage.setItem(userNames[i].user, userNames[i].description);
            }
        },
        error: function(errMsg){
            console.log(errMsg);
        }
    });
}
function getAuthority(userid)
{
    $.ajax({
        url: "/user/getAuthority",
        data: { 'userId': userid },
        type: 'post',
        timeout: 3000,
        success: function(data) {
            sessionStorage.setItem("author",data);
        },
        error: function(errMsg){
            console.log(errMsg);
        }
    });
}

