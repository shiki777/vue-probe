(function() {

    var store = new Vuex.Store({
        state : {
            taskList : [], /*任务列表*/
            taskPage : 1, /*任务页数*/
            currentPage : 1, /*任务页数*/
            taskName : '', /*任务名*/
            isHistory : false /*是否读取历史记录*/
        },
        mutations : {
            updateTaskList : function(state,list) {
                var l = formatList(list);
                state.taskList = list;
            },
            updatePage : function(state, page) {
                state.taskPage = page;
            }
        },
        actions : {        
            updateTaskList : function(context,list) {
                context.commit('updateTaskList', list);
            },
            updatePage : function(context, page) {
                context.commit('updatePage',page);
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
        console.log(res)
        return res;
    }

    window.taskStore = store;


})()