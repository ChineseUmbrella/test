 function show_dockers(filesStr){
    $('#download_list').empty();
     var array = filesStr.split(',');
     for(var i=0;i<array.length;i++){
        if (array[i]=="") {continue;}; 
        //第i+1行
        var row=$("<tr id='file_list_row_" + i + "'" + "></tr>");
        //第一列 序号
        var index=$("<td></td>").text(i+1);

        //第二列 文件名
        var path=array[i].split("/");
        var child=$("<td></td>").text(path[path.length-1])

        //第三列 功能列表
        var fuc = $("<td id='fuc_"+i+"'></td>");

        var start_bt=$("<button id='start_bt_" + i + "'" + "></button>").text("开始服务")
        var stop_bt=$("<button id='stop_bt_" + i + "'" + "></button>").text("停止服务")
        var remove_bt=$("<button id='remove_bt_" + i + "'" + "></button>").text("移除服务")
        var delete_bt=$("<button id='delete_bt_" + i + "'" + "></button>").text("删除文件")

        //创建单元
        $('#download_list').append(row)

        $('#file_list_row_'+i).append(index);
        $('#file_list_row_'+i).append(child);
        $('#file_list_row_'+i).append(fuc);

        $('#fuc_'+i).append(start_bt);
        $('#fuc_'+i).append(stop_bt);
        $('#fuc_'+i).append(remove_bt);
        $('#fuc_'+i).append(delete_bt);

        $("#start_bt_"+i).click(function(){$.get("/pm2/start/path/"+path[path.length-1]);
        })
        $("#stop_bt_"+i).click(function(){$.get("/pm2/stop/path/"+path[path.length-1]);
        })
        $("#remove_bt_"+i).click(function(){$.get("/pm2/remove/path/"+path[path.length-1]);
        })
        $("#delete_bt_"+i).click(function(){$.get("/delete/"+path[path.length-1]);
            get_file_list();
        })
   }
}
function get_file_list(){
  $.get("/file_list",function(data,status){
    if(status!=404){
      show_dockers(data+"")} 
    else{
      alert("服务器发生错误！")
     }
     window.location.hash="#panel-983436"
  });
}