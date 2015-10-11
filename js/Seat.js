//座位类
//座位类中有装备区，有判定区，有状态区（麻，禁，翻），有牌区，有角色，有与其他座位的距离列表，有攻击距离，防御距离,阶段类
function Seat(staff,role){
	this.staff = staff;//舞台类
	this.role = role;//角色
	this.hero = null;
	this.panding_zone = new PandingZone(this,role);//判定区
	this.step = new Step(this,staff);//阶段类
	this.weapon_equip = null;//武器装备区
	this.weapon_distance = 1;//武器的攻击距离,即使没有武器，攻击距离至少也是1
	this.shield_equip = null;//盾牌装备区
	this.defense_horse = null;//防御马
	this.attack_horse = null;//攻击马
	this.ma_status = false;//默认不麻
	this.jin_status = false;//默认不禁
	this.fan_status = false;//默认不翻
	this.pai_list = null;//手牌列表
	this.distance = null;
	this.attack_distance = 0;//攻击距离默认为0
	this.defense_distance = 0;//防御距离默认为0
	this.skill_attack_distance = 0;//技能攻击距离
	this.skill_defense_distance = 0;//技能防御距离
	this.$div = null;//座位类对应的div
	this.no = null;//座位号，可以用这个来计算距离
	this.can_attack_seats = [];//本座位可以攻击的其他座位的数组,主要用于电脑攻击分析
	this.my_attack_seats = [];//我自己的攻击目标，主要是自己用
}
Seat.prototype = {
	constructor : Seat,
	init : function(){
		this.set_div_info();
		//this.compute_distance();//计算当作座位与其他座位的距离
	},
	test : function(){
		console.log(this.my_attack_seats.length);
		for(var i = 0,j = this.my_attack_seats.length;i < j;i++){
			this.my_attack_seats[i].get_div().html('test');
		}
	},
	//初始化座位所属DIV信息
	set_div_info : function(){
        this.$div.find('.rolename').text(this.role.get_flag()).attr('no',this.no);
        //加入装备区html结构
        this.$div.find('.zbzone').html(this.html.get_zhuangbei_zone());
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
		get_zhuangbei_zone : function(){
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
		var result = {};
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
				result[other_no] = defense_dist;
				if(attack_dist>=defense_dist){//如果可以攻击的话
					if(is_me){//如果是我自己，则满足条件的需要标红
						a_seat[i].get_div().addClass('can_attack');
					}else{//对于自动的来说，则将可以攻击的目标先保存起来，便于以后的分析攻击等
						this.can_attack_seats.push(a_seat[i]);
					}
				}
				
			}
		}
		this.distance = result;
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
	get_pai_list : function(){
		return this.pai_list;
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
	//两种情况，第一次时直接赋值，以后都是数组合并,注参数都是手牌数组
	set_pai_list : function(pai_list){
		if(this.pai_list){
			this.pai_list.concat(pai_list);
		}else{
			this.pai_list = pai_list;
		}
	},
	//将座位中的牌列表放到牌区中去(当然，基本上自动的不会用到，不过在测试的时候可以用用)
	cards_to_cardzone_me : function(){
		if(this.pai_list){
			var $cards = $('.myzone .cards');
			var $ul = $cards.find('.cardul');
			for(var i = 0,j = this.pai_list.length;i < j;i++){
				$ul.append(this.pai_list[i].get_div());
			}
			var $lis = $cards.find('.cardul > li');
			this.staff.get_card_manager().layout_paiqu_cards($cards,$lis);
		}else{
			console.log('this.pai_list为空me....');
		}
	},
	cards_to_cardzone_computer : function(){
		if(this.pai_list){
			var $cards = $('.computer .cards');
			var $ul = $cards.find('.cardul');
			$ul.empty();//在用之前把上一个的清空
			for(var i = 0,j = this.pai_list.length;i < j;i++){
				$ul.append(this.pai_list[i].get_div());
			}
			var $lis = $cards.find('.cardul > li');
			this.staff.get_card_manager().layout_paiqu_cards($cards,$lis);
		}else{
			console.log('this.pai_list为空auto....');
		}
	}
}