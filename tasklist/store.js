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
        },
        actions : {        

        }

    });

    window.taskStore = store;


})()