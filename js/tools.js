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
    }
}