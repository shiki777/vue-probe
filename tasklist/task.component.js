Vue.component('taskpanel',{
    template : '                            <div class="creatTask" :style="showStyle">\
                                <h4 class="channel-title">{{title}}</h4>\
                                <div class="creattaskwrap">\
                                    <form class="form-horizontal">\
                                        <br>\
                                        <div class="form-group">\
                                            <label for="f_taskName" class="col-sm-2 control-label">任务名</label>\
                                            <div class="col-sm-10">\
                                                <input type="text" class="form-control" id="f_taskName" placeholder="任务名">\
                                            </div>\
                                        </div>\
                                        <div class="form-group">\
                                            <label for="f_taskType" class="col-sm-2 control-label">任务类型</label>\
                                            <div class="col-sm-10">\
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
                                            <div class="col-sm-10">\
                                                <input type="text" class="form-control" id="f_taskappid" placeholder="应用标识">\
                                            </div>\
                                        </div>\
                                        <div class="form-group" :style="taskItemStyle(\'stream\')">\
                                            <label for="f_tasksname" class="col-sm-2 control-label">流名</label>\
                                            <div class="col-sm-10">\
                                                <input type="text" class="form-control" id="f_tasksname" placeholder="流名">\
                                            </div>\
                                        </div>\
                                        <div class="form-group" :style="taskItemStyle(\'ping\')">\
                                            <label for="f_tasksize" class="col-sm-2 control-label">包大小</label>\
                                            <div class="col-sm-10">\
                                                <input type="text" class="form-control" id="f_tasksize" placeholder="包大小">\
                                            </div>\
                                        </div>\
                                        <div class="form-group" :style="taskItemStyle(\'ping\')">\
                                            <label for="f_tasktap" class="col-sm-2 control-label">ping包之间的间隔 -i(毫秒)</label>\
                                            <div class="col-sm-10">\
                                                <input type="text" class="form-control" id="f_tasktap" placeholder="ping包之间的间隔 -i(毫秒)">\
                                            </div>\
                                        </div>\
                                        <div class="form-group" :style="taskItemStyle(\'ping\')">\
                                            <label for="f_tasktap2" class="col-sm-2 control-label">对同一个目标的ping包间隔 -p(毫秒)</label>\
                                            <div class="col-sm-10">\
                                                <input type="text" class="form-control" id="f_tasktap2" placeholder="对同一个目标的ping包间隔 -p(毫秒)">\
                                            </div>\
                                        </div>\
                                        <div class="form-group">\
                                            <label for="f_taskPing" class="col-sm-2 control-label">ping持续时间</label>\
                                            <div class="col-sm-10">\
                                                <input type="number" class="form-control" id="f_taskPing" placeholder="ping持续时间">\
                                            </div>\
                                        </div>\
                                        <div class="form-group">\
                                            <label for="f_taskUdp" class="col-sm-2 control-label">UDP上报地址</label>\
                                            <div class="col-sm-10">\
                                                <input type="text" class="form-control" id="f_taskUdp" placeholder="UDP上报地址">\
                                            </div>\
                                        </div>\
                                        <div class="form-group">\
                                            <label for="f_taskRunType" class="col-sm-2 control-label">任务运行类型</label>\
                                            <div class="col-sm-10">\
                                                <select class="form-control" id="f_taskRunType">\
                                                    <option value="0" selected="selected">选择任务运行类型</option>\
                                                    <option value="1" label="立即执行">立即执行</option>\
                                                    <option value="2" label="定时执行(运行开始时间-运行结束时间)">定时执行(运行开始时间-运行结束时间)</option>\
                                                    <option value="3" label="定时执行(运行开始时间)">定时执行(运行开始时间)</option>\
                                                </select>\
                                            </div>\
                                        </div>\
                                        <div class="form-group">\
                                            <label class="col-sm-2 control-label">接收主机标识</label>\
                                            <div class="col-sm-10">\
                                                <select class="form-control" id="taskDestId_config" name="taskDestId_config" v-model="destId">\
                                                    <option value="epmty">接收主机标识</option>\
                                                    <option :value="dest.name" :label="dest.name" v-for="dest in destList">{{dest.name}}</option>\
                                                </select>\
                                            </div>\
                                        </div>\
                                        <div class="form-group">\
                                            <label for="taskDestIP_config" class="col-sm-2 control-label">接收方主机IP</label>\
                                            <div class="col-sm-10">\
                                                <input type="text" class="form-control" id="taskDestIP_config" placeholder="接收方主机IP">\
                                            </div>\
                                        </div>\
                                        <br>\
                                        <div class="col-sm-offset-2">\
                                            <button class="btn btn-primary" id="J_btn_newTask">确定</button>\
                                            <button class="btn btn-primary" type="reset">下一步</button>\
                                            <!-- <button class="btn btn-primary" type="reset" id="J_btn_cancel">取消</button> -->\
                                        </div>\
                                    </form>\
                                </div>\
                            </div>',
    data : function() {
        return {
            show : true,
            destList : [],
            destId :  'empty', /*接收主机标识id*/
            taskType : 'hls' /*任务类型*/
        }
    },
    computed : {
        showStyle : function() {
            return this.show ? 'display : block;' : 'display : none;'
        },
        ipReadonly : function() {
            return this.destId == 'empty' ? 'xxx' : 'readonly';
        },
        title : function() {
            return this.$store.state.isEdit ? '编辑任务' : '新建任务';
        }
    },    
    methods : {
        setVisible : function(bool) {
            this.show = bool;
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