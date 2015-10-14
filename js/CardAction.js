//牌的动作类，按先后顺序：是否可用，是否可出（如果可用），准备出牌（如果可用并点击后，此时被点击的牌高出一头）,放弃出牌（从高出一头到回到牌区,准备出牌时点击取消或者其他手牌时），出牌（准备出牌时点击确认）
//,准备出牌时，放弃出牌时，出牌后，询问是否可用，是否可出
//装备类动作放弃出牌与出牌后的动作不完全一样

//玉玺，金火罐炮，黄金甲，李广之弓，流星锤，吕布之弓  没有

/*can_use_opt包含的属性可能为:
    can_all:代表所有牌可用
    can_base:代表杀，闪，桃，酒可用
    can_celue:代表策略牌可用,查找禁用状态,李广之弓杀中后状态
    can_zhuangbei:代表装备牌可用
    can_zuoji:代表坐骑牌可用
    can_weapon:代表武器牌可用
    can_fangju:代表防具牌可用
    can_sha:代表杀可用,查找麻木状态,吕布之弓杀中后状态
    can_shan:代表闪可用(这里自己可以定义一个迟钝状态，有这个状态则不能用闪)
    can_tao:代表桃可用,当前血量小于最大血量或者有角色濒临死亡时可用，角色濒临死亡的状态放在staff类中，当英雄掉血为小于等于0时会改变这个值，当英雄吃桃或喝酒后血量大于1时也改变该值，适当的时候会调用方法this.staff.get_card_manager().cards_can_use({can_tao:true});//判断牌是否可用
    can_jiu:代表酒可用,酒可以多喝，每喝一次，要么回复一滴血（一回合只能回复一次，在适当的时候），要么攻击值加1
    heimu:代表是否有黑幕技能
*/
function CardAction(){
	this.name = '动作';
	this.card = null;
}
CardAction.prototype = {
	constructor : CardAction,
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
	},


    can_use : function(can_use_opt){
        //如果可用则将所属的card类去掉disable，如果不可用则加上disable
        this.can_use_opt = can_use_opt || {};
        this.can_all();
            this.can_base();
            this.can_celue();
            this.can_zhuangbei();
                this.can_zhuangbei_son();//武器，防具，驴
                this.can_danpai();
                this.can_jineng();//最后还要看看技能判断情况，例如贾诩不能使用黑闪
    },
    can_all : function(){
        //如果可用则将所属的card类去掉disable，如果不可用则加上disable
        console.log('CardAction根类中的can_all');
        if(this.can_use_opt.can_all!=undefined){
            if(this.can_use_opt.can_all){
                console.log('CardAction根类中的can_all  true');
                this.card.get_div().removeClass('card_disable');
            }else{
                console.log('CardAction根类中的can_all  false');
                this.card.get_div().addClass('card_disable');
            }
        }
    },
    can_base : function(){
        console.log('CardAction根类中的can_base');
    },
    can_celue : function(){
        console.log('CardAction根类中的can_celue');
    },
    can_zhuangbei : function(){
        console.log('CardAction根类中的can_zhuangbei');
    },
    can_zhuangbei_son : function(){
        console.log('CardAction根类中的can_zhuangbei_son');
    },
    can_danpai : function(){
        console.log('CardAction根类中的can_danpai');
    },
    can_jineng : function(){
        console.log('CardAction根类中的can_jineng');
    }
}


function Celue(){
    this.can_use_opt = null;
}
Celue.prototype = new CardAction();
Celue.prototype.can_celue = function(){
    console.log('策略类中的can_celue');//如果有禁言，则不能用
    if(this.can_use_opt.can_celue!=undefined){
        if(this.can_use_opt.can_celue){
            console.log('策略类中的can_celue true');
            this.card.get_div().removeClass('card_disable');
        }else{
            console.log('策略类中的can_celue false');
            this.card.get_div().addClass('card_disable');
        }
    }
}


