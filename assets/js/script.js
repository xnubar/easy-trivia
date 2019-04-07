var queryUrl = "https://opentdb.com/api.php?amount=10";

var question = null;
var questionList = null

var timeInterval;
var correctAnswers = 0;
var wrongAnswers = 0;
var unanswered = 0;


var totalTime;
var minutes, seconds;


var audio = new Audio("./assets/musics/start.mp3")
audio.play();

function randomIndex(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) * min;
}
function fillAnswers(arr, index) {
    return arr.filter(function (item) {
        return item !== arr[index]
    })
}

function fillQuestions(arr) {
    $(".variants").empty();
    for (let i = 0; i < arr.results.length; i++) {
        let questionObj = arr.results[i];

        let div = $("<div>");
        $(div).addClass("variant")

        let span = $("<span>")
        $(span).addClass("question-num");
        $(span).html(i + 1 + ")")

        let h3 = $("<h3>");
        $(h3).addClass("question-text");
        $(h3).html(questionObj.question);

        $(div).append(span);
        $(div).append(h3);

        var answers = arr.results[i].incorrect_answers;
        answers.push(arr.results[i].correct_answer);
        for (let j = 0; j < arr.results[i].incorrect_answers.length; j++) {

            let input = $("<input>");
            $(input).attr("type", "radio");
            $(input).addClass("variant-num");
            $(input).attr("name", i)
            $(input).data("value", i);
            $(input).data("variant", i)


            let h4 = $("<h4>")
            $(h4).addClass("variant-text");
            $(h4).data("variant", i)

            let index = randomIndex(0, answers.length);
            $(h4).html(answers[index]);
            $(div).append(input);
            $(div).append(h4);
            answers = fillAnswers(answers, index);

        }

        $(div).append("<br>")



        $(".variants").append(div)
        $(".start-btn").hide();
        $(".submit-btn").show();
    }
}



function countdown() {

    let timeArr = $(".timer").html().split(":");
    if (parseInt(timeArr[0]) == 0 && parseInt(timeArr[1]) == 0) {
        finish();
        return;
    } else {
        if (parseInt(timeArr[1]) > 0) {
            timeArr[1] = parseInt(timeArr[1]) - 1;
        } else if (parseInt(timeArr[0]) > 0) {
            timeArr[0] = parseInt(timeArr[0]) - 1;
            timeArr[1] = 59;
        }
        $(".timer").html(timeArr[0] + ":" + timeArr[1])
    }


}
$(document).on("click", ".start-btn", function () {


    $.ajax({
        url: queryUrl,
        method: 'GET'
    }).done(function (response) {
        let questions = response.results;
        questionList = response.results;
        fillQuestions(response);


        totalTime = questionList.length*5000;
        minutes = Math.floor((totalTime / 60000));
        seconds = Math.floor((totalTime / 1000) % 60);
        $(".timer").html(minutes + ":" + seconds)
        timeInterval = setInterval(countdown, 1000);
    })




})



$(document).on("click", ".variant-num", function () {
    let index = parseInt($(this).data("value"));
    if (questionList[index].correct_answer == $($(this).next()).html()) {
        correctAnswers++;
    } else {
        wrongAnswers++;
    }
})

function finish() {
    clearInterval(timeInterval);
    audio.pause();
    unanswered = questionList.length - (correctAnswers + wrongAnswers)
    $(".variants").hide();
    $(".description-header").show();
    $(".correct-answers-text").show();
    $(".correct-answers").html(correctAnswers)
    $(".wrong-answers-text").show();
    $(".wrong-answers").html(wrongAnswers)
    $(".unanswered-text").show();
    $(".unanswered").html(unanswered)
    $(".submit-btn").hide();
}
$(document).on("click", ".submit-btn", function () {
    finish();
})