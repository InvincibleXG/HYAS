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

