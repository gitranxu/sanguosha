//座位类
//座位类中有装备区，有判定区，有状态区（麻，禁，翻），有牌区，有角色，有与其他座位的距离列表，有攻击距离，防御距离,阶段类
function Seat(staff,role){
	this.staff = staff;//舞台类
	this.role = role;//角色
	this.panding_zone = new PandingZone(this,role);//判定区
	this.step = new Step(this,staff);//阶段类
	this.weapon_equip = null;//武器装备区
	this.shield_equip = null;//盾牌装备区
	this.defense_horse = null;//防御马
	this.attack_horse = null;//攻击马
	this.ma_status = false;//默认不麻
	this.jin_status = false;//默认不禁
	this.fan_status = false;//默认不翻
	this.pai_list = null;//手牌列表
	this.distance = null;
	this.attack_distance = 0;//攻击距离默认为0
	this.defense_distance = 0;//防御距离默认为0
	this.$div = null;//座位类对应的div
	this.no = null;//座位号，可以用这个来计算距离
}
Seat.prototype = {
	constructor : Seat,
	set_div : function($div){
		this.$div = $div;
	},
	get_div : function(){
		return this.$div;
	},
	get_role : function(){
		return this.role;
	},
	set_no : function(no){
		this.no = no;
	},
	get_no : function(){
		return this.no;
	},
	get_staff : function(){
		return this.staff;
	},
	get_panding_zone : function(){
		return this.panding_zone;
	},
	get_step : function(){
		return this.step;
	}
}