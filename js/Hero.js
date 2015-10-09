//英雄：有技能列表
function Hero(){
    this.skills = [];//技能列表
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

//应该有一个攻击的方法和一个防御的方法
//调用攻击方法去攻击另外一个英雄的过程为：在这个攻击方法内部调用被攻击英雄的防御方法，并为这个防御方法传递攻击的参数（杀或者策略）
//不管是杀，决斗还是南蛮入侵，火攻等等，应该是他们这些牌本身有攻击方法，英雄的攻击方法其实就是调用这些牌的攻击方法。当在牌区点击某个牌时，这个牌会根据当前英雄的装备（马）及与其他座位距离情况，计算出可以攻击的范围，范围内的座位都会被标红
//自动攻击的简单逻辑：忠先杀反再杀内，主先杀反再杀内，内先杀反再杀忠最后杀主，反先杀主，如果满足目标条件大于2时，则哪个血少先杀哪个，如果血量一样，优先杀牌少的