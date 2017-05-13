
var socket = io();

function scrollToBottom () {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child')
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

 //   if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
   // }
}


$('#message-form').on('submit',(e)=>{
    e.preventDefault();
    socket.emit("createMessage",generatem("empty",$('#message').val()),(data)=>{
        $('#message').val('');
    });
})


function generatem (admin,message){
    return {from:admin,text:message,createdat:new Date().getTime()}
}

socket.on("connect",()=>{
    var param = jQuery.deparam(window.location.search);
        socket.emit("join",param,(err)=>{
            if(err){
              alert("name and group name are required");
            window.location.href = "/";}
                else
                console.log("no error");
        })
})

socket.on("updateuserlist",(users)=>{
    var ol = $("<ol></ol>");

    users.forEach((user)=>{
        ol.append($("<li></li>").text(user))
    })

    $("#users").html(ol);
})

socket.on('disconnect',()=>{
    console.log("disconnected from server");
})

socket.on("newMessage",(message)=>{
    var template = $('#message-template').html();
    var time = moment(message.createdat).format("h:mm a");
    var html = Mustache.render(template,{from:message.from,createdat:time,text:message.text});
    $('#messages').append(html);
    scrollToBottom();

})

var locbtn = $('#message-location');
locbtn.on('click',()=>{
    if(!navigator.geolocation)
        return  alert("geolocation not supported by your browser");

    locbtn.attr("disabled","disabled");
    locbtn.text('sending location');
    navigator.geolocation.getCurrentPosition((position)=>{
        locbtn.text("send location");
        locbtn.removeAttr('disabled');
        socket.emit("createlocmessage",{latitude:position.coords.latitude,longitude:position.coords.longitude});
    },()=>{
        locbtn.removeAttr('disabled');
        alert("unable to fetch your location");
    })
})

socket.on("newlocmessage",(coords)=>{
    var time = moment(coords.createdat).format("h:mm a");
    var url = "https://google.com/maps?q="+coords.text;
    var template = $('#location-template').html();
    var html = Mustache.render(template,{from:coords.from,createdat:time,url:url});
    $('#messages').append(html);
    scrollToBottom();

})
