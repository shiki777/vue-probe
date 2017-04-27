(function() {

    var store = new Vuex.Store({
        state : {
            probeList : [], /*探针列表*/
            probePage : 1, /*探针页数*/
            currentPage : 1, /*当前页数*/
            groupid : 0, /*组号*/
            probeName : '',
            groups : [] /*组信息*/
        },
        mutations : {
            updateList : function(state, list) {
                state.probeList = formatList(list);
            },
            updatePage : function(state, page) {
                state.probePage = page;
            },
            updateCurrentPage : function(state,p) {
                state.currentPage = p;
            },
            updateProbeName : function(state,name) {
                state.probeName = name;
            },
            updateGroups : function(state, groups) {
                state.groups = groups;
            },
            updateGroupid : function(state, id) {
                state.groupid = id;
            },
            addGroup : function(state, group) {
                state.groups.push(group);
            }
        },
        actions : {
            updateList : function(context, list) {
                context.commit('updateList', list);
            },
            updatePage : function(context, page) {
                context.commit('updatePage', page);
            },
            updateCurrentPage : function(context,p) {
                context.commit('updateCurrentPage',p);
            },
            updateProbeName : function(context, name) {
                context.commit('updateProbeName', name);
            },
            updateGroups : function(context, group) {
                context.commit('updateGroups',group);
            },
            updateGroupid : function(context, id) {
                context.commit('updateGroupid',id);
            },
            addGroup : function(context, group) {
                context.commit('addGroup',group);
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