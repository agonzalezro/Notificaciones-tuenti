function loading(type) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://m.tuenti.com", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (type == "popup")
                show_popup(xhr.responseText);
            else if (type == "notification")
                show_notification(xhr.responseText);
        }
    }
    xhr.send(null);
}


function get_messages(response) {
    messages = 0;

    //1 mensaje|1 message|1 missatge|1 mensaxe|Iruzkin 1
    messages = String(response.match("[0-9]+ (mensaje|message|missatge)|ruzkin.*[0-9]+")); 
    messages = messages.match("[0-9]+");

    return messages;
}


function get_wall_posts(response) {
    wall_posts = 0;

    //1 nuevo|1 wall|1 comentari|1 entrada|mezu 1
    wall_posts = String(response.match("([0-9]+ (comment|wall|nuevo|comentari)|ezu.*[0-9]+).{2,10}small")); 
    wall_posts = wall_posts.match("[0-9]+");

    return wall_posts;
}


function get_content(messages, wall_posts, plain) {
    //Format messages
    if (messages == 1) { messages = "1 mensaje privado"; }
    else if (messages > 1) { messages = messages + " mensajes privados"; }
    else { messages = null; }
    if (messages != null && plain != true) messages = "<a target='_blank' href='http://www.tuenti.com/#m=Message&func=index'>" + messages + "</a>"; 

    //Format wall posts
    if (wall_posts == 1) { wall_posts = "1 comentario"; }
    else if (wall_posts > 1) { wall_posts = wall_posts + " comentarios"; }
    else { wall_posts = null; }
    if (wall_posts != null && plain != true) wall_posts = "<a target='_blank' href='http://www.tuenti.com/#m=Profile&func=index'>" + wall_posts + "</a>";

    if (plain) {
        //Format both
        if (messages != null && wall_posts != null) { innerHTML = messages + " y " + wall_posts; }
        else if (messages != null && wall_posts == null) { innerHTML = messages; }
        else if (messages == null && wall_posts != null) { innerHTML = wall_posts; }
        else { return null; }
    } else {
        //Format both
        if (messages != null && wall_posts != null) { innerHTML = messages + "<br/>" + wall_posts; }
        else if (messages != null && wall_posts == null) { innerHTML = messages; }
        else if (messages == null && wall_posts != null) { innerHTML = wall_posts; }
        else { innerHTML = "No hay notificaciones o no est&aacute;s conectado a <a target='_blank' href='http://m.tuenti.com'>m.tuenti.com</a>"; }
    }

    return innerHTML;
}

function get_innerText(messages, wall_posts) {
    innerHTML = get_innerHTML(messages, wall_posts, true);
    innerHTML = innerHTML.replace("<a.*index>", "");
}

function show_popup(response) {
    messages = get_messages(response);
    wall_posts = get_wall_posts(response);

    innerHTML = get_content(messages, wall_posts, false);

    document.getElementById("notifications").innerHTML = innerHTML;
}


function show_notification(response) {
    messages = get_messages(response);
    wall_posts = get_wall_posts(response);


    if ((messages != null) || (wall_post != null)) {
        webkitNotifications.createNotification(
          'icon48.png',
          'Tienes nuevas notificaciones',
          get_content(messages, wall_posts, true)
        ).show();
    }
}

