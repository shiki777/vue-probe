(function() {

    loginManage.chack();
    main();
    var vm;

    function main() {
        snailprobe.load()
        .then(function(data) {
            createVm();
            probeStore.commit('updateList',data.body.probeList);
            probeStore.commit('updatePage',data.body.indexCounts);
        })
        .catch(function(err) {
            console.log(err)
        })
    }

    function createVm() {
            vm = new Vue({
            el : '#frame-body',
            store : probeStore,
            component : {
                page : 'page',
                groups : 'groups'
            },
            computed : {
                probelist : function() {
                    return this.$store.state.probeList;
                },
                page : function() {
                    return this.$store.state.probePage;
                }
            }
        })        
    }

})()