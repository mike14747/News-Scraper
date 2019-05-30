"use strict";

$(document).ready(function () {

    $(".add_note").on("click", function(event) {
        event.preventDefault();
        $.get("/article/" + $(this).val(), data => {
            $("#article_title").html("<i class='far fa-newspaper mr-2'></i>" + data.title);
            $("#article_link").html("<a href='" + data.link + "' target='_blank'>" + data.link + "</a>");
            $("#article_source").text(data.website);
        });
        $("#article_id").attr("value", $(this).val());
        $("#add_note_modal").modal("show");
    });

    // delete a single article
    $(".delete_article").on("click", function(event) {
        event.preventDefault();
        var deleteItem = {
            article_id: $(this).val()
        };
        $.ajax('/api/article/delete', {
            type: 'DELETE',
            data: deleteItem
        }).then(response => $(location).attr('href', '/articles'));
    });

    // delete all articles
    $(".delete_articles").on("click", event => {
        event.preventDefault();
        $.ajax('/api/articles/delete', {
            type: 'DELETE'
        }).then(response => $(location).attr('href', '/articles'));
    });

    $("#submit_note").on("click", event => {
        event.preventDefault();
        $("#add_note_modal").modal("hide");
        var note_info = {
            text: $("#note_text").val().trim(),
            article_id: $("#article_id").val()
        }
        $.post("/api/note", note_info)
            .then(response => {
                if (response === "error") {
                    console.log(error);
                } else {
                    $(location).attr('href', '/articles');
                }
            });
    });

    $(".update_note").on("click", event => {
        event.preventDefault();
        var note_info = {
            text: $("form textarea[name=note_text]").val().trim(),
            note_id: $("form input[name=note_id]").val()
        }
        $.ajax('/api/note/update', {
            type: 'PUT',
            data: note_info
        }).then(response => $(location).attr('href', '/articles'));
    });

    $(".delete_note").on("click", event => {
        event.preventDefault();
        var deleteNote = {
            note_id: $("form input[name=note_id]").val()
        };
        $.ajax('/api/note/delete', {
            type: 'DELETE',
            data: deleteNote
        }).then(response => $(location).attr('href', '/articles'));
    });

});