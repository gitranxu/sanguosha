(function(window,$,undefined){
    window.sanguosha = window.sanguosha || {};

    var timer = null;
    var tst_user = [{name:'小乔',action:function(){console.log('小乔说...');}},
        {name:'大乔',action:function(){console.log('大乔说...');}},
        {name:'未久',action:function(){console.log('未久说...');}},
        {name:'我',action:function(){console.log('我说...');}},
        {name:'貂蝉',action:function(){console.log('貂蝉说...');}}];
    var i_now = 0;
    var sgs = {
        run : function(){
            timer = setInterval(function(){
                var user = tst_user[i_now%tst_user.length];
                if(user.name == '我'){
                    clearInterval(timer);
                    timer = null;
                }else{
                    user.action();
                }
                i_now++;
            },2000);
        }
    };


    sanguosha.init = function(){
        sgs.run()
    }
})(window,jQuery);