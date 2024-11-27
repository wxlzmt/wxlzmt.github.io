
### 快速搭建一个网站
(一个看起来绝对正常无可挑剔的正常网站)

**linux版本:centos6 x64**

1.安装httpd
```shell
yum -y install httpd php
```
2.修改配置文件    
路径:`/etc/httpd/conf/httpd.conf`    
改端口 `Listen 976`

如果嫌修改起来麻烦,直接下载我改好的
```shell
mv /etc/httpd/conf/httpd.conf /etc/httpd/conf/httpd.conf.bak
wget -P /etc/httpd/conf https://wxlzmt.github.io/static/resource/script/httpd.conf
```
**端口:976,已优化小内存服务器.已解决启动httpd时,报错Could not reliably determine the server's fully qualified domain name, using ::1 for ServerName的问题, 已关闭ServerSignature.**    

至于说为什么不用80端口,这是为了留给别的应用使用,你懂的.

如果需要修改端口号,则需要修改2处:
```shell
Listen 976
ServerName 127.0.0.1:976
```
3.设置开机自启动
```shell
chkconfig --level 2345 httpd on
```
4.给网站放一些数据 

```shell
禁止搜索引擎搜到
wget -P /var/www/html https://wxlzmt.github.io/static/resource/script/robots.txt

探针(简体中文)
wget -P /var/www/html https://wxlzmt.github.io/static/resource/script/tz.php

放一个静态网站
wget https://raw.githubusercontent.com/wxlzmt/bigfiles/master/jdk1.8-api.zip
#由于github的原因,下载地址可能不好使,详见 https://github.com/wxlzmt/bigfiles
unzip -n jdk1.8-api.zip -d /var/www/html
```

---

end

