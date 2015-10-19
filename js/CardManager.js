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
			a_data[i].set_no(i);
			a_data[i].init_div();
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
	layout_paiqu_cards : function($cards,$lis){//自己牌区一屏最多显示10张，加减自己牌区的牌都调用
        var pianyi_positions = this.get_pianyi_positions($cards,$lis);
        var length = $lis.length;
        $lis.each(function(index){
        	$(this).css({zIndex:index+2}).animate({left: pianyi_positions[index]},800*(length-index));//效果爽到爆
    	});
	},

	//得到偏移目标位置，分两种情况，每次计算前都要先判断一下是哪种情况
	get_pianyi_positions:function($cards,$lis){
		var result = [];
		var cards_width = $cards.width();
		var li_width = $lis.width();
		var li_length = $lis.length;
		var pai_ju = li_width;//默认牌距就是一张牌的距离
		if(li_width * li_length > cards_width){//需要叠加
			pai_ju = (cards_width - li_width) / (li_length-1);
		}
		for(var i = 0;i < li_length;i++){
			result.push(pai_ju*i);
		}
		return result;
	},

	layout_log_cards : function(){//显示区中的牌20张也是一屏显示,这个方法是点击确定将li放到log中后再调用
		var $cards = $('.log .cards');
        var $lis = $cards.find('.cardul > li');
        this.layout_paiqu_cards($cards,$lis);
	},

	//洗牌，将牌堆中的牌打乱，同时将牌的所属英雄名去掉
	xipai : function(){
		var tmp = this.cards;
		this.cards = [];
		for(var i = 0,j = tmp.length;i < j;i++){
			var card = tools.get_rand_from_arr(tmp)[0];
			card.div_reset();
			this.cards.push(card);
		}
	},
	re_xipai : function(){
		var tmp = this.drop_cards;
		this.drop_cards = [];
		for(var i = 0,j = tmp.length;i < j;i++){
			var card = tools.get_rand_from_arr(tmp)[0];
			card.div_reset();
			this.drop_cards.push(card);
		}
		
		this.cards = this.drop_cards;
		this.drop_cards = [];//弃牌堆中的牌重新洗牌放到摸（发）牌堆后，要清空一下
	},
	//每个座位类分到初始的4张牌
	fapai : function(){
		var a_seat = this.staff.get_a_seat();
		for(var i = 0,j = a_seat.length;i < j;i++){
			a_seat[i].mepai_to_paiqu(i,4);
		}
	},
	aftermepai : function(num,seat){//每次摸牌后，要合并座位的pai_list并更新牌数
		seat.set_pai_list(this.get_a_pai(num));
		seat.update_div_pai_num();
		this.update_div_pai_count();//更新剩余的牌数
	},
	me_pai : function(num){//摸牌后更新剩余牌数,返回数组
		var cards = this.get_a_pai(num);
		this.update_div_pai_count();//更新剩余的牌数
		return cards;
	},
	update_div_pai_count : function(){
		$('#leave_pai_num').text(this.cards.length);
	},
	//从牌堆顶部顺序取得n张牌，并返回该数组
	get_a_pai : function(n){
		var result = [];
		for(var i = 0;i < n;i++){
			var pop_card = this.cards.pop();
			if(!pop_card){
				this.re_xipai();
				pop_card = this.cards.pop();
			}
			pop_card.set_staff(this.staff);
			result.push(pop_card);
		}
		//console.log('取了'+result.length+'张牌!');
		return result;
	},
	chupai_to_log : function(cards,fn){//将出牌在log中显示出来,这个回头得改，出牌跟弃牌要分开，虽然里面的代码基本上一样
		var $cardul = $('.log .cards .cardul');
		$cardul.empty();

		var html = [];
		this.staff.pause();//暂停
		var _this = this;
		if(cards.length > 0){
			for(var i = 0,j = cards.length;i < j;i++){ 
				(function(k){
					setTimeout(function(){
						cards[k].when_out();//到牌被打出时一些操作
						$cardul.append(cards[k].get_div());
						_this.to_drop_cards(cards);//判断是否将牌放到弃牌区
						_this.layout_log_cards();
						_this.staff.set_$log('自动出牌阶段思考'+this.auto_chupai_time+'秒钟...');
						if(k==cards.length-1){//如果是最后一个了，再停止暂停
							console.log('弃最后一张牌的时候能看到....');
							if(fn&&typeof fn == 'function'){
								fn.call();
							}
						}
					},5000*k);
				})(i);
			}
		}else{
			if(fn&&typeof fn == 'function'){
				fn.call();
			}
		}
		
	},
	to_drop_cards : function(cards){
		//如果是装备牌，则出牌时不能放到弃牌堆，这里还假定，如果cards大于1张，则肯定会放到弃牌堆，例如制衡，蛇矛
		var card_type = cards[0].get_card_type();
		if(cards.length==1 && (card_type=='zhuangbei' || card_type=='yanchicelue')){
			console.log('装备牌，延迟策略牌，不放到弃牌堆...');
		}else{
			this.drop_cards_concat(cards);//将牌放到弃牌堆
		}
	},
	drop_cards_concat : function(cards){//将牌放到弃牌堆
		tools.concat_two_arr(this.drop_cards,cards);
		$('#qipaidun_pai_num').text(this.drop_cards.length);
	},
	cards_can_use : function(opt){
		var mabi = true;
		var pai_list = this.staff.get_cur_seat().get_pai_list();
		for(var i = 0,j = pai_list.length;i < j;i++){
			pai_list[i].get_card_action().can_use(opt);
		}
	},
	get_init_data : function(){
		return [new Card({huase_show:'heitao',dots_show:1,color:'black',img_code:8},new Juedou()),
		new Card({huase_show:'hongtao',dots_show:1,color:'red',img_code:15},new Wanjianqifa()),
		new Card({huase_show:'meihua',dots_show:1,color:'black',img_code:8},new Juedou()),
		new Card({huase_show:'fangkuai',dots_show:1,color:'red',img_code:8},new Juedou()),

		new Card({huase_show:'heitao',dots_show:4,color:'black',img_code:20},new Bingliangcunduan()),
		new Card({huase_show:'hongtao',dots_show:4,color:'red',img_code:20},new Bingliangcunduan()),
		new Card({huase_show:'meihua',dots_show:4,color:'black',img_code:20},new Bingliangcunduan()),
		new Card({huase_show:'fangkuai',dots_show:4,color:'red',img_code:20},new Bingliangcunduan()),

		new Card({huase_show:'heitao',dots_show:5,color:'black',img_code:20},new Bingliangcunduan()),
		new Card({huase_show:'hongtao',dots_show:5,color:'red',img_code:20},new Bingliangcunduan()),
		new Card({huase_show:'meihua',dots_show:5,color:'black',img_code:20},new Bingliangcunduan()),
		new Card({huase_show:'fangkuai',dots_show:5,color:'red',img_code:20},new Bingliangcunduan()),

		new Card({huase_show:'heitao',dots_show:5,color:'black',img_code:20},new Bingliangcunduan()),
		new Card({huase_show:'hongtao',dots_show:5,color:'red',img_code:20},new Bingliangcunduan()),
		new Card({huase_show:'meihua',dots_show:5,color:'black',img_code:20},new Bingliangcunduan()),
		new Card({huase_show:'fangkuai',dots_show:5,color:'red',img_code:20},new Bingliangcunduan()),

		

		

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

		new Card({huase_show:'heitao',dots_show:5,color:'black',img_code:19},new Lebusishu()),
		new Card({huase_show:'hongtao',dots_show:5,color:'red',img_code:19},new Lebusishu()),
		new Card({huase_show:'meihua',dots_show:5,color:'black',img_code:19},new Lebusishu()),
		new Card({huase_show:'fangkuai',dots_show:5,color:'red',img_code:19},new Lebusishu()),

		new Card({huase_show:'heitao',dots_show:5,color:'black',img_code:19},new Lebusishu()),
		new Card({huase_show:'hongtao',dots_show:5,color:'red',img_code:19},new Lebusishu()),
		new Card({huase_show:'meihua',dots_show:5,color:'black',img_code:19},new Lebusishu()),
		new Card({huase_show:'fangkuai',dots_show:5,color:'red',img_code:19},new Lebusishu()),

		new Card({huase_show:'heitao',dots_show:6,color:'black',img_code:19},new Lebusishu()),
		new Card({huase_show:'hongtao',dots_show:6,color:'red',img_code:19},new Lebusishu()),
		new Card({huase_show:'meihua',dots_show:6,color:'black',img_code:19},new Lebusishu()),
		new Card({huase_show:'fangkuai',dots_show:6,color:'red',img_code:19},new Lebusishu()),

		new Card({huase_show:'heitao',dots_show:6,color:'black',img_code:19},new Lebusishu()),
		new Card({huase_show:'hongtao',dots_show:6,color:'red',img_code:19},new Lebusishu()),
		new Card({huase_show:'meihua',dots_show:6,color:'black',img_code:19},new Lebusishu()),
		new Card({huase_show:'fangkuai',dots_show:6,color:'red',img_code:19},new Lebusishu()),

		new Card({huase_show:'heitao',dots_show:6,color:'black',img_code:19},new Lebusishu()),
		new Card({huase_show:'hongtao',dots_show:6,color:'red',img_code:19},new Lebusishu()),
		new Card({huase_show:'meihua',dots_show:6,color:'black',img_code:19},new Lebusishu()),
		new Card({huase_show:'fangkuai',dots_show:6,color:'red',img_code:19},new Lebusishu()),

	



	


		new Card({huase_show:'heitao',dots_show:13,color:'black',img_code:16},new Wuxiekeji()),
		new Card({huase_show:'hongtao',dots_show:13,color:'red',img_code:16},new Wuxiekeji()),
		new Card({huase_show:'meihua',dots_show:13,color:'black',img_code:18},new Tiesuolianhuan()),
		new Card({huase_show:'fangkuai',dots_show:13,color:'red',img_code:244},new Hualiu())

		];
	},
	get_init_data1 : function(){
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