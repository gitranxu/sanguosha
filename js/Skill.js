//技能类，不同的技能类可以组成各种个性的英雄
function Skill(){

}
Skill.prototype = {
	constructor : Skill,
	launch : function(){
		console.log('发动技能');
	}
}