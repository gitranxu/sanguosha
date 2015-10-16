var tools = {
    concat_two_arr : function(arrto,arrsource){
        for(var i = 0,j = arrsource.length;i < j;i++){
            arrto.push(arrsource[i]);
        }
    },
    get_rand_between_two_num : function(min,max){
        return parseInt(Math.random()*(max-min+1))+min;
    },
    //不重复拿到数组中的值
    get_rand_from_arr : function(arr){
        return arr.splice(this.get_rand_between_two_num(0,arr.length-1),1);
    },
    trans_to_float : function($lis){
    	$lis.parent().removeClass('absoluteul').addClass('floatul');
    },
    trans_to_absolute : function($lis){
    	for(var i = $lis.length-1;i >= 0;i--){
    		var $theli = $lis.eq(i);
    		$theli.css({
    			left : $theli.position().left,
    			zIndex : i+2
    		});
    	}
    	$lis.parent().removeClass('floatul').addClass('absoluteul');
    	//console.log('trans_to_absolute');
    },
    /*当大于时为absolute布局，这时候有错位，第一张牌left值不变，后面的牌left值向左错
		的位置为：(li.length*li.width-$cards.width)/li.length*/
    adjust_position : function($lis,i_cuowei){
    	//console.log(i_cuowei);
    	$lis.each(function(index){
    		if(index!=0){
    			var i_total_cuowei = Math.abs($(this).position().left-i_cuowei*index);
    			//$(this).css({left:i_total_cuowei});//常规效果
    			$(this).animate({left: i_total_cuowei},35*index);//效果爽到爆,动画有待改善
    		}
    	});
    }
}