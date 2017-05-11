(function() {

    var store = new Vuex.Store({
        state : {
            probeList : [], /*探针列表*/
            probePage : 1, /*探针页数*/
            currentPage : 1, /*当前页数*/
            groupid : 0, /*组号*/
            editGroupid : 0, /*编辑的组号，暂时把store当消息总线用,用于组件之间通信*/
            probeName : '', /*探针名*/
            groups : [], /*组信息*/
            groupPanelData : {
                step : 1, /*默认状态是1*/
                groupName : '',
                show : false
            }, /*组件弹窗数据*/
            editOriginName : ''/*编辑标识时，老标识名，此标识名不需要通过接口去查重*/
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
            updateEditGroupid : function(state,id) {
                state.editGroupid = id;
            },
            addGroup : function(state, group) {
                state.groups.push(group);
            },
            delGroup : function(state, id) {
                var index = -1;
                for(var i = 0; i < state.groups.length; i++){
                    if(state.groups[i].id == id){
                        index = i;
                    }
                }
                if(index >=0){
                    state.groups.splice(index,1);
                }
            },
            updateGroupPanel : function(state, opt) {
                var opt = opt || {};
                if(opt.step){
                    state.groupPanelData.step = opt.step;
                }
                if(opt.groupName){
                    state.groupPanelData.groupName = opt.groupName;
                }
                if(typeof opt.show == 'boolean'){
                    state.groupPanelData.show = opt.show;
                }                                                
            },
            updateEditOriginName : function(state,name) {
                state.editOriginName = name;
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
            updateEditGroupid : function(context,id) {
                context.commit('updateEditGroupid',id);
            },
            addGroup : function(context, group) {
                context.commit('addGroup',group);
            },
            delGroup : function(context, id) {
                context.commit('delGroup',id);
            },
            updateGroupPanel : function(context,opt) {
                context.commit('updateGroupPanel',opt);
            },
            updateEditOriginName : function(context,name) {
                context.commit('updateEditOriginName',name);
            }        

        }

    });

    function formatList(list) {
        var l = list.length;
        var res = [];
        for(var i = 0; i < l; i++){
            var probeItem = list[i];
            res.push({
                name : probeItem['hostname'],
                time : probeItem['hbtime'],
                ip : probeItem['ip'],
                area : probeItem['district'],
                version : probeItem['version']
            });
        };
        return res;
    }

    window.probeStore = store;


})()