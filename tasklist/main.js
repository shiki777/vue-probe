(function() {

    loginManage.chack();
    main();
    var vm;

    function main() {
        snailtask.load(taskStore.state.taskName)
        .then(function(data) {
            createVm();
            taskStore.commit('updateTaskList',data.body.taskList);
            taskStore.commit('updatePage',data.body.indexCounts);
        })
        .catch(function(err) {
            console.log(err)
        })
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