const fs = require('fs');

const express = require('express');
const socket = require('socket.io');
const http = require('http');
const app = express();                  // express 객체 생성
const server = http.createServer(app);  // express http 서버 생성
const io = socket(server);              // 생성된 서버를 socket.io 에 바인딩

app.use('/css',express.static('./static/css'));
app.use('/js',express.static('./static/js'));

// get 방식으로 / 경로에 접속하면 실행 됨
// request <-- 클라이언트에서 전달된 데이터와 정보들이 담겨있음
// response <-- 클라리언트에게 응답할 정보가 담겨있음
app.get('/',(request,response) => {
    // console.log('유저가 / 으로 접속하였습니다 !');  // 터미널,서버에 표시
    // response.send('Hello, 익스프레스 서버 !');  // 클라이언트에게 전달할 데이터

    // readFile() -> 지정된 파일을 읽어서 데이터를 가져옴
    fs.readFile('./static/index.html',(err,data) => {
        if(err) {
            response.send('에러');
        } else {
            // writeHead : 클라이언트에게 보낼 내용은 index.html 이기때문에 헤더에 설정
            response.writeHead(200, {'Content-Type':'text/html'});
            // write : HTML 데이터 전송
            response.write(data);
            // end : 완료 (write를 통해 응답할 경우 꼭 사용해야함!)
            response.end();
        }
    })
})


io.sockets.on('connection',(socket) => {
    console.log('유저 접속 됨');

    // socket.on('send',(data) => {
    //     console.log('전달된 메세지 : ', data);
    //     // console.log('전달된 메세지 : ', data.msg);
    // })
    
    //새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌
    socket.on('newUser',(name)=>{
        console.log(name+"님이 접속 하였습니다.");
        // 소켓에 이름 저장
        socket.name = name;
        //모든 소켓에게 전송   [ io.emit() : 모든 소켓에게 ]
        io.socket.emit('update',{type: 'connect', name: 'SERVER' , message: name+"님이 접속하였습니다."});
    })

    // 전송한 메세지 수신
    socket.on('message',(data) => {
        data.name = socket.name;
        console.log(data);
        
        // socket.broadcast : 메세지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메세지 전송
        socket.broadcast.emit('update',data);
    })

    // 접속 종료
    socket.on('disconnect', () => {
        console.log('접속 종료');
        socket.broadcast.emit('update',{type: 'disconnect', name: 'SERVER' , message: name+"님이 나가셨습니다."});
    })
})
// on 은 수신 ,  emit 은 전송   emit('이번트명',()=>{})  on 도 같은 이벤트명이 있어야 받을 수 있다.(이벤트명이 동일 한 것끼리 통신)

// node app.js 로 실행 (명령어)
server.listen(8080, () => {
    console.log('서버 실행중 ...');
});