/*分组组件*/
/*2组件通过vuex通信,写代码方便一点,应该通过父子组件通信的*/
Vue.component('groups', {
    template: '<div class="probe-group" id="probeGroupList">\
    <div class="btn btn-default group-btn" v-for="g in groups" :gid="g.id" @click="onGroupBtnClick(g.id,g.name)" :class="isCurrentGroup(g.id)">{{g.name}}<div class="group-hover-panel"><div @click="editGroup(g.id,g.name,$event)">编辑</div><div @click="delGroup(g.id,$event)">删除</div></div></div>\
    <button type="button" title="添加新组" class="btn btn-default glyphicon glyphicon-plus" @click="createGroup()"></button>\
    </div>',
    computed : {
        groups : function() {
            return this.$store.state.groups;
        }
    },
    data : function() {
        return {
            currentGroup : 0
        }
    },
    methods: {
        load: function() {
            var GROUP_URL = snailprobe.BASE_URL + '/probe-service/org/orgList';
            var self = this;
            var reqBody = {
                consult : '',
                pageIndex : 0,
                pageSize : 30
            };
            Vue.http.post(GROUP_URL,reqBody)
            .then(function(data) {
                self.$store.dispatch('updateGroups', self.formatGroups(data.body.orgList));
            })
            .catch(function(e) {
                console.log(e)
            });
        },
        formatGroups: function(groups) {
            var res = [];
            for (var i = 0; i < groups.length; i++) {
                var g = groups[i];
                res.push({
                    id : g.id,
                    name : g.name
                });
            }
            return res;
        },
        isCurrentGroup : function(id) {
             return id == this.currentGroup ? 'activeGroup' : '';
        },
        onGroupBtnClick : function(id,name) {
            this.currentGroup = id;
            /*懒得嵌套promise，直接commit了*/
            this.$store.commit('updateCurrentPage',1);            
            this.$store.dispatch('updateGroupid', id)
                .then(function() {
                    snailprobe.load(id,0)
                    .then(snailprobe.probeLoadCallback)
                    .catch(function(e) {console.log(e)})
                })
                .catch(function(e) {console.log(e)})
        },
        createGroup : function() {
            this.$store.dispatch('updateEditGroupid',0);
            this.$store.dispatch('updateGroupPanel', {show : true});
        },
        delGroup : function(id,e) {
            /*阻止冒泡*/
            e.stopPropagation();
            var DEL_URL = snailprobe.BASE_URL +  '/probe-service/org/orgDelete'
            var requestBody = {
                orgId : id
            };
            var self = this;
            Vue.http.post(DEL_URL,requestBody)
                .then(function(data) {
                    /*0是成功*/
                    if(data.body.status == 0){
                        self.$store.dispatch('delGroup',id);
                    } else {
                        alert('删除失败');
                    }
                })
                .catch(function(e) {console.log(e)});
                return false;
        },
        editGroup : function(id,name,e) {
            /*阻止冒泡*/
            e.stopPropagation();            
            this.$store.dispatch('updateEditOriginName', name);
            /*hack vuex在值不变的情况下不会发出通知，当初不用消息总线来通知消息而偷懒用vuex很不明智*/
            this.$store.dispatch('updateEditGroupid', -1); 
            this.$store.dispatch('updateEditGroupid', id); 
            this.$store.dispatch('updateGroupPanel', {step:2,groupName:name,show:true}); 
            return false;
        }
    },
    created: function() {
        this.load();
    }
});

