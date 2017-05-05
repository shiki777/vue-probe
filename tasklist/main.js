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
                    type : 'cur' /*当前显示tab类型，有type cur*/
                };
            },
            component : {
                page : 'page'
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
                    this.$store.dispatch('updateType', false)
                        .then(this.load);
                    this.$store.dispatch('updateCurrentPage',1);
                },
                onHistoryTaskClick : function() {
                    if(this.type == 'his') return;
                    this.type = 'his';
                    this.$store.dispatch('updateType', true)
                        .then(this.load);        
                    this.$store.dispatch('updateCurrentPage',1);            
                },
                isActive : function(type) {
                    return this.type == type ? 'active' : '';
                },
                load : function() {
                    snailtask.load(this.$store.state.taskName,0)
                        .then(snailtask.loadCallback);
                }
            }
        })        
    }

})()