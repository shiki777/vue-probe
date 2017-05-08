(function() {

    var BASE_URL = 'http://10.220.10.60:8089';
    var CURRENT_URL = BASE_URL + '/probe-service/task/taskList';
    var HISTORY_URL = BASE_URL + '/probe-service/task/historyTaskList';
    var PAGE_SIZE  = 10;

    var messageBus = new Vue();

    var lastIndex = 0;

    /*根据是否选择组id来选择调用哪一个load param参数暂时弃用*/
    function load(param,index,size) {
        if(index == 0){

        } else {
            /*index不传参数则用lastIndex*/
            var index = index  ? index : lastIndex;
        }
        lastIndex = index;
        if(taskStore.state.isHistory){
            return loadHistory(taskStore.state.taskName,index,size);
        } else {
            return loadDoing(taskStore.state.taskName,index,size);
        }
    }

    /*获取当前任务*/
    function loadDoing(taskName,index,size) {
        var requestBody = {
            taskName : taskName,
            pageIndex : parseInt(index,10) || 0,
            pageSize : parseInt(size,10) || PAGE_SIZE
        };
        return Vue.http.post(CURRENT_URL,requestBody); 
    }

    /*读取历史人物*/
    function loadHistory(taskName,index,size) {
        var requestBody = {
            taskName : taskName,
            pageIndex : parseInt(index,10) || 0,
            pageSize : parseInt(size,10) || PAGE_SIZE
        };
        return Vue.http.post(HISTORY_URL,requestBody);
    }

    /*回调函数*/
    function loadCallback(data) {
        taskStore.dispatch('updateTaskList',data.body.taskList);
        taskStore.dispatch('updatePage', data.body.indexCounts);
    }

    window.snailtask = {
        BASE_URL : BASE_URL,
        pageSize : PAGE_SIZE,
        load : load,
        loadCallback : loadCallback,
        messageBus : messageBus
    };

})()