//桃是否可用应该牌类自己有一个是否可用的方法
function Card($card_div){
    this.$card_div = $card_div;//代表棋牌本身的html元素
}
Card.prototype = {
    constructor : Card,
    //如果不可以用，则棋牌本身自己加一个disable属性,这个方法是当轮到自己的时候棋牌进行调用的，如果一个角色要死的时候，不会调用这个方法，给别人喂桃是另外的方法
    can_use : function(){console.log('父类中的牌类是否可用的方法，看到这句话，说明子类没有实现这个方法...')}//该方法每个特定的牌类自己去具体实现
}

function Peach($card_div){
    Card.call(this,$card_div);
}
Peach.prototype = new Card();
Peach.prototype.can_use = function(hero){
    if(hero.get_cur_blood() >= hero.get_max_blood()){
        this.$card_div.addClass('disable');
    }
}

function Sha($card_div){
    Card.call(this,$card_div);
}
Sha.prototype = new Card();
Sha.prototype.can_use = function(hero){
    //如果英雄的状态为麻木，则不能使用
    if(hero.mamu_status){
        this.$card_div.addClass('disable');
    }
}

function Shan($card_div){
    Card.call(this,$card_div);
}
Shan.prototype = new Card();
Shan.prototype.can_use = function(hero){}

//装备牌，可以放到装备区，可以增加座位的攻击范围或防御范围，座位中还应包括提前就已算好的与其他座位的距离，