//英雄管理类，主要有生成棋牌,弃牌堆，洗牌，发牌等方法
//每次随机从英雄牌堆中选出9个供选择，选择完毕后再将余下的放回到英雄牌堆中供下次继续选择
function HeroManager(staff){
	this.staff = staff;
	this.cards = [];//游戏开始时生成的牌，发牌或摸牌时都是从这里取得
	this.init();
	this.rand9heros = [];//随机选取的9个英雄
}
HeroManager.prototype = {
	constructor : HeroManager,
	generate_cards : function(){
		return [new Zhouyu(),new Guanyu(),new Zhangfei(),new Zhaoyun(),new Zhangliao(),new Liubei(),new Bulianshi(),new Caiwenji(),new Daoqiao(),new Diaochan(),new Spdiaochan(),new Sunshangxiang(),new Wuguotai(),new Xiaoqiao(),new Zhangchunhua(),new Zhenji(),new Ganning(),new Gongsunzan(),new Guojia(),new Huanggai(),new Huangyueying(),new Huatuo(),new Lusu(),new Madai(),new Simayi(),new Spzhaoyun(),new Sunquan()];
	},
	init : function(){
		this.cards = this.generate_cards();
	},
	chose_hero : function(){
		//this.a_seat[0].set_hero(new Zhouyu());
		var a_seat = this.staff.get_a_seat();
		var hero = tools.get_rand_from_arr(this.cards)[0];
		this.staff.set_$log('主公开始选择英雄');
		var seat_now = a_seat[this.staff.get_i_now()];
		var is_me = seat_now.get_div().hasClass('me');
		var _this = this;
		setTimeout(function(){
			if(!is_me){
				_this.staff.set_$log('主公选择了英雄:'+hero.get_name());
				seat_now.set_hero(hero);//首先是主公选择英雄
			}
			_this.me_chose_hero();//然后是自己选择
		},800);
		
	},
	me_chose_hero : function(){
		//弹出9个随机英雄供选择
		this.update_9_hero_div();

		//最后我选择完事儿后，再调用剩余座位选英雄（直接从英雄堆里随机选就OK了）
		//this.other_chose_hero();
	},
	update_9_hero_div : function(){
		var _this = this;
		$('.chose_heros table td').each(function(index){
			var hero = tools.get_rand_from_arr(_this.cards)[0];
			$(this).text(hero.get_name()).attr('no',index);
			_this.rand9heros.push(hero);
		});
		$('.chose_heros').show();
	},
	get_rand9heros : function(){
		return this.rand9heros;
	},
	other_chose_hero : function(){
		//其他英雄选择的顺序为[7,0,1,2,3,4,5]
		var a_order = [7,0,1,2,3,4,5];
		var a_seat = this.staff.get_a_seat();
		var _this = this;
		for(var i = 0,j = a_order.length;i < j;i++){
			(function(k){
				var seat = a_seat[a_order[k]];
				if(!seat.get_div().attr('hero')){
					setTimeout(function(){
							var hero = tools.get_rand_from_arr(_this.cards)[0];
							var no = seat.get_no();
								_this.staff.set_$log('玩家'+(no+1)+'选择了英雄:'+hero.get_name());
							seat.set_hero(hero);
						
					},800*(k+1));
				}
			})(i);
		}

		setTimeout(function(){
			_this.staff.set_$log('武将分配完毕');
			_this.staff.play();
		},800*(a_order.length+1));
	}
}