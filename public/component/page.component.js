Vue.component('page', {
    template : '<ul class="pagingUl">\
    <li v-for="n in pageNum"><a href="javascript:" :class="isCurrent(n)" @click="onPageClick(n)">{{n}}</a></li>\
    </ul>',
    props : ['loadfunc','loadcb'],
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
            this.currentPage = n;
            this.load();
        },
        setCurrentPage : function(p) {
            this.currentPage = p;
        }
    }
})