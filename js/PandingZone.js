//判定类,显示，隐藏
//乐不思蜀，兵粮寸断如果显示的时候，将牌放到相应对象中，等判定完毕后再扔回到弃牌堆
function PandingZone(seat,role){
    this.seat = seat;
    this.staff = this.seat.get_staff();
    this.card_manager = this.staff.get_card_manager();
    this.role = role;
    this.lebusishu_flag = false;//乐不思蜀
    this.bingliangcunduan_flag = false;//兵粮寸断
    this.shandian_flag = false;//闪电，这是是否在显示区进行显示的标志,false不显示

    this.lebusishu_obj = null;
    this.bingliangcunduan_obj = null;

    this.lebusishu_success = true;//可以进入出牌阶段
    this.bingliangcunduan_success = true;//可以进入摸牌阶段
    this.shandian_success = false;//闪电判定为假，不会掉血

    this.skipqipai = false;//是否跳过弃牌阶段，默认不跳过
}
PandingZone.prototype = {
    constructor : PandingZone,
    validate : function(){
        //如果兵粮寸断的标志为true，则说明判定区有兵粮寸断，需要判定,根据判定结果，将兵粮寸断是否判定成功的标志进行改写，如果判定成功，则可以进入摸牌阶段，否则不可以。判定成功标志默认是成功的
        console.log(this.seat.get_role().get_name()+'------------------lebusishu-----'+this.lebusishu_flag); 
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
    get_lebusishu_flag : function(){//通过这个方法用来判断某个座位是否已经被加上乐不思蜀的标志了
        return this.lebusishu_flag;
    },
    get_bingliangcunduan_flag : function(){//通过这个方法用来判断某个座位是否已经被加上兵粮寸断的标志了
        return this.bingliangcunduan_flag;
    },
    lebusishu_show : function(card){//作为乐不思蜀的牌
        this.lebusishu_obj = card;
        this.seat.get_div().find('.status').append('<div class="lebusishu">乐</div>');
        this.lebusishu_flag = true;//会进行乐不思蜀的判定
    },
    lebusishu_hide : function(){
        this.seat.get_div().find('.status .lebusishu').remove();
        this.lebusishu_flag = false;//不会进行乐不思蜀的判定
        this.card_manager.drop_cards_concat([this.lebusishu_obj]); //将牌静静的放到弃牌堆 
        this.lebusishu_obj = null;
    },
    bingliangcunduan_show : function(card){
        this.bingliangcunduan_obj = card;
        this.seat.get_div().find('.status').append('<div class="bingliangcunduan">断</div>');
        this.bingliangcunduan_flag = true;//会进行兵粮寸断的判定
    },
    bingliangcunduan_hide : function(){
        this.seat.get_div().find('.status .bingliangcunduan').remove();
        this.bingliangcunduan_flag = false;//不会进行兵粮寸断的判定
        this.card_manager.drop_cards_concat([this.bingliangcunduan_obj]); //将牌静静的放到弃牌堆 
        this.bingliangcunduan_obj = null;
    },
    shandian_show : function(){
        this.seat.get_div().find('.shandian').show();
        this.shandian_flag = true;//会进行闪电的判定
    },
    shandian_hide : function(){
        this.seat.get_div().find('.shandian').hide();
        this.shandian_flag = false;//不会进行闪电的判定
    },
    bingliangcunduan_validate : function(){  
        var cards = this.card_manager.me_pai(1);  //摸一张牌,判定牌
        this.card_manager.chupai_to_log(cards);  //将牌直接打入展示区
        this.staff.set_$log('英雄名对断的判定牌为(<img class="log_puke_icon" src="./img/v'+cards[0].get_huase_show()+'.png"></img>'+cards[0].get_dots_value()+'的'+cards[0].get_card_action().get_name()+')','#447788');
        if(cards[0].get_huase_value()=='meihua'){
            this.staff.set_$log(this.role.get_name()+'对断判定不成功，可以摸牌','green');
            this.bingliangcunduan_success = true;
        }else{
            this.staff.set_$log(this.role.get_name()+'对断判定成功，不能摸牌','red');
            this.bingliangcunduan_success = false;
        }
        //不管判定是否成功，最后都要将这个小图标隐藏掉
        this.bingliangcunduan_hide();
    },
    lebusishu_validate : function(){  
        var cards = this.card_manager.me_pai(1);  //摸一张牌
        this.card_manager.chupai_to_log(cards);   //将牌直接打入展示区 
        this.staff.set_$log('英雄名对乐的判定牌为(<img class="log_puke_icon" src="./img/v'+cards[0].get_huase_show()+'.png"></img>'+cards[0].get_dots_value()+'的'+cards[0].get_card_action().get_name()+')','#447788');
        if(cards[0].get_huase_value()=='hongtao'){//判定成功
            this.staff.set_$log(this.role.get_name()+'对乐判定不成功，可以出牌','green');
            this.lebusishu_success = true;
        }else{
            this.staff.set_$log(this.role.get_name()+'对乐判定成功，不能出牌','red');
            this.lebusishu_success = false;

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