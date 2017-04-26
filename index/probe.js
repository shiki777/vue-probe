(function() {

    var PROBE_URL = 'http://10.220.10.60:8080/probe-service/probe/probeList';
    var PROBE_URL = 'http://127.0.0.1:5000/probe-service/probe/probeList';
    // var PROBE_URL = 'http://10.220.10.60:8080/probe/rest/probeTask/query.do';
    var PAGE_SIZE  = 10;

    function load(name,index,size) {
        var requestBody = {
            hostname : name,
            pageIndex : parseInt(index,10) || 0,
            pageSize : parseInt(size,10) || PAGE_SIZE
        };
        return Vue.http.post(PROBE_URL,requestBody);
    }

    /*export*/
    window.snailprobe = {
        probeUrl : PROBE_URL, //列表url
        pageSize : PAGE_SIZE, //页数
        load : load 
    }

})()