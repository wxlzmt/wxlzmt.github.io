#### how to use gbk.js

```javascript
<script type="module">
	import gbk from './gbk.js';
	window.gbk = gbk;

	var s1 = "中文aaa/bbb啊啊啊";
	console.log("原文=", s1);
	var s2 = window.gbk.encode(s1);
	console.log("GBK方式编码之后=", s2);

	var s3 = "%D6%D0%CE%C4aaa%2Fbbb%B0%A1%B0%A1%B0%A1";
	console.log("原文=", s3);
	var s4 = window.gbk.decode(s3);
	console.log("GBK方式解码之后=", s4);
</script>
```

---

