(function() {

    var store = new Vuex.Store({
        state : {
            probeList : [], /*探针列表*/
            probePage : 1 /*探针页数*/
        },
        mutations : {
            updateList : function(state, list) {
                state.probeList = formatList(list);
            },
            updatePage : function(state, page) {
                state.probePage = page;
            }
        },
        actions : {
            updateList : function(context, list) {
                context.commit('updateList', list);
            },
            updatePage : function(context, page) {
                context.commit('updatePage', page);
            }

        }

    });

    function formatList(list) {
        var l = list.length;
        var res = [];
        for(var i = 0; i < l; i++){
            var probeItem = list[i];
            res.push({
                name : probeItem['district'],
                time : probeItem['hbtime'],
                ip : probeItem['ip'],
                area : probeItem['hostname'],
                version : probeItem['version']
            });
        };
        return res;
    }

    window.probeStore = store;


})()