//桃是否可用应该牌类自己有一个是否可用的方法
//opt包含huase,dots,color,no这四个信息
function Card(opt,$card_div){
    this.opt = opt || {};
    this.$div = $card_div;
    this.huase = this.opt.huase || 'wuse';//这个属性还可以用作class名
    this.dots = this.opt.dots || 0;//默认0点
    this.color = this.opt.color || 'green';//默认绿色，当然，只有红黑两色 
    this.no = this.opt.no || 0;
    this.img_code = 'c0';//默认c0
    this.name = '牌牌';//默认名

    //this.init_div();//初始化div
    /*//两个防御属性
    this.can_shan = opt.can_shan;//可以用闪吗，默认不可以，只有闪才是true
    this.can_wuxie = opt.can_wuxie;//可以用无懈可击吗，默认不可以，只有无懈可击才是true
    //两个救命属性
    this.can_tao = opt.can_tao;//可以吃桃吗
    this.can_jiu = opt.can_jiu;//可以吃酒吗
    //南蛮或决斗时
    this.can_sha = opt.can_sha;//可以杀吗*/

}
Card.prototype = {
    constructor : Card,
    //如果不可以用，则棋牌本身自己加一个disable属性,这个方法是当轮到自己的时候棋牌进行调用的，如果一个角色要死的时候，不会调用这个方法，给别人喂桃是另外的方法
    can_use : function(){//该方法每个特定的牌类自己去具体实现
        console.log('父类中的牌类是否可用的方法，看到这句话，说明子类没有实现这个方法...')
    },
    get_name : function(){
        return this.name;
    },
    get_huase : function(){
        return this.huase;
    },
    get_dots : function(){
        return this.dots;
    },
    /*set_can_shan : function(){
        return this.can_shan;
    },
    set_can_wuxie : function(){
        return this.can_wuxie;
    },
    set_can_tao : function(){
        return this.can_tao;
    },
    set_can_jiu : function(){
        return this.can_jiu;
    },
    set_can_sha : function(){
        return this.can_sha;
    },
    can_shan : function(){
        if(this.can_shan){
            this.$div.addClass('light');//高亮显示
        }else{
            this.$div.addClass('dark')
        }
    },
    can_wuxie : function(){
        if(this.can_wuxie){
            this.$div.addClass('light');//高亮显示
        }else{
            this.$div.addClass('dark')
        }
    },
    can_tao : function(){
        if(this.can_tao){
            this.$div.addClass('light');//高亮显示
        }else{
            this.$div.addClass('dark')
        }
    },
    can_jiu : function(){
        if(this.can_jiu){
            this.$div.addClass('light');//高亮显示
        }else{
            this.$div.addClass('dark')
        }
    },
    can_sha : function(){
        if(this.can_sha){
            this.$div.addClass('light');//高亮显示
        }else{
            this.$div.addClass('dark')
        }
    },*/
    get_div : function(){
        return this.$div;
    },
    init_div : function(){
        if(this.$div){
            //console.log(this.$div.html()+'----before---'+this.color);
            this.$div.find('.card').removeClass('no_se_card').addClass(this.color+'_card').attr('id','card'+this.no);
            this.$div.find('.huase').addClass(this.huase);
            this.$div.find('.dots').text(this.dots);
            this.$div.find('.bg').addClass(this.img_code);
            this.$div.find('.name').text(this.name);
            //$('#test').append(this.$div);
            //console.log(JSON.stringify(this.$div)+'----after');
        }
    },
    set_username : function(username){
        if(this.$div){
            this.$div.find('.user').text(username);
        }
    }
}

//opt包含huase,dots,color,no这四个信息
//杀，主动点击时，如果不是【制衡】，则会触发检查方法，该方法检查是否有满足条件的攻击对象，如果有继续等待满足条件的对象是否进一步满足出牌的条件，如果都满足了，则让确定按钮变的可用
//被动点击情况【被决斗】【被南蛮】
function Sha(opt,$card_div){
    Card.call(this,opt,$card_div);
    this.name = '杀';
    this.img_code = 'c1';
    this.init_div();
}
Sha.prototype = new Card();
Sha.prototype.can_use = function(hero){
    //如果英雄的状态为麻木，则不能使用
    if(hero.mamu_status){
        this.$card_div.addClass('disable');
    }
}

function Huosha(opt,$card_div){
    Card.call(this,opt,$card_div);
    this.name = '火杀';
    this.img_code = 'c11';
    this.init_div();
}
Huosha.prototype = new Sha();
Huosha.prototype.can_use = function(hero){
    //如果英雄的状态为麻木，则不能使用
    if(hero.mamu_status){
        this.$card_div.addClass('disable');
    }
}

function Leisha(opt,$card_div){
    Card.call(this,opt,$card_div);
    this.name = '雷杀';
    this.img_code = 'c12';
    this.init_div();
}
Leisha.prototype = new Sha();
Leisha.prototype.can_use = function(hero){
    //如果英雄的状态为麻木，则不能使用
    if(hero.mamu_status){
        this.$card_div.addClass('disable');
    }
}


function Shan(opt,$card_div){
    Card.call(this,opt,$card_div);
    this.name = '闪';
    this.img_code = 'c2';
    this.init_div();
}
Shan.prototype = new Card();

//桃在两种情况下可用，自己血不满或者有角色濒死
function Peach(opt,$card_div){
    Card.call(this,opt,$card_div);
    this.name = '桃';
    this.img_code = 'c3';
    this.init_div();
}
Peach.prototype = new Card();
Peach.prototype.can_use = function(hero){
    if(hero.get_cur_blood() >= hero.get_max_blood()){
        this.$card_div.addClass('disable');
    }
}


function Yuxi(opt,$card_div){
    Card.call(this,opt,$card_div);
    this.name = '玉玺';
    this.img_code = 'c272';
    this.init_div();
}
Yuxi.prototype = new Card();
Yuxi.prototype.can_use = function(hero){
}

function Zhugeliannu(opt,$card_div){
    Card.call(this,opt,$card_div);
    this.name = '诸葛连弩';
    this.img_code = 'c261';
    this.init_div();
}
Zhugeliannu.prototype = new Card();
Zhugeliannu.prototype.can_use = function(hero){
}


/*function Peach($card_div){
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
Shan.prototype.can_use = function(hero){}*/

//装备牌，可以放到装备区，可以增加座位的攻击范围或防御范围，座位中还应包括提前就已算好的与其他座位的距离，