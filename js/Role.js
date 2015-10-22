//角色：主公（游戏的关键，成功与否的标志），忠臣，反贼，内奸，角色类会控制怎样杀来杀去
//座位类中有判定区，即（乐不思蜀，兵粮寸断，闪电），在开始，判定，摸牌，出牌，弃牌各阶段切换时用于判定
//座位中再加入装备区
//应该加一个座位类，座位类中有角色
function Role(name,flag,code){
    this.name = name;
    this.flag = flag;
    this.code = code;
    this.seat = null;
}
Role.prototype = {
    constructor : Role,
    get_name : function(){
        return this.name;
    },
    get_flag : function(){
        return this.flag;
    },
    get_code : function(){
        return this.code;
    },
    get_seat : function(){
        return this.seat;
    },
    set_seat : function(seat){
        this.seat = seat;
    },
    chupai : function(fn){
        var _this = this;
        //this.seat.get_pai_list()[0].get_div().addClass('ready_to_out');//模拟自动出牌
        console.log('角色出牌过程....');
        //如果有杀，则用杀来杀我，如果没有则出第一张牌
        setTimeout(function(){
            console.log('-------------1');
            var card = _this.seat.get_card_by_name('杀');
            if(!card){
                card = _this.seat.get_pai_list()[0];//模拟自动出牌
            }
            card.get_div().addClass('ready_to_out');
            _this.seat.set_ready_to_out_list([card]);
            //card(杀).get_div().addClass('ready_to_out');
            //这里也不用判断我能不能被他们杀到，以后再判断
            var $myseat = $('.myzone .seat');
            var index = $('.seat').index($myseat);  //这里的这个$(this)代表我自己的seat
            //$myseat.addClass('attack_selected');
            _this.seat.selected_attack_seats_fn(index,$myseat);

            _this.seat.chu_pai();//角色来出牌
            setTimeout(function(){
                console.log('-------------2');
                fn&&fn();
            },3000);
        },5000);
            
    },
    defense : function(){
        console.log('座位角色的防御方法...');
    }
}

function Zhugong(){
    Role.call(this,'主公','主',1);
}
Zhugong.prototype = new Role();
function Zhongchen(){
    Role.call(this,'忠臣','忠',2);
}
Zhongchen.prototype = new Role();
function Neijian(){
    Role.call(this,'内奸','内',3);
}
Neijian.prototype = new Role();
function Fanze(){
    Role.call(this,'反贼','反',4);
}
Fanze.prototype = new Role();