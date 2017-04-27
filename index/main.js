(function() {

    loginManage.chack();
    main();
    var vm;

    function main() {
        snailprobe.load(probeStore.state.probeName)
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
            el : '#page-wrap',
            store : probeStore,
            component : {
                page : 'page',
                groups : 'groups',
                group : 'group'
            },
            data : {
                pname : ''
            },
            methods : {
                onProbeNameClick : function() {
                    var self = this;
                    /*懒得嵌套promise，直接commit了*/
                    this.$store.commit('updateCurrentPage',1);
                    this.$store.dispatch('updateProbeName',this.pname)
                        .then(function() {
                            snailprobe.load(self.pname,0)
                                .then(snailprobe.probeLoadCallback)
                                .catch(function(e) {
                                    console.log(e);
                                })
                        })
                },
                onFreshClick : function() {
                    var self = this;
                    this.$store.dispatch('updateProbeName',this.pname)
                        .then(function() {
                            var param = self.$store.state.groupid ? self.$store.state.groupid : self.$store.state.pname;
                            snailprobe.load(self.pname)
                                .then(snailprobe.probeLoadCallback)
                                .catch(function(e) {
                                    console.log(e);
                                })
                        })                    
                }
            },
            computed : {
                probelist : function() {
                    return this.$store.state.probeList;
                },
                page : function() {
                    return this.$store.state.probePage;
                },
                probeName : function() {
                    return this.$store.state.probeName;
                }
            }
        })        
    }

})()