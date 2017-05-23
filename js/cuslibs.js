/**
 * 自定义js方法库
 */
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
	var ajax = function(obj) {
	  if(obj!=null){
		  var options = obj;
		  if(typeof(options)=="string"){
			  options = {url:obj};
		  }else if(typeof(options)=="object"){
			  var xmlhttp = getXHRInstance();
			  var state_Change = function () {
				if (xmlhttp.readyState == 4) { // 4 = "loaded"
				  if (xmlhttp.status == 200) { // 200 = "OK"
					if(options.success && typeof(options.success)=="function"){
						(options.success)(xmlhttp.responseText,xmlhttp.status,xmlhttp.statusText);
					}
				  }
				}
			  }
			  if (xmlhttp != null) {
				xmlhttp.onreadystatechange = state_Change;
				var _method = options.method?options.method:"GET";
				xmlhttp.open(_method, options.url, true);
				xmlhttp.send(options.data);
			  }
		  }
	  }
	}
	//注册方法
	window.$$ = {
		"ajax":ajax
	};
})();
