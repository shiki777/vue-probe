/*分组组件*/
/*2组件通过vuex通信,写代码方便一点*/
Vue.component('groups', {
    template: '<div class="btn-group probe-group" id="probeGroupList">\
    <button type="button" class="btn btn-default" v-for="g in groups" gid="g.id" @click="onGroupBtnClick(g.id,g.name)">{{g.name}}</button>\
    <button type="button" title="添加新组" class="btn btn-default glyphicon glyphicon-plus" onclick="group.cGroupName();"></button>\
    </div>',
    computed : {
        groups : function() {
            return this.$store.state.groups;
        }
    },
    methods: {
        load: function() {
            var GROUP_URL = 'http://10.220.10.60:8087/probe-service/org/orgList';
            var GROUP_URL = 'http://127.0.0.1:5000/groups';
            var self = this;
            Vue.http.post(GROUP_URL)
            .then(function(data) {
                self.$store.dispatch('updateGroups', self.formatGroups(data.body.list));
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
        onGroupBtnClick : function(id,name) {
            /*懒得嵌套promise，直接commit了*/
            this.$store.commit('updateCurrentPage',1);            
            this.$store.dispatch('updateGroupid', id)
                .then(function() {
                    snailprobe.load(id,0)
                    .then(snailprobe.probeLoadCallback)
                    .catch(function(e) {console.log(e)})
                })
                .catch(function(e) {console.log(e)})
        }        
    },
    created: function() {
        this.load();
    }
});

/*组修改组件*/
Vue.component('group', {
    template : '<div class="modal fade">\
            <div class="modal-backdrop"></div>\
            <div class="probe-group-dialog">\
                <div class="modal-header">\
                    <span class="close" aria-hidden="true">&times;</span>\
                    <h5 class="modal-title">添加／修改组</h5>\
                </div>\
                <div class="modal-body">\
                    <div class="container-fluid">\
                        <br>\
                        <div class="form-group">\
                            <label for="groupName" class="col-sm-3 control-label">组名称</label>\
                            <div class="col-sm-9">\
                                <input type="text" class="form-control" id="groupName" placeholder="组名称">\
                            </div>\
                        </div>\
                        <div class="clearfix"></div>\
                        <br>\
                        <div class="alert alert-danger fade" id="noNameTips"></div>\
                        <div class="col-sm-offset-3 col-sm-9">\
                            <button type="submit" class="btn btn-default">取 消</button>\
                            <button type="submit" class="btn btn-primary">下一步</button>\
                        </div>\
                    </div>\
                </div>\
            </div>\
            <div class="group-multiselect">\
                <div class="modal-header">\
                    <span class="close" aria-hidden="true">&times;</span>\
                    <h5 class="modal-title">添加／修改组</h5>\
                </div>\
                <div id="loadingLayer" class="mod-loading-layer">\
                    <div class="mod-loading-content">\
                        <i class="icon micon-loading"></i>\
                        <div class="mod-loading-layer__desc">加载中...</div>\
                    </div>\
                </div>\
                <div class="row hide" id="multi_select">\
                    <div class="col-xs-5">\
                        <h4>所有探针列表</h4>\
                        <select name="from[]" id="multiselect_from" class="multiselect form-control" size="10" multiple="multiple" data-right="#multiselect_to_1" data-right-all="#right_All_1" data-right-selected="#right_Selected_1" data-left-all="#left_All_1" data-left-selected="#left_Selected_1">\
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
                        <button type="submit" class="btn btn-default">上一步</button>\
                        <button type="submit" class="btn btn-primary">保&nbsp;&nbsp;存</button>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>'
});