function show_servers(pm2Str){ 
    $('#server_list').empty();
     var jsonStr = JSON.parse(pm2Str);
     var monit = jsonStr["monit"];
     var processes =jsonStr["processes"];
 //序号 服务 运行状态 内存 功能
     for(var i=0;i<processes.length;i++){
      //第一列 序号
      var index=$("<td></td>").text(i+1);
      //服务名
      var server_name=processes[i]["name"];
      var server_name_tr = $("<td></td>").text(server_name);
      //运行状态
      var status = processes[i]["pm2_env"]["status"];
      var status_tr =$("<td></td>").text(status);
      var row_class=" class='active'"
      if (status=="errored") {row_class=" class = 'danger'"}
      else if(status=="online") {row_class=" class = 'success'"}
      else if(status=="stopped") {row_class=" class = 'warning'"}
      var row=$("<tr id='server_list_row_" + i + "'" +row_class+ "></tr>");
      //内存
      var memory = processes[i]["monit"]["memory"];
      var memory_tr =$("<td></td>").text(memory);
      //CPU
      var cpu = processes[i]["monit"]["cpu"];
      var cpu_tr =$("<td></td>").text(cpu);
      //功能列表
      var fuc = $("<td id='server_fuc_"+i+"'></td>");
      var start_bt=$("<button id='server_start_bt_" + i + "'" + "></button>").text("开始服务")
      var stop_bt=$("<button id='server_stop_bt_" + i + "'" + "></button>").text("停止服务")
      var remove_bt=$("<button id='server_remove_bt_" + i + "'" + "></button>").text("移除服务")
      //创建单元
      $('#server_list').append(row)

      $('#server_list_row_'+i).append(index)
      $('#server_list_row_'+i).append(server_name_tr)
      $('#server_list_row_'+i).append(status_tr)
      $('#server_list_row_'+i).append(memory_tr)
      $('#server_list_row_'+i).append(cpu_tr)
      $('#server_list_row_'+i).append(fuc)

      $('#server_fuc_'+i).append(start_bt)
      $('#server_fuc_'+i).append(stop_bt)
      $('#server_fuc_'+i).append(remove_bt)
      $("#server_start_bt_"+i).click(function(){$.get("/pm2/start/path/"+server_name);
        get_server_list();
        })
      $("#server_stop_bt_"+i).click(function(){$.get("/pm2/stop/path/"+server_name);
        get_server_list();
        })
      $("#server_remove_bt_"+i).click(function(){$.get("/pm2/remove/path/"+server_name);
        get_server_list();
        })
     }
}
function get_server_list(){
  $.get("/pm2",function(data,status){
    if(status!=404){
      show_servers(data+"")} 
    else{
      alert("服务器发生错误！")
     }
      window.location.hash="#panel-201663";
  });
}