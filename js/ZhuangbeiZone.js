
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
	up_weapon_obj : function(weapon_obj){
		this.down_weapon_obj();

		this.weapon_obj = weapon_obj;//挂上 1加上对象 
		var add_attack_num = this.weapon_obj.get_add_attack_num();//得到武器的攻击加成
		this.seat.get_seat_status().set_attack_distance(add_attack_num);//2修改攻击距离

		//this.seat.get_div().find('.zbzone').//3修改div
		var $wuqi = this.seat.get_div().find('.zbzone .wuqi');
		$wuqi.find('.huase_zb').append('<img src="img/v'+this.weapon_obj.get_huase_show()+'.png" alt="梅花">');
		$wuqi.find('.dots_zb').text(this.weapon_obj.get_dots_show());
		$wuqi.find('.name_zb').text(this.weapon_obj.get_card_action().get_short_name());
		$wuqi.find('.shecheng_zb').text('＋'+(this.weapon_obj.get_add_attack_num()-0+1));
	},
	down_weapon_obj : function(){
		
		if(this.weapon_obj){
			var add_attack_num = this.weapon_obj.get_add_attack_num();//得到武器的攻击加成
			this.seat.get_seat_status().set_attack_distance(-add_attack_num);//1修改攻击距离
			this.weapon_obj = null;//摘掉 2去掉对象 

			var $wuqi = this.seat.get_div().find('.zbzone .wuqi');
			$wuqi.find('.huase_zb').empty();
			$wuqi.find('.dots_zb').text('');
			$wuqi.find('.name_zb').text('');
			$wuqi.find('.shecheng_zb').text('');
		}
	}
}