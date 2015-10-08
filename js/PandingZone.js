//判定类,显示，隐藏
function PandingZone(o_role){
    this.o_role = o_role;
    this.lebusishu_flag = false;//乐不思蜀
    this.bingliangcunduan_flag = false;//兵粮寸断
    this.shandian_flag = false;//闪电，这是是否在显示区进行显示的标志,false不显示

    this.lebusishu_success = true;//可以进入出牌阶段
    this.bingliangcunduan_success = true;//可以进入摸牌阶段
    this.shandian_success = false;//闪电判定为假，不会掉血

    this.skipqipai = false;//是否跳过弃牌阶段，默认不跳过
}
PandingZone.prototype = {
    constructor : PandingZone,
    validate : function(){
        //如果兵粮寸断的标志为true，则说明判定区有兵粮寸断，需要判定,根据判定结果，将兵粮寸断是否判定成功的标志进行改写，如果判定成功，则可以进入摸牌阶段，否则不可以。判定成功标志默认是成功的 
        if(this.lebusishu_flag){
            this.lebusishu_validate();
        }
        if(this.bingliangcunduan_flag){
            this.bingliangcunduan_validate();
        }
        if(this.shandian_flag){
            this.shandian_validate();
        }
    },
    reset : function(){//将各标志置回原始状态
        this.lebusishu_flag = false;//乐不思蜀
        this.bingliangcunduan_flag = false;//兵粮寸断
        this.shandian_flag = false;//闪电，这是是否在显示区进行显示的标志,false不显示

        this.lebusishu_success = true;//可以进入出牌阶段
        this.bingliangcunduan_success = true;//可以进入摸牌阶段
        this.shandian_success = false;//闪电判定为假，不会掉血

        this.skipqipai = false;//是否跳过弃牌阶段，默认不跳过
    },
    skipqipai : function(){
        this.skipqipai = true;
    },
    get_skipqipai : function(){
        return this.skipqipai;
    },
    get_lebusishu_success : function(){
        return this.lebusishu_success;
    },
    set_lebusishu_success : function(b){
        this.lebusishu_success = b;
    },
    get_bingliangcunduan_success : function(){
        return this.bingliangcunduan_success;
    },
    set_bingliangcunduan_success : function(b){
        this.bingliangcunduan_success = b;
    },
    get_shandian_success : function(){
        return this.shandian_success;
    },
    set_shandian_success : function(b){
        this.shandian_success = b;
    },
    lebusishu_show : function(){
        this.o_role.get_div().find('.lebusishu').show();
        this.lebusishu_flag = true;//会进行乐不思蜀的判定
    },
    lebusishu_hide : function(){
        this.o_role.get_div().find('.lebusishu').hide();
        this.lebusishu_flag = false;//不会进行乐不思蜀的判定
    },
    bingliangcunduan_show : function(){
        this.o_role.get_div().find('.bingliangcunduan').show();
        this.bingliangcunduan_flag = true;//会进行兵粮寸断的判定
    },
    bingliangcunduan_hide : function(){
        this.o_role.get_div().find('.bingliangcunduan').hide();
        this.bingliangcunduan_flag = false;//不会进行兵粮寸断的判定
    },
    shandian_show : function(){
        this.o_role.get_div().find('.shandian').show();
        this.shandian_flag = true;//会进行闪电的判定
    },
    shandian_hide : function(){
        this.o_role.get_div().find('.shandian').hide();
        this.shandian_flag = false;//不会进行闪电的判定
    },
    bingliangcunduan_validate : function(){
        if(this.bingliangcunduan_success){//判定成功
            this.o_role.staff.set_$info(this.o_role.get_name()+'兵粮寸断判定成功','green');
        }else{
            this.o_role.staff.set_$info(this.o_role.get_name()+'兵粮寸断判定不成功','red');
        }
        //不管判定是否成功，最后都要将这个小图标隐藏掉
        this.bingliangcunduan_hide();
    },
    lebusishu_validate : function(){
        if(this.lebusishu_success){//判定成功
            this.o_role.staff.set_$info(this.o_role.get_name()+'乐不思蜀判定成功','green');
        }else{
            this.o_role.staff.set_$info(this.o_role.get_name()+'乐不思蜀判定不成功','red');
        }
        //不管判定是否成功，最后都要将这个小图标隐藏掉
        this.lebusishu_hide();
    },
    shandian_validate : function(){
        if(true){//判定成功
            this.shandian_success = true;
            //如果闪电判定成功，则其所在角色中的英雄要掉血
            //this.o_role.hero.del_blood();
        }else{
            this.shandian_success = false;
        }
        //不管判定是否成功，最后都要将这个小图标隐藏掉
        this.shandian_hide();
    }
}