function loadTree(regions)
{
    var html="<ul><li><div class='close_menu'><span></span><a guid='TOP'>通力电梯</a></div>";
    html+="<ul>";
    for (var i in regions)
    {
        html+="<li><div class='close_menu'><span></span><a guid='"+regions[i].guid+"' type='1' shortName='"+regions[i].shortName+
        "' description='"+regions[i].description+"'pguid='TOP' >"+regions[i].name+"</a></div>";
        var branches=JSON.parse(regions[i].children);
        html+="<ul>";
        for (var j in branches)
        {
            html+="<li><a guid='"+branches[j].guid+"' type='2' pguid='"+regions[i].guid+"' shortName='"+branches[j].shortName+
            "'description='"+branches[j].description+"' >"+branches[j].name+"</a></li>";
        }
        html+="</ul>";
        html+="</li>";
    }
    html+="</ul></li></ul>";
    $("#root").html(html);
    treeReady();
    // 自动打开节点
    let nodes=$(".close_menu span");
    let nodelen=nodes.length;
    for (let i=0; i<nodelen; i++){
        nodes.eq(i).click();
    }
}
