Vue.component('destconfig', {
    template : '<div class="creatTask" v-show="show">\
        <h4 class="channel-title">主机标识配置</h4>\
        <span aria-hidden="true" class="close" @click="hidePanel()">×</span>\
        <div class="creattaskwrap">\
            <button class="btn btn-primary" @click="onCreateDestClick($event)" style="margin-bottom:5px;">创建主机标识</button>\
            <table class="table table-striped table-bordered table-hover table-prolist" id="tableDada">\
            <thead>\
            <tr><th>编号</th><th>主机标识名称</th><th>主机IP</th><th>操作</th></tr>\
            </thead>\
            <tbody>\
            <tr v-for="(dest,index) in list">\
            <td>{{index + 1}}</td>\
            <td>{{dest.name}}</td>\
            <td>{{dest.ip}}</td>\
            <td><div class=""><button class="btn btn-default btn-sm" @click="removeDest(dest.id)">删除</button><button class="btn btn-default btn-sm" @click="updateDest(dest.id,dest.name,dest.ip)">修改</button></div></td>\
            </tr>\
            </tbody>\
            </table>\
            <div id="page">\
            <ul class="pagingUl">\
            <li v-for="n in page"><a  href="javascript:" :class="isCurrent(n)" @click="onPageClick(n)">{{n}}</a></li>\
            </ul>\
            </div>\
        </div>\
        <div class="probe-group-dialog task-dialog" v-show="createShow">\
            <div class="modal-header">\
                <span class="close" aria-hidden="true" @click="closeCreatePanel()">&times;</span>\
                <h5 class="modal-title">添加主机标识</h5>\
            </div>\
            <div class="modal-body">\
                <div class="container-fluid">\
                    <br>\
                    <div class="form-group">\
                        <label for="destname" class="col-sm-3 control-label" >标识名称</label>\
                        <div class="col-sm-9">\
                            <input type="text" class="form-control" id="destname" v-model="newDestName" placeholder="标识名称" :readonly="isNameReadOnly">\
                        </div>\
                    </div>\
                    <div class="form-group" v-if="step == 2">\
                        <label for="destip" class="col-sm-3 control-label" >标识IP</label>\
                        <div class="col-sm-9">\
                            <input type="text" class="form-control" id="destip" v-model="newDestIp" placeholder="标识IP">\
                        </div>\
                    </div>\
                    <div class="clearfix"></div>\
                    <br>\
                    <div class="alert alert-danger" id="noNameTips" v-if="errMsg">{{errMsg}}</div>\
                    <div class="col-sm-offset-3 col-sm-9">\
                        <button type="submit" class="btn btn-default" @click="closeCreatePanel()">取 消</button>\
                        <button type="submit" class="btn btn-primary" v-if="step == 1" @click="onNextClick($event)">下一步</button>\
                        <button type="submit" class="btn btn-primary" v-if="step == 2" @click="onPrevClick($event)">上一步</button>\
                        <button type="submit" class="btn btn-primary" v-if="step == 2" @click="submit($event)">提交</button>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>',
    data : function() {
        return {
            show : false, /*控制主机标识配置面板显示*/
            createShow : false,/*控制创建主机标识面板显示*/
            index : 0,
            page : 1,
            list : [],
            errMsg : '', /*创建主机标识错误提示*/
            newDestName : '', /*创建主机标识名字*/
            newDestIp : '', /*创建主机标识ip*/
            step : 1,/*创建主机标识步骤*/
            editId : 0, /*编辑中的id，用于判断是否在编辑*/
            editOriginName : ''/*编辑标识时，老标识名，此标识名不需要通过接口去查重*/
        }
    },
    computed : {
        isNameReadOnly : function() {
            return this.step == 1 ? false : true;
        }
    },
    methods : {
        load : function() {
            var url = snailtask.BASE_URL + '/probe-service/taskDest/taskDestList';
            var requestBody = {
                consult : '',
                pageIndex : this.index,
                pageSize : 10
            };
            var self = this;
            Vue.http.post(url, requestBody)
            .then(function(data) {
                self.list = self.formatList(data.body.taskDestList);
                self.page = data.body.indexCounts;
            });            
        },
        formatList : function(list) {
            var res = [];
            for(var i = 0; i < list.length; i++){
                res.push({
                    name : list[i].destID,
                    ip : list[i].destIP,
                    id : list[i].id
                });
            }
            return res;            
        },
        removeDestFromList : function(id) {
            var index = -1;
            for(var i = 0; i < this.list.length; i++){
                if(index == -1 && this.list[i].id == id){
                    index = i;
                }
            }
            if(index >=0){
                this.list.splice(index,1);
            }
        },
        updateDestFromList : function(name,ip,id) {
            var index = -1;
            for(var i = 0; i < this.list.length; i++){
                if(index == -1 && this.list[i].id == id){
                    index = i;
                }
            }
            if(index >=0){
                this.list[index].name = name;
                this.list[index].ip = ip;
            }
        },
        isCurrent: function(n) {
            return n == this.index + 1 ? 'activP' : '';
        },
        onPageClick: function(n) {
            var self = this;
            this.index = n - 1;
            this.load();
        },
        onCreateDestClick : function(e) {
            e.preventDefault();
            this.createShow = true;
        },
        onNextClick : function(e) {
            e.preventDefault();
            if(!this.newDestName){
                this.errMsg = '标识名称不能为空';
                return;
            } else {
                this.errMsg = '';
            }
            /*如果是编辑的情况，标识名未变的情况不需要走查重接口*/
            if(this.editOriginName = this.newDestName){
                this.step = 2;
                return;
            }
            var self = this;
            this.validNameRepeat()
            .then(function(data) {
                if(data.body.isUnique){
                    self.step = 2;
                } else {
                    self.errMsg = '标识名重复';
                }
            })
            .catch(function() {
                self.errMsg = '查重失败，请检查网络'
            })
        },
        onPrevClick : function(e) {
            e.preventDefault();
            this.step = 1;
        },
        submit : function() {
            var destid = this.newDestName;
            var destip = this.newDestIp;
            var id = this.editId;
            if(!this.validIp()){
                this.errMsg = 'ip不符合规则';
                return;
            } else {
                this.errMsg = '';
            }
            var self = this;
            /*编辑状态则更新*/
            if(this.editId){
                this.editDestUpdate(id,destid,destip)
                .then(function(data) {
                    if(data.body.status == 0){
                        self.updateDestFromList(destid,destip,id);
                        self.reset();
                        self.createShow = false;
                    } else {
                        self.errMsg = '更新失败'
                    }
                })
                .catch(function() {
                    self.errMsg = '更新失败，请检查网络';
                });
            } else {
                /*否则新建*/
                this.createDest(destid,destip)
                .then(function(data) {
                    if(data.body.status == 0){
                        self.list.splice(0,0,{name : destid,ip : destip});
                        self.reset();
                        self.createShow = false;
                    } else {
                        self.errMsg = '创建失败'
                    }
                })
                .catch(function() {
                    self.errMsg = '创建失败，请检查网络'
                })                
            }
        },
        removeDest : function(id) {
            var DEL_URL = snailtask.BASE_URL +  '/probe-service/taskDest/taskDestDelete';
            var requestBody = {
                id : id
            };
            var self = this;
            Vue.http.post(DEL_URL,requestBody)
                .then(function(data) {
                    if(data.body.status == 0){
                        self.removeDestFromList(id);
                    } else {
                        alert('删除失败，请检查网络');
                    }
                })
                .catch(function() {
                    alert('删除失败，请检查网络');
                })
        },
        updateDest : function(id,name,ip) {
            this.editId = id;
            this.newDestIp = ip;
            this.newDestName = name;
            this.editOriginName = name;
            this.step = 2;
            this.createShow = true;
        },
        createDest : function(name,ip) {
            var CREATE_URL = snailtask.BASE_URL +  '/probe-service/taskDest/taskDestNew'
            var requestBody = {
                destID : name,
                destIP : ip
            };
            return Vue.http.post(CREATE_URL,requestBody);
        },
        editDestUpdate : function(id,name,ip) {
            var UPDATE_URL = snailtask.BASE_URL +  '/probe-service/taskDest/taskDestUpdate'
            var requestBody = {
                id : id,
                destID : name,
                destIP : ip
            };
            return Vue.http.post(UPDATE_URL,requestBody);
        },
        closeCreatePanel : function() {
            this.createShow = false;
            this.reset();
        },
        /*验证新建名字是否重复*/
        validNameRepeat : function() {
            var CHECK_URL = snailtask.BASE_URL +  '/probe-service/taskDest/queryCountByDestID'
            var requestBody = {
                destID : this.newDestName
            };
            return Vue.http.post(CHECK_URL,requestBody); 
        },
        reset : function() {
            this.step = 1;
            this.newDestName = '';
            this.newDestIp = '';
            this.editId = 0;
            this.editOriginName = '';
        },
        validIp : function() {
            if (this.newDestIp.match(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(:[0-9]{1,5})?$/)) {
                return true;
            } else if (this.newDestIp.match(/([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/)) {
                return true;
            }
            return false;            
        },
        hidePanel : function() {
            this.show = false;
            this.createShow = false;
            this.reset();
        }
    },
    created : function() {
        /*新建任务中也会拉取该接口，没有放到store中统一存储，重复拉取了*/
        this.load();     
        var self = this;  
        snailtask.messageBus.$on('showDest', function(bool) {
            self.show = true;
        });         
    }
})