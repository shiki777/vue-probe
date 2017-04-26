Vue.component('page', {
    template : '<ul class="pagingUl">\
    <li v-for="n in pageNum"><a href="javascript:" :class="isCurrent(n)" @click="onPageClick(n)">{{n}}</a></li>\
    </ul>',
    props : ['loadfunc'],
    data : function() {
        return {
            currentPage : 1
        }
    },
    computed : {
        pageNum : function() {
            return this.$store.state.probePage;
        }
    },
    methods : {
        load : function() {
            if(typeof snailprobe[this.loadfunc] == 'function'){
                snailprobe[this.loadfunc]('',this.currentPage)
                .then(function(data) {
                    probeStore.commit('updateList',data.body.probeList);
                    probeStore.commit('updatePage',data.body.indexCounts);
                })
                .catch(function(err) {
                    console.log(err)
                })                
            }
        },
        isCurrent : function(n) {
            return n == this.currentPage ? 'activP' : '';
        },
        onPageClick : function(n) {
            this.currentPage = n;
            this.load();
        }
    }
})