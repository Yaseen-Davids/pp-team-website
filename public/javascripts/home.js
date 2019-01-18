$(document).ready(function(){

    // ******************** GET DATE ********************
    function getDate(){

        var date = new Date();
        var day = date.getDay();
        var theDate = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();

        var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        var monthsOfYear = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Nov', 'Dec'];

        dayText = daysOfWeek[day - 1];
        dateText = monthsOfYear[month] + ", " + theDate + " " +  year;

        $(".today_day").text(dayText);
        $(".today_date").text(dateText);
    }
    getDate();
     
    // ******************** WEATHER API ********************
    var url = "https://api.apixu.com/v1/current.json?key=8585e574c307411ea26131730180612&q=South Africa/Cape Town&days=6";

    // GET the weather
    $.ajax({
        url: url,
        method: "GET",
        success: function(result){
            console.log(result);
            $(".weather_temp_text").text(result.current.temp_c + "°C");
            $(".weather_condition").text(result.current.condition.text);
            $(".wind_text").text(result.current.wind_kph + " km/h");
            $(".humidity_text").text(result.current.humidity);
            $(".cloud_text").text(result.current.cloud);
            $(".weather_icon").append("<img src=' "+ result.current.condition.icon +"' >");
        }
    })

    // **************** MARK TASK AS COMPLETE OR NOT COMPLETE ****************

    $('.note_icon').on('click', function(e){

        // IF TASK IS NOT COMPLETE, MARK AS COMPLETE
        if ($(this).hasClass("note_check")){

            $(this).addClass("note_complete");
            $(this).closest(".notes_left").find(".delete_note").addClass("completed_task");
            $(this).removeClass("note_check");

            let target = $(this);
            const id = target.attr('data-id');
            
            $.ajax({
                method: 'GET',
                url: '/completed/'+id,
                done: function(response){
                    console.log("Task updated")
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
        // IF TASK IS COMPLETE, MARK AS NOT COMPLETE
        else if ($(this).hasClass("note_complete")){

            $(this).addClass("note_check");
            $(this).closest(".notes_left").find(".delete_note").removeClass("completed_task");
            $(this).removeClass("note_complete");
    
            let target = $(this);
            const id = target.attr('data-id');

            $.ajax({
                method: 'GET',
                url: '/redo-note/'+id,
                done: function(response){
                    console.log("Task updated")
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
    });

    // ******************** CHECK IF USER HAS NOTES ********************
    if ($(".notes_text").hasClass("visible")){
        console.log("There are tasks")
    }
    else{
        $("#notes_length").text("You have no tasks. To add a task, click the Add Task button.")
    }

    // ******************** NEWS API ********************
    var newsURL = 'https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=b04c0503ef41477cba37485ef01b7a7b';

    $.ajax({
        url: newsURL,
        method: 'GET',
        success: function(news){
            var articles = news.articles;
            for (let n = 0; n < articles.length; n++){
                $(".news_content").append(
                    '<div class="news_box">' +
                        '<div class="news_image">' +
                            '<a href="' + articles[n].url +'" target="_blank"><img class="news_img" src=" '+ articles[n].urlToImage + ' " alt=""></a>' +
                        '</div>' +
                        '<div class="news_text">' +
                            '<a href="' + articles[n].url + '" target="_blank"><p class="article_title">' + articles[n].title + '</p></a>' +
                            '<p class="article_info">' +
                                '<i class="fas fa-user"></i><span class="article_author">' + articles[n].author + '</span>' +
                                '<i class="fas fa-calendar calendar_icon"></i><span class="article_date">' + articles[n].publishedAt + '</span>' +
                            '</p>' +
                        '</div>' +
                    '</div>'
                );
            }
        }
    })

    // ******************** EDIT TASK********************
    $(".notes_notes").on('click', function(){

        let targetID = $(this).attr('data-id');
        console.log(targetID)

        // MAKE API CALL TO POST THE DATA TO THE EDIT TASK MODAL
        $.ajax({
            url: '/notes_data/' + targetID,
            method: "GET",
            success: (noteData) =>{

                console.log(noteData)

                $("#note_id").val(noteData._id);
                $("#note_username").val(noteData.username);
                $("#note_edit").val(noteData.note);
                $("#note_importance").val(noteData.importance);

            }
        })

    })

    $(".edit_merchant").on('click', function(){

        var id = $(this).attr("data-id");

        $.ajax({
            url: "/get_merchant/" + id,
            method: "GET",
            contentType: "application/json",
            success: function(response){

                $("#merchant_username").val(response.username);
                $("#merchant_id").val(response._id);
                $("#merchant_name").val(response.name);
                $("#merchant_sandbox").val(response.sandbox);
                $("#merchant_documents").val(response.documents);
                $("#merchant_contract").val(response.contract);
                $("#merchant_update").val(response.update);

            }
        })

    });

    // $(".delete_merchant").on('click', function(){

    //     let confirmDelete = confirm("Are you sure you want to delete this merchant ?");
    //     if (confirmDelete == true){
            
    //         $(this).closest("tr").remove();
    //         // target event
    //         let target = $(this);
    //         // Data attrib of button
    //         const id = target.attr('data-id');

    //         // Ajax function
    //         $.ajax({
    //             method: 'DELETE',
    //             url: '/delete-merchant/'+id,
    //             success: function(response){
    //                 console.log("Task deleted")
    //             },
    //             error: function(err){
    //                 console.log(err);
    //             }
    //         });
    //     }

    // })

})