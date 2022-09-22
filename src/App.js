import './App.css';

function App() {
  return (
    <div className="App">
      <h1 id='check-users'>Node Socket Telecon</h1>
      <div id='chat-window'>
        <div id='chat-window-messages'></div>
        <div id='chat-window-typing'></div>
      </div>
      <form id='chat-form' autocomplete='off'>
        <label id='chat-label' for='chat-input'>&nbsp;Message:&nbsp;</label>
        <input class='input' id='chat-input' />
        <input class='submit' type='submit' value=' send ' />
      </form>
      <div id='user-list'></div>
    </div>
  );
}

export default App;
