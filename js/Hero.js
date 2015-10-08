//英雄：有各自的英雄技能
//英雄类中有装备区，有状态区，装备区及状态区不放在角色类中，角色类只是判断如何操作英雄
function Hero(){
    this.cur_blood = 3;//默认当前血量
    this.max_blood = 3;//默认最大血量
}
Hero.prototype = {
    constructor : Hero,
    sha : function(){
        console.log('杀...');
    },
    shan : function(){
        console.log('闪...');
    },
    del_blood : function(){
        this.blood--;

    },
    add_blood : function(){
        this.cur_blood++;
    },
    get_cur_blood : function(){
        return this.cur_blood;
    },
    get_max_blood : function(){
        return this.max_blood;
    }
}