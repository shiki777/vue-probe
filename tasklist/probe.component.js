Vue.component('probelist', {
    template: '<div>\
        <div class="probe-panel">\
            <h3>探针选择</h3>\
            <div class="input-group search-area"><input type="text" placeholder="搜索探针..." id="searchQuery" class="form-control" v-model="probeName"> <span class="input-group-btn"><button type="button" id="J_searchBtn" data-searchkey="" class="btn btn-default" @click="onSearchClick()">查找</button></span></div>\
            <table class="table table-striped table-bordered table-hover table-prolist" id="tableDada">\
            <thead>\
            <tr><th></th><th>编号</th><th>探针名称</th><th>最近运行时间</th><th>IP地址</th><th>地区</th><th>版本</th></tr>\
            </thead>\
            <tbody>\
            <tr v-for="(probe,index) in list">\
            <td><input type="checkbox" @click="onprobeBoxClick(probe.name)" :value="probe.name" :name="probe.name" :id="probe.name" :checked="isBoxChecked(probe.name)"/></td>\
            <td>{{index + 1}}</td>\
            <td>{{probe.name}}</td>\
            <td>{{probe.time}}</td>\
            <td>{{probe.ip}}</td>\
            <td>{{probe.area}}</td>\
            <td>{{probe.version}}</td>\
            </tr>\
            </tbody>\
            </table>\
            <div id="page">\
            <ul class="pagingUl">\
            <li v-for="n in pageNum"><a  href="javascript:" :class="isCurrent(n)" @click="onPageClick(n)">{{n}}</a></li>\
            </ul>\
            </div>\
        </div>\
        <div class="group-panel">\
            <h3>组选择</h3>\
            <div class="btn-group probe-group" id="probeGroupList">\
            <div class="btn btn-default group-btn" v-for="g in groups"><input type="checkbox" @click="ongroupBoxClick(g.id)" :value="g.id" :name="g.id" :id="g.id" :checked="isGroupBoxChecked(g.id)"/>{{g.name}}</div>\
            </div>\
        </div>\
        <div class="select-panel">\
        <h3>已选择探针</h3><button class="btn btn-primary" @click="lastStep($event)">上一步</button><button class="btn btn-primary" @click="probeSubmit($event)">提交</button>\
        <div class="selected-wrap">\
            <div class="selected-probe" v-for="p in selectedShowProbes">{{p.hostName}}</div>\
        </div>\
        </div>\
    </div>',
    data: function() {
        return {
            list: [],
            pageNum: 1,
            BASE_URL: 'http://10.220.10.60:8089',
            PROBE_URL: '/probe-service/probe/probeList',
            GROUP_URL: '/probe-service/org/orgListWithProbeList',
            CREATE_URL : '/probe-service/task/taskNew',
            probeName: '',
            index: 0,
            size: 5,
            groups: [],
            tempGroups : {},
            selectedProbes : [], /*选中的探针组,此数据没有和选中组排重*/
            selectedGroups : [] /*选中的组*/
        }
    },
    computed : {
        /*显示的已选择探针，由已选择探针和已选择组内的探针组合而成*/
        selectedShowProbes : function() {
            var res = [].concat(this.selectedProbes);
            for(var i = 0; i < this.selectedGroups.length; i++){
                var gid = this.selectedGroups[i];
                for(var j = 0; j < this.groups[gid].probes.length; j++){
                    var p = this.groups[gid].probes[j];
                    /*这一步把选中的单个探针和组内探针做去重*/
                    if(!this.isProbeInArray(res,p)){
                        res.push({hostName : p.hostname,orgId : gid});
                    }
                }
            }
            return res;
        }
    },
    methods: {
        lastStep : function(e) {
            e.preventDefault();
            this.$emit('toStep1');
        },
        probeSubmit : function(e) {
            e.preventDefault();
            this.$emit('submit',{groups : this.selectedGroups,probes : this.selectedShowProbes});
        },
        /*加载探针列表*/
        load: function() {
            var requestBody = {
                hostname: this.probeName,
                pageIndex: this.index,
                pageSize: this.size
            };
            var self = this;
            Vue.http.post(this.BASE_URL + this.PROBE_URL, requestBody)
            .then(function(data) {
                self.list = self.formatList(data.body.probeList);
                self.pageNum = data.body.indexCounts;
            });
        },
        /*加载组,暂时不做分页*/
        loadGroup: function() {
            var requestBody = {
                consult: '',
                pageIndex: 0,
                pageSize: 20
            };
            var self = this;
            Vue.http.post(this.BASE_URL + this.GROUP_URL, requestBody)
            .then(function(data) {
                self.groups = self.formatGroups(data.body.orgList);
            });
        },
        isCurrent: function(n) {
            return n == this.index + 1 ? 'activP' : '';
        },
        onPageClick: function(n) {
            var self = this;
            this.index = n - 1;
            this.load();
        },
        onSearchClick: function() {
            this.index = 0;
            this.load();
        },
        isBoxChecked : function(name) {
            return this.isProbeSelected(name);
        },
        onprobeBoxClick : function(name) {
            if(this.isProbeSelected(name)){
                this.removeFromSelectedProbe(name);
            } else {
                this.addToSelectedProbe({hostName : name, orgId : 0});
            }
        },
        /*探针是否被选择*/
        isProbeSelected : function(name) {
            for(var i = 0; i < this.selectedProbes.length; i++){
                if(name == this.selectedProbes[i].hostName){
                    return true;
                }
            }
            return false;
        },
        /*上一个函数可以调这个*/
        isProbeInArray : function(arr,probe) {
            for(var i = 0; i < arr.length; i++){
                if(probe.hostname == arr[i].hostName){
                    return true;
                }
            }
            return false;
        },
        /*把探针加入已选择探针*/
        addToSelectedProbe : function(probeObj) {
            this.selectedProbes.push(probeObj);
        },
        /*把探针移出已选择探针*/
        removeFromSelectedProbe : function(name) {
            var index = -1;
            for(var i = 0; i < this.selectedProbes.length; i++){
                if(name == this.selectedProbes[i].hostName){
                    index = i;
                }
            }
            if(index > -1){
                this.selectedProbes.splice(index,1);
            }
        },
        /*组是否被选择*/
        isGroupBoxChecked : function(id) {
            return this.isGroupSelected(id);
        },
        ongroupBoxClick : function(id) {
            if(this.isGroupSelected(id)){
                this.removeFromSelectedGroup(id);
            } else {
                this.addToSelectedGroup(id);
            }
        },
        /*组是否被选择*/
        isGroupSelected : function(id) {
            var flag = false;      
            for(var i = 0; i < this.selectedGroups.length; i++){
                var groupid = this.selectedGroups[i];
                if(groupid == id){
                    flag = true;
                }
            }
            return flag;
        },
        /*把组加入已选择组内*/
        addToSelectedGroup : function(id) {
            this.selectedGroups.push(id)
        },
        /*把组移出已选择组*/
        removeFromSelectedGroup : function(id) {
            var index = this.selectedGroups.indexOf(id);
            this.selectedGroups.splice(index,1);
        },
        formatList: function(list) {
            var l = list.length;
            var res = [];
            for (var i = 0; i < l; i++) {
                var probeItem = list[i];
                res.push({
                    name: probeItem['hostName'],
                    time: probeItem['hbtime'],
                    ip: probeItem['ip'],
                    area: probeItem['district'],
                    version: probeItem['version']
                });
            };
            return res;
        },
        formatGroups: function(groups) {
            var res = {};
            for (var i = 0; i < groups.length; i++) {
                var g = groups[i];
                res[g.groupId] = {
                    id: g.groupId,
                    name: g.groupName,
                    probes : g.probeList
                };
            }
            return res;
        },
        /*处理编辑的探针列表，更新selectedProbes和selectedGroups*/
        formatProbelist : function(probelist) {
            var self = this;
            probelist.map(function(probe) {
                if(probe.orgId){
                    /*组未加入，则加入已选择组*/
                    if(self.selectedGroups.indexOf(probe.orgId) == -1){
                        self.selectedGroups.push(probe.orgId);
                    }
                } else {
                    self.selectedProbes.push({hostName : probe.hostname, orgId : probe.orgId});
                }
            })
        }
    },
    created: function() {
        this.load();
        this.loadGroup();
        var self = this;
        snailtask.messageBus.$on('editProbePanel', function(probelist) {
            self.formatProbelist(probelist);
        });
    }
})

function createData(id) {
    var res = [];
    for(var i = 0; i < 3; i++){
        res.push('probe' + id + i);
    }
    return res;
}