$(document).ready(function(){

    $(".modal_btn").on('click', function(){
        var modalNo = $(this).data("modal");
        // OPEN MODAL BOX
        if ($(".modal_wrapper").hasClass(modalNo)){
            modalClass = "." + modalNo
            $(modalClass).fadeIn("fast");
        }
        var confirmDelete = $(this).attr("data-delete");
        var confirmAdmin = $(this).attr("data-confirm");
        var id = $(this).attr("data-id");
        var email = $(this).attr("data-email");

        $("#delete_button").addClass(confirmDelete);
        $("#delete_button").attr("data-id", id);

        $("#confirm_button").addClass(confirmAdmin);
        $("#confirm_button").attr("data-id", id);
        $("#confirm_button").attr("data-email", email);
    })

    // CLOSE MODAL BOX
    $(".close_modal").on('click', function(){
        if ($("#delete_button").attr("class") != undefined){
            var deleteClass = $("#delete_button")[0].className;
            $("#delete_button").removeClass(deleteClass);
            $("#delete_button").attr("data-id", "");
            $("#delete_button").attr("data-email", "");
            $(modalClass).fadeOut("fast");
        }

        else if ($("#confirm_button").attr("class") != undefined){
            var confirmClass = $("#confirm_button")[0].className;
            $("#confirm_button").removeClass(confirmClass);
            $("#confirm_button").attr("data-id", "");
            $("#confirm_button").attr("data-email", "");
            $(modalClass).fadeOut("fast");
        }
        else{
            $(modalClass).fadeOut("fast");
        }
    })
})