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
	get_drop_cards : function(){
		return this.drop_cards;
	},
	generate_cards : function(){
		var a_data = this.get_init_data();
		for(var i = 0,j = a_data.length;i < j;i++){
			var $card_div = this.create_div();
			a_data[i].set_div($card_div);
			this.cards.push(a_data[i]);
		}
	},
	create_div : function(){
		var html = '<li><div class="bg3"></div><div class="card" id="cardwu">'+
						'<div class="huase_show"><img src="" alt=""></div>'+
						'<div class="dots_show">G</div>'+
						'<div class="bg"></div>'+
						'<div class="name"></div>'+
						'<div class="user"></div>'+
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
		tools.trans_to_float($lis);
		tools.trans_to_absolute($lis);
		if(li_width * li_length > cards_width){
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

	//洗牌，将牌堆中的牌打乱，同时将牌的所属英雄名去掉
	xipai : function(){
		var tmp = this.cards;
		this.cards = [];
		for(var i = 0,j = tmp.length;i < j;i++){
			var card = tools.get_rand_from_arr(tmp)[0];
			card.remove_hero_name();
			this.cards.push(card);
		}
	},
	re_xipai : function(){
		console.log('这个功能需要在打出牌的功能写出后才能做...');
	},
	//每个座位类分到初始的4张牌
	fapai : function(){
		var a_seat = this.staff.get_a_seat();
		for(var i = 0,j = a_seat.length;i < j;i++){
			this.aftermepai(8,a_seat[i]);
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
		this.update_div_pai_count();//更新剩余的牌数
	},
	update_div_pai_count : function(){
		$('#leave_pai_num').text(this.cards.length);
		//console.log('剩余'+this.cards.length+'张牌');
	},
	//从牌堆顶部顺序取得n张牌，并返回该数组
	get_a_pai : function(n){
		var result = [];
		for(var i = 0;i < n;i++){
			var pop_card = this.cards.pop();
			pop_card.set_staff(this.staff);
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
	cards_can_use : function(opt){
		var mabi = true;
		var pai_list = this.staff.get_cur_seat().get_pai_list();
		for(var i = 0,j = pai_list.length;i < j;i++){
			pai_list[i].get_card_action().can_use(opt);
		}
	},
	test : function($lis){
		tools.trans_to_float($lis);
		tools.trans_to_absolute($lis);
	},
	/*get_class : function(opt,no,$card_div){
		var ct = opt.img_code;
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
	},*/
	get_init_data : function(){
		return [new Card({huase_show:'heitao',dots_show:1,color:'black',img_code:8},new Juedou()),
		new Card({huase_show:'hongtao',dots_show:1,color:'red',img_code:15},new Wanjianqifa()),
		new Card({huase_show:'meihua',dots_show:1,color:'black',img_code:8},new Juedou()),
		new Card({huase_show:'fangkuai',dots_show:1,color:'red',img_code:8},new Juedou()),

		new Card({huase_show:'heitao',dots_show:1,color:'black',img_code:21},new Shandian()),
		new Card({huase_show:'hongtao',dots_show:1,color:'red',img_code:10},new Taoyuanjieyi()),
		new Card({huase_show:'meihua',dots_show:1,color:'black',img_code:261},new Zhugeliannu()),
		new Card({huase_show:'fangkuai',dots_show:1,color:'red',img_code:261},new Zhugeliannu()),
		
		new Card({huase_show:'heitao',dots_show:1,color:'black',img_code:265},new Gudingdao()),
		new Card({huase_show:'hongtao',dots_show:1,color:'red',img_code:16},new Wuxiekeji()),
		new Card({huase_show:'meihua',dots_show:1,color:'black',img_code:231},new Baiyinshizi()),
		new Card({huase_show:'fangkuai',dots_show:1,color:'red',img_code:270},new Zhuqueyushan()),

		new Card({huase_show:'heitao',dots_show:2,color:'black',img_code:232},new Baguazhen()),
		new Card({huase_show:'hongtao',dots_show:2,color:'red',img_code:2},new Shan()),
		new Card({huase_show:'meihua',dots_show:2,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'fangkuai',dots_show:2,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:2,color:'black',img_code:262},new Cixiongshuanggujian()),
		new Card({huase_show:'hongtao',dots_show:2,color:'red',img_code:2},new Shan()),
		new Card({huase_show:'meihua',dots_show:2,color:'black',img_code:232},new Baguazhen()),
		new Card({huase_show:'fangkuai',dots_show:2,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:2,color:'black',img_code:234},new Tengjia()),
		new Card({huase_show:'hongtao',dots_show:2,color:'red',img_code:17},new Huogong()),
		new Card({huase_show:'meihua',dots_show:2,color:'black',img_code:234},new Tengjia()),
		new Card({huase_show:'fangkuai',dots_show:2,color:'red',img_code:3},new Tao()),

		new Card({huase_show:'heitao',dots_show:2,color:'black',img_code:264},new Hanbingjian()),
		new Card({huase_show:'meihua',dots_show:2,color:'black',img_code:233},new Renwangdun()),

		new Card({huase_show:'heitao',dots_show:3,color:'black',img_code:5},new Guohechaiqiao()),
		new Card({huase_show:'hongtao',dots_show:3,color:'red',img_code:3},new Tao()),
		new Card({huase_show:'meihua',dots_show:3,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'fangkuai',dots_show:3,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:3,color:'black',img_code:6},new Shunshouqianyang()),
		new Card({huase_show:'hongtao',dots_show:3,color:'red',img_code:13},new Wugufengdeng()),
		new Card({huase_show:'meihua',dots_show:3,color:'black',img_code:5},new Guohechaiqiao()),
		new Card({huase_show:'fangkuai',dots_show:3,color:'red',img_code:6},new Shunshouqianyang()),
		new Card({huase_show:'heitao',dots_show:3,color:'black',img_code:4},new Jiu()),
		new Card({huase_show:'hongtao',dots_show:3,color:'red',img_code:11},new Huosha()),
		new Card({huase_show:'meihua',dots_show:3,color:'black',img_code:4},new Jiu()),
		new Card({huase_show:'fangkuai',dots_show:3,color:'red',img_code:3},new Tao()),

		new Card({huase_show:'heitao',dots_show:4,color:'black',img_code:5},new Guohechaiqiao()),
		new Card({huase_show:'hongtao',dots_show:4,color:'red',img_code:3},new Tao()),
		new Card({huase_show:'meihua',dots_show:4,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'fangkuai',dots_show:4,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:4,color:'black',img_code:6},new Shunshouqianyang()),
		new Card({huase_show:'hongtao',dots_show:4,color:'red',img_code:13},new Wugufengdeng()),
		new Card({huase_show:'meihua',dots_show:4,color:'black',img_code:5},new Guohechaiqiao()),
		new Card({huase_show:'fangkuai',dots_show:4,color:'red',img_code:6},new Shunshouqianyang()),

		new Card({huase_show:'heitao',dots_show:4,color:'black',img_code:12},new Leisha()),
		new Card({huase_show:'hongtao',dots_show:4,color:'red',img_code:17},new Huogong()),
		new Card({huase_show:'meihua',dots_show:4,color:'black',img_code:20},new Bingliangcunduan()),
		new Card({huase_show:'fangkuai',dots_show:4,color:'red',img_code:11},new Huosha()),

		new Card({huase_show:'heitao',dots_show:5,color:'black',img_code:267},new Qinglongyanyuedao()),
		new Card({huase_show:'hongtao',dots_show:5,color:'red',img_code:271},new Qilingong()),
		new Card({huase_show:'meihua',dots_show:5,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'fangkuai',dots_show:5,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:5,color:'black',img_code:241},new Jueying()),
		new Card({huase_show:'hongtao',dots_show:5,color:'red',img_code:251},new Chitu()),
		new Card({huase_show:'meihua',dots_show:5,color:'black',img_code:242},new Dilu()),
		new Card({huase_show:'fangkuai',dots_show:5,color:'red',img_code:266},new Guanshifu()),

		new Card({huase_show:'heitao',dots_show:5,color:'black',img_code:12},new Leisha()),
		new Card({huase_show:'hongtao',dots_show:5,color:'red',img_code:3},new Tao()),
		new Card({huase_show:'meihua',dots_show:5,color:'black',img_code:12},new Leisha()),
		new Card({huase_show:'fangkuai',dots_show:5,color:'red',img_code:11},new Huosha()),

		new Card({huase_show:'heitao',dots_show:6,color:'black',img_code:19},new Lebusishu()),
		new Card({huase_show:'hongtao',dots_show:6,color:'red',img_code:3},new Tao()),
		new Card({huase_show:'meihua',dots_show:6,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'fangkuai',dots_show:6,color:'red',img_code:1},new Sha()),

		new Card({huase_show:'heitao',dots_show:6,color:'black',img_code:263},new Qinghongjian()),
		new Card({huase_show:'hongtao',dots_show:6,color:'red',img_code:19},new Lebusishu()),
		new Card({huase_show:'meihua',dots_show:6,color:'black',img_code:19},new Lebusishu()),
		new Card({huase_show:'fangkuai',dots_show:6,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:6,color:'black',img_code:12},new Leisha()),
		new Card({huase_show:'hongtao',dots_show:6,color:'red',img_code:3},new Tao()),
		new Card({huase_show:'meihua',dots_show:6,color:'black',img_code:12},new Leisha()),
		new Card({huase_show:'fangkuai',dots_show:6,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:7,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'hongtao',dots_show:7,color:'red',img_code:3},new Tao()),
		new Card({huase_show:'meihua',dots_show:7,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'fangkuai',dots_show:7,color:'red',img_code:1},new Sha()),

		new Card({huase_show:'heitao',dots_show:7,color:'black',img_code:14},new Nanmanruqin()),
		new Card({huase_show:'hongtao',dots_show:7,color:'red',img_code:7},new Wuzhongshengyou()),
		new Card({huase_show:'meihua',dots_show:7,color:'black',img_code:14},new Nanmanruqin()),
		new Card({huase_show:'fangkuai',dots_show:7,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:7,color:'black',img_code:12},new Leisha()),
		new Card({huase_show:'hongtao',dots_show:7,color:'red',img_code:11},new Huosha()),
		new Card({huase_show:'meihua',dots_show:7,color:'black',img_code:12},new Leisha()),
		new Card({huase_show:'fangkuai',dots_show:7,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:8,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'hongtao',dots_show:8,color:'red',img_code:3},new Tao()),
		new Card({huase_show:'meihua',dots_show:8,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'fangkuai',dots_show:8,color:'red',img_code:1},new Sha()),

		new Card({huase_show:'heitao',dots_show:8,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'hongtao',dots_show:8,color:'red',img_code:7},new Wuzhongshengyou()),
		new Card({huase_show:'meihua',dots_show:8,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'fangkuai',dots_show:8,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:8,color:'black',img_code:12},new Leisha()),
		new Card({huase_show:'hongtao',dots_show:8,color:'red',img_code:2},new Shan()),
		new Card({huase_show:'meihua',dots_show:8,color:'black',img_code:12},new Leisha()),
		new Card({huase_show:'fangkuai',dots_show:8,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:9,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'hongtao',dots_show:9,color:'red',img_code:3},new Tao()),
		new Card({huase_show:'meihua',dots_show:9,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'fangkuai',dots_show:9,color:'red',img_code:1},new Sha()),

		new Card({huase_show:'heitao',dots_show:9,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'hongtao',dots_show:9,color:'red',img_code:7},new Wuzhongshengyou()),
		new Card({huase_show:'meihua',dots_show:9,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'fangkuai',dots_show:9,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:9,color:'black',img_code:4},new Jiu()),
		new Card({huase_show:'hongtao',dots_show:9,color:'red',img_code:2},new Shan()),
		new Card({huase_show:'meihua',dots_show:9,color:'black',img_code:4},new Jiu()),
		new Card({huase_show:'fangkuai',dots_show:9,color:'red',img_code:4},new Jiu()),

		new Card({huase_show:'heitao',dots_show:10,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'hongtao',dots_show:10,color:'red',img_code:1},new Sha()),
		new Card({huase_show:'meihua',dots_show:10,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'fangkuai',dots_show:10,color:'red',img_code:1},new Sha()),

		new Card({huase_show:'heitao',dots_show:10,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'hongtao',dots_show:10,color:'red',img_code:1},new Sha()),
		new Card({huase_show:'meihua',dots_show:10,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'fangkuai',dots_show:10,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:10,color:'black',img_code:20},new Bingliangcunduan()),
		new Card({huase_show:'hongtao',dots_show:10,color:'red',img_code:11},new Huosha()),
		new Card({huase_show:'meihua',dots_show:10,color:'black',img_code:18},new Tiesuolianhuan()),
		new Card({huase_show:'fangkuai',dots_show:10,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:11,color:'black',img_code:6},new Shunshouqianyang()),
		new Card({huase_show:'hongtao',dots_show:11,color:'red',img_code:1},new Sha()),
		new Card({huase_show:'meihua',dots_show:11,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'fangkuai',dots_show:11,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:11,color:'black',img_code:16},new Wuxiekeji()),
		new Card({huase_show:'hongtao',dots_show:11,color:'red',img_code:7},new Wuzhongshengyou()),
		new Card({huase_show:'meihua',dots_show:11,color:'black',img_code:1},new Sha()),
		new Card({huase_show:'fangkuai',dots_show:11,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:11,color:'black',img_code:18},new Tiesuolianhuan()),
		new Card({huase_show:'hongtao',dots_show:11,color:'red',img_code:2},new Shan()),
		new Card({huase_show:'meihua',dots_show:11,color:'black',img_code:18},new Tiesuolianhuan()),
		new Card({huase_show:'fangkuai',dots_show:11,color:'red',img_code:2},new Shan()),

		new Card({huase_show:'heitao',dots_show:12,color:'black',img_code:5},new Guohechaiqiao()),
		new Card({huase_show:'hongtao',dots_show:12,color:'red',img_code:3},new Tao()),
		new Card({huase_show:'meihua',dots_show:12,color:'black',img_code:9},new Jiedaosharen()),
		new Card({huase_show:'fangkuai',dots_show:12,color:'red',img_code:3},new Tao()),

		new Card({huase_show:'heitao',dots_show:12,color:'black',img_code:268},new Zhangbashemao()),
		new Card({huase_show:'hongtao',dots_show:12,color:'red',img_code:5},new Guohechaiqiao()),
		new Card({huase_show:'meihua',dots_show:12,color:'black',img_code:16},new Wuxiekeji()),
		new Card({huase_show:'fangkuai',dots_show:12,color:'red',img_code:269},new Fangtianhuaji()),

		new Card({huase_show:'heitao',dots_show:12,color:'black',img_code:18},new Tiesuolianhuan()),
		new Card({huase_show:'hongtao',dots_show:12,color:'red',img_code:2},new Shan()),
		new Card({huase_show:'meihua',dots_show:12,color:'black',img_code:18},new Tiesuolianhuan()),
		new Card({huase_show:'fangkuai',dots_show:12,color:'red',img_code:17},new Huogong()),

		new Card({huase_show:'hongtao',dots_show:12,color:'red',img_code:21},new Shandian()),
		new Card({huase_show:'fangkuai',dots_show:12,color:'red',img_code:16},new Wuxiekeji()),

		new Card({huase_show:'heitao',dots_show:13,color:'black',img_code:14},new Nanmanruqin()),
		new Card({huase_show:'hongtao',dots_show:13,color:'red',img_code:2},new Shan()),
		new Card({huase_show:'meihua',dots_show:13,color:'black',img_code:9},new Jiedaosharen()),
		new Card({huase_show:'fangkuai',dots_show:13,color:'red',img_code:1},new Sha()),

		new Card({huase_show:'heitao',dots_show:13,color:'black',img_code:252},new Dawan()),
		new Card({huase_show:'hongtao',dots_show:13,color:'red',img_code:243},new Zhuahuangfeidian()),
		new Card({huase_show:'meihua',dots_show:13,color:'black',img_code:16},new Wuxiekeji()),
		new Card({huase_show:'fangkuai',dots_show:13,color:'red',img_code:253},new Ziju()),

		new Card({huase_show:'heitao',dots_show:13,color:'black',img_code:16},new Wuxiekeji()),
		new Card({huase_show:'hongtao',dots_show:13,color:'red',img_code:16},new Wuxiekeji()),
		new Card({huase_show:'meihua',dots_show:13,color:'black',img_code:18},new Tiesuolianhuan()),
		new Card({huase_show:'fangkuai',dots_show:13,color:'red',img_code:244},new Hualiu())

		];
	}
}