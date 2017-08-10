process.title = 'tty.js';

var tty =  require('./lib/tty.js');
var path = require('path');
var child_process = require('child_process')
var conf = tty.config.readConfig()
  , app = tty.createServer(conf);
var http = require('http');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'static'));

app.get('/',function(req,res){
  var glob = require("glob")
  glob(process.cwd()+"/docker/*",function(err,files){
    if(err){
       return res.render('/index',{"files":""})
    }
    res.render('demo',{"files":files})
  })
})
//获取docker启动文件列表
app.get('/file_list',function(req,res){
  var glob = require("glob")
  glob(process.cwd()+"/docker/*",function(err,files){
    if(err){
       res.send(404);
    }
    else{
     res.send(files);
    }
  })
})
//获取pm2的进程信息
app.get('/pm2',function(req,res){
  var options = {  
    hostname: 'localhost',  
    port: 9615,  
    path: '/' ,  
    method: 'GET'  
  };  
  var req2 = http.request(options, function (res2) {  
    res2.setEncoding('utf8');  
    res2.on('data', function (chunk) {  
       res.send(chunk) 
    });  
  }); 
  req2.on('error', function (e) {  
    res.send(404) 
  });
  req2.end();
})
function httpPm2(call){
   http.get("http://localhost:9615", function(ress) {
    call(ress.text);
  }).on('error', function(e) {
    call(e.message);   
  });
}

//将需要运行的程序放置于Docker内
var fs = require('fs');
app.post('/docker', function(req, res, next) {
  if(!req.files){
    res.send("文件上传失败");}
  else{
    var tmp_path = req.files.docker_file.path;
    var target_path = './docker/'+req.files.docker_file.originalFilename;
    fs.rename(tmp_path,target_path,function(err){
      if (err) throw err;
      // 删除临时文件夹文件, 
      fs.unlink(tmp_path, function() {
         if (err) throw err;
         res.redirect('/');
      });
    })
  }
});
//删除对应的程序
app.get('/delete/:filePath',function(req,res){
  var filePath=process.cwd()+"/docker/"+req.params.filePath;
  if(fs.existsSync(filePath)){
    fs.unlinkSync(filePath)
  }
})
//运行pm2命令
app.get('/pm2/:pm2_type/path/:file_path',function(req,res){
  var pm2_type = 'list';
  console.log(req.params.pm2_type);
  switch(req.params.pm2_type){
    case "start":
    pm2_type='start'
    break;
    case "stop":
    pm2_type='stop'
    break;
    case "remove":
    pm2_type='delete'
    break;
    case "restart":
    pm2_type='restart'
    break;
    case "detail":
    pm2_type='describe'
    break;
    default:
    return res.send("无效命令！")
  }

  var workerProcess = child_process.exec('cd '+process.cwd()+"/docker"+'&& pm2 '+pm2_type+' '+req.params.file_path,function(error,stdout,stderr){
    if(error){
      res.send(stderr);
    }
    else{
      res.send(stdout);
    }
  })
   
  workerProcess.on('exit',function(code){
  });
})


app.listen();