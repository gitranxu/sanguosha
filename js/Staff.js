(function(window,$,undefined){
    window.sanguosha = window.sanguosha || {};

    /*舞台类，只管定时轮询就可以了，舞台类中还有棋牌管理类*/
    //随机定角色，电脑随机选英雄，到我这再弹出选英雄的界面
    //角色：主公（游戏的关键，成功与否的标志），忠臣，反贼，内奸，角色类会控制怎样杀来杀去
    //英雄：有各自的英雄技能
    function Staff(){
        this.card_manager = new CardManager(this);
        this.timer = null;
        this.a_seat = [];
        this.i_now = 0;
        this.i_next = 0;
        this.i_count = 0;
        //this.can_play = false;//英雄选择完毕就可以开始玩了
        this.$log = $('.log .content');//用于显示日志的div
        this.$log_left = $('.log_left .content');//用于显示日志的div
        this.$log_right = $('.log_right .content');//用于显示日志的div
        this.paiqu_card_move_time = 100;//点中牌后完成上下移动所需时间
        this.init();
    }
    Staff.prototype = {
        constructor : Staff,
        init : function(){
            this.assign_role_to_seat_rand();//给每个座位类随机分配角色
            this.seat_init();//初始化座位信息

            this.card_manager.generate_cards();//生成所有的手牌，回头还要生成英雄牌
            //this.chose_hero();
            //this.test();
            this.card_manager.xipai();
            //this.test1();
            this.card_manager.fapai();//每个座位类分到初始的4张牌

            //定位主公，将当前座位指定到公主所在座位
            this.index_to_zhugong();

            this.bind();
            this.play();
        },
        test : function(){
            var cards = this.card_manager.get_cards();
            $('#test').append('现在有牌：'+cards.length+' 个.');
            //$('#test').append(cards[0].get_name());get_dots
            for(var card in cards){
                $('#test').append(cards[card].get_name()+':'+cards[card].get_huase()+':'+cards[card].get_dots()+',');
            }
        },
        test1 : function(){
            var cards = this.card_manager.get_cards();
            $('#test1').append('洗后有牌：'+cards.length+' 个.');
            //$('#test1').append(cards[0].get_name());
            //console.log(JSON.stringify(cards));
            for(var card in cards){
                $('#test1').append(cards[card].get_name()+':'+cards[card].get_huase()+':'+cards[card].get_dots()+',');
            }
        },
        play : function(){
            var _this = this;
            clearInterval(this.timer);
            this.timer = setInterval(function(){
                _this.i_now = _this.i_count%8;
                _this.a_seat[_this.i_now].get_step().steps(_this.i_now);//进入各阶段
                _this.i_count++;
                _this.i_next = _this.i_count%8;
            },1000);
        },
        pause : function(){
            clearInterval(this.timer);
            this.timer = null;
        },
        seat_init : function(){
            for(var i = 0,j = this.a_seat.length;i < j;i++){
                this.a_seat[i].init();//在座位初始化
            }
        },
        get_all_roles : function(){
            return [new Zhugong(),new Zhongchen(),new Zhongchen(),new Neijian(),new Fanze(),new Fanze(),new Fanze(),new Fanze()];
        },
        assign_role_to_seat_rand : function(){
            var a_o_roles = this.get_all_roles();
            var $seats_div = $('#sanguosha .seat');
            var length = $seats_div.length;
            for(var i = 0;i<length;i++){
                var o_rand_role = tools.get_rand_from_arr(a_o_roles)[0];
                var seat = new Seat(this,o_rand_role);
                seat.set_div($seats_div.eq(i));
                seat.set_no(i);
                this.a_seat.push(seat);
            }
        },
        index_to_zhugong : function(){
            this.i_now = this.i_count%8;
            var code = this.a_seat[this.i_now].get_role().get_code();
            this.i_count++;
            this.i_next = this.i_count%8;
            if(code==1){
                this.i_count--;//找到后，微调一下指针
                return;
            }else{
                this.index_to_zhugong();
            }
        },
        get_card_manager : function(){
            return this.card_manager;
        },
        get_a_seat : function(){
            return this.a_seat;
        },
        bind : function(){
            var _this = this;
            //点击弃牌按钮
            $('.btns .next').click(function(){
                //点击弃牌按钮后就进入弃牌阶段了
                //_this.a_o_roles[_this.i_now].qipai_step();
            });

            $('#xianyin').click(function(){
                var ishide = $('#log_left_ctr').is(':hidden');
                if(ishide){
                    $(this).text('隐');
                    $('#log_left_ctr,#log_right_ctr').show();
                }else{
                    $(this).text('显');
                    $('#log_left_ctr,#log_right_ctr').hide();
                }
            });

            //牌区中的每张牌点击的时候
            $('.paiqu').delegate('.cardul > li', {
                'click':function(){
                    this.index = this.index || 0;
                    if(this.index%2==0){
                        $(this).animate({top: 0}, _this.paiqu_card_move_time,function(){
                            $(this).addClass('ready_to_out');
                        });
                    }else{
                        $(this).animate({top: 10}, _this.paiqu_card_move_time,function(){
                            $(this).removeClass('ready_to_out');
                        });
                    }
                    
                    this.index++; 
                },
                'mouseenter':function(){
                    $(this).find('.card').addClass('now');
                },
                'mouseleave':function(){
                    $(this).find('.card').removeClass('now');
                }
            });

            //点击确定按钮时，会将选中的牌打入到弃牌区，同时将牌放入到弃牌堆，再调用一下layout_my_cards方法。确定按钮不管选中的牌能不能打出
            $('.myzone .btns .ok').click(function(){

            });

        },
        set_$log : function(msg,color){
            var html = this.$log.html();
            if(color){
                msg = '<font color="'+color+'">'+msg+'</font>';
            }

            $('#log_tmp').show().html(msg);
            var log_tmp_height = $('#log_tmp').height();
            $('#log_tmp').html('').hide();
            var log_tmp_rows = log_tmp_height/14; //得到中间每条日志的行数

            $('#log_left_tmp').show().html(msg);
            var log_left_tmp_height = $('#log_left_tmp').height();
            $('#log_left_tmp').html('').hide();
            var log_left_tmp_rows = log_left_tmp_height/14;//得到左右两边每条日志行数

            this.$log.html(html+msg+'<br>');
            this.$log_left.html(html+msg+'<br>');
            this.$log_right.html(html+msg+'<br>');
            var log_top = this.$log.position().top;
            var log_height = this.$log.height();
            if(log_height>=84){ //84=14*(5+1),显示5行文字,line-height为14
                this.$log.css({top:log_top-14*log_tmp_rows});
            }
            var log_left_top = this.$log_left.position().top;
            var log_left_height = this.$log_left.height();
            if(log_left_height>=756){ //392*2=14*27*2,显示27行文字,line-height为14
                this.$log_left.css({top:log_left_top-14*log_left_tmp_rows});
            }

            var log_right_top = this.$log_right.position().top;
            var log_right_height = this.$log_right.height();
            if(log_right_height>=756){ //392=14*27*2,显示27行文字,line-height为14
                this.$log_right.css({top:log_right_top-14*log_left_tmp_rows});
            }
        }
    }

    sanguosha.init = function(){
        window.staff1 = new Staff();
    }
})(window,jQuery);