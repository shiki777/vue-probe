(function() {

    var store = new Vuex.Store({
        state : {
            probeList : [], /*探针列表*/
            probePage : 1, /*探针页数*/
            probeName : 'aaa',
            groups : {
                groups:['a','b','c'],
                len:6
            }
        },
        mutations : {
            updateList : function(state, list) {
                state.probeList = formatList(list);
            },
            updatePage : function(state, page) {
                state.probePage = page;
            },
            updateProbeName : function(state,name) {
                state.probeName = name;
            }
        },
        actions : {
            updateList : function(context, list) {
                context.commit('updateList', list);
            },
            updatePage : function(context, page) {
                context.commit('updatePage', page);
            },
            updateProbeName : function(context, name) {
                context.commit('updateProbeName', name);
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