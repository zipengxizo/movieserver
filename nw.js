	
let Service = require('node-windows').Service;
 
let svc = new Service({
  name: 'movie',    //服务名称
  description: 'movie node服务器', //描述
  script: './bin/www' //nodejs项目要启动的文件路径
});
 
svc.on('install', () => {
  svc.start();
});
 
svc.install();