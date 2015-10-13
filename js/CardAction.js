//牌的动作类，按先后顺序：是否可用，是否可出（如果可用），准备出牌（如果可用并点击后，此时被点击的牌高出一头）,放弃出牌（从高出一头到回到牌区,准备出牌时点击取消或者其他手牌时），出牌（准备出牌时点击确认）
//,准备出牌时，放弃出牌时，出牌后，询问是否可用，是否可出
//装备类动作放弃出牌与出牌后的动作不完全一样
function CardAction(){
	this.name = '动作';
	this.card = null;
}
CardAction.prototype = {
	constructor : CardAction,
	can_use : function(){
		//如果可用则将所属的card类去掉disable，如果不可用则加上disable
	},
	can_out : function(){
		//如果可出则将.ok按钮去掉disable，如果不可用则加上disable
	},
	ready_to_out : function(){
		//准备出牌,【杀】这个动作会在这个时候计算攻击范围并将满足条件的座位类标红
	},
	cancel_out : function(){
		//放弃出牌，这时候需要将准备出牌时加的一些效果啥的还原
	},
	ok_out : function(){
		//成功出牌,这时需要显示牌的打出者是谁,card_manager应该有发牌堆，弃牌堆及展示堆，打出牌后先是放到展示堆（只放一次性打出的牌），在由展示堆放到弃牌堆时需要将上面的打出者名字去掉
	},
	get_name : function(){
		return this.name;
	},
	set_card : function(card){
		this.card = card;
	}
}


//杀，主动点击时，如果不是【制衡】，则会触发检查方法，该方法检查是否有满足条件的攻击对象，如果有继续等待满足条件的对象是否进一步满足出牌的条件，如果都满足了，则让确定按钮变的可用
//被动点击情况【被决斗】【被南蛮】
function Sha(){
    this.name = '杀';
}
Sha.prototype = new CardAction();
Sha.prototype.can_use = function(can_use_opt){
	//如果可用则将所属的card类去掉disable，如果不可用则加上disable
    if(can_use_opt.can_all || can_use_opt.can_sha){
    	if(can_use_opt.mabi){ //如果英雄的状态为麻木，则不能使用
    		this.card.get_div().addClass('card_disable');
    	}else{
    		this.card.get_div().removeClass('card_disable');
    	}
    }else{
    	this.card.get_div().addClass('card_disable');
    }
}

function Shan(){
    this.name = '闪';
}
Shan.prototype = new CardAction();
Shan.prototype.can_use = function(can_use_opt){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    if(can_use_opt.can_all || can_use_opt.can_shan){
        this.card.get_div().removeClass('card_disable');
    }else{
        this.card.get_div().addClass('card_disable');
    }
}

function Tao(){
    this.name = '桃';
}
Tao.prototype = new CardAction();
Tao.prototype.can_use = function(can_use_opt){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    if(can_use_opt.can_all || can_use_opt.can_tao){
        this.card.get_div().removeClass('card_disable');
    }else{
        this.card.get_div().addClass('card_disable');
    }
}

function Jiu(){
    this.name = '酒';
}
Jiu.prototype = new CardAction();
Jiu.prototype.can_use = function(can_use_opt){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    if(can_use_opt.can_all || can_use_opt.can_jiu){
        this.card.get_div().removeClass('card_disable');
    }else{
        this.card.get_div().addClass('card_disable');
    }
}


function Celue(){}
Celue.prototype = new CardAction();
Celue.prototype.can_use = function(can_use_opt){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    if(can_use_opt.can_all || can_use_opt.can_celue){
        this.card.get_div().removeClass('card_disable');
    }else{
        this.card.get_div().addClass('card_disable');
    }
}

function Juedou(){
	this.name = '决斗';
}

Juedou.prototype = new Celue();
Juedou.prototype.can_use = function(can_use_opt){
	//如果可用则将所属的card类去掉disable，如果不可用则加上disable
    //这里如何先调用一下父类中的方法，然后再继续调用自己的方法



    
}


