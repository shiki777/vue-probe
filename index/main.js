(function() {

    var vm = new Vue({
        el : '#frame-body',
        store : probeStore,
        computed : {
            probelist : $store.state.probeList;
        }
    })

})()