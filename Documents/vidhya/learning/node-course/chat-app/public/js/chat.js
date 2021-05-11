const socket = io(); // used to send and receive events

// Elements 
const messageInputBoxElem = document.querySelector("#message_box");
const submitBtn = document.querySelector("#submit");
const sendLocationBtn = document.querySelector("#send_location");
const $messages = document.querySelector("#messages");

// Templates 
const messageTemplate = document.querySelector("#message_template").innerHTML;
const locationTemplate = document.querySelector("#location_template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar_template").innerHTML;

// Options 
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true});

const autoScroll = () => {
  // New Message Element 
  const $newMessage = $messages.lastElementChild;

  // Height of the new message 
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // visible height 
  const visibleHeight = $messages.offsetHeight;

  // height of messages container 
  const containerHeight = $messages.scrollHeight;

  // how far i have reached 
  const scrollOffset = $messages.scrollTop + visibleHeight;
  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
  console.log(newMessageStyles)
}

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('hh:mm a'),
    username: message.username
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on("locationMessage", (message) => {
  const html = Mustache.render(locationTemplate, {
    url: message.url,
    createdAt: moment(message.createdAt).format('hh:mm a'),
    username: message.username
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  document.querySelector("#sidebar").innerHTML = html;
});

submitBtn.addEventListener("click", () => {  
  submitBtn.setAttribute("disabled", "disabled");
  socket.emit('sendMessage', messageInputBoxElem.value, (error) => {
    if (error) {
      return console.log(error)
    }
    submitBtn.removeAttribute("disabled");
    messageInputBoxElem.value = '';
    messageInputBoxElem.focus();
    console.log("Message delivered!");
  });
})

sendLocationBtn.addEventListener("click", () => {  
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported in your browser")
  }
  sendLocationBtn.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    const locationObj = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    socket.emit('sendLocation', locationObj , () => {
      sendLocationBtn.removeAttribute("disabled");
    });
  });
})

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
