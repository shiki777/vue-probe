(function() {

    var store = new Vuex.Store({
        state : {
            probeList : [], /*探针列表*/
            probePage : 1, /*探针页数*/
            currentPage : 1, /*当前页数*/
            groupid : 0, /*组号*/
            probeName : '', /*探针名*/
            groups : [], /*组信息*/
            groupPanelData : {
                step : 1, /*默认状态是1*/
                groupName : '',
                probeList : [], //未选择的探针列表,暂时等于probelist，等需求
                show : false
            } /*组件弹窗数据*/
        },
        mutations : {
            updateList : function(state, list) {
                var l = formatList(list);
                state.probeList = l;
                /*暂定，等需求*/
                state.groupPanelData.probeList = l;
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
            },
            updateGroupPanel : function(state, opt) {
                var opt = opt || {};
                if(opt.step){
                    state.groupPanelData.step = opt.step;
                }
                if(opt.groupName){
                    state.groupPanelData.groupName = opt.groupName;
                }
                if(opt.probeList){
                    state.groupPanelData.probeList = opt.probeList;
                }
                if(typeof opt.show == 'boolean'){
                    state.groupPanelData.show = opt.show;
                }                                                
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
            },
            updateGroupPanel : function(context,opt) {
                context.commit('updateGroupPanel',opt);
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