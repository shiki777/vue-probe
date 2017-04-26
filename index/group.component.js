Vue.component('groups', {
    template: '<div class="btn-group probe-group" id="probeGroupList">\
    <button type="button" class="btn btn-default" v-for="g in groups">{{g}}</button>\
    <button type="button" title="添加新组" class="btn btn-default glyphicon glyphicon-plus" onclick="group.cGroupName();"></button>\
    </div>',
    data: function() {
        return {
            groups: []
        }
    },
    methods: {
        load: function() {
            var GROUP_URL = 'http://127.0.0.1:5000/groups';
            var self = this;
            Vue.http.post(GROUP_URL)
            .then(function(data) {
                self.groups = self.formatGroups(data.body.list);
            })
            .catch(function(e) {
                console.log(e)
            });
        },
        formatGroups: function(groups) {
            var res = [];
            for (var i = 0; i < groups.length; i++) {
                var g = groups[i];
                res.push(g);
            }
            return res;
        }
    },
    created: function() {
        this.load();
    }
});