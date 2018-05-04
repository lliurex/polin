

function formFactory(){
}

formFactory.prototype.createSelect=function createSelect(item, columns=1){
  
  var disabled="";
  if (item.disabled==="true") disabled=' disabled="disabled" ';
  
  if (columns!=1){
    var left_col_size="col-md-12";
    var right_col_size="col-md-12";
  }
  else{
    var left_col_size="col-md-2";
    var right_col_size="col-md-10";
  }
  var cols_str="col-md-"+Math.floor(12/columns);
  
  
  var sel='<div class="form-group '+cols_str+'" title="'+item.help+'" >';
    sel+='<label for="'+item.id+'" class="'+left_col_size+' control-label">'+item.label+'</label>';
    sel+='<div class="'+right_col_size+'">';
    sel+='<select id="'+item.id+'" class="form-control" '+disabled+'>';
    for (var i in item.options){
        var selected="";
        if (item.options[i].value==item.default) selected=' selected ';
        sel+="<option "+selected+" value="+item.options[i].value+">"+item.options[i].label+"</option>";
    }
    sel+="</select></div></div>";
    
    return sel;
};

formFactory.prototype.createCheckbox=function createCheckbox(item, columns=1){
    
    if (columns!=1){
      var left_col_size="col-md-12";
      var right_col_size="col-md-12";
    }
    else{
      var left_col_size="col-md-2";
      var right_col_size="col-md-10";
    }
    
    var cols_str="col-md-"+Math.floor(12/columns);
    
    var checked="";
    var disabled="";
    if (item.default=="checked") checked=" checked ";
    if (item.disabled=="true") disabled=" disabled ";
    var content='<div class="form-group '+cols_str+'" title="'+item.help+'">';
    content+='<label class="'+left_col_size+' control-label">';
    content+=item.label+'</label>';
    content+='<div class="'+right_col_size+'">';
    content+='<div class="checkbox"><label>';
    content+='<input type="checkbox" '+checked+' '+disabled+' name="'+item.id+'" id="'+item.id+'"/></label></div>';
    content+="</div></div>";
    return content;
}


formFactory.prototype.createText=function createText(item, columns=1){
    
  if (columns!=1){
    var left_col_size="col-md-12";
    var right_col_size="col-md-12";
  }
  else{
    var left_col_size="col-md-2";
    var right_col_size="col-md-10";
  }
  var cols_str="col-md-"+Math.floor(12/columns);
  
  var disabled="";
  if (item.disabled==="true") disabled=' disabled="disabled" ';
  
  var sel='<div class="form-group '+cols_str+'" title="'+item.help+'" controlid="'+item.id+'">';
    sel+='<label for="'+item.id+'" class="'+left_col_size+' control-label">'+item.label+'</label>';
    sel+='<div class="'+right_col_size+'">';
    sel+='<input id="'+item.id+'" class="form-control" type="text" value="'+item.value+'" '+disabled+'>';
    sel+="</input></div></div>";
    return sel;
};

formFactory.prototype.createTextArea=function createTextArea(item, columns=1){
  
  if (columns!=1){
    var left_col_size="col-md-12";
    var right_col_size="col-md-12";
  }
  else{
    var left_col_size="col-md-2";
    var right_col_size="col-md-10";
  }
  var cols_str="col-md-"+Math.floor(12/columns);
  

  var disabled="";
  if (item.disabled==="true") disabled=' disabled="disabled" ';
  
  var sel='<div class="form-group '+cols_str+'" title="'+item.help+'" >';
    sel+='<label for="'+item.id+'" class="'+left_col_size+' control-label">'+item.label+'</label>';
    sel+='<div class="'+right_col_size+'">';
    sel+='<textarea id="'+item.id+'" class="form-control" type="text" '+disabled+'>'+item.value;
    sel+="</textarea></div></div>";
    return sel;
};
