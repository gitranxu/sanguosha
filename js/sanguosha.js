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
        this.$info = $('.info .content');//用于显示日志的div
        this.$info_left = $('.info_left .content');//用于显示日志的div
        this.$info_right = $('.info_right .content');//用于显示日志的div
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
                _this.a_o_roles[_this.i_now].steps(_this.i_now);//进入各阶段
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
                o_role.set_staff(this);
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
                /*var $this = $(this);
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
                }*/
                
            });


        },
        set_$info : function(msg,color){
            var html = this.$info.html();
            if(color){
                msg = '<font color="'+color+'">'+msg+'</font>';
            }

            $('#info_tmp').show().html(msg);
            var info_tmp_height = $('#info_tmp').height();
            $('#info_tmp').html('').hide();
            var info_tmp_rows = info_tmp_height/14; //得到中间每条日志的行数

            $('#info_left_tmp').show().html(msg);
            var info_left_tmp_height = $('#info_left_tmp').height();
            $('#info_left_tmp').html('').hide();
            var info_left_tmp_rows = info_left_tmp_height/14;//得到左右两边每条日志行数

            this.$info.html(html+msg+'<br>');
            this.$info_left.html(html+msg+'<br>');
            this.$info_right.html(html+msg+'<br>');
            var info_top = this.$info.position().top;
            var info_height = this.$info.height();
            if(info_height>=84){ //84=14*(5+1),显示5行文字,line-height为14
                this.$info.css({top:info_top-14*info_tmp_rows});
            }
            var info_left_top = this.$info_left.position().top;
            var info_left_height = this.$info_left.height();
            if(info_left_height>=756){ //392*2=14*27*2,显示27行文字,line-height为14
                this.$info_left.css({top:info_left_top-14*info_left_tmp_rows});
            }

            var info_right_top = this.$info_right.position().top;
            var info_right_height = this.$info_right.height();
            if(info_right_height>=756){ //392=14*27*2,显示27行文字,line-height为14
                this.$info_right.css({top:info_right_top-14*info_left_tmp_rows});
            }
        }
    }

    sanguosha.init = function(){
        window.staff1 = new Staff();
    }
})(window,jQuery);