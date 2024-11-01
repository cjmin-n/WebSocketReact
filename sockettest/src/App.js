import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Main from './pages/Main';
import ChatWindow from './pages/ChatWindow';
import ChatCss from './pages/ChatWindow.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/chatWindow/:userId" element={<ChatWindow/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
