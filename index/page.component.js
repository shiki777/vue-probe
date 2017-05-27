Vue.component('page', {
    template : '<ul class="pagingUl">\
    <li v-for="n in indexArr"><a href="javascript:" :class="isCurrent(n)" @click="onPageClick(n)">{{n}}</a></li>\
    </ul>',
    props : ['loadfunc','loadcb'],
    data : function() {
        return {
            MAX_PAGE : 10
        }
    },
    computed : {
        /*页数*/
        pageNum : function() {
            return this.$store.state.probePage;
        },
        currentPage : function() {
            return this.$store.state.currentPage;
        },
        /*当前页标前面下标数*/
        currentPrevNum : function() {
            if(this.MAX_PAGE % 2 == 0){
                return this.MAX_PAGE / 2 - 1;
            } else {
                return Math.floor(this.MAX_PAGE);
            }
        },
        /*下标数组*/
        indexArr : function() {
            var indexArr = [];
            var bodyStart = (this.currentPage - this.currentPrevNum) > 0 ? this.currentPage - this.currentPrevNum : 1;
            var bodyEnd = (bodyStart + this.MAX_PAGE - 1) >= this.pageNum ? this.pageNum : bodyStart + this.MAX_PAGE - 1;
            for(var i = bodyStart; i <= bodyEnd; i++){
                indexArr.push(i);
            }
            if(bodyStart > 1){
                indexArr.splice(0,0,1);
            }
            if(bodyStart > 2){
                indexArr.splice(1,0,'...');
            }
            if(bodyEnd < this.pageNum){
                indexArr.push(this.pageNum);
            }
            if(bodyEnd < this.pageNum - 1){
                indexArr.splice(indexArr.length - 1,0,'...');
            }
            return indexArr;
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
            console.log(typeof parseInt(n,10))
            if(isNaN(parseInt(n,10))) {return;}
            var self = this;
            this.$store.dispatch('updateCurrentPage',n)
                .then(function() {
                    self.load();
                })
                .catch(function(e) {console.log(e)});
        }
    }
})