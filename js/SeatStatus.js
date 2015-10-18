//座位类的状态类，这个类里面的所有属性都有设置，获取的方法
function SeatStatus(){
	this.mabi = 0;//默认不麻痹
	this.zhongdu = 0;//默认不中毒
	this.fanpai = 0;//默认不翻牌
	this.jinyan = 0;//默认不禁言
	this.chidun = 0;//默认不迟钝

	//装备假设攻击为4，则它的攻击加成为3 
	this.attack_distance = 1;//攻击默认距离,武器装卸，坐骑装卸，距离相关武将技开关，都会改变该值
	this.defense_distance = 1;//默认防御距离
	this.chu_pai_num = 1;//出牌数，在能够出牌多选的时候使用，用于判断可以同时出几张牌【蛇矛只能允许2张】

	this.extra_chipai_num = 0;//额外的持牌数，默认为0
}

SeatStatus.prototype = {
	constructor : SeatStatus,
	get_mabi : function(){
		return this.mabi;
	},
	set_mabi : function(mabi){
		this.mabi = mabi;
	},
	get_zhongdu : function(){
		return this.zhongdu;
	},
	set_zhongdu : function(zhongdu){
		this.zhongdu = zhongdu;
	},
	get_fanpai : function(){
		return this.fanpai;
	},
	set_fanpai : function(fanpai){
		this.fanpai = fanpai;
	},
	get_jinyan : function(){
		return this.jinyan;
	},
	set_jinyan : function(jinyan){
		this.jinyan = jinyan;
	},
	get_chidun : function(){
		return this.chidun;
	},
	set_chidun : function(chidun){
		this.chidun = chidun;
	},
	get_attack_distance : function(){
		return this.attack_distance;
	},
	set_attack_distance : function(attack_distance){
		this.attack_distance += attack_distance;
	},
	get_defense_distance : function(){
		return this.defense_distance;
	},
	set_defense_distance : function(defense_distance){
		this.defense_distance += defense_distance;
	},
	get_chu_pai_num : function(){
		return this.chu_pai_num;
	},
	set_chu_pai_num : function(chu_pai_num){
		this.chu_pai_num = chu_pai_num;
	},
	get_extra_chipai_num : function(){
		return this.extra_chipai_num;
	},
	set_extra_chipai_num : function(extra_chipai_num){
		this.extra_chipai_num = extra_chipai_num;
	}
}