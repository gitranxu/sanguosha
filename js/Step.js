//阶段类
function Step(seat,staff){
	this.seat = seat;
	this.staff = this.seat.get_staff();
	this.panding_zone = this.seat.get_panding_zone();
    this.card_manager = this.staff.get_card_manager();
	this.name = seat.get_role().get_name();
    this.auto_chupai_time = 3000;//自动出牌模拟时间
}
Step.prototype = {
	constructor : Step,
	steps : function(){
        //可能都需要在出牌阶段开始时暂停，出牌阶段结束时继续
        //console.log(this.name+'回合开始');
        this.staff.set_$log(this.name+'回合开始');
        this.is_me = this.seat.get_div().hasClass('me');
        this.seat.get_div().addClass('active');//设置当前座位类div，加上active类
        this.staff.pause();


        var _this = this;
        setTimeout(function(){
            _this.staff.play();
            _this.panding_step();//判定阶段
        },2000);
        
    },
    panding_step : function(){
        //console.log(this.name+'判定阶段');
        this.staff.set_$log(this.name+'判定阶段');
        this.panding_zone.validate();
        //判定阶段需要判断判定区是否有牌，如果有兵粮寸断且判定不成功，则跳过摸牌阶段

        this.mepai_step();//摸牌阶段
    },
    mepai_step : function(){
        if(this.panding_zone.get_bingliangcunduan_success()){
            this.staff.set_$log(this.name+'摸牌阶段开始');
            //英姿，英魂，再起等技能是否发动,这里应该是调用英雄的技能的摸牌阶段的方法，这个阶段的方法的返回值大概有三种情况，直接返回摸牌数量没有其他效果或多加一个让他们摸弃牌效果或再起效果

            if(this.is_me){
                $('.myzone .btn3').show();//到我这儿出牌时，先把出牌按钮啥的显示出来
            }
            this.seat.mepai_to_paiqu(this.staff.get_i_now(),2);

            this.staff.set_$log(this.name+'摸牌阶段结束');
        }else{
            this.panding_zone.set_bingliangcunduan_success(true);//恢复默认值
            this.staff.set_$log(this.name+'对断判定成功，跳过摸牌阶段','yellow');
        }
        this.chupai_step();//出牌阶段
    },
    chupai_step : function(){
        //判断牌是否可用是在出牌阶段才有必要去判定
        this.card_manager.cards_can_use({can_all:true,can_shan:false,can_tao:false,can_wuxiekeji:false});//判断牌是否可用

        this.staff.pause();//这里应该加一个暂停
        //中间还要区分是自动出牌（自动出牌方法最后加一个继续的方法以让游戏继续），还是手动出牌（手动出牌不需要加继续的方法，而是通过点击弃牌按钮手动触发）
        if(this.panding_zone.get_lebusishu_success()){
            this.staff.set_$log(this.name+'出牌阶段');
            if(this.is_me){
                this.me_chupai_step();
            }else{
                this.auto_chupai_step();
            }
        }else{
            this.panding_zone.set_lebusishu_success(true);//这次判定不成功后要马上把值恢复为初始值，以便下次重新判定
            this.staff.set_$log(this.name+'对乐判定成功，跳过出牌阶段','yellow');
            this.qipai_step();
        }
        
    },
    qipai_step : function(){
        //弃牌阶段一开始，先要把所有的牌的类名全部去掉（因为刚摸上来的牌没有任何类名）
        this.seat.reset_card_div();
        var _this = this;
        if(this.panding_zone.get_skipqipai()){
            this.staff.set_$log('跳过弃牌阶段','yellow');
            this.staff.play();//最后加一个继续
        }else{
            this.staff.set_$log(this.name+'弃牌阶段开始');

            //这里就简单的认为弃牌就是直接从pai_list中pop出来(不考虑优先弃什么牌)，然后打到log中，放到弃牌堆
            this.seat.qi_pai(function(){
                _this.staff.set_$log(_this.name+'弃牌阶段结束');
                _this.staff.set_$log(_this.name+'回合结束');
                _this.seat.get_div().removeClass('active');//设置当前座位类div，去掉active类
                if(_this.is_me){
                    $('.myzone .btn3').hide();//出完牌后把我出牌的按钮隐藏
                }
                _this.staff.play();//最后加一个继续
            });
        }
        
        
    },
    auto_chupai_step : function(){
        var _this = this;
        this.staff.set_$log('自动出牌阶段思考'+this.auto_chupai_time+'秒钟...');
        _this.seat.get_role().chupai();//角色来出牌
        setTimeout(function(){
            _this.qipai_step();//弃牌阶段
        },_this.auto_chupai_time);
    },
    me_chupai_step : function(){
        //this.qipai_step();//弃牌阶段应该是点击取消按钮后手动触发
        this.staff.set_$log('我自己的出牌阶段');
    }
}