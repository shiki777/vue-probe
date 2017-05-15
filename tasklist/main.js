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
                format: 'MM/DD/YYYY HH:mm:ss'
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
                format: 'MM/DD/YYYY HH:mm:ss'
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