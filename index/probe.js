(function() {

    var PROBE_URL = 'http://10.220.10.60:8080/probe-service/probe/probeList';
    var PROBE_URL = 'http://127.0.0.1:5000/probe-service/probe/probeList'; //通过探针名查询URL
    // var PROBE_URL = 'http://10.220.10.60:8080/probe/rest/probeTask/query.do';
    var GROUP_URL = 'http://10.220.10.60:8000/probe-service/probeOrg/probeListByOrgId'
    var PAGE_SIZE  = 10;

    /*根据是否选择组id来选择调用哪一个load*/
    function load(name,index,size) {
        if(probeStore.state.groupid){
            return loadByGroup(name,index,size);
        } else {
            return probeLoad(name,index,size);
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
        probeUrl : PROBE_URL, //列表url
        pageSize : PAGE_SIZE, //页数
        load : load,
        probeLoadCallback : probeLoadCallback, //load回调函数
    }

})()