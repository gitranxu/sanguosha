//英雄：有技能列表
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
    },
    get_skills : function(){
        return this.skills;
    },
    get_img_code : function(){
        return this.img_code;
    },
    get_name : function(){
        return this.name;
    }
}

function Zhouyu(){
    this.name = '周瑜';
    this.img_code = 'jzhouyu';
    this.skills = [new Yingzi()];
}
Zhouyu.prototype = new Hero();

function Guanyu(){
    this.name = '关羽';
    this.img_code = 'jguanyu';
    this.skills = [new Yingzi()];
    this.cur_blood = 4;//默认当前血量
    this.max_blood = 4;//默认最大血量
}
Guanyu.prototype = new Hero();

function Zhangfei(){
    this.name = '张飞';
    this.img_code = 'jzhangfei';
    this.skills = [new Yingzi()];
    this.cur_blood = 4;//默认当前血量
    this.max_blood = 4;//默认最大血量
}
Zhangfei.prototype = new Hero();

function Zhaoyun(){
    this.name = '赵云';
    this.img_code = 'jzhaoyun';
    this.skills = [new Yingzi()];
    this.cur_blood = 4;//默认当前血量
    this.max_blood = 4;//默认最大血量
}
Zhaoyun.prototype = new Hero();

function Zhangliao(){
    this.name = '张辽';
    this.img_code = 'jzhangliao';
    this.skills = [new Yingzi()];
    this.cur_blood = 4;//默认当前血量
    this.max_blood = 4;//默认最大血量
}
Zhangliao.prototype = new Hero();

function Liubei(){
    this.name = '刘备';
    this.img_code = 'jliubei';
    this.skills = [new Yingzi()];
    this.cur_blood = 4;//默认当前血量
    this.max_blood = 4;//默认最大血量
}
Liubei.prototype = new Hero();

function Bulianshi(){
    this.name = '步练师';
    this.img_code = 'jbulianshi';
    this.skills = [new Yingzi()];
}
Bulianshi.prototype = new Hero();

function Caiwenji(){
    this.name = '蔡文姬';
    this.img_code = 'jcaiwenji';
    this.skills = [new Yingzi()];
}
Caiwenji.prototype = new Hero();

function Daoqiao(){
    this.name = '大乔';
    this.img_code = 'jdaqiao';
    this.skills = [new Yingzi()];
}
Daoqiao.prototype = new Hero();

function Diaochan(){
    this.name = '貂蝉';
    this.img_code = 'jdiaochan';
    this.skills = [new Yingzi()];
}
Diaochan.prototype = new Hero();

function Spdiaochan(){
    this.name = 'SP貂蝉';
    this.img_code = 'jspdiaochan';
    this.skills = [new Yingzi()];
}
Spdiaochan.prototype = new Hero();

function Sunshangxiang(){
    this.name = '孙尚香';
    this.img_code = 'jsunshangxiang';
    this.skills = [new Yingzi()];
}
Sunshangxiang.prototype = new Hero();

function Wuguotai(){
    this.name = '吴国太';
    this.img_code = 'jwuguotai';
    this.skills = [new Yingzi()];
}
Wuguotai.prototype = new Hero();

function Xiaoqiao(){
    this.name = '小乔';
    this.img_code = 'jxiaoqiao';
    this.skills = [new Yingzi()];
}
Xiaoqiao.prototype = new Hero();

function Zhangchunhua(){
    this.name = '张春华';
    this.img_code = 'jzhangchunhua';
    this.skills = [new Yingzi()];
}
Zhangchunhua.prototype = new Hero();

function Zhenji(){
    this.name = '甄姬';
    this.img_code = 'jzhenji';
    this.skills = [new Yingzi()];
}
Zhenji.prototype = new Hero();

function Ganning(){
    this.name = '甘宁';
    this.img_code = 'jganning';
    this.skills = [new Yingzi()];
    this.cur_blood = 4;//默认当前血量
    this.max_blood = 4;//默认最大血量
}
Ganning.prototype = new Hero();

function Gongsunzan(){
    this.name = '公孙瓒';
    this.img_code = 'jgongsunzan';
    this.skills = [new Yingzi()];
    this.cur_blood = 4;//默认当前血量
    this.max_blood = 4;//默认最大血量
}
Gongsunzan.prototype = new Hero();

function Guojia(){
    this.name = '郭嘉';
    this.img_code = 'jguojia';
    this.skills = [new Yingzi()];
}
Guojia.prototype = new Hero();

function Huanggai(){
    this.name = '黄盖';
    this.img_code = 'jhuanggai';
    this.skills = [new Yingzi()];
    this.cur_blood = 4;//默认当前血量
    this.max_blood = 4;//默认最大血量
}
Huanggai.prototype = new Hero();

function Huangyueying(){
    this.name = '黄月英';
    this.img_code = 'jhuangyueying';
    this.skills = [new Yingzi()];
}
Huangyueying.prototype = new Hero();

function Huatuo(){
    this.name = '华佗';
    this.img_code = 'jhuatuo';
    this.skills = [new Yingzi()];
}
Huatuo.prototype = new Hero();

function Lusu(){
    this.name = '鲁肃';
    this.img_code = 'jlusu';
    this.skills = [new Yingzi()];
}
Lusu.prototype = new Hero();

function Madai(){
    this.name = '马岱';
    this.img_code = 'jmadai';
    this.skills = [new Yingzi()];
    this.cur_blood = 4;//默认当前血量
    this.max_blood = 4;//默认最大血量
}
Madai.prototype = new Hero();

function Simayi(){
    this.name = '司马懿';
    this.img_code = 'jsimayi';
    this.skills = [new Yingzi()];
}
Simayi.prototype = new Hero();

function Spzhaoyun(){
    this.name = 'SP赵云';
    this.img_code = 'jspzhaoyun';
    this.skills = [new Yingzi()];
}
Spzhaoyun.prototype = new Hero();

function Sunquan(){
    this.name = '孙权';
    this.img_code = 'jsunquan';
    this.skills = [new Yingzi()];
    this.cur_blood = 4;//默认当前血量
    this.max_blood = 4;//默认最大血量
}
Sunquan.prototype = new Hero();


//应该有一个攻击的方法和一个防御的方法
//调用攻击方法去攻击另外一个英雄的过程为：在这个攻击方法内部调用被攻击英雄的防御方法，并为这个防御方法传递攻击的参数（杀或者策略）
//不管是杀，决斗还是南蛮入侵，火攻等等，应该是他们这些牌本身有攻击方法，英雄的攻击方法其实就是调用这些牌的攻击方法。当在牌区点击某个牌时，这个牌会根据当前英雄的装备（马）及与其他座位距离情况，计算出可以攻击的范围，范围内的座位都会被标红
//自动攻击的简单逻辑：忠先杀反再杀内，主先杀反再杀内，内先杀反再杀忠最后杀主，反先杀主，如果满足目标条件大于2时，则哪个血少先杀哪个，如果血量一样，优先杀牌少的