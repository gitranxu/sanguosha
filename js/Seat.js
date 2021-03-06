//座位类
//座位类中有装备区，有判定区，有状态区（麻，禁，翻），有牌区，有角色，有与其他座位的距离列表，有攻击距离，防御距离,阶段类
function Seat(staff,role){
	this.staff = staff;//舞台类
	this.role = role;//角色
	this.card_manager = this.staff.get_card_manager();
	this.hero = null;
	this.panding_zone = new PandingZone(this,role);//判定区
	this.step = new Step(this,staff);//阶段类

	this.zhuangbei_zone = new ZhuangbeiZone(this);
	this.seat_status = new SeatStatus(); 

	this.weapon_equip = null;//武器装备区
	this.weapon_distance = 1;//武器的攻击距离,即使没有武器，攻击距离至少也是1
	this.shield_equip = null;//盾牌装备区
	this.defense_horse = null;//防御马
	this.attack_horse = null;//攻击马
	this.ma_status = false;//默认不麻
	this.jin_status = false;//默认不禁
	this.fan_status = false;//默认不翻
	this.pai_list = null;//手牌列表
	this.mepai_list = null;//摸牌列表
	this.ready_to_out_list = null;//准备出牌的列表
	//this.distance = null;
	this.attack_distance = 0;//攻击距离默认为0
	this.defense_distance = 0;//防御距离默认为0 
	this.skill_attack_distance = 0;//技能攻击距离
	this.skill_defense_distance = 0;//技能防御距离
	this.$div = null;//座位类对应的div
	this.no = null;//座位号，可以用这个来计算距离
	this.can_attack_seats = [];//本座位可以攻击的其他座位的数组
	this.selected_attack_seats = [];//选中的准备攻击的座位数组
	

	this.my_attack_seats = [];//我自己的攻击目标，主要是自己用
	this.chu_pai_mult = false;//出牌时能否多选，默认不能，这个用于测试
	this.chu_pai_num = 1;//出牌数，在能够出牌多选的时候使用，用于判断可以同时出几张牌 

	this.out_for_log_cards = [];//打出的牌，准备在log中显示
}
Seat.prototype = {
	constructor : Seat,
	init : function(){
		this.set_div_info();
		this.role.set_seat(this);
		//this.compute_distance();//计算当作座位与其他座位的距离
	},
	get_card_by_id : function(id){//如果找不到，则会返回undefined，这种情况正常情况下不会出现
		if(this.pai_list){
			for(var i = 0,j = this.pai_list.length;i < j;i++){
				if(this.pai_list[i].get_no() == id){
					return this.pai_list[i];
				}
			}
		}
	},
	selected_attack_seats_fn : function(index,$seat){//index是选中的座位的索引，一方面是我自己在点击can_attack类时触发，另一方面电脑会在适当的时候调用这个方法，这个方法有两个功能，1将选中的seat放到selected_attack_seats中去，另一方面，要调用card_action对象的can_queren方法用于控制确认按钮是否可用
		//应该根据允不允许选择多个来进行限制 selected_attack_seat_num
		var selected_attack_seats_num = this.ready_to_out_list[0].get_selected_attack_seats_num();
		if(this.selected_attack_seats.length < selected_attack_seats_num && selected_attack_seats_num > 1){//多选
			var selected_attack_seat = this.staff.get_a_seat()[index];
			this.selected_attack_seats.push(selected_attack_seat);
			$seat.addClass('attack_selected');
		}else if(this.selected_attack_seats.length <= selected_attack_seats_num && selected_attack_seats_num == 1){//单选
			var selected_attack_seat = this.staff.get_a_seat()[index];
			this.selected_attack_seats = [];//选清空上一次的
			this.selected_attack_seats.push(selected_attack_seat);
			$seat.parents('.container').find('.seat').removeClass('attack_selected');
			$seat.addClass('attack_selected');
		}else{
			console.log('应该不会出现的第三种情况....');
		}
		
		this.ready_to_out_list[0].can_queren();

	},
	//初始化座位所属DIV信息
	set_div_info : function(){
        this.$div.find('.rolename').text(this.role.get_flag()).attr('no',this.no);
        //加入装备区html结构
        this.$div.find('.zbzone').html(this.html.get_zhuangbei_zone_html());
	},
	update_div_pai_num : function(){
		this.$div.find('.card_num').text(this.pai_list.length);
	},
	update_div_hero_info : function(hero){
		//得到英雄的最大血量和当前血量
		var max_blood = hero.get_max_blood();
		var cur_blood = hero.get_cur_blood();
		var img_code = hero.get_img_code();
		this.$div.find('.bg2').attr('src','./img/wujiang/'+img_code+'.jpg');
		this.$div.find('.bloodzone').html(this.html.get_blood_zone(max_blood,cur_blood));
	},
	html : {
		get_zhuangbei_zone_html : function(){
			//<img src="img/vmeihua.png" alt="梅花">＋－
			var html = '<div class="bg1"></div><div class="vaiqu"><img src="img/vaiqu.gif" alt=""></div><ul class="aiquul"><li class="wuqi"><i class="huase_zb"></i><span class="dots_zb"></span><span class="name_zb"></span><span class="shecheng_zb"></span></li><li class="fangju"><i class="huase_zb"></i><span class="dots_zb"></span><span class="name_zb"></span><span class="shecheng_zb"></span></li><li class="fangyuma"><i class="huase_zb"></i><span class="dots_zb"></span><span class="name_zb"></span><span class="shecheng_zb ma"></span></li><li class="jingongma"><i class="huase_zb"></i><span class="dots_zb"></span><span class="name_zb"></span><span class="shecheng_zb ma"></span></li></ul><div class="card_num"></div>';
			return html;
		},
		get_blood_zone : function(max_blood,cur_blood){//根据最大血量,当前血量确定返回值，这样每次重新生成这个html就可以了，虽然有点儿低性能，但使逻辑变的很简单了，可以采用.
			//<li><img src="img/vtili.png" alt=""></li>
			var hide = '';//血量最大值在大于5滴血时显示
			if(max_blood>5){
				hide = 'hid';
			}
			var red_lis = '';
			var grey_lis = '';
			var is_bloodmax_show = 'hid';
			var is_bloodcur_show = 'hid';
			var blood_red_lis = '';
			var blood_grey_lis = '';
			var red_blood_num = cur_blood;
			var grey_blood_num = max_blood-cur_blood;
			if(max_blood>5){
				is_bloodmax_show = '';
				if(cur_blood==5){
					red_blood_num = 5;
					grey_blood_num = 0;
				}else if(cur_blood < 5){
					red_blood_num = cur_blood;
					grey_blood_num = 5 - cur_blood;
				}else{
					red_blood_num = 4;
					grey_blood_num = 0;
					is_bloodcur_show = '';
				}
			}

			blood_red_lis = this.get_blood_lis(red_blood_num,'red');
			blood_grey_lis = this.get_blood_lis(grey_blood_num,'grey');
			return '<div class="bloodmax '+is_bloodmax_show+'">'+max_blood+'</div><ul class="bloodul">'+blood_red_lis+blood_grey_lis+'</ul><div class="bloodcur '+is_bloodcur_show+'">+<span>'+(cur_blood-red_blood_num)+'</span></div>';
		},
		get_blood_lis : function(num,bloodcolor){
			var lis = '';
			if(bloodcolor=='red'){
				bloodcolor = 'vtili.png';
			}else{
				bloodcolor = 'vtili2.png';
			}
			for(var i = 0;i < num;i++){
				lis += '<li><img src="img/'+bloodcolor+'" alt=""></li>'
			}
			return lis;
		}
	},
	//根据座位数组[0,1,2,3,4,5,6,7]等，计算其他座位与当前座位的最短距离，一个方向（从左往右），当向一个方向计算找到的距离小于数组长度的一半时就说明找到了正确的距离，当扫描距离超过一半找到时，最短距离等于座位数减去找到的距离,只需遍历一次就可以
	//该方法每次在杀点击要出牌时都要算一次，算的时候要综合考虑每个座位类的固定距离加是否有防御马加是否有技能加距的距离之和，并与自己当前的攻击距离（武器加攻击马加技能加距）进行比较，在攻击距离之内的座位类要被标红，如果点杀的时候是放弃出牌，则去掉标红
	//当被杀标红时，点击座位，则把这个座位类放入攻击目标中，当放弃出牌或已出牌时，将攻击目标置空
	//如果是我自己，则最后回标红，如果是电脑，不用标红
	compute_distance: function(is_me){
		//var result = {};
		//计算的目的有两个，1标红，2放到can_attack_seats中
		this.can_attack_seats = [];//先进行一下置空处理
		var attack_dist = this.weapon_distance + this.attack_distance + this.skill_attack_distance;//攻击距离等于得到武器的攻击距离，得到攻击马距离，得到技能加成攻击距离

		var a_seat = this.staff.get_a_seat();
		for(var i = 0,j = a_seat.length;i < j;i++){
			var other_no = a_seat[i].get_no();
			if(other_no!=this.no){
				var dist = Math.abs(other_no - this.no);
				if(dist > j/2){
					dist = j - dist;
				}
				//到这一步，上面的dist得到的是固定距离
				//防御马距离，直接得到座位类的防御马距离，这个属性座位类自己会随时更新
				var fangyuma_dist = a_seat[i].get_defense_distance();
				//第三步，得到座位的技能防御距离
				var skill_defense_distance = a_seat[i].get_skill_defense_distance();
				var defense_dist = dist+fangyuma_dist+skill_defense_distance
				//result[other_no] = defense_dist;
				if(attack_dist>=defense_dist){//如果可以攻击的话
					if(is_me){//如果是我自己，则满足条件的需要标红
						a_seat[i].get_div().addClass('can_attack');
					}else{//对于自动的来说，则将可以攻击的目标先保存起来，便于以后的分析攻击等
						this.can_attack_seats.push(a_seat[i]);
					}
				}
				
			}
		}
		//this.distance = result;
	},
	for_attack : function(){
		this.compute_distance(true);
	},
	cancel_attack : function(){
		$('.seat').removeClass('can_attack attack_selected');//去掉标红等标记
		this.my_attack_seats = [];//清空我自己的攻击目标

	},
	can_attack_click : function($clicked_seat_div){
		//这里就先做只能攻击一个目标的情况，同时攻击多个目标的情况也能做，每次增加attack_selected之前先判断之前已经有几个了，如果小于武器的攻击个数，则加上这个类，同时将my_attack_seats清空，再将现在有的所有选中的seats加入进去，如果已经大于或等于攻击个数了，则不能加上attack_selected这个类
		var _this = this;
		var attack_num = 1;//默认至少可以攻击一个
		if(this.weapon_equip){
			attack_num = this.weapon_equip.get_attack_num();
		}
		
		if(attack_num==1){//只能攻击一个的情况
			this.my_attack_seats = [];
			$('.can_attack').removeClass('attack_selected');
        	$clicked_seat_div.addClass('attack_selected');
        	//console.log('加上了');
			var index = parseInt($clicked_seat_div.find('.rolename').attr('no'));
			var a_seat = this.staff.get_a_seat();
			console.log(index);
			this.my_attack_seats.push(a_seat[index]);
			
		}else{
			var length = $('.attack_selected').length;
			if(length >= attack_num){
				return;
			}
			this.my_attack_seats = [];
			$clicked_seat_div.addClass('attack_selected');
			$('.attack_selected').each(function(){
				var index2 = parseInt($(this).find('.rolename').attr('no'));
				_this.my_attack_seats.push(_this.staff.get_a_seat()[index2]);
			});
		}
	},
	set_div : function($div){
		this.$div = $div;
	},
	get_div : function(){
		return this.$div;
	},
	get_role : function(){
		return this.role;
	},
	set_no : function(no){
		this.no = no;
	},
	get_no : function(){
		return this.no;
	},
	get_staff : function(){
		return this.staff;
	},
	get_panding_zone : function(){
		return this.panding_zone;
	},
	get_step : function(){
		return this.step;
	},
	get_defense_distance : function(){
		return this.defense_distance;
	},
	get_skill_defense_distance : function(){
		return this.skill_defense_distance;
	},
	set_skill_defense_distance : function(skill_defense_distance){
		this.skill_defense_distance = skill_defense_distance;
	},
	get_skill_attack_distance : function(){
		return this.skill_attack_distance;
	},
	set_skill_attack_distance : function(skill_attack_distance){
		this.skill_attack_distance = skill_attack_distance;
	},
	get_weapon_distance : function(){
		return this.weapon_distance;
	},
	set_weapon_distance : function(weapon_distance){
		this.weapon_distance = weapon_distance;
	},
	get_hero : function(){
		return this.hero;
	},
	set_hero : function(hero){
		this.hero = hero;
		//一旦设置英雄后，紧跟着就应该是将英雄的信息展示出来
		this.update_div_hero_info(hero);
		this.$div.attr('hero',hero.get_name());
	},
	get_chu_pai_mult : function(){
		return this.chu_pai_mult;
	},
	set_chu_pai_mult : function(chu_pai_mult){
		this.chu_pai_mult = chu_pai_mult;
	},
	chu_pai_num : function(){
		return this.chu_pai_num;
	},
	chu_pai_num : function(chu_pai_num){
		this.chu_pai_num = chu_pai_num;
	},
	get_pai_list : function(){
		return this.pai_list;
	},
	//两种情况，第一次时直接赋值，以后都是数组合并,注参数都是手牌数组
	set_pai_list : function(pai_list){
		if(this.pai_list){
			tools.concat_two_arr(this.pai_list,pai_list);
		}else{
			this.pai_list = pai_list;
		}
		//这里，设置完后，要马上更新一下手牌数
		this.update_div_pai_num();
	},

	get_mepai_list : function(){
		return this.mepai_list;
	},
	set_mepai_list : function(mepai_list){
		this.mepai_list = mepai_list;
	},
	
	remove_pai_by_id : function(id){
		var index = -1;
		for(var i = 0,j = this.pai_list.length;i < j;i++){
			if(this.pai_list[i].get_no()==id){
				index = i;
				break;
			}
		}
		var pai_for_out = this.pai_list.splice(index,1);
		this.out_for_log_cards.push(pai_for_out[0]);

		pai_for_out[0].chupai();
		//$('.log .cards .cardul').append(pai_for_out[0].get_div());
	},
	remove_pai : function(){
		var _this = this;
		//自动的决定出什么牌的时候，也会给其牌区中的牌加上ready_to_out类,停顿800毫秒，然后再打出
		$('#paiqu'+this.staff.get_i_now()+' .ready_to_out').each(function(){
			var id = $(this).attr('id');
			_this.remove_pai_by_id(id);
		});
	},
	chu_pai : function(){//出牌的过程大概为将ready_to_out的牌从当前seat的pai_list中移出，更新牌区，并决定是否放到弃牌堆
		$('.log .cards .cardul').empty();//清空展示区的牌
		this.remove_pai();
		this.mepai_to_paiqu(this.staff.get_i_now(),0);//加0的意思是不用摸牌但需要这个方法的更新牌区的功能
		this.out_for_log_cards_show();
	},
	qi_pai : function(fn){
		if(this.pai_list){
			var s = this.pai_list.length;
			var chi_pai_max = this.hero.get_cur_blood() - 0 + this.seat_status.get_extra_chipai_num();
			if(chi_pai_max < this.pai_list.length){//如果持牌上限小于当前牌数，则需要弃牌
				var qi_num = this.pai_list.length - chi_pai_max;
				for(var i = 0;i < qi_num;i++){
					var card = this.pai_list.pop();
					this.out_for_log_cards.push(card);
				}
				$('.log .cards .cardul').empty();//清空展示区的牌
				this.mepai_to_paiqu(this.staff.get_i_now(),0);//加0的意思是不用摸牌但需要这个方法的更新牌区的功能
			}
			this.out_for_log_cards_show(fn);
		}else{
			console.log('都没有牌，就不用弃了...');
		}
		
	},
	out_for_log_cards_show : function(fn){ 
		this.staff.get_card_manager().chupai_to_log(this.out_for_log_cards,fn);
		this.out_for_log_cards = [];
	},
	//回头要改造，增加一个摸牌堆，每次摸的牌都放摸牌堆中，然后在牌区展示的时候，先将摸牌堆中的牌放到pai_list中去，然后$ul只是append摸牌堆中的牌，然后再将摸牌堆清空，这是摸牌流程
	//还有出牌流程，从pai_list中去删除，根据删除的id去把展示区中相应的牌DIV去掉就行
	//所以有摸牌到展示区及从展示区出牌的方法,还有就是展示区牌发生变化后的更新方法
	mepai_to_paiqu : function(index,num){
		this.aftermepai(num);
		if(this.pai_list){
			var $cards = $('#paiqu'+index+' .cards');
			var $ul = $cards.find('.cardul');

			$ul.find('.ready_to_out').remove();//先将ready_to_out的牌从牌区移除（如果是摸牌时调用该方法，这时不会有ready_to_out类的牌，如果是出牌时调用该方法，说明ready_to_out类的牌就是要移除的牌）

			for(var i = 0,j = this.mepai_list.length;i < j;i++){
				$ul.append(this.mepai_list[i].get_div());
			}
			var $lis = $cards.find('.cardul > li');
			this.staff.get_card_manager().layout_paiqu_cards($cards,$lis);
		}else{
			console.log('this.pai_list为空me....');
		}
	},
	aftermepai : function(num){//每次摸牌后，要合并座位的pai_list并更新牌数
		var mepai_cards = this.card_manager.get_a_pai(num);
		this.set_mepai_list(mepai_cards);
		this.set_pai_list(mepai_cards);
		this.update_div_pai_num();
		this.card_manager.update_div_pai_count();//更新剩余的牌数
	},
	reset_card_div : function(){//把所有的牌的类名全部去掉
		if(this.pai_list){
			for(var i = 0;i < this.pai_list.length;i++){
				this.pai_list[i].remove_all_class();
			}
		}
	},
	get_seat_status : function(){
		return this.seat_status;
	},
	set_seat_status : function(seat_status){
		this.seat_status = seat_status;
	},
	get_zhuangbei_zone : function(){
		return this.zhuangbei_zone;
	},
	set_can_attack_seats : function(can_attack_seats){
		this.can_attack_seats = can_attack_seats;
	},
	get_can_attack_seats : function(){
		return this.can_attack_seats;
	},
	set_selected_attack_seats : function(selected_attack_seats){
		this.selected_attack_seats = selected_attack_seats;
	},
	get_selected_attack_seats : function(){
		return this.selected_attack_seats;
	},
	set_ready_to_out_list : function(ready_to_out_list){
		//这个方法根据允许不允许会有不同的处理方式   _this.get_cur_seat().get_chu_pai_mult()
		if(this.chu_pai_mult){//允许出多牌
			tools.concat_two_arr(this.ready_to_out_list,ready_to_out_list);
		}else{//不允许出多张，保留最新的准备要出的牌
			this.ready_to_out_list = ready_to_out_list;
		}
	},
	get_ready_to_out_list : function(){
		return this.ready_to_out_list;
	}
}