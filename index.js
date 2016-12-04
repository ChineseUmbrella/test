process.title = 'tty.js';

var tty =  require('./lib/tty.js');

var conf = tty.config.readConfig()
  , app = tty.createServer(conf);

app.listen();