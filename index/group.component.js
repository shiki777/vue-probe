/*分组组件*/
/*2组件通过vuex通信,写代码方便一点,应该通过父子组件通信的*/
Vue.component('groups', {
    template: '<div class="btn-group probe-group" id="probeGroupList">\
    <div class="btn btn-default group-btn" v-for="g in groups" :gid="g.id" @click="onGroupBtnClick(g.id,g.name)" :class="isCurrentGroup(g.id)">{{g.name}}<div class="group-hover-panel"><div @click="editGroup(g.id,$event)">编辑</div><div @click="delGroup(g.id,$event)">删除</div></div></div>\
    <button type="button" title="添加新组" class="btn btn-default glyphicon glyphicon-plus" @click="showPanel()"></button>\
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
                pageSize : 10
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
        showPanel : function() {
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
        editGroup : function(id) {
            var CHECK_URL = snailprobe.BASE_URL +  '/probe-service/org/queryCountByOrgName'
            var requestBody = {
                name : this.groupName
            };
            Vue.http.post(CHECK_URL,requestBody); 
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
                        <option :value="i.name" v-for="i in selectProbes">{{i.name}}</option> \
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
                        <select name="to[]" id="multiselect_to_1" class="form-control" size="10" multiple="multiple"></select>\
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
            selectedProbes : []
        }
    },
    computed : {
        panelData : function() {
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
            return this.$store.state.groupPanelData.show ? 'in show' : '';
        },
        errorShow : function() {
            return this.error ? 'show in' : '';
        }
    },
    methods : {
        loadSelectProbes : function(index) {
            var PROBE_URL = snailprobe.BASE_URL + '/probe-service/probe/probeList';
            var requestBody = {
                hostname : '',
                pageIndex : parseInt(index,10) || 0,
                pageSize : 20
            };
            var self = this;
            Vue.http.post(PROBE_URL,requestBody)
            .then(function(data) {
                for(var i = 0; i < data.body.probeList.length; i++){
                    var probeItem = data.body.probeList[i];
                    self.selectProbes.push({
                        name : probeItem['hostname'],
                        time : probeItem['hbtime'],
                        ip : probeItem['ip'],
                        area : probeItem['district'],
                        version : probeItem['version']
                    })
                }
            })
            .catch(function(e) {console.log(e)});
        },
        hidePanel : function() {
            this.$store.dispatch('updateGroupPanel',{show : false});
            this.reset();
        },
        toStep2 : function() {
            if(!this.groupName){
                this.setErrorPanel(true,'组名不能为空');
                return;
            }
            var self = this;
            this.checkGroupName()
            .then(function(data) {
                /*true代表成功*/
                if(!data.body.isUnique){
                    self.setErrorPanel(true,'组名重复，请更换');
                } else {
                    self.$store.dispatch('updateGroupPanel',{step : 2});
                    self.initMult();
                }
            })
            .catch(function(e) {console.log(e)});
        },
            //初始化多选插件
            initMult: function() {
                var self = this;
                $('.multiselect').multiselect({
                    afterMoveToRight : function(left,right,option) {
                        for(var i =0; i < option.length;i++){
                            self.selectedProbes.push(option[i].value);
                        }
                    },
                    afterMoveToLeft : function(left,right,option) {
                        for(var i = option.length; i > 0; i--){
                            var index = self.selectedProbes.indexOf(option[i-1].value);
                            if(index >=0){
                                self.selectedProbes.splice(index,1);
                            }
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
                var requestBody = {
                    "organization":{
                        "name":this.groupName,
                        "counts":this.selectedProbes.length
                    },
                    "hostNameList":this.selectedProbes
                };
                var self = this;
                Vue.http.post(CREATE_URL,requestBody)
                .then(function(data) {
                    /*成功*/
                    if(data.body.status == 0){
                        self.$store.dispatch('addGroup',{id : data.body.orgId,name : self.groupName});
                        self.$store.dispatch('updateGroupPanel',{step : 1,show : false});
                        self.reset();
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
            }
        },
        created : function() {
            this.loadSelectProbes(0);
        }
});