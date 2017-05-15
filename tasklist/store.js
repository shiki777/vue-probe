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
            /*整体更新list*/
            updateTaskList : function(state,list) {
                var l = formatList(list);
                state.taskList = l;
            },
            /*添加一条记录*/
            addTask : function(state, task) {
                state.push(task);
            },
            delTask: function(state, task) {
                var index = -1;
                for (var i = 0; i < state.taskList.length; i++) {
                    if (index == -1 && state.taskList[i].id == task.id) {
                        index = i;
                    }
                }
                if (index >= 0) {
                    state.taskList.splice(index, 1);
                }
            },
            updateTask : function(state, task) {
                var index = -1;
                for(var i = 0; i < state.taskList.length; i++){
                    if(index == -1 && state.taskList[i].id == task.id){
                        index = i;
                    }
                }
                if(index >=0){
                    for(var key in task){
                        self.taskList[index][key] = task[key];
                    }
                }
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
            addTask : function(context, task) {
                console.log(task)
                context.commit('addTaskList',task);
            },
            delTask : function(context, task) {
                context.commit('delTask', task);
            },
            updateTask : function(context, task) {
                context.commit('updateTask', task);
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