function Base(){}
Base.prototype = new CardAction();
Base.prototype.can_base = function(){
    console.log('基础牌类中的can_base');
    if(this.can_use_opt.can_base!=undefined){
        if(this.can_use_opt.can_base){
            console.log('基础牌类中的can_base true');
            this.card.get_div().removeClass('card_disable');
        }else{
            console.log('基础牌类中的can_base false');
            this.card.get_div().addClass('card_disable');
        }
    }
}


//杀，主动点击时，如果不是【制衡】，则会触发检查方法，该方法检查是否有满足条件的攻击对象，如果有继续等待满足条件的对象是否进一步满足出牌的条件，如果都满足了，则让确定按钮变的可用
//被动点击情况【被决斗】【被南蛮】
function Sha(){
    this.name = '杀';
}
Sha.prototype = new Base();
Sha.prototype.can_danpai = function(){
	//如果可用则将所属的card类去掉disable，如果不可用则加上disable
    if(this.can_use_opt.can_sha!=undefined){
        if(this.can_use_opt.can_sha){
            console.log('【'+this.name+'】类中的can_danpai  true');
            this.card.get_div().removeClass('card_disable');
            /*if(this.can_use_opt.mabi){ //如果英雄的状态为麻木，则不能使用,这个麻木状态应该是自己求得
                this.card.get_div().addClass('card_disable');
            }else{
                this.card.get_div().removeClass('card_disable');
            }*/
        }else{
            console.log('【'+this.name+'】类中的can_danpai  false');
            this.card.get_div().addClass('card_disable');
        }
    }
}

function Huosha(){
    this.name = '火杀';
}
Huosha.prototype = new Sha();

function Leisha(){
    this.name = '雷杀';
}
Leisha.prototype = new Sha();


function Shan(){
    this.name = '闪';
}
Shan.prototype = new CardAction();
Shan.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    if(this.can_use_opt.can_shan!=undefined){
        if(this.can_use_opt.can_shan){
            console.log('【闪】类中的can_danpai  true');
            this.card.get_div().removeClass('card_disable');
        }else{
            console.log('【闪】类中的can_danpai  false');
            this.card.get_div().addClass('card_disable');
        }
    }
}

function Tao(){
    this.name = '桃';
}
Tao.prototype = new CardAction();
Tao.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    if(this.can_use_opt.can_tao!=undefined){
        //如果自己英雄的当前血量小于最大血量，可以用，如果有角色濒死状态，则可用
        if(this.can_use_opt.can_tao){
            console.log('【桃】类中的can_danpai  true');
            this.card.get_div().removeClass('card_disable');
        }else{
            console.log('【桃】类中的can_danpai  false');
            this.card.get_div().addClass('card_disable');
        }
    }
}

function Jiu(){
    this.name = '酒';
}
Jiu.prototype = new CardAction();
Jiu.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    if(this.can_use_opt.can_jiu!=undefined){
        if(this.can_use_opt.can_jiu){
            console.log('【酒】类中的can_danpai  true');
            this.card.get_div().removeClass('card_disable');
        }else{
            console.log('【酒】类中的can_danpai  false');
            this.card.get_div().addClass('card_disable');
        }
    }
}


//-------------------------------------------------------------------------策略类---start-------

function Juedou(){
	this.name = '决斗';
}

Juedou.prototype = new Celue();
Juedou.prototype.can_danpai = function(){
	//如果可用则将所属的card类去掉disable，如果不可用则加上disable
    console.log('【决斗】类中的can_danpai');
}

function Shandian(){
    this.name = '闪电';
}
Shandian.prototype = new Celue();
Shandian.prototype.can_danpai = function(){
    //如果是黑色，并且是黑幕技能，则不能使用
    console.log('【闪电】类中的can_danpai');
    //牌色及是否黑幕技能自己取得
    /*if(this.can_use_opt.heimu&&!this.card.is_red()){
        this.card.get_div().removeClass('card_disable');
    }else{
        this.card.get_div().addClass('card_disable');
    }*/
}

function Guohechaiqiao(){
    this.name = '过河拆桥';
}
Guohechaiqiao.prototype = new Celue();
Guohechaiqiao.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    console.log('【过河拆桥】类中的can_danpai');
}

