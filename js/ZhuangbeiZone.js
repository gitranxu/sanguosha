
//装备只有两个方法，装上，卸下，具体装上卸下时都产生了什么效果(主要是改变属性类的属性)，每个装备类自己去实现 
function ZhuangbeiZone(seat){
	this.seat = seat;
	this.weapon_obj = null;//武器
	this.fangju_obj = null;//防具
	this.defense_horse = null;//防御马
	this.attack_horse = null;//进攻马
}
ZhuangbeiZone.prototype = {
	constructor : ZhuangbeiZone,
	up_zhuangbei : function(card,classname,shecheng_zb_text){
		console.log(card+'-----------------2');
		var add_attack_num = card.get_add_attack_num();//得到武器的攻击加成
		this.seat.get_seat_status().set_attack_distance(add_attack_num);//2修改攻击距离
		var add_defense_num = card.get_add_defense_num();//得到武器的防御加成
		this.seat.get_seat_status().set_defense_distance(add_defense_num);//2修改防御距离

		//this.seat.get_div().find('.zbzone').//3修改div
		var $zb_li = this.seat.get_div().find('.zbzone .'+classname);
		$zb_li.find('.huase_zb').append('<img src="img/v'+card.get_huase_show()+'.png" alt="">');
		$zb_li.find('.dots_zb').text(card.get_dots_show());
		$zb_li.find('.name_zb').text(card.get_card_action().get_short_name());
		$zb_li.find('.shecheng_zb').text(shecheng_zb_text);
	},
	down_zhuangbei : function(card,classname,obj_name){
		if(card){
			var add_attack_num = card.get_add_attack_num();//得到武器的攻击加成
			this.seat.get_seat_status().set_attack_distance(-add_attack_num);//1修改攻击距离
			var add_defense_num = card.get_add_defense_num();//得到武器的防御加成
			this.seat.get_seat_status().set_defense_distance(-add_defense_num);//2修改防御距离
			this[obj_name] = null;//摘掉 2去掉对象 

			var $zb_li = this.seat.get_div().find('.zbzone .'+classname);
			$zb_li.find('.huase_zb').empty();
			$zb_li.find('.dots_zb').text('');
			$zb_li.find('.name_zb').text('');
			$zb_li.find('.shecheng_zb').text('');
		}
	},
	
	up_weapon_obj : function(card){
		this.down_weapon_obj();

		this.weapon_obj = card;//挂上 1加上对象 
		var shecheng_zb_text = '＋'+(card.get_add_attack_num()-0+1);
		this.up_zhuangbei(this.weapon_obj,'wuqi',shecheng_zb_text);

	},
	down_weapon_obj : function(){
		this.down_zhuangbei(this.weapon_obj,'wuqi','weapon_obj');
	},

	up_fangju_obj : function(card){
		this.down_fangju_obj();

		this.fangju_obj = card;//挂上 1加上对象 
		this.up_zhuangbei(this.fangju_obj,'fangju','');
		
	},
	down_fangju_obj : function(){
		this.down_zhuangbei(this.fangju_obj,'fangju','fangju_obj');
	},

	up_fangyuma_obj : function(card){
		this.down_fangyuma_obj();

		this.defense_horse = card;//挂上 1加上对象 
		this.up_zhuangbei(this.defense_horse,'fangyuma','');
		
	},
	down_fangyuma_obj : function(){
		this.down_zhuangbei(this.defense_horse,'fangyuma','defense_horse');
	},

	up_jingongma_obj : function(card){
		this.down_jingongm_obj();

		this.attack_horse = card;//挂上 1加上对象 
		this.up_zhuangbei(this.attack_horse,'jingongma','');
		
	},
	down_jingongm_obj : function(){
		this.down_zhuangbei(this.attack_horse,'jingongma','attack_horse');
	}
}