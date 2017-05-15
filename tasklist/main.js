(function() {

    loginManage.chack();
    main();
    var vm;

    function main() {
        initPlugin();
        snailtask.load(taskStore.state.taskName)
        .then(function(data) {
            createVm();
            initPlugin();
            taskStore.commit('updateTaskList',data.body.taskList);
            taskStore.commit('updatePage',data.body.indexCounts);
        })
        .catch(function(err) {
            console.log(err)
        })
    }

    function initPlugin() {
        var startTime = moment();
        var endTime = moment().endOf('day');
        var startOnlyTime =moment();

        $('input[name="task_time2"]').daterangepicker({
            timePicker:true,
            timePicker24Hour:true,
            timePickerSeconds: true,
            timePickerIncrement: 1,
            minDate : moment(),
            locale: {
                format: 'YYYY-MM-DD HH:mm:ss'
            },
            autoApply: true,
        }, function(start, end){        
            startTime=start;
            endTime = end;
        });

        $('input[name="task_time3"]').daterangepicker({
            singleDatePicker: true,
            timePicker:true,
            timePicker24Hour:true,
            timePickerSeconds: true,
            timePickerIncrement: 1,
            minDate : moment(),
            locale: {
                format: 'YYYY-MM-DD HH:mm:ss'
            },
            autoApply: true,
        }, function(start, end){        
            startOnlyTime=start;            
        }); 
    }

    function createVm() {
            vm = new Vue({
            el : '#page-wrap',
            store : taskStore,
            data : function() {
                return {
                    type : 'cur', /*当前显示tab类型，有his cur*/
                    taskName : ''
                };
            },
            component : {
                page : 'page',
                taskpanel : 'taskpanel'
            },
            computed : {
                taskList : function() {
                    return this.$store.state.taskList;
                }
            },
            methods : {
                statusMsg : function(status) {
                    if(status == -1){
                        return '暂停中';
                    }
                    if(status == 1){
                        return '运行中';
                    }
                    if(status == 0){
                        return '未运行';
                    }
                },
                onCurrentTaskClick : function() {
                    if(this.type == 'cur') return;
                    this.type = 'cur';
                    this.clearTaskName();                  
                    this.$store.dispatch('updateType', false)
                        .then(this.load);
                    this.$store.dispatch('updateCurrentPage',1);
                },
                onHistoryTaskClick : function() {
                    if(this.type == 'his') return;
                    this.type = 'his';
                    this.clearTaskName();
                    this.$store.dispatch('updateType', true)
                        .then(this.load);        
                    this.$store.dispatch('updateCurrentPage',1);            
                },
                onSerchClick : function() {
                    this.$store.dispatch('updateTaskName', this.taskName)
                        .then(this.load);
                },
                onCreateTaskClick : function() {
                    snailtask.messageBus.$emit('showPanel',true);
                },
                onDestConfigClick : function() {
                    snailtask.messageBus.$emit('showDest', true);
                },
                onTaskDel: function(id, name) {
                    var DEL_URL = snailtask.BASE_URL + '/probe-service/task/taskDelete';
                    var requestBody = {
                        taskId : id,
                        taskName: name
                    };
                    var self = this;
                    Vue.http.post(DEL_URL, requestBody)
                        .then(function(data) {
                            if (data.body.status == 0) {
                                self.$store.dispatch('delTask',{id : id});
                            } else {
                                alert('删除失败，请检查网络');
                            }
                        })
                        .catch(function() {
                            alert('删除失败，请检查网络');
                        })
                },
                onTaskPause : function(id) {
                    var PAUSE_URL = snailtask.BASE_URL + '/probe-service/task/taskPause';
                    var requestBody = {
                        taskId : id,
                    };
                    var self = this;
                    Vue.http.post(PAUSE_URL, requestBody)
                        .then(function(data) {
                            if (data.body.status == 0) {
                                self.$store.dispatch('updateTask',{id : id,status : -1});
                            } else {
                                alert('暂停失败，请检查网络');
                            }
                        })
                        .catch(function() {
                            alert('暂停失败，请检查网络');
                        })
                },
                isActive : function(type) {
                    return this.type == type ? 'active' : '';
                },
                load : function() {
                    snailtask.load(this.$store.state.taskName,0)
                        .then(snailtask.loadCallback);
                },
                clearTaskName : function() {
                    /*切换时清空任务名*/
                    this.taskName = '';
                    this.$store.commit('updateTaskName','');
                }
            }
        })        
    }

})()