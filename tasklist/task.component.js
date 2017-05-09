Vue.component('taskpanel',{
    template : '                            <div class="creatTask" :style="showStyle">\
                                <h4 class="channel-title">{{title}}</h4>\
                                <div class="creattaskwrap">\
                                    <form class="form-horizontal">\
                                        <br>\
                                        <div class="form-group">\
                                            <label for="f_taskName" class="col-sm-2 control-label">任务名</label>\
                                            <div class="col-sm-8">\
                                                <input type="text" class="form-control" id="f_taskName" placeholder="任务名" v-model="taskName">\
                                            </div>\
                                            <div class="col-sm-2 form-warning" v-if="validateData.nameError">任务名不可为空</div>\
                                        </div>\
                                        <div class="form-group">\
                                            <label for="f_taskType" class="col-sm-2 control-label">任务类型</label>\
                                            <div class="col-sm-8">\
                                                <select class="form-control" v-model="taskType">\
                                                    <option value="hls" label="hls">hls</option>\
                                                    <option value="flv" label="flv">flv</option>\
                                                    <option value="rtmp" label="rtmp">rtmp</option>\
                                                    <option value="ping" label="ping">ping</option>\
                                                    <option value="traceroute" label="traceroute">traceroute</option>\
                                                </select>\
                                            </div>\
                                        </div>\
                                        <div class="form-group" :style="taskItemStyle(\'stream\')">\
                                            <label for="f_taskappid" class="col-sm-2 control-label">应用标识</label>\
                                            <div class="col-sm-8">\
                                                <input type="text" class="form-control" id="f_taskappid" placeholder="应用标识" v-model="taskAppid">\
                                            </div>\
                                            <div class="col-sm-2 form-warning" v-if="validateData.appidError">应用标识不可为空</div>\
                                        </div>\
                                        <div class="form-group" :style="taskItemStyle(\'stream\')">\
                                            <label for="f_tasksname" class="col-sm-2 control-label">流名</label>\
                                            <div class="col-sm-8">\
                                                <input type="text" class="form-control" id="f_tasksname" placeholder="流名" v-model="taskStreamname">\
                                            </div>\
                                            <div class="col-sm-2 form-warning" v-if="validateData.streamnameError">流名不可为空</div>\
                                        </div>\
                                        <div class="form-group" :style="taskItemStyle(\'ping\')">\
                                            <label for="f_tasksize" class="col-sm-2 control-label">包大小</label>\
                                            <div class="col-sm-8">\
                                                <input type="number" class="form-control" id="f_tasksize" placeholder="包大小" v-model="taskSize">\
                                            </div>\
                                            <div class="col-sm-2 form-warning">包大小不能小于24</div>\
                                        </div>\
                                        <div class="form-group" :style="taskItemStyle(\'ping\')">\
                                            <label for="f_tasktap" class="col-sm-2 control-label">ping包之间的间隔 -i(毫秒)</label>\
                                            <div class="col-sm-8">\
                                                <input type="number" class="form-control" id="f_tasktap" placeholder="ping包之间的间隔 -i(毫秒)" v-model="tasktap1">\
                                            </div>\
                                        </div>\
                                        <div class="form-group" :style="taskItemStyle(\'ping\')">\
                                            <label for="f_tasktap2" class="col-sm-2 control-label">对同一个目标的ping包间隔 -p(毫秒)</label>\
                                            <div class="col-sm-8">\
                                                <input type="number" class="form-control" id="f_tasktap2" placeholder="对同一个目标的ping包间隔 -p(毫秒)" v-model="tasktap2">\
                                            </div>\
                                        </div>\
                                        <div class="form-group">\
                                            <label for="f_taskPing" class="col-sm-2 control-label">ping持续时间</label>\
                                            <div class="col-sm-8">\
                                                <input type="number" class="form-control" id="f_taskPing" placeholder="ping持续时间" v-model="taskDuration">\
                                            </div>\
                                            <div class="col-sm-2 form-warning" v-if="validateData.taskDurationError">ping持续时间不可为空</div>\
                                        </div>\
                                        <div class="form-group">\
                                            <label for="f_taskUdp" class="col-sm-2 control-label">UDP上报地址</label>\
                                            <div class="col-sm-8">\
                                                <input type="text" class="form-control" id="f_taskUdp" placeholder="UDP上报地址" v-model="taskUdp">\
                                            </div>\
                                            <div class="col-sm-2 form-warning" v-if="validateData.taskUdpError">{{validateData.taskUdpError}}</div>\
                                        </div>\
                                        <div class="form-group">\
                                            <label for="f_taskRunType" class="col-sm-2 control-label">任务运行类型</label>\
                                            <div class="col-sm-8">\
                                                <select class="form-control" id="f_taskRunType" v-model="taskRuntype">\
                                                    <option value="0" selected="selected">选择任务运行类型</option>\
                                                    <option value="1" label="立即执行">立即执行</option>\
                                                    <option value="2" label="定时执行(运行开始时间-运行结束时间)">定时执行(运行开始时间-运行结束时间)</option>\
                                                    <option value="3" label="定时执行(运行开始时间)">定时执行(运行开始时间)</option>\
                                                </select>\
                                            </div>\
                                            <div class="col-sm-2 form-warning">请选择任务运行类型</div>\
                                        </div>\
                                        <div class="form-group" :style="isRuntypeShow(3)">\
                                        <label class="col-sm-2 control-label" for="task_time3">运行开始时间</label>\
                                            <div class="col-sm-8">\
                                                <input type="text" class="form-control" id="task_time3" name="task_time3" placeholder="运行开始时间" value="">\
                                            </div>\
                                        </div>\
                                        <div class="form-group" :style="isRuntypeShow(2)">\
                                        <label class="col-sm-2 control-label" for="task_time2">运行开始时间-运行结束时间</label>\
                                            <div class="col-sm-8">\
                                                <input type="text" class="form-control" id="task_time2" name="task_time2" placeholder="运行开始时间-运行结束时间" value="">\
                                            </div>\
                                        </div>\
                                        <div class="form-group">\
                                            <label class="col-sm-2 control-label">接收主机标识</label>\
                                            <div class="col-sm-8">\
                                                <select class="form-control" id="taskDestId_config" name="taskDestId_config" v-model="destId">\
                                                    <option value="empty">接收主机标识</option>\
                                                    <option :value="dest.name" :label="dest.name" v-for="dest in destList">{{dest.name}}</option>\
                                                </select>\
                                            </div>\
                                        </div>\
                                        <div class="form-group">\
                                            <label for="taskDestIP_config" class="col-sm-2 control-label">接收方主机IP</label>\
                                            <div class="col-sm-8">\
                                                <input type="text" class="form-control" id="taskDestIP_config" placeholder="接收方主机IP":readonly="ipReadonly" v-model="taskIp">\
                                            </div>\
                                            <div class="col-sm-2 form-warning">接收方主机IP不可为空</div>\
                                        </div>\
                                        <br>\
                                        <div class="col-sm-offset-2">\
                                            <button class="btn btn-primary">下一步</button>\
                                            <!-- <button class="btn btn-primary" id="J_btn_cancel">取消</button> -->\
                                        </div>\
                                    </form>\
                                </div>\
                            </div>',
    data : function() {
        return {
            show : true,
            step : 1,
            destList : [],
            destId :  'empty', /*接收主机标识id*/
            taskRuntype : '2', /*任务运行类型*/
            taskType : 'hls', /*任务类型*/
            taskName : '', /*任务名*/
            taskAppid : '', /*任务应用标识*/
            taskStreamname : '', /*任务流名*/
            taskSize : '', /*任务包大小*/
            tasktap1 : '', /*任务ping包间隔*/
            tasktap2 : '', /*任务同一目标ping包间隔*/
            taskUdp : '', /*任务UDP上报地址*/
            taskIp : '', /*任务接受主机IP*/
            taskDuration : '',/*任务ping持续时间*/
            formstate  : {}
        }
    },
    computed : {
        showStyle : function() {
            return this.show ? 'display : block;' : 'display : none;'
        },
        ipReadonly : function() {
            return this.destId == 'empty' ? false : 'readonly';
        },
        title : function() {
            return this.$store.state.isEdit ? '编辑任务' : '新建任务';
        },
        /*控制验证信息错误显示的数据结构*/
        validateData : function() {
            return {
                nameError : false,
                appidError : false,
                streamnameError : false,
                taskDurationError : false,
                taskUdpError : false
            }
        }
    },    
    watch : {
        destId : function(val) {
            if(val == 'empty'){
                this.taskIp = '';
            } else {
                this.taskIp = this.getTaskListIp(val);
            }
        },
        taskName : function(v) {
            if(!v){
                this.validateData.nameError = true;
            } else {
                this.validateData.nameError = false;
            }
        },
        taskAppid : function(v) {
            if(!v){
                this.validateData.appidError = true;
            } else {
                this.validateData.appidError = false;
            }
        },
        taskStreamname : function(v) {
            if(!v){
                this.validateData.streamnameError = true;
            } else {
                this.validateData.streamnameError = false;
            }
        },
        taskDuration : function(v) {
            if(!v){
                this.validateData.taskDurationError = true;
            } else {
                this.validateData.taskDurationError = false;
            }
        },
        taskUdp : function(v) {
            if(!v){
                this.validateData.taskUdpError = 'UDP上报地址不可为空';
            } else if(isIPorDomainValid(v)){
                this.validateData.taskUdpError = false;
            } else {
                this.validateData.taskUdpError = 'UDP上报格式不正确';
            }
        }
    },
    methods : {
        setVisible : function(bool) {
            this.show = bool;
        },
        getTaskListIp : function(val) {
            var ip = '';
            for(var i = 0; i < this.destList.length; i++){
                if(this.destList[i].name == val){
                    ip = this.destList[i].ip;
                }
            }
            return ip;
        },
        /*读取主机标识列表*/
        loadTaskDestList : function() {
            var url = snailtask.BASE_URL + '/probe-service/taskDest/taskDestList';
            var requestBody = {
                consult : '',
                pageIndex : 0,
                pageSize : 40
            };
            var self = this;
            /*暂时不考虑标识分页问题，等待需求*/
            Vue.http.post(url,requestBody)
                .then(function(data) {
                    self.destList = formatDestList(data.body.taskDestList);
                })      
        },
        /*根据选择的任务类型，需要填写的字段也不同，该属性用于控制显示填写字段*/
        taskItemStyle : function(itemType) {
            if(this.taskType == 'hls' || this.taskType == 'flv' || this.taskType == 'rtmp'){
                if(itemType == 'stream') {
                    return 'display : block;';
                } else {
                    return 'display : none;'
                }
            } else {
                if(itemType == 'ping'){
                    return 'display : block;'
                } else {
                    return 'display : none;'
                }
            }
        },
        isRuntypeShow : function(type) {
            return this.taskRuntype  == type ? 'display : block' : 'display : none;'
        }        

    },
    created : function() {
        var self = this;
        snailtask.messageBus.$on('showPanel', function(bool) {
            self.setVisible(bool);
        });
        this.loadTaskDestList();
    }
})

function formatDestList(list) {
    var res = [];
    for(var i = 0; i < list.length; i++){
        res.push({
            name : list[i].destID,
            ip : list[i].destIP
        });
    }
    return res;
}

/*验证字符串是否符合ip或者域名规则（带端口）*/
function isIPorDomainValid(v) {
    if (v.match(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(:[0-9]{1,5})?$/)) {
        return true;
    } else if (v.match(/([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/)) {
        return true;
    }
    return false;
}