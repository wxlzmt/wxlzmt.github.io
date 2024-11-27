#!/bin/bash
# 本脚本的作用：linux 修改ls显示的时间格式，适用于centos，其他系统未做测试。本脚本有防止重复执行的机制。

# 放在github上方便下载使用，使用命令如下：
# wget -O /root/inject_time_style.sh https://wxlzmt.github.io/static/resource/script/inject_time_style.sh
# su root
# chmod +x /root/inject_time_style.sh
# /root/inject_time_style.sh
# source /root/.bash_profile


# ls -lha 显示结果每一列的含义
# 输出的7列的含义依次是:
# ①文件属性   ②文件数 ③拥有者 ④所属的group ⑤文件大小 ⑥建档日期            ⑦文件名
# -rw-r--r--   1       root    root         217       2019-07-12 10:06:23   .bash_profile

#使用 /bin/sh 意味着报错立即停止执行
#使用 /bin/bash 意味着报错死扛到底
#调用其它脚本或者启动程序时建议使用nohup
#======script start ============
bashfilepath="/root/.bash_profile"
#查询进程关键字符串,用于防止重复执行启动程序的命令
tofindstr="TIME_STYLE"
OUT=$(cat $bashfilepath | grep $tofindstr | awk '{ print $0 }')
#-n str1 当串的长度大于0时为真(串非空)
#-z str1 当串的长度为0时为真(空串)
if [ -n "$OUT" ]; then
  echo -e "\033[31m系统已存 TIME_STYLE ,现在放弃注入! \033[0m"
else
  #echo "" >> 文件名是为了添加换行符, >代表覆盖 , >>代表追加
  echo "" >> $bashfilepath
  echo "export TIME_STYLE='+%Y-%m-%d %H:%M:%S'" >> $bashfilepath
  echo "" >> $bashfilepath
  #在脚本内执行source是不生效的,因为当前执行环境是在本shell脚本之内,
  #对外面的环境没有影响,所以需要手动执行,或者重启使之生效
  #source $bashfilepath
  echo -e "\033[32m已添加时间样式. \033[0m"
  echo -e "请手动执行命令 \033[32m source $bashfilepath \033[0m 以便立即生效. "
fi
#=======script end =============
