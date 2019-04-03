$(document).ready(function(){

    // ******************** GET DATE ********************
    function getDate(){

        var date = new Date();
        var day = date.getDay();
        var theDate = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();

        var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var monthsOfYear = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Nov', 'Dec'];

        dayText = daysOfWeek[day];
        dateText = monthsOfYear[month] + ", " + theDate + " " +  year;

        $(".today_day").text(dayText);
        $(".today_date").text(dateText);
    }
    getDate();
     
    // ******************** WEATHER API ********************
    var url = "https://api.apixu.com/v1/current.json?key=8585e574c307411ea26131730180612&q=South Africa/Cape Town&days=6";

    // GET the weather
    function getWeather(){
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
                $(".loading_wrapper").fadeOut();
            }
        })
    }
    getWeather();

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

    function getNews(){
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
                    $(".loading_wrapper").fadeOut();
                }
            }
        })
    }

    getNews();
    
    $("#refresh-news").click(function(){
        $(".loading_wrapper").fadeIn();
        $(".news_content").html("");
        getNews();
    })

    $("#refresh-weather").click(function(){
        $(".loading_wrapper").fadeIn();
        $(".weather_temp_text").text("");
        $(".weather_condition").text("");
        $(".wind_text").text("");
        $(".humidity_text").text("");
        $(".cloud_text").text("");
        $(".weather_icon").html("");
        getWeather();
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

    $(".breadcrumbs").click(function(){
        $(this).fadeOut("slow");
    })

    $("#copy-data").click(function(e){
        
        e.preventDefault();
        
        let arr = $(".checkbox");
        let dataToCopy = [];

        for (let i2 = 0; i2 < arr.length; i2++){
            if ($(arr[i2])[0].checked == true){
                dataToCopy.push($(arr[i2])[0].value);
            }
        }

        if (dataToCopy.length == 0){
            console.log("Nothing to copy");
        }
        else{
            var tableData = $(".merchants_table");
            var tbodyRows = $(tableData)[0].children[1].rows;

            $("#input-copydata").text("");

            for (let i = 0; i < tbodyRows.length; i++){

                var merchantName = tbodyRows[i].children[0].innerText,
                merchantSandbox = tbodyRows[i].children[1].className,
                merchantDocs = tbodyRows[i].children[2].className,
                merchantContract = tbodyRows[i].children[3].className,
                merchantUpdate = tbodyRows[i].children[4].innerText;

                if (merchantSandbox == "checked"){
                    merchantSandbox = "Sandboxes created"
                }
                else if (merchantSandbox == "unchecked"){
                    merchantSandbox = "Sandboxes NOT created"
                }
                if (merchantDocs == "checked"){
                    merchantDocs = "Documents received"
                }
                else if (merchantDocs == "unchecked"){
                    merchantDocs = "Documents NOT received"
                }
                if (merchantContract == "checked"){
                    merchantContract = "Contract received"
                }
                else if (merchantContract == "unchecked"){
                    merchantContract = "Contract NOT received"
                }

                var copyData = merchantName;
                
                for (let i3 = 0; i3 < arr.length; i3++){
                    if ($(arr[i3])[0].value == "Sandbox"){
                        if($(arr[i3])[0].checked == true){
                            copyData += " - " + merchantSandbox;
                        }
                    }
                    else if ($(arr[i3])[0].value == "Docs"){
                        if($(arr[i3])[0].checked == true){
                            copyData += " - " + merchantDocs;
                        }
                    }
                    else if ($(arr[i3])[0].value == "Contract"){
                        if($(arr[i3])[0].checked == true){
                            copyData += " - " + merchantContract;
                        }
                    }
                    else if ($(arr[i3])[0].value == "Update"){
                        if($(arr[i3])[0].checked == true){
                            copyData += " - " + merchantUpdate;
                        }
                    }
                }

                copyData += "\n"

                $("#input-copydata").append(copyData);
            }

            $("#input-copydata").select();
            document.execCommand("copy");

            $(".modal_11").fadeOut();

            // SHOW BREADCRUMB
            $(".breadcrumbs").fadeIn("fast");
            // HIDE BREADCRUMBS AFTER 2 SECONDS
            setTimeout(function(){
                $(".breadcrumbs").fadeOut("slow");
            },2000);
        }
    });

})