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
    chupai : function(){
        this.seat.get_pai_list()[0].get_div().addClass('ready_to_out');//模拟自动出牌
        console.log('角色出牌过程....');
        this.seat.chu_pai();//角色来出牌
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