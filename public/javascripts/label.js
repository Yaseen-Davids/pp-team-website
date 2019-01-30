$(document).ready(function(){

    $(".label_main").hover(function(){

        theLabel = $(".the_label");

        var labelNo = $(this).data("label");

        if ($(theLabel).hasClass(labelNo)){
            var left = $(this).offset().left - 50;
            var top = $(this).offset().top + 30;
            $("."+labelNo).css("opacity","1");
            $(theLabel).css("left", left);
            $(theLabel).css("top", top);
        }

    }, function(){
        $(theLabel).css("opacity", "0");
        $(theLabel).attr("style", "");
        if ($(theLabel).css("opacity") == "1"){
            $(theLabel).css("opacity", "0"); 
        }
    });

    $('.label_main').mouseleave(function(){
        $(theLabel).css("opacity", "0");
    })
    
})