function Shunshouqianyang(){
    this.name = '顺手牵羊';
}
Shunshouqianyang.prototype = new Celue();
Shunshouqianyang.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    console.log('【顺手牵羊】类中的can_danpai');
}

function Wuzhongshengyou(){
    this.name = '无中生有';
}
Wuzhongshengyou.prototype = new Celue();
Wuzhongshengyou.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    console.log('【无中生有】类中的can_danpai');
}

function Jiedaosharen(){
    this.name = '借刀杀人';
}
Jiedaosharen.prototype = new Celue();
Jiedaosharen.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    console.log('【借刀杀人】类中的can_danpai');
}



function Taoyuanjieyi(){
    this.name = '桃园结义';
}
Taoyuanjieyi.prototype = new Celue();
Taoyuanjieyi.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    console.log('【桃园结义】类中的can_danpai');
}

function Wugufengdeng(){
    this.name = '五谷丰登';
}
Wugufengdeng.prototype = new Celue();
Wugufengdeng.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    console.log('【五谷丰登】类中的can_danpai');
}

function Nanmanruqin(){
    this.name = '南蛮入侵';
}
Nanmanruqin.prototype = new Celue();
Nanmanruqin.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    console.log('【南蛮入侵】类中的can_danpai');
}

function Wanjianqifa(){
    this.name = '万箭齐发';
}
Wanjianqifa.prototype = new Celue();
Wanjianqifa.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    console.log('【万箭齐发】类中的can_danpai');
}

function Wuxiekeji(){
    this.name = '无懈可击';
}
Wuxiekeji.prototype = new Celue();
Wuxiekeji.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    console.log('【无懈可击】类中的can_danpai');
    if(this.can_use_opt.can_wuxiekeji!=undefined){
        if(this.can_use_opt.can_wuxiekeji){
            console.log('【无懈可击】类中的can_danpai true');
            this.card.get_div().removeClass('card_disable');
        }else{
            console.log('【无懈可击】类中的can_danpai false');
            this.card.get_div().addClass('card_disable');
        }
    } 
}

function Huogong(){
    this.name = '火攻';
}
Huogong.prototype = new Celue();
Huogong.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    console.log('【火攻】类中的can_danpai');
}

function Tiesuolianhuan(){
    this.name = '铁索连环';
}
Tiesuolianhuan.prototype = new Celue();
Tiesuolianhuan.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    console.log('【铁索连环】类中的can_danpai');
}

function Lebusishu(){
    this.name = '乐不思蜀';
}
Lebusishu.prototype = new Celue();
Lebusishu.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    console.log('【乐不思蜀】类中的can_danpai');
}

function Bingliangcunduan(){
    this.name = '兵粮寸断';
}
Bingliangcunduan.prototype = new Celue();
Bingliangcunduan.prototype.can_danpai = function(){
    //如果可用则将所属的card类去掉disable，如果不可用则加上disable
    console.log('【兵粮寸断】类中的can_danpai');
}

//--------------------------------------策略类--------end-----------------------------------------


function Zhuangbei(){}
Zhuangbei.prototype = new CardAction();
Zhuangbei.prototype.can_zhuangbei = function(){
    console.log('【装备】类中的can_zhuangbei');
    if(this.can_use_opt.can_zhuangbei!=undefined){
        if(this.can_use_opt.can_zhuangbei){
            console.log('【装备】类中的can_zhuangbei true');
            this.card.get_div().removeClass('card_disable');
        }else{
            console.log('【装备】类中的can_zhuangbei false');
            this.card.get_div().addClass('card_disable');
        }
    } 
}

function Fangju(){}
Fangju.prototype = new Zhuangbei();
Fangju.prototype.can_zhuangbei_son = function(){
    console.log('【防具】类中的can_zhuangbei_son');
    if(this.can_use_opt.can_fangju!=undefined){
        if(this.can_use_opt.can_fangju){
            console.log('【防具】类中的can_zhuangbei_son true');
            this.card.get_div().removeClass('card_disable');
        }else{
            console.log('【防具】类中的can_zhuangbei_son false');
            this.card.get_div().addClass('card_disable');
        }
    }
}