//img_code:1杀 11火杀 12雷杀 2闪 3桃 4酒 5过河拆桥 6顺手牵羊 7无中生有 8决斗 9借刀杀人 10桃园结义 13五谷丰登 14南蛮入侵 15万箭齐发 16无懈可击 17火攻 18铁索连环 19乐不思蜀 20兵粮寸断 21闪电 26武器 23防具 24进攻马 25防守马 231白银狮子 232八卦阵 233仁王盾 234藤甲 235黄金甲 261诸葛连弩 262雌雄双股剑 263青红剑 264寒冰剑 265古锭刀 266贯石斧 267青龙偃月刀 268丈八蛇矛 269方天画戟 270朱雀羽扇 271麒麟弓 272玉玺 273金火罐炮 241绝影 242的卢 243爪黄飞电 244骅骝 251赤兔 252大宛 253紫驹

















//opt包含huase,dots,color,no这四个信息
//杀，主动点击时，如果不是【制衡】，则会触发检查方法，该方法检查是否有满足条件的攻击对象，如果有继续等待满足条件的对象是否进一步满足出牌的条件，如果都满足了，则让确定按钮变的可用
//被动点击情况【被决斗】【被南蛮】
/*function Sha(opt,$card_div){
    Card.call(this,opt,$card_div);
    this.name = '杀';
    this.img_code = 'c1';
    this.init_div();
}
Sha.prototype = new Card();
Sha.prototype.can_use = function(hero){
    //如果英雄的状态为麻木，则不能使用
    if(hero.mamu_status){
        this.$card_div.addClass('disable');
    }
}
Sha.prototype.after_up = function(){
    
}

function Huosha(opt,$card_div){
    Card.call(this,opt,$card_div);
    this.name = '火杀';
    this.img_code = 'c11';
    this.init_div();
}
Huosha.prototype = new Sha();
Huosha.prototype.can_use = function(hero){
    //如果英雄的状态为麻木，则不能使用
    if(hero.mamu_status){
        this.$card_div.addClass('disable');
    }
}

function Leisha(opt,$card_div){
    Card.call(this,opt,$card_div);
    this.name = '雷杀';
    this.img_code = 'c12';
    this.init_div();
}
Leisha.prototype = new Sha();
Leisha.prototype.can_use = function(hero){
    //如果英雄的状态为麻木，则不能使用
    if(hero.mamu_status){
        this.$card_div.addClass('disable');
    }
}


function Shan(opt,$card_div){
    Card.call(this,opt,$card_div);
    this.name = '闪';
    this.img_code = 'c2';
    this.init_div();
}
Shan.prototype = new Card();

//桃在两种情况下可用，自己血不满或者有角色濒死
function Peach(opt,$card_div){
    Card.call(this,opt,$card_div);
    this.name = '桃';
    this.img_code = 'c3';
    this.init_div();
}
Peach.prototype = new Card();
Peach.prototype.can_use = function(hero){
    if(hero.get_cur_blood() >= hero.get_max_blood()){
        this.$card_div.addClass('disable');
    }
}


function Weapon(opt,$card_div){
    Card.call(this,opt,$card_div);
    this.attack_num = 1;//武器的攻击个数，默认为1，方天画戟在最后一张牌是杀的情况下，这个数字会变成3
}
Weapon.prototype = new Card();
Weapon.prototype.get_attack_num = function(){
    return this.attack_num;
}
Weapon.prototype.set_attack_num = function(attack_num){
    this.attack_num = attack_num;
}
Weapon.prototype.use = function(seat){

}


function Yuxi(opt,$card_div){
    Weapon.call(this,opt,$card_div);
    this.name = '玉玺';
    this.img_code = 'c272';
    this.init_div();
}
Yuxi.prototype = new Weapon();
Yuxi.prototype.can_use = function(hero){
}

function Zhugeliannu(opt,$card_div){
    Weapon.call(this,opt,$card_div);
    this.name = '诸葛连弩';
    this.img_code = 'c261';
    this.init_div();
}
Zhugeliannu.prototype = new Weapon();
Zhugeliannu.prototype.can_use = function(hero){
}*/