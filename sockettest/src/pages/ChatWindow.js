import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ChatWindow = () => {

    const {userId} = useParams(); // URL 에서 userId 가져옴.
    const [messages, setMessages] = useState([]); // 채팅 메시지 상태 관리
    const [messageInput, setMessageInput] = useState(""); // 입력된 메시지 상태 관리
    const [webSocket, setWebSocket] = useState(null); // webSocket 상태 관리
    const navigate = useNavigate();

    useEffect(()=>{

        const wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";
        const wsUrl = `${wsProtocol}localhost:8080/chattingServer`;
        const ws = new WebSocket(wsUrl);

        // 소켓 연결이 성공적으로 되었을 때 실행될 함수
        ws.onopen = () => {
            console.log("WebSocket 연결 성공");
            const initialMessage = 'webSocket 연결 성공';
            setMessages(prev=> [...prev, {type:'info', message: initialMessage}])
            ws.send(JSON.stringify({type: 'join', userId}));
        };

        // 메시지 수신 시 실행될 함수
        ws.onmessage = (event) => {
            console.log("서버로부터 메시지 수신 : " + event.data);
            const message = event.data;
            setMessages(prev => [...prev, {type: 'received', message}]);
        };

        // 연결이 닫혔을 때 실행되는 함수
        ws.onclose = () => {
            console.log("Socket 서버와의 연결이 종료 되었습니다.");
            const closingMessage = "Socket 서버 연결 종료";
            setMessages(prev => [...prev, {type: 'info', message: closingMessage}]);
        };

        // 에러 발생시 실행
        ws.onerror = (error) => {
            console.log("error : " + error);
        };


        setWebSocket(ws);

        // 클래스 언마운트 시
        return(() => {
            if(ws){
                ws.send(JSON.stringify({type:'leave', userId}));
                ws.close();
            }
        })

    }, []);


    const sendMessage = () => {
        if(webSocket && webSocket.readyState === webSocket.OPEN){
            const trimmedMessage = messageInput.trim();
            if(trimmedMessage !== ''){
                webSocket.send(JSON.stringify({type:'message', userId, message: trimmedMessage}));
                setMessages(prev=>[...prev, {type: 'sent', message: trimmedMessage}]);
                setMessageInput("");
            }
        }else {
            console.log("웹 소켓이 연결되지 않았습니다.");
        }
    }
    
    const handleKeyPress = (event) => {
        if(event.key === "Enter"){
            sendMessage();
        }
    }

    
    const handleBackToMain = () => {
        navigate("/");
    }

    return (
        <>
            <div className="chat-container">
                <h2>WebSocket 채팅</h2>
                <div id="chatWindow" 
                    className="chat-window"  
                    style={{
                        border: '1px solid #ccc',
                        width: '380px',
                        height: '400px',
                        overflowY: 'scroll',
                        padding: '10px',
                        backgroundColor: '#fff',
                    }}>
                        
                    {messages.map((msg, index)=>{
                        return(
                            <div key={index} 
                                className={`message${msg.type}`}
                                style={{
                                    textAlign: msg.type === 'sent' ? 'right' : 'left',
                                    marginTop: '5px',
                                    color: msg.type === 'sent' ? 'blue' : '#f32f00',
                                }}
                                // dangerouslySetInnerHTML={{__html:msg.message}}
                            >
                                {msg.message}
                            </div>
                        )
                    })}
                </div>
                <div className="input-container">
                    <input 
                        type="text" 
                        id="chatMessage" 
                        placeholder="메시지 입력" 
                        value={messageInput} 
                        onChange={e => setMessageInput(e.target.value)} 
                        // 특정 키를 눌렀을 때
                        onKeyDown={handleKeyPress}/>
                    <button id="sendBtn" onClick={sendMessage}>
                        전송
                    </button>
                    <button onClick={handleBackToMain}>
                        메인으로 돌아가기
                    </button>
                </div>
            </div>
        </>
    );
}

export default ChatWindow;