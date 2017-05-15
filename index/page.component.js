Vue.component('page', {
    template : '<ul class="pagingUl">\
    <li v-for="n in pageNum"><a href="javascript:" :class="isCurrent(n)" @click="onPageClick(n)">{{n}}</a></li>\
    </ul>',
    props : ['loadfunc','loadcb'],
    computed : {
        pageNum : function() {
            return this.$store.state.probePage;
        },
        currentPage : function() {
            return this.$store.state.currentPage;
        }
    },
    methods : {
        load : function() {
            if(typeof snailprobe[this.loadfunc] == 'function'){
                snailprobe[this.loadfunc]('',this.currentPage - 1)
                .then(snailprobe[this.loadcb])
                .catch(function(err) {
                    console.log(err)
                })                
            }
        },
        isCurrent : function(n) {
            return n == this.currentPage ? 'activP' : '';
        },
        onPageClick : function(n) {
            var self = this;
            this.$store.dispatch('updateCurrentPage',n)
                .then(function() {
                    self.load();
                })
                .catch(function(e) {console.log(e)});
        }
    }
})