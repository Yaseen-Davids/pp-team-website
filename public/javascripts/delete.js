$(document).ready(function(){

    // ******************** DELETE MAIN FUNCTION ********************
    $("#delete_button").on("click", function(){
        
        var theClass = $(this)[0].className;
        var id = $(this).attr("data-id");

        if (theClass == "delete_task"){
            deleteTask(id);
        }
        else if (theClass == "delete_merchant"){
            deleteMerchant(id);
        }
        else{
            console.log("Class not found");
        }

    })

    // DELETE TASK
    function deleteTask(id){

        var thearray = $(".notes_text").data("id", id).closest("p");

        for (let i = 0; i < thearray.length; i++){
            if (thearray[i].dataset.id == id){
                thearray[i].remove();
                confirmDeleteTask(id);
                $(".close_modal").click();
                return;
            }
            else{
                console.log("Something went wrong");
            }
        }
    }
    // CONFIRM DELETE TASK
    function confirmDeleteTask(id){
        $.ajax({
            method: 'DELETE',
            url: '/delete-note/id='+id,
            success: function(response){
                window.location.href = "/";
            },
            error: function(err){
                console.log(err);
            }
        });
    }

    // DELETE MERCHANT
    function deleteMerchant(id){
        var thearray = $(".delete_merchant").data("id", id).closest("td");

        for (let i = 0; i < thearray.length; i++){
            if (thearray[i].dataset.id == id){
                thearray[i].closest("tr").remove();
                confirmDeleteMerchant(id);
                $(".close_modal").click();
                return;
            }
            else{
                console.log("Something went wrong");
            }
        }
    }
    // CONFIRM DELETE MERCHANT
    function confirmDeleteMerchant(id){
        $.ajax({
            method: 'DELETE',
            url: '/delete-merchant/'+id,
            success: function(response){
                console.log("Task deleted")
            },
            error: function(err){
                console.log(err);
            }
        });
    }
    
    // CONFIRM BUTTON
    $("#confirm_button ").click(function(){

        var theClass = $(this)[0].className;
        var id = $(this).attr("data-id");

        console.log(theClass);
        console.log(id);

        if (theClass == "confirm_admin"){
            confirmAdmin(id);
        }
        else{
            console.log("Class not found");
        }

    });

    function confirmAdmin(id){
        console.log(id);
    }

})