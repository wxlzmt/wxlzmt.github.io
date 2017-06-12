// encoding utf8
(function(){
	var getXHRInstance = function () {
	  var xhr = null;
	  if (window.XMLHttpRequest) { // code for IE7, Firefox, Opera, etc.
		xhr = new XMLHttpRequest();
	  } else if (window.ActiveXObject) { // code for IE6, IE5
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	  }
	  return xhr;
	};
    var ajax = function(opt) {
        opt = opt || {};
        opt.method = (opt.method==null?"GET":opt.method.toUpperCase());
        opt.url = opt.url || '';
        opt.async = opt.async || true;
        opt.data = opt.data || null;
        opt.success = opt.success || function () {};
		opt.error = opt.error || function () {};
        var xmlHttp = getXHRInstance();
		if(xmlHttp==null)return;
		var params = [];
        for (var key in opt.data){
            params.push(key + '=' + opt.data[key]);
        }
        var postData = params.join('&');
		var _url = opt.url;
		if(opt.url.indexOf("?")>0){
			_url = opt.url + '&' + postData;
		}else{
			_url = opt.url + '?' + postData;
		}
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 ) {
				if(xmlHttp.status == 200){
					opt.success(xmlHttp.responseText,xmlHttp.status,xmlHttp.statusText);
				}else{
					opt.error(xmlHttp.responseText,xmlHttp.status,xmlHttp.statusText);
				}
            }
        };
        if (opt.method.toUpperCase() === 'POST') {
            xmlHttp.open(opt.method, _url, opt.async);
            xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
            xmlHttp.send(postData);
        } else if (opt.method.toUpperCase() === 'GET') {
            xmlHttp.open(opt.method, _url, opt.async);
            xmlHttp.send(null);
        } 
    }
	window.$$ = {
		"ajax":ajax
	};
})();

//how to use
//$$.ajax({
//		url:"../../resource/cdnjs.cloudflare.com.json",
//		data:{key1:val1,key2:val2},
//		success:function(response,status,statusText){
//			//console.log(response);
//		},
//		error:function(response,status,statusText){
//			
//		}
//	});
//
