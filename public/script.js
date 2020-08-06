const socket = io("/");
// var peer = new Peer(undefined,{
//     path:'/peerjs',
//     host:'/',
//     port:'3030'
// }); 
var peer = new Peer(); 
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
let videoStream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:false
}).then(stream =>{
    videoStream=stream;
    addVideoStream(myVideo,stream);

    socket.on('user-connected',userId=>{
        connectToNewUser(userId,stream);
    });

    peer.on('call',call=>{
        console.log("Answer");
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream);
        })
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