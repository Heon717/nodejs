let socket = io();  // index.js = 클라이언트  , app.js  = 서버

socket.on('connect',() => {
    // let input = document.getElementById('test');
    // input.value = '접속 됨'
    let name = prompt('닉네임을 입력해주세요!','')
                    // prompt() : 첫번째 변수는 alert(첫변수);   2번째 변수는 alert.value

    if(!name) {
        name = '익명';
    }
    socket.emit('newUser',name);
})

// update 데이터 수신
socket.on('update',(data) => {
    console.log(`${data.name}: ${data.message}`)
})

const send = () => {
    let message = document.getElementById('test').value;
    document.getElementById('test').value = '';
    socket.emit('message',message);
    // socket.emit('send',{type: 'message', msg : message});
}
