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
        opt.header = opt.header || null;
        opt.success = opt.success || function () {};
        opt.error = opt.error || function () {};
        var xmlHttp = getXHRInstance();
        if(xmlHttp==null)return;
        xmlHttp.onreadystatechange = function () {
            //console.log(xmlHttp);
            if (xmlHttp.readyState == 4 ) {
                if(xmlHttp.status == 200){
                    opt.success(xmlHttp.responseText,xmlHttp.status,xmlHttp.statusText);
                }else{
                    opt.error(xmlHttp.responseText,xmlHttp.status,xmlHttp.statusText);
                }
            }
        };
        var params = [];
        var postData = opt.data;
        if(typeof(opt.data)=="object"){
            for (var key in opt.data){
                params.push(key + '=' + encodeURIComponent(opt.data[key]));
            }
            postData = params.join('&');
        }
        var body = null;
        if (opt.method.toUpperCase() === 'POST') {
            body = postData;
            xmlHttp.open(opt.method,opt.url, opt.async);
        }else{
            var _url = opt.url;
            if(params.length>0){
                if(opt.url.indexOf("?")>0){
                    _url = opt.url + '&' + postData;
                }else{
                    _url = opt.url + '?' + postData;
                }
            }
            xmlHttp.open(opt.method,_url, opt.async);
        }
        if(opt.header!=null){
            for(kk in opt.header){
                var val = opt.header[kk];
                xmlHttp.setRequestHeader(kk,val);
            }
        }else{
            xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        }
        xmlHttp.send(body);
    };
    window.$$ = {
        "ajax":ajax
    };
})();

/*how to use
$$.ajax({
		url:"https://api.cdnjs.com/libraries",
		data:{key1:"val1",key2:"val2"},
		header:{"Content-Type":"application/json;charset=utf-8"},
		success:function(response,status,statusText){
			console.log(response);
		},
		error:function(response,status,statusText){

	}
});
*/