/*组修改组件*/
Vue.component('group', {
    template : '<div class="modal fade" :class="panelMaskClass">\
            <div class="modal-backdrop" :class="panelMaskClass"></div>\
            <div class="probe-group-dialog" :class="step1Show">\
                <div class="modal-header">\
                    <span class="close" aria-hidden="true" @click="hidePanel()">&times;</span>\
                    <h5 class="modal-title">添加／修改组</h5>\
                </div>\
                <div class="modal-body">\
                    <div class="container-fluid">\
                        <br>\
                        <div class="form-group">\
                            <label for="groupName" class="col-sm-3 control-label">组名称</label>\
                            <div class="col-sm-9">\
                                <input type="text" class="form-control" id="groupName" v-model="groupName" placeholder="组名称">\
                            </div>\
                        </div>\
                        <div class="clearfix"></div>\
                        <br>\
                        <div class="alert alert-danger fade" id="noNameTips" :class="errorShow">{{errMsg}}</div>\
                        <div class="col-sm-offset-3 col-sm-9">\
                            <button type="submit" class="btn btn-default" @click="hidePanel()">取 消</button>\
                            <button type="submit" class="btn btn-primary" @click="toStep2()">下一步</button>\
                        </div>\
                    </div>\
                </div>\
            </div>\
            <div class="group-multiselect" :class="step2Show">\
                <div class="modal-header">\
                    <span class="close" aria-hidden="true" @click="hidePanel()">&times;</span>\
                    <h5 class="modal-title">添加／修改组</h5>\
                </div>\
                <div id="loadingLayer" class="mod-loading-layer" style="display:none;">\
                    <div class="mod-loading-content">\
                        <i class="icon micon-loading"></i>\
                        <div class="mod-loading-layer__desc">加载中...</div>\
                    </div>\
                </div>\
                <div class="row hide" id="multi_select" :class="step2Show">\
                    <div class="col-xs-5">\
                        <h4>所有探针列表</h4>\
                        <select name="from[]" id="multiselect_from" class="multiselect form-control" size="10" multiple="multiple" data-right="#multiselect_to_1" data-right-all="#right_All_1" data-right-selected="#right_Selected_1" data-left-all="#left_All_1" data-left-selected="#left_Selected_1">\
                        <option v-for="p in leftPluginProbes" :value="p.name">{{p.name}}</option> \
                        </select>\
                    </div>\
                    <div class="col-xs-2 multi-option">\
                        <button type="button" id="right_All_1" class="btn btn-default btn-block"><i class="glyphicon glyphicon-forward"></i></button>\
                        <button type="button" id="right_Selected_1" class="btn btn-default btn-block"><i class="glyphicon glyphicon-chevron-right"></i></button>\
                        <button type="button" id="left_Selected_1" class="btn btn-default btn-block"><i class="glyphicon glyphicon-chevron-left"></i></button>\
                       <button type="button" id="left_All_1" class="btn btn-default btn-block"><i class="glyphicon glyphicon-backward"></i></button>\
                    </div>\
                    <div class="col-xs-5">\
                        <h4>当前组所选探针</h4>\
                        <select name="to[]" id="multiselect_to_1" class="form-control" size="10" multiple="multiple">\
                        <option :value="i.name" v-for="i in pluginProbes">{{i.name}}</option> \
                        </select>\
                    </div>\
                    <div class="clearfix"></div>\
                    <p class="alert">按ctrl或command多选</p>\
                    <div class="btns">\
                        <button type="submit" class="btn btn-default" @click="moveToStep1()">上一步</button>\
                        <button type="submit" class="btn btn-primary" @click="submitGroup()">保&nbsp;&nbsp;存</button>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>',
    data : function() {
        return {
            groupName : '',
            error : false,
            errMsg : '',
            /*可供选择的探针*/
            selectProbes : [],
            /*选中的探针*/
            selectedProbes : [],
            /*缓存的选择探针列表*/
            cacheProbes : [],
            /*用于给插件右侧渲染的数组，只会在拉完接口后使用*/
            pluginProbes : [],
            /*插件左侧渲染数据*/
            leftPluginProbes : []
        }
    },
    computed : {
        panelData : function() {
            this.groupName = this.$store.state.groupPanelData.groupName;
            return this.$store.state.groupPanelData;
        },
        /*步骤一显示控制*/
        step1Show : function() {
            if(this.panelData.step != 1){
                return '';
            }
            return this.$store.state.groupPanelData.show ? 'show in' : '';
        },
        /*步骤二显示控制*/
        step2Show : function() {
            if(this.panelData.step != 2){
                return '';
            }
            return 'show in';
        },
        panelMaskClass : function() {
            /*hack vue computed属性，只有被调用时候会被计算*/
            console.log('hack vue ' + this.selectedProbesProxy);
            return this.$store.state.groupPanelData.show ? 'in show' : '';
        },
        errorShow : function() {
            return this.error ? 'show in' : '';
        },
        /*selectedProbesProxy是一个代理属性，用于更新选中探针列表*/
        /**/
        selectedProbesProxy : function() {
            if(this.$store.state.editGroupid == 0){
                this.reset();
                return 0;
            }
            this.reset();
            this.loadSelectedProbes();   
            this.groupName = this.$store.state.groupPanelData.groupName;
            return this.$store.state.editGroupid;       
        }
    },
    methods : {
        /*插件和vue有些冲突，为了方便把插件HTML渲染从VUE拿出，改用js渲染，反正入口统一,只有此2处UI没使用vue data*/
        /*更新左侧选择栏*/
        updateLeftSelects : function(arrs) {
            var l_select = document.getElementById('multiselect_from');
            if(l_select){
                l_select.innerHTML = this.createHTML(arrs);
            }
            // this.leftPluginProbes = this.copy(arrs);
        },
        /*更新右侧选择栏*/
        updateRightSelects : function(arrs) {
            var r_select = document.getElementById('multiselect_to_1');
            if(r_select){
                r_select.innerHTML = this.createHTML(arrs);
            }            
            // this.pluginProbes = this.copy(arrs);
        },
        createHTML : function(arr) {
            var html = ''
            for(var i = 0; i < arr.length; i++){
                var p = arr[i];
                html += '<option value="' + p.name + '">' + p.name + '</option>';
            }
            return html;
        },
        /*拉取可选择探针*/
        loadSelectProbes : function(index) {
            var PROBE_URL = snailprobe.BASE_URL + '/probe-service/probe/probeList';
            var requestBody = {
                hostname : '',
                pageIndex : index || 0,
                pageSize : 20
            };
            var self = this;
            Vue.http.post(PROBE_URL,requestBody)
            .then(function(data) {
                for(var i = 0; i < data.body.probeList.length; i++){
                    var probeItem = data.body.probeList[i];
                    self.selectProbes.push({
                        name : probeItem['hostName'],
                        time : probeItem['hbtime'],
                        ip : probeItem['ip'],
                        area : probeItem['district'],
                        version : probeItem['version']
                    })
                };
                self.updateLeftSelects(self.selectProbes);
                self.cacheProbes = self.copy(self.selectProbes);
            })
            .catch(function(e) {console.log(e)});
        },
        /*拉取已选择探针*/
        loadSelectedProbes : function(index) {
            var PROBE_URL = snailprobe.BASE_URL + '/probe-service/probeOrg/probeListByOrgId';
            var requestBody = {
                orgId : this.$store.state.editGroupid,
                pageIndex : index || 0,
                pageSize : 20
            };
            var self = this;
            Vue.http.post(PROBE_URL,requestBody)
            .then(function(data) {
                /*清空先前数据*/
                self.selectedProbes = [];
                for(var i = 0; i < data.body.probeList.length; i++){
                    var probeItem = data.body.probeList[i];
                    
                    self.selectedProbes.push({
                        name : probeItem['hostName'],
                        time : probeItem['hbtime'],
                        ip : probeItem['ip'],
                        area : probeItem['district'],
                        version : probeItem['version']
                    })
                }
                self.removeSameProbeFromList();
                /*vue的响应式数据 检测不到对象属性/数组属性的修改，需要全部赋值才可以同步UI*/
                self.updateLeftSelects(self.selectProbes);
                self.updateRightSelects(self.selectedProbes);
                self.initMult()
            })
            .catch(function(e) {console.log(e)});
        },
        hidePanel : function() {
            this.$store.dispatch('updateGroupPanel',{show : false,step : 1});
            /*当前操作是创建组时重置数据,是编辑时保留以上数据*/
            if(!this.$store.state.editGroupid){
                this.reset();
            }
        },
        toStep2 : function() {
            if(!this.groupName){
                this.setErrorPanel(true,'组名不能为空');
                return;
            }
            var self = this;
            if(this.$store.state.editGroupid){
               if(this.groupName == this.$store.state.editOriginName){
                    this.$store.dispatch('updateGroupPanel',{step : 2});
                    return;
               }
            }
            this.checkGroupName()
            .then(function(data) {
                /*true代表成功*/
                if(!data.body.isUnique){
                    self.setErrorPanel(true,'组名重复，请更换');
                } else {
                    self.$store.dispatch('updateGroupPanel',{step : 2});
                }
                self.initMult();
            })
            .catch(function(e) {console.log(e)});
        },
            //初始化多选插件
            initMult: function() {
                var self = this;
                $('.multiselect').multiselect({
                    afterMoveToRight : function(left,right,option) {
                        for(var i =0; i < option.length;i++){
                            self.selectedProbes.push({name : option[i].value});
                        }
                    },
                    afterMoveToLeft : function(left,right,option) {
                        for(var i = option.length; i > 0; i--){
                            self.removeProbeFromList(self.selectedProbes,option[i-1].value);
                        }
                    }
                });
            },
            moveToStep1 : function() {
                this.$store.dispatch('updateGroupPanel',{step : 1});
            },
            submitGroup : function() {
                if(this.selectedProbes.length == 0){
                    alert('请选择探针');
                    return;
                }
                var CREATE_URL = snailprobe.BASE_URL + '/probe-service/org/orgNew';
                var UPDATE_URL = snailprobe.BASE_URL + '/probe-service/org/orgUpdate';
                var probes = this.getSubmitProbes();
                var requestBody = {
                    "organization":{
                        "name":this.groupName,
                        "counts":probes.length
                    },
                    "hostNameList":probes
                };
                var self = this;
                var type = this.$store.state.editGroupid ? 'update' : 'create';
                if(type == 'update'){
                    requestBody.organization.id = this.$store.state.editGroupid;
                }
                var url = type == 'update' ? UPDATE_URL : CREATE_URL;
                Vue.http.post(url,requestBody)
                .then(function(data) {
                    /*成功*/
                    if(data.body.status == 0){
                        if(type == 'create'){
                            self.$store.dispatch('addGroup',{id : data.body.orgId,name : self.groupName});
                            this.$store.dispatch('updateEditOriginName','');
                        }
                        self.$store.dispatch('updateGroupPanel',{step : 1,show : false});
                    } else {
                        alert('新建失败');
                    }
                })
                .catch(function(e) {console.log(e)});
            },
            /*检查组名是否重复*/
            checkGroupName : function() {
                var CHECK_URL = snailprobe.BASE_URL +  '/probe-service/org/queryCountByOrgName'
                var requestBody = {
                    name : this.groupName
                };
                return Vue.http.post(CHECK_URL,requestBody); 
            },
            setErrorPanel : function(show,msg) {
                this.error = show;
                this.errMsg = msg;
            },
            reset : function() {
                this.groupName = '';
                this.error = false;
                this.errMsg = '';
                this.selectedProbes = [];
                this.selectProbes = this.copy(this.cacheProbes);
                this.updateLeftSelects(this.cacheProbes);
                this.updateRightSelects([]);
                this.pluginProbes = [];
            },
            /*从可选探针中去除已选探针*/
            removeSameProbeFromList : function() {
                var l = this.selectedProbes.length;
                for(var i = 0; i < l; i++){
                    this.removeProbeFromList(this.selectProbes ,this.selectedProbes[i].name);
                }
            },
            removeProbeFromList : function(list,probeName) {
                var l = list.length;
                for(var i = l; i > 0; i--){
                    if(probeName == list[i-1].name){
                        list.splice(i-1,1);
                        return;
                    }
                }
            },
            copy : function(obj) {
                return JSON.parse(JSON.stringify(obj));
            },
            getSubmitProbes : function() {
                var res = [];
                for(var i = 0; i < this.selectedProbes.length; i++){
                    res.push(this.selectedProbes[i].name);
                }
                return res;
            }
        },
        created : function() {
            this.loadSelectProbes(0);
            // 初始化时调用无效
            // this.initMult();
        }
});