//棋牌管理类，主要有生成棋牌,弃牌堆，洗牌，发牌等方法,如何展示牌
function CardManager(staff){
	this.staff = staff;
	this.cards = [];//游戏开始时生成的牌，发牌或摸牌时都是从这里取得
	this.drop_cards = [];//弃牌堆，在打出牌或角色死掉或判定牌判定后就会将牌放入弃牌堆
}
CardManager.prototype = {
	constructor : CardManager,
	get_cards : function(){
		return this.cards;
	},
	generate_cards : function(){
		var a_data = this.get_init_data();
		for(var i = 0,j = a_data.length;i < j;i++){
			var $card_div = this.create_div();
			var qipai = this.get_class(a_data[i],i,$card_div);
			if(qipai){
				this.cards.push(qipai);
			}
		}
	},
	create_div : function(){
		var html = '<li><div class="card no_se_card" id="cardwu">'+
						'<div class="huase"></div>'+
						'<div class="dots">G</div>'+
						'<div class="bg"></div>'+
						'<div class="name"></div>'+
						'<div class="user">孙悟空</div>'+
					'</div></li>';
		return $(html);
	},
	/*算法，根据$cards的宽度，li的个数，
		当li宽度乘以个数小于等于$cards宽度时，先为float布局，再转为absolute布局
		当大于时为absolute布局，这时候有错位，第一张牌left值不变，后面的牌left值向左错
		的位置为：(li.length*li.width-$cards.width)/(li.length-1) 
		$cards显示区的宽度*/
	show_cards : function($cards,$lis){
		var cards_width = $cards.width();
		var li_width = $lis.width();
		var li_length = $lis.length;
		if(li_width * li_length <= cards_width){
			tools.trans_to_float($lis);
			tools.trans_to_absolute($lis);
		}else{
			tools.trans_to_absolute($lis);

			var i_cuowei = (li_length * li_width - cards_width)/(li_length-1);
			var i_last_cuowei = (li_width - i_cuowei)/(li_length-1);
			tools.adjust_position($lis,i_cuowei+i_last_cuowei);
		}
	},
	layout_paiqu_cards : function($cards,$lis){//自己牌区一屏最多显示10张，加减自己牌区的牌都调用
        this.show_cards($cards,$lis);
	},
	layout_log_cards : function(){//显示区中的牌20张也是一屏显示,这个方法是点击确定将li放到log中后再调用
		var $cards = $('.log .cards');
        var $lis = $cards.find('.cardul > li');
        this.show_cards($cards,$lis);
	},
	//从牌堆中取出1张牌
	get_1_rand_card : function(){

	},
	//洗牌，将牌堆中的牌打乱
	xipai : function(){
		var tmp = this.cards;
		this.cards = [];
		for(var i = 0,j = tmp.length;i < j;i++){
			this.cards.push(tools.get_rand_from_arr(tmp)[0]);
		}
	},
	re_xipai : function(){
		console.log('这个功能需要在打出牌的功能写出后才能做...');
	},
	//每个座位类分到初始的4张牌
	fapai : function(){
		var a_seat = this.staff.get_a_seat();
		for(var i = 0,j = a_seat.length;i < j;i++){
			this.aftermepai(4,a_seat[i]);
			//如果是自己的座位，则需要将牌显示到牌区中
			var is_me = a_seat[i].get_div().hasClass('me');
			if(is_me){
				a_seat[i].cards_to_cardzone_me();
			}else{
				a_seat[i].cards_to_cardzone_computer();
			}
			
		}
	},
	aftermepai : function(num,seat){//每次摸牌后，要合并座位的pai_list并更新牌数
		seat.set_pai_list(this.get_a_pai(num));
		seat.update_div_pai_num();
	},
	//从牌堆顶部顺序取得n张牌，并返回该数组
	get_a_pai : function(n){
		var result = [];
		for(var i = 0;i < n;i++){
			var pop_card = this.cards.pop();
			if(pop_card){
				console.log('成功取出牌');
				result.push(pop_card);
				console.log('还剩'+this.cards.length+'张牌');
			}else{//如果数组为空了，这时候应该触发一个方法，将弃牌堆中的牌重新洗牌后放到this.cards中，然后再继续进行循环
				console.log('牌不够了，重新洗牌..');
				this.re_xipai();
				//i--;//相当于这次循环不算,因为没取出牌来
			}
		}
		console.log('取了'+result.length+'张牌!');
		return result;
	},
	test : function($lis){
		tools.trans_to_float($lis);
		tools.trans_to_absolute($lis);
	},
	get_class : function(opt,no,$card_div){
		var ct = opt.classtype;
		opt.no = no;
		switch(ct){
			case 1:
				return new Sha(opt,$card_div);
			case 11:
				return new Huosha(opt,$card_div);
			case 12:
				return new Leisha(opt,$card_div);
			case 2:
				return new Shan(opt,$card_div);
			case 3:
				return new Peach(opt,$card_div);
			case 272:
				return new Yuxi(opt,$card_div);
			case 271:
				return null;
			case 270:
				return null;
			case 261:
				return new Zhugeliannu(opt,$card_div);
			default:
				return null;
		}
	},
	get_init_data : function(){
		return [{huase:'heitao',dots:1,color:'black',classtype:8},
		{huase:'hongtao',dots:1,color:'red',classtype:15},
		{huase:'meihua',dots:1,color:'black',classtype:8},
		{huase:'fangpian',dots:1,color:'red',classtype:8},

		{huase:'heitao',dots:1,color:'black',classtype:21},
		{huase:'hongtao',dots:1,color:'red',classtype:10},
		{huase:'meihua',dots:1,color:'black',classtype:261},
		{huase:'fangpian',dots:1,color:'red',classtype:261},
		
		{huase:'heitao',dots:1,color:'black',classtype:265},
		{huase:'hongtao',dots:1,color:'red',classtype:16},
		{huase:'meihua',dots:1,color:'black',classtype:231},
		{huase:'fangpian',dots:1,color:'red',classtype:270},

		{huase:'heitao',dots:2,color:'black',classtype:232},
		{huase:'hongtao',dots:2,color:'red',classtype:2},
		{huase:'meihua',dots:2,color:'black',classtype:1},
		{huase:'fangpian',dots:2,color:'red',classtype:2},

		{huase:'heitao',dots:2,color:'black',classtype:262},
		{huase:'hongtao',dots:2,color:'red',classtype:2},
		{huase:'meihua',dots:2,color:'black',classtype:232},
		{huase:'fangpian',dots:2,color:'red',classtype:2},

		{huase:'heitao',dots:2,color:'black',classtype:234},
		{huase:'hongtao',dots:2,color:'red',classtype:17},
		{huase:'meihua',dots:2,color:'black',classtype:234},
		{huase:'fangpian',dots:2,color:'red',classtype:3},

		{huase:'heitao',dots:2,color:'black',classtype:264},
		{huase:'meihua',dots:2,color:'black',classtype:233},

		{huase:'heitao',dots:3,color:'black',classtype:5},
		{huase:'hongtao',dots:3,color:'red',classtype:3},
		{huase:'meihua',dots:3,color:'black',classtype:1},
		{huase:'fangpian',dots:3,color:'red',classtype:2},

		{huase:'heitao',dots:3,color:'black',classtype:6},
		{huase:'hongtao',dots:3,color:'red',classtype:13},
		{huase:'meihua',dots:3,color:'black',classtype:5},
		{huase:'fangpian',dots:3,color:'red',classtype:6},

		{huase:'heitao',dots:3,color:'black',classtype:4},
		{huase:'hongtao',dots:3,color:'red',classtype:11},
		{huase:'meihua',dots:3,color:'black',classtype:4},
		{huase:'fangpian',dots:3,color:'red',classtype:3},

		{huase:'heitao',dots:4,color:'black',classtype:5},
		{huase:'hongtao',dots:4,color:'red',classtype:3},
		{huase:'meihua',dots:4,color:'black',classtype:1},
		{huase:'fangpian',dots:4,color:'red',classtype:2},

		{huase:'heitao',dots:4,color:'black',classtype:6},
		{huase:'hongtao',dots:4,color:'red',classtype:13},
		{huase:'meihua',dots:4,color:'black',classtype:5},
		{huase:'fangpian',dots:4,color:'red',classtype:6},

		{huase:'heitao',dots:4,color:'black',classtype:12},
		{huase:'hongtao',dots:4,color:'red',classtype:17},
		{huase:'meihua',dots:4,color:'black',classtype:20},
		{huase:'fangpian',dots:4,color:'red',classtype:11},

		{huase:'heitao',dots:5,color:'black',classtype:267},
		{huase:'hongtao',dots:5,color:'red',classtype:271},
		{huase:'meihua',dots:5,color:'black',classtype:1},
		{huase:'fangpian',dots:5,color:'red',classtype:2},

		{huase:'heitao',dots:5,color:'black',classtype:241},
		{huase:'hongtao',dots:5,color:'red',classtype:251},
		{huase:'meihua',dots:5,color:'black',classtype:242},
		{huase:'fangpian',dots:5,color:'red',classtype:266},

		{huase:'heitao',dots:5,color:'black',classtype:12},
		{huase:'hongtao',dots:5,color:'red',classtype:3},
		{huase:'meihua',dots:5,color:'black',classtype:12},
		{huase:'fangpian',dots:5,color:'red',classtype:11},

		{huase:'heitao',dots:6,color:'black',classtype:19},
		{huase:'hongtao',dots:6,color:'red',classtype:3},
		{huase:'meihua',dots:6,color:'black',classtype:1},
		{huase:'fangpian',dots:6,color:'red',classtype:1},

		{huase:'heitao',dots:6,color:'black',classtype:263},
		{huase:'hongtao',dots:6,color:'red',classtype:19},
		{huase:'meihua',dots:6,color:'black',classtype:19},
		{huase:'fangpian',dots:6,color:'red',classtype:2},

		{huase:'heitao',dots:6,color:'black',classtype:12},
		{huase:'hongtao',dots:6,color:'red',classtype:3},
		{huase:'meihua',dots:6,color:'black',classtype:12},
		{huase:'fangpian',dots:6,color:'red',classtype:2},

		{huase:'heitao',dots:7,color:'black',classtype:1},
		{huase:'hongtao',dots:7,color:'red',classtype:3},
		{huase:'meihua',dots:7,color:'black',classtype:1},
		{huase:'fangpian',dots:7,color:'red',classtype:1},

		{huase:'heitao',dots:7,color:'black',classtype:14},
		{huase:'hongtao',dots:7,color:'red',classtype:7},
		{huase:'meihua',dots:7,color:'black',classtype:14},
		{huase:'fangpian',dots:7,color:'red',classtype:2},

		{huase:'heitao',dots:7,color:'black',classtype:12},
		{huase:'hongtao',dots:7,color:'red',classtype:11},
		{huase:'meihua',dots:7,color:'black',classtype:12},
		{huase:'fangpian',dots:7,color:'red',classtype:2},

		{huase:'heitao',dots:8,color:'black',classtype:1},
		{huase:'hongtao',dots:8,color:'red',classtype:3},
		{huase:'meihua',dots:8,color:'black',classtype:1},
		{huase:'fangpian',dots:8,color:'red',classtype:1},

		{huase:'heitao',dots:8,color:'black',classtype:1},
		{huase:'hongtao',dots:8,color:'red',classtype:7},
		{huase:'meihua',dots:8,color:'black',classtype:1},
		{huase:'fangpian',dots:8,color:'red',classtype:2},

		{huase:'heitao',dots:8,color:'black',classtype:12},
		{huase:'hongtao',dots:8,color:'red',classtype:2},
		{huase:'meihua',dots:8,color:'black',classtype:12},
		{huase:'fangpian',dots:8,color:'red',classtype:2},

		{huase:'heitao',dots:9,color:'black',classtype:1},
		{huase:'hongtao',dots:9,color:'red',classtype:3},
		{huase:'meihua',dots:9,color:'black',classtype:1},
		{huase:'fangpian',dots:9,color:'red',classtype:1},

		{huase:'heitao',dots:9,color:'black',classtype:1},
		{huase:'hongtao',dots:9,color:'red',classtype:7},
		{huase:'meihua',dots:9,color:'black',classtype:1},
		{huase:'fangpian',dots:9,color:'red',classtype:2},

		{huase:'heitao',dots:9,color:'black',classtype:4},
		{huase:'hongtao',dots:9,color:'red',classtype:2},
		{huase:'meihua',dots:9,color:'black',classtype:4},
		{huase:'fangpian',dots:9,color:'red',classtype:4},

		{huase:'heitao',dots:10,color:'black',classtype:1},
		{huase:'hongtao',dots:10,color:'red',classtype:1},
		{huase:'meihua',dots:10,color:'black',classtype:1},
		{huase:'fangpian',dots:10,color:'red',classtype:1},

		{huase:'heitao',dots:10,color:'black',classtype:1},
		{huase:'hongtao',dots:10,color:'red',classtype:1},
		{huase:'meihua',dots:10,color:'black',classtype:1},
		{huase:'fangpian',dots:10,color:'red',classtype:2},

		{huase:'heitao',dots:10,color:'black',classtype:20},
		{huase:'hongtao',dots:10,color:'red',classtype:11},
		{huase:'meihua',dots:10,color:'black',classtype:18},
		{huase:'fangpian',dots:10,color:'red',classtype:2},

		{huase:'heitao',dots:11,color:'black',classtype:6},
		{huase:'hongtao',dots:11,color:'red',classtype:1},
		{huase:'meihua',dots:11,color:'black',classtype:1},
		{huase:'fangpian',dots:11,color:'red',classtype:2},

		{huase:'heitao',dots:11,color:'black',classtype:16},
		{huase:'hongtao',dots:11,color:'red',classtype:7},
		{huase:'meihua',dots:11,color:'black',classtype:1},
		{huase:'fangpian',dots:11,color:'red',classtype:2},

		{huase:'heitao',dots:11,color:'black',classtype:18},
		{huase:'hongtao',dots:11,color:'red',classtype:2},
		{huase:'meihua',dots:11,color:'black',classtype:18},
		{huase:'fangpian',dots:11,color:'red',classtype:2},

		{huase:'heitao',dots:12,color:'black',classtype:5},
		{huase:'hongtao',dots:12,color:'red',classtype:3},
		{huase:'meihua',dots:12,color:'black',classtype:9},
		{huase:'fangpian',dots:12,color:'red',classtype:3},

		{huase:'heitao',dots:12,color:'black',classtype:268},
		{huase:'hongtao',dots:12,color:'red',classtype:5},
		{huase:'meihua',dots:12,color:'black',classtype:16},
		{huase:'fangpian',dots:12,color:'red',classtype:269},

		{huase:'heitao',dots:12,color:'black',classtype:18},
		{huase:'hongtao',dots:12,color:'red',classtype:2},
		{huase:'meihua',dots:12,color:'black',classtype:18},
		{huase:'fangpian',dots:12,color:'red',classtype:17},

		{huase:'hongtao',dots:12,color:'red',classtype:21},
		{huase:'fangpian',dots:12,color:'red',classtype:16},

		{huase:'heitao',dots:13,color:'black',classtype:14},
		{huase:'hongtao',dots:13,color:'red',classtype:2},
		{huase:'meihua',dots:13,color:'black',classtype:9},
		{huase:'fangpian',dots:13,color:'red',classtype:1},

		{huase:'heitao',dots:13,color:'black',classtype:252},
		{huase:'hongtao',dots:13,color:'red',classtype:243},
		{huase:'meihua',dots:13,color:'black',classtype:16},
		{huase:'fangpian',dots:13,color:'red',classtype:253},

		{huase:'heitao',dots:13,color:'black',classtype:16},
		{huase:'hongtao',dots:13,color:'red',classtype:16},
		{huase:'meihua',dots:13,color:'black',classtype:18},
		{huase:'fangpian',dots:13,color:'red',classtype:244}

		];
		//classtype:1杀 11火杀 12雷杀 2闪 3桃 4酒 5过河拆桥 6顺手牵羊 7无中生有 8决斗 9借刀杀人 10桃园结义 13五谷丰登 14南蛮入侵 15万箭齐发 16无懈可击 17火攻 18铁索连环 19乐不思蜀 20兵粮寸断 21闪电 26武器 23防具 24进攻马 25防守马 231白银狮子 232八卦阵 233仁王盾 234藤甲 235黄金甲 261诸葛连弩 262雌雄双股剑 263青红剑 264寒冰剑 265古锭刀 266贯石斧 267青龙偃月刀 268丈八蛇矛 269方天画戟 270朱雀羽扇 271麒麟弓 272玉玺 273金火罐炮 241绝影 242的卢 243爪黄飞电 244骅骝 251赤兔 252大宛 253紫驹
	}
}