function Baiyinshizi(){
    this.name = '白银狮子';
}
Baiyinshizi.prototype = new Fangju();


function Baguazhen(){
    this.name = '八卦阵';
}
Baguazhen.prototype = new Fangju();

function Renwangdun(){
    this.name = '仁王盾';
}
Renwangdun.prototype = new Fangju();

function Tengjia(){
    this.name = '藤甲';
}
Tengjia.prototype = new Fangju();

function Huangjinjia(){
    this.name = '黄金甲';
}
Huangjinjia.prototype = new Fangju();

function Weapon(){}
Weapon.prototype = new Zhuangbei();
Weapon.prototype.can_zhuangbei_son = function(){
    console.log('【武器】类中的can_zhuangbei_son');
    if(this.can_use_opt.can_weapon!=undefined){
        if(this.can_use_opt.can_weapon){
            console.log('【武器】类中的can_zhuangbei_son true');
            this.card.get_div().removeClass('card_disable');
        }else{
            console.log('【武器】类中的can_zhuangbei_son false');
            this.card.get_div().addClass('card_disable');
        }
    }
}

function Zhugeliannu(){
    this.name = '诸葛连弩';
}
Zhugeliannu.prototype = new Weapon();

function Cixiongshuanggujian(){
    this.name = '雌雄双股剑';
}
Cixiongshuanggujian.prototype = new Weapon();

function Qinghongjian(){
    this.name = '青红剑';
}
Qinghongjian.prototype = new Weapon();

function Hanbingjian(){
    this.name = '寒冰剑';
}
Hanbingjian.prototype = new Weapon();

function Gudingdao(){
    this.name = '古锭刀';
}
Gudingdao.prototype = new Weapon();

function Guanshifu(){
    this.name = '贯石斧';
}
Guanshifu.prototype = new Weapon();

function Qinglongyanyuedao(){
    this.name = '青龙偃月刀';
}
Qinglongyanyuedao.prototype = new Weapon();

function Zhangbashemao(){
    this.name = '丈八蛇矛';
}
Zhangbashemao.prototype = new Weapon();

function Fangtianhuaji(){
    this.name = '方天画戟';
}
Fangtianhuaji.prototype = new Weapon();

function Zhuqueyushan(){
    this.name = '朱雀羽扇';
}
Zhuqueyushan.prototype = new Weapon();

function Qilingong(){
    this.name = '麒麟弓';
}
Qilingong.prototype = new Weapon();

function Yuxi(){
    this.name = '玉玺';
}
Yuxi.prototype = new Weapon();
function Jinguanhuopao(){
    this.name = '金火罐炮';
}
Jinguanhuopao.prototype = new Weapon();

function Zuoji(){}
Zuoji.prototype = new Zhuangbei();
Zuoji.prototype.can_zhuangbei_son = function(){
    console.log('【坐骑】类中的can_zhuangbei_son');
    if(this.can_use_opt.can_zuoji!=undefined){
        if(this.can_use_opt.can_zuoji){
            console.log('【坐骑】类中的can_zhuangbei_son true');
            this.card.get_div().removeClass('card_disable');
        }else{
            console.log('【坐骑】类中的can_zhuangbei_son false');
            this.card.get_div().addClass('card_disable');
        }
    }
}

function Jueying(){
    this.name = '绝影';
}
Jueying.prototype = new Zuoji();

function Dilu(){
    this.name = '的卢';
}
Dilu.prototype = new Zuoji();

function Zhuahuangfeidian(){
    this.name = '爪黄飞电';
}
Zhuahuangfeidian.prototype = new Zuoji();

function Hualiu(){
    this.name = '骅骝';
}
Hualiu.prototype = new Zuoji();

function Chitu(){
    this.name = '赤兔';
}
Chitu.prototype = new Zuoji();

function Dawan(){
    this.name = '大宛';
}
Dawan.prototype = new Zuoji();

function Ziju(){
    this.name = '紫驹';
}
Ziju.prototype = new Zuoji();