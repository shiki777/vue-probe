Vue.component('probelist',{
    template : '<div><table class="table table-striped table-bordered table-hover table-prolist" id="tableDada">\
    <thead>\
    <tr><th>编号</th><th>探针名称</th><th>最近运行时间</th><th>IP地址</th><th>地区</th><th>版本</th></tr>\
    </thead>\
    <tbody>\
    <tr v-for="(probe,index) in list">\
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
    <li v-for="n in pageNum"><a href="javascript:" :class="isCurrent(n)" @click="onPageClick(n)">{{n}}</a></li>\
    </ul>\
    </div></div>',
    data : function() {
        return {
            list : [],
            pageNum : 1,
            BASE_URL : 'http://10.220.10.60:8089',
            PROBE_URL : '/probe-service/probe/probeList',
            probeName : '',
            index : 0,
            size : 10
        }
    },
    methods : {
        load : function() {
            var requestBody = {
                hostname : this.probeName,
                pageIndex : this.index,
                pageSize : this.size
            };
            var self = this;
            Vue.http.post(this.BASE_URL + this.PROBE_URL,requestBody)
                .then(function(data) {
                    self.list = self.formatList(data.body.probeList);
                    self.pageNum = data.body.indexCounts;
                })
        },
        isCurrent : function(n) {

        },
        onPageClick : function(n) {

        },
        formatList : function(list) {
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
    },
    created : function() {
        this.load()

    }
})

