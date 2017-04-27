(function() {

    var BASE_URL = 'http://10.220.10.60:8089';
    var PROBE_URL = 'http://10.220.10.60:8080/probe-service/probe/probeList';
    var PROBE_URL = 'http://127.0.0.1:5000/probe-service/probe/probeList'; //通过探针名查询URL
    // var PROBE_URL = 'http://10.220.10.60:8080/probe/rest/probeTask/query.do';
    var GROUP_URL = 'http://10.220.10.60:8000/probe-service/probeOrg/probeListByOrgId'
    var GROUP_URL = 'http://127.0.0.1:5000/org';
    var PAGE_SIZE  = 10;

    var lastIndex = 0;

    /*根据是否选择组id来选择调用哪一个load param参数暂时弃用*/
    function load(param,index,size) {
        if(index == 0){

        } else {
            /*index不传参数则用lastIndex*/
            var index = index  ? index : lastIndex;
        }
        lastIndex = index;
        if(probeStore.state.groupid){
            return loadByGroup(probeStore.state.groupid,index,size);
        } else {
            return probeLoad(probeStore.state.probeName,index,size);
        }
    }

    function probeLoad(name,index,size) {
        var requestBody = {
            hostname : name,
            pageIndex : parseInt(index,10) || 0,
            pageSize : parseInt(size,10) || PAGE_SIZE
        };
        return Vue.http.post(PROBE_URL,requestBody);
    }

    function probeLoadCallback(data) {
        probeStore.dispatch('updateList',data.body.probeList);
        probeStore.dispatch('updatePage', data.body.indexCounts);
    }

    function loadByGroup(gid,index,size) {
        var requestBody = {
            orgId : gid,
            pageIndex : parseInt(index,10) || 0,
            pageSize : parseInt(size,10) || PAGE_SIZE
        };
        return Vue.http.post(GROUP_URL,requestBody);        
    }

    /*export*/
    window.snailprobe = {
        BASE_URL : BASE_URL,
        probeUrl : PROBE_URL, //列表url
        pageSize : PAGE_SIZE, //页数
        load : load,
        probeLoadCallback : probeLoadCallback, //load回调函数
    }

})()