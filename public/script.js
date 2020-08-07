const socket = io("/");
var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'443'
}); 
// var peer = new Peer(); 
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
let videoStream;
//var front = false;
//var constraints = { facingMode: (front? "user" : "environment") };
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    videoStream=stream;
    addVideoStream(myVideo,stream);

    peer.on('call',call=>{
        console.log("Answer");
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream);
        })
    });

    socket.on('user-connected',userId=>{
        connectToNewUser(userId,stream);
    });

});

peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
})

const connectToNewUser = (userId,stream) => {
    const call = peer.call(userId,stream);
    console.log("Called");
    const video = document.createElement('video');
    call.on('stream',userVideoStream => {
        addVideoStream(video,userVideoStream)
    })
}

const addVideoStream = (video,stream) =>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();    
    });
    videoGrid.append(video);
}

const toggleMute = () => {
    const enabled = videoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        videoStream.getAudioTracks()[0].enabled = false;
      const html = `<i class="myIcon fas fa-microphone-slash"></i><span class="myText">Mute</span>`
      document.querySelector('#muteUnmute').innerHTML = html;
    } else {
    const html = `<i class="myIcon fas fa-microphone"></i><span class="myText">Mute</span>`
      document.querySelector('#muteUnmute').innerHTML = html;
      videoStream.getAudioTracks()[0].enabled = true;
    }
  }
  
  const toggleVideo = () => {
    let enabled = videoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        videoStream.getVideoTracks()[0].enabled = false;
        const html = `<i class="myIcon fas fa-video-slash"></i><span class="myText">Play Video</span>`
        document.querySelector('#videoToggle').innerHTML = html;
    } else {
        const html = `
        <i class="myIcon fas fa-video"></i><span class="myText">Stop Video</span>`
      document.querySelector('#videoToggle').innerHTML = html;
      videoStream.getVideoTracks()[0].enabled = true;
    }
  }

const toggleCamera = () =>{
    front=!front;
    console.log("Changed");
  }