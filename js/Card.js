//opt包含huase_show,dots_show,color,no,img_code这五个信息
function Card(opt,card_action){
    this.opt = opt || {};
    this.$div = null;
    this.huase_show = this.opt.huase_show || 'wuse';//这个属性还可以用作class名
    this.huase_value = this.huase_show;//默认值与显示值是一样的，这个值用来做真正的判定
    this.dots_show = this.opt.dots_show || 0;//默认0点
    this.dots_value = this.dots_show;
    this.color = this.opt.color || 'green';//默认绿色，当然，只有红黑两色 
    this.color_value = this.color;
    this.no = this.opt.no || 0;
    this.img_code = this.opt.img_code || 'c0';//默认c0

    this.card_action = card_action || new CardAction();//动作类
    this.card_action.set_card(this);
    this.staff = null;
}
//can_use方法是判断牌本身是否可用，can_out方法是判断点击牌后确认按钮是否可用
Card.prototype = {
    constructor : Card,
    chupai : function(){
        this.card_action.chupai();//出牌
    },
    get_add_attack_num : function(){
        return this.card_action.get_add_attack_num();
    },
    get_add_defense_num : function(){
        return this.card_action.get_add_defense_num();
    },
    get_card_type : function(){//得到牌的类型，基础，策略,延迟策略，装备
        return this.card_action.get_type();
    },
    get_huase_show : function(){
        return this.huase_show;
    },
    get_dots_show : function(){
        if(this.dots_show==11){
            return 'J';
        }
        if(this.dots_show==12){
            return 'Q';
        }
        if(this.dots_show==13){
            return 'K';
        }
        return this.dots_show;
    },
    get_huase_value : function(){
        return this.huase_value;
    },
    set_huase_value : function(huase_value){
        this.huase_value = huase_value;
    },
    get_dots_value : function(){
        return this.dots_value;
    },
    set_dots_value : function(dots_value){
        this.dots_value = dots_value;
    },
    get_color_value : function(){
        return this.color_value;
    },
    set_color_value : function(color_value){
        this.color_value = color_value;
    },
    get_no : function(){
        return this.no;
    },
    set_no : function(no){
        this.no = no;
    },
    get_div : function(){
        return this.$div;
    },
    set_div : function($div){
        this.$div = $div;
    },
    is_red : function(){
        if(this.huase_value=='hongtao' || this.huase_value=='fangkuai'){
            return true;
        }else{
            return false;
        }
    },
    is_hongtao : function(){
        if(this.huase_value=='hongtao'){
            return true;
        }else{
            return false;
        }
    },
    is_heitao : function(){
        if(this.huase_value=='heitao'){
            return true;
        }else{
            return false;
        }
    },
    is_meihua : function(){
        if(this.huase_value=='meihua'){
            return true;
        }else{
            return false;
        }
    },
    is_fangkuai : function(){
        if(this.huase_value=='fangkuai'){
            return true;
        }else{
            return false;
        }
    },
    init_div : function(){
        if(this.$div){
            this.$div.attr('id',this.no);
            this.$div.find('.card').addClass(this.color+'_card');
            this.$div.find('.huase_show img').attr('src','./img/v'+this.huase_show+'.png');
            this.$div.find('.dots_show').text(this.get_dots_show()).addClass(this.color+'_txt');
            this.$div.find('.bg').addClass('c'+this.img_code);
            this.$div.find('.name').text(this.card_action.get_name());
            //$('#test').append(this.$div);
        }
    },
    //当牌被打出时，显示英雄名，去掉card_disable ready_to_out等这些中间加工出现的类名
    when_out : function(){
        this.set_hero_name();//出牌后要显示英雄名
        this.remove_all_class();
    },
    set_hero_name : function(){
        var cur_seat = this.staff.get_cur_seat();
        if(this.$div){
            this.$div.find('.user').text(cur_seat.get_hero().get_name());
        }
    },
    remove_all_class : function(){
        this.$div.removeClass();//一张牌刚摸上来的时候，没有任何类名，所以出去时，要把所有类名也去掉
    },
    remove_hero_name : function(){
        if(this.$div){
            this.$div.find('.user').text('');
        }
    },
    remove_status_class : function(){
        if(this.$div){
            this.$div.removeClass('ready_to_out');
        }
    },
    div_reset : function(){
        this.remove_hero_name();
        this.remove_status_class();
    },
    set_staff : function(staff){
        this.staff = staff;
    },
    get_staff : function(){
        return this.staff;
    },
    get_card_action : function(){
        return this.card_action;
    },
    set_card_action : function(card_action){
        this.card_action = card_action;
    }
}

