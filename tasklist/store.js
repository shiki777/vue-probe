(function() {

    var store = new Vuex.Store({
        state : {
            taskList : [], /*任务列表*/
            taskPage : 1, /*任务页数*/
            currentPage : 1, /*任务页数*/
            taskName : '', /*任务名*/
            isHistory : false, /*是否读取历史记录*/
            isEdit : false /*是否编辑任务，否则为新建任务*/
        },
        mutations : {
            updateTaskList : function(state,list) {
                var l = formatList(list);
                state.taskList = l;
            },
            updatePage : function(state, page) {
                state.taskPage = page;
            },
            updateCurrentPage : function(state,page) {
                state.currentPage = page;
            },
            updateType : function(state,isHis) {
                state.isHistory = isHis;
            },
            updateTaskName : function(state, name) {
                state.taskName = name;
            },
            updateEdit : function(state, isEdit) {
                state.isEdit = isEdit;
            }
        },
        actions : {        
            updateTaskList : function(context,list) {
                context.commit('updateTaskList', list);
            },
            updatePage : function(context, page) {
                context.commit('updatePage',page);
            },
            updateCurrentPage : function(context,page) {
                context.commit('updateCurrentPage', page);
            },
            updateType : function(context,isHis) {
                context.commit('updateType', isHis);
            },
            updateTaskName : function(context,name) {
                context.commit('updateTaskName', name);
            },
            updateEdit : function(context, isEdit) {
                context.commit('updateEdit', isEdit);
            }
        }

    });

    function formatList(list) {
        var l = list.length;
        var res = [];
        for(var i = 0; i < l; i++){
            var taskItem = list[i];
            res.push({
                id : taskItem['taskId'],
                name : taskItem['taskName'],
                type : taskItem['type'],
                time : taskItem['hbtime'],
                udphost : taskItem['udphost'],
                status : taskItem['status'],
                operationType : taskItem['operationType']
            });
        };
        return res;
    }

    window.taskStore = store;


})()