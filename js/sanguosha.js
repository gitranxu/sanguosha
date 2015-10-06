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
        this.init();
    }
    Staff.prototype = {
        constructor : Staff,
        init : function(){
            //随机分配角色
            this.set_roles_rand();
            //console.log(this.a_o_roles);
            this.assign_role();
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
        action : function(){
            console.log(this.name+'在行动...');
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




    sanguosha.init = function(){
        new Staff();
    }
})(window,jQuery);