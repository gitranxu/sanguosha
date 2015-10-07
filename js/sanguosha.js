(function(window,$,undefined){
    window.sanguosha = window.sanguosha || {};

    /*舞台类，只管定时轮询就可以了*/
    //随机定角色，电脑随机选英雄，到我这再弹出选英雄的界面
    //角色：主公（游戏的关键，成功与否的标志），忠臣，反贼，内奸，角色类会控制怎样杀来杀去
    //英雄：有各自的英雄技能
    function Staff(){
        this.timer = null;
        //this.$roles_div = $('.container .role');
        this.a_o_roles = [];
        this.i_now = 0;
        this.i_next = 0;
        this.i_count = 0;
        this.can_play = false;//英雄选择完毕就可以开始玩了
        this.init();
    }
    Staff.prototype = {
        constructor : Staff,
        init : function(){
            //随机分配角色
            this.set_roles_rand();
            this.init_role_div();//角色所在DIV信息初始化

            this.chose_hero();
            this.bind();
            this.play();
        },
        play : function(){
            var _this = this;
            clearInterval(this.timer);
            this.timer = setInterval(function(){
                _this.i_now = _this.i_count%8;
                _this.$cur_role_div = _this.a_o_roles[_this.i_now].get_div();
                _this.a_o_roles[_this.i_now].change_bg(_this.i_now);
                _this.is_me = _this.$cur_role_div.hasClass('me');
                if(_this.is_me){
                    _this.pause();
                }
                _this.a_o_roles[_this.i_now].steps(_this.i_now,_this);//进入各阶段
                _this.i_count++;
                _this.i_next = _this.i_count%8;
            },1000);
        },
        pause : function(){
            clearInterval(this.timer);
            this.timer = null;
        },
        chose_hero : function(){

        },
        init_role_div : function(){
            for(var i = 0,j = this.a_o_roles.length;i < j;i++){
                var flag = this.a_o_roles[i].get_flag();
                this.a_o_roles[i].get_div().find('.rolename').text(flag);
            }
        },
        get_o_roles : function(){
            return [new Zhugong(),new Zhongchen(),new Zhongchen(),new Neijian(),new Fanze(),new Fanze(),new Fanze(),new Fanze()];
        },
        set_roles_rand : function(){
            var a_o_roles = this.get_o_roles();
            var $roles_div = $('#sanguosha .role');
            for(var i = 0;i<8;i++){
                var o_role = tools.get_rand_from_arr(a_o_roles)[0];
                o_role.set_div($roles_div.eq(i));
                this.a_o_roles.push(o_role);
            }
        },
        assign_hero_rand : function(){

        },
        bind : function(){
            var _this = this;
            //点击弃牌按钮
            $('.btns .next').click(function(){
                //点击弃牌按钮后就进入弃牌阶段了
                _this.a_o_roles[_this.i_now].qipai_step();
            });

            //点击暂停按钮
            $('.btns .pause').click(function(){
                var $this = $(this);
                if($this.text()=='暂停'){
                    $this.text('恢复');
                    _this.pause();
                }else{
                    $this.text('暂停');
                    if(!_this.$cur_role_div.hasClass('me')){
                        _this.play();
                        console.log('可以恢复');
                    }else{
                        console.log('不可以恢复');
                    }
                }
                
            });


        }
    }

    var tools = {
        get_rand_between_two_num : function(min,max){
            return parseInt(Math.random()*(max-min+1))+min;
        },
        //不重复拿到数组中的值
        get_rand_from_arr : function(arr){
            return arr.splice(this.get_rand_between_two_num(0,arr.length-1),1);
        }
    }

    //角色：主公（游戏的关键，成功与否的标志），忠臣，反贼，内奸，角色类会控制怎样杀来杀去
    //角色类中有判定区，即（乐不思蜀，兵粮寸断，闪电），在开始，判定，摸牌，出牌，弃牌各阶段切换时用于判定
    function Role(name,flag){
        this.name = name;
        this.flag = flag;
        this.$div = null;
        this.panding_zone = new PandingZone(this);
    }
    Role.prototype = {
        constructor : Role,
        get_name : function(){
            return this.name;
        },
        get_flag : function(){
            return this.flag;
        },
        get_div : function(){
            return this.$div;
        },
        set_div : function($div){
            this.$div = $div;
        },
        change_bg : function(index){
            $('.role').removeClass('active').eq(index).addClass('active');
        },


        steps : function(index,staff){
            //可能都需要在出牌阶段开始时暂停，出牌阶段结束时继续
            console.log(this.name+'回合开始');
            var _this = this;
            staff.pause();
            setTimeout(function(){
                staff.play();
                _this.panding_step(staff);//判定阶段
            },5000);
            
        },
        panding_step : function(staff){
            console.log(this.name+'判定阶段');
            this.panding_zone.validate();
            //判定阶段需要判断判定区是否有牌，如果有兵粮寸断且判定不成功，则跳过摸牌阶段

            this.mepai_step(staff);//摸牌阶段
        },
        mepai_step : function(staff){
            if(this.panding_zone.get_bingliangcunduan_success()){
                console.log(this.name+'摸牌阶段开始');
                console.log(this.name+'摸牌阶段结束');
            }else{
                console.log('兵粮寸断判定为假，跳过摸牌阶段');
            }
            this.chupai_step(staff);//出牌阶段
        },
        chupai_step : function(staff){
            console.log(this.name+'出牌阶段');
            //这里应该加一个暂停
            staff.pause();
            //中间还要区分是自动出牌（自动出牌方法最后加一个继续的方法以让游戏继续），还是手动出牌（手动出牌不需要加继续的方法，而是通过点击弃牌按钮手动触发）
            if(this.panding_zone.get_lebusishu_success()){
                if(staff.is_me){
                    this.me_chupai_step(staff);
                }else{
                    this.auto_chupai_step(staff);
                }
            }else{
                console.log('乐不思蜀判定为假，跳过出牌阶段');
            }
            
        },
        qipai_step : function(){
            if(this.panding_zone.get_skipqipai()){
                console.log('跳过弃牌阶段');
            }else{
                console.log(this.name+'弃牌阶段开始');
                console.log(this.name+'弃牌阶段结束');
            }
            
            this.panding_zone.reset();//回合结束前将这次的判定条件重置一下,以备下次开始之前重新判定
            console.log(this.name+'回合结束');

            staff.play();//最后加一个继续
        },
        auto_chupai_step : function(staff){
            var _this = this;
            console.log('自动出牌阶段思考3秒钟...');
            setTimeout(function(){
                _this.qipai_step();//弃牌阶段
            },3000);
        },
        me_chupai_step : function(staff){
            //this.qipai_step();//弃牌阶段应该是点击取消按钮后手动触发
            console.log('我自己的出牌阶段');
        }
    }
    function Zhugong(){
        Role.call(this,'主公','主');
    }
    Zhugong.prototype = new Role();
    function Zhongchen(){
        Role.call(this,'忠臣','忠');
    }
    Zhongchen.prototype = new Role();
    function Neijian(){
        Role.call(this,'内奸','内');
    }
    Neijian.prototype = new Role();
    function Fanze(){
        Role.call(this,'反贼','反');
    }
    Fanze.prototype = new Role();

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
        get_bingliangcunduan_success : function(){
            return this.bingliangcunduan_success;
        },
        get_shandian_success : function(){
            return this.shandian_success;
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
            if(true){//判定成功
                this.bingliangcunduan_success = true;
            }else{
                this.bingliangcunduan_success = false;
            }
            //不管判定是否成功，最后都要将这个小图标隐藏掉
            this.bingliangcunduan_hide();
        },
        lebusishu_validate : function(){
            if(true){//判定成功
                this.lebusishu_success = true;
            }else{
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


    //英雄：有各自的英雄技能
    //英雄类中有装备区，有状态区，装备区及状态区不放在角色类中，角色类只是判断如何操作英雄
    function Hero(){
        this.cur_blood = 3;//默认当前血量
        this.max_blood = 3;//默认最大血量
    }
    Hero.prototype = {
        constructor : Hero,
        sha : function(){
            console.log('杀...');
        },
        shan : function(){
            console.log('闪...');
        },
        del_blood : function(){
            this.blood--;

        },
        add_blood : function(){
            this.cur_blood++;
        },
        get_cur_blood : function(){
            return this.cur_blood;
        },
        get_max_blood : function(){
            return this.max_blood;
        }
    }

    //桃是否可用应该牌类自己有一个是否可用的方法
    function Card($card_div){
        this.$card_div = $card_div;//代表棋牌本身的html元素
    }
    Card.prototype = {
        constructor : Card,
        //如果不可以用，则棋牌本身自己加一个disable属性,这个方法是当轮到自己的时候棋牌进行调用的，如果一个角色要死的时候，不会调用这个方法，给别人喂桃是另外的方法
        can_use : function(){console.log('父类中的牌类是否可用的方法，看到这句话，说明子类没有实现这个方法...')}//该方法每个特定的牌类自己去具体实现
    }

    function Peach($card_div){
        Card.call(this,$card_div);
    }
    Peach.prototype = new Card();
    Peach.prototype.can_use = function(hero){
        if(hero.get_cur_blood() >= hero.get_max_blood()){
            this.$card_div.addClass('disable');
        }
    }

    function Sha($card_div){
        Card.call(this,$card_div);
    }
    Sha.prototype = new Card();
    Sha.prototype.can_use = function(hero){
        //如果英雄的状态为麻木，则不能使用
        if(hero.mamu_status){
            this.$card_div.addClass('disable');
        }
    }

    function Shan($card_div){
        Card.call(this,$card_div);
    }
    Shan.prototype = new Card();
    Shan.prototype.can_use = function(hero){}



    sanguosha.init = function(){
        window.staff = new Staff();
    }
})(window,jQuery);