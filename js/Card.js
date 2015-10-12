//opt包含huase,dots,color,no,img_code这五个信息
function Card(opt,card_action){
    this.opt = opt || {};
    this.$div = null;
    this.huase = this.opt.huase || 'wuse';//这个属性还可以用作class名
    this.dots = this.opt.dots || 0;//默认0点
    this.color = this.opt.color || 'green';//默认绿色，当然，只有红黑两色 
    this.no = this.opt.no || 0;
    this.img_code = this.opt.img_code || 'c0';//默认c0

    this.card_action = card_action || new CardAction();//动作类
    this.card_action.set_card(this);
    this.staff = null;
}
//can_use方法是判断牌本身是否可用，can_out方法是判断点击牌后确认按钮是否可用
Card.prototype = {
    constructor : Card,
    get_huase : function(){
        return this.huase;
    },
    get_dots : function(){
        return this.dots;
    },
    get_no : function(){
        return this.no;
    },
    get_div : function(){
        return this.$div;
    },
    set_div : function($div){
        this.$div = $div;
        this.init_div();
    },
    init_div : function(){
        if(this.$div){
            this.$div.attr('id',this.no);
            this.$div.find('.card').addClass(this.color+'_card');
            this.$div.find('.huase img').attr('src','./img/v'+this.huase+'.png');
            this.$div.find('.dots').text(this.dots);
            this.$div.find('.bg').addClass('c'+this.img_code);
            this.$div.find('.name').text(this.card_action.get_name());
            //$('#test').append(this.$div);
        }
    },
    set_hero_name : function(){
        var cur_seat = this.staff.get_cur_seat();
        if(this.$div){
            this.$div.find('.user').text(cur_seat.get_hero().get_name());
        }
    },
    remove_hero_name : function(){
        if(this.$div){
            this.$div.find('.user').text('');
        }
    },
    set_staff : function(staff){
        this.staff = staff;
    },
    get_card_action : function(){
        return this.card_action;
    },
    set_card_action : function(card_action){
        this.card_action = card_action;
    }
}

