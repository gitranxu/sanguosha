//技能类，不同的技能类可以组成各种个性的英雄
//主动技能，被动技能，主被技能
function Skill(){

}
Skill.prototype = {
	constructor : Skill,
	panding_step : function(){
		console.log('判定阶段要发动的技能需实现该方法，如突袭，观星等');
	},
	mepai_step : function(){
		console.log('摸牌阶段要发动的技能需实现该方法，如英姿，英魂，再起等');
		//return {num:3,code:2} //code姑且代表效果
	},
	chupai_step : function(){
		console.log('出牌阶段要发动的技能需实现该方法，如制衡，关张赵等');
	},
	qipai_step : function(){
		console.log('弃牌阶段要发动的技能需实现该方法，如克已，闭月，李典等');
	},
	defense : function(){
		console.log('当被动防御时可以发起的技能，如黑幕，白象等');
	},
	get_name : function(){
		return this.name;
	}
}

function Yingzi(){
	//Skill.call();
	this.name = '英姿';
}
Yingzi.prototype = new Skill();
Yingzi.prototype.mepai_step = function(){
	return {num:3,code:1};//code为1时代表没有其他效果
}