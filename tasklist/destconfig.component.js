Vue.component('destconfig', {
    template : '<div class="creatTask" v-show="show">\
        <h4 class="channel-title">主机标识配置</h4>\
        <div class="creattaskwrap">\
            <button class="btn btn-primary" @click="onCreateDestClick($event)" style="margin-bottom:5px;">创建主机标识</button>\
            <table class="table table-striped table-bordered table-hover table-prolist" id="tableDada">\
            <thead>\
            <tr><th>编号</th><th>主机标识名称</th><th>主机IP</th><th>操作</th></tr>\
            </thead>\
            <tbody>\
            <tr v-for="(probe,index) in list">\
            <td>{{index + 1}}</td>\
            <td>{{probe.name}}</td>\
            <td>{{probe.ip}}</td>\
            <td><div class=""><button class="btn btn-default btn-sm">删除</button><button class="btn btn-default btn-sm">修改</button></div></td>\
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
            step : 1/*创建主机标识步骤*/
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
                    ip : list[i].destIP
                });
            }
            return res;            
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
            if(!this.validIp()){
                this.errMsg = 'ip不符合规则';
                return;
            } else {
                this.errMsg = '';
            }
            this.createDest(destid,destip)
                .then(function(data) {
                    if(data.body.status){
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
        },
        createDest : function(id,ip) {
            var CREATE_URL = snailtask.BASE_URL +  '/probe-service/taskDest/taskDestNew'
            var requestBody = {
                destID : id,
                destIP : ip
            };
            return Vue.http.post(CREATE_URL,requestBody);
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
        },
        validIp : function() {
            if (this.newDestIp.match(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(:[0-9]{1,5})?$/)) {
                return true;
            } else if (this.newDestIp.match(/([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/)) {
                return true;
            }
            return false;            
        }
    },
    created : function() {
        /*新建任务中也会拉取该接口，没有放到store中统一存储，重复拉取了*/
        this.load();        
    }
})