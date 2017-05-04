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
            computed : {
                taskList : function() {
                    return this.$store.state.taskList;
                }
            },
            methods : {
                taskDestHostList : function() {}
            }
        })        
    }

})()