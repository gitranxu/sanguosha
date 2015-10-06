(function(window,$,undefined){
    window.sanguosha = window.sanguosha || {};

    /*舞台类，只管定时轮询就可以了*/
    //随机定角色，电脑随机选英雄，到我这再弹出选英雄的界面
    //角色：主公（游戏的关键，成功与否的标志），忠臣，反贼，内奸，角色类会控制怎样杀来杀去
    //英雄：有各自的英雄技能
    function Staff(){
        this.timer = null;
        this.$roles_div = $('.container .role');
        this.a_o_roles = [];
        this.i_now = 0;
        this.can_play = false;//英雄选择完毕就可以开始玩了
        this.init();
    }
    Staff.prototype = {
        constructor : Staff,
        init : function(){
            //随机分配角色
            this.set_roles_rand();
            //console.log(this.a_o_roles);
            this.assign_role();
            this.chose_hero();
            this.bind();
            this.play();
        },
        play : function(){
            var _this = this;
            clearInterval(this.timer);
            this.timer = setInterval(function(){
                var index = _this.i_now%8;
                _this.$cur_role_div = _this.$roles_div.eq(index);
                _this.a_o_roles[index].change_bg(index);
                if(_this.$cur_role_div.hasClass('me')){
                    _this.pause();
                }else{
                    _this.a_o_roles[index].action(index);
                }
                _this.i_now++;
            },1000);
        },
        pause : function(){
            clearInterval(this.timer);
            this.timer = null;
        },
        chose_hero : function(){

        },
        assign_role : function(){
            var _this = this;
            this.$roles_div.each(function(index){
                var flag = _this.a_o_roles[index].get_flag();
                $(this).find('.rolename').text(flag);
            });
        },
        get_roles : function(){
            return [new Zhugong(),new Zhongchen(),new Zhongchen(),new Neijian(),new Fanze(),new Fanze(),new Fanze(),new Fanze()];
        },
        set_roles_rand : function(){
            var roles = this.get_roles();
            for(var i = 0;i<8;i++){
                this.a_o_roles.push(tools.get_rand_from_arr(roles)[0]);
            }
        },
        assign_hero_rand : function(){

        },
        bind : function(){
            var _this = this;
            //点击弃牌按钮
            $('.btns .next').click(function(){
                _this.play();
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
    function Role(name,flag){
        this.name = name;
        this.flag = flag;
    }
    Role.prototype = {
        constructor : Role,
        get_name : function(){
            return this.name;
        },
        get_flag : function(){
            return this.flag;
        },
        action : function(index){
            //console.log(this.name+'在行动...'+index);
        },
        change_bg : function(index){
            $('.role').removeClass('active').eq(index).addClass('active');
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


    //英雄：有各自的英雄技能
    //英雄类中有装备区，有判定区，装备区及判断区不放在角色类中，角色类只是判断如何操作英雄
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