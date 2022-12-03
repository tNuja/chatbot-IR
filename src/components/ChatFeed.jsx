import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MyMessage from './MyMessage';
import BotMessage from './BotMessage';
import { SendOutlined} from '@ant-design/icons';
import { BarChart } from "./charts/BarChart/Chart.tsx";
import { LineChart } from "./charts/LineChart/Chart.tsx";
import { PieChart } from "./charts/PieChart/Chart.tsx";
import { WordCloud } from "./charts/WordCloud/Chart.tsx";
import { Ellipsis } from 'react-spinners-css';

const ChatFeed = (props) => {
 
  const [value, setValue] = useState('');
  const [cursor, setCursor] = useState(null);
  const ref = useRef(null);
  const [isLoading, setLoading] = useState(false)
  const [isTopic, setTopicFlag] = useState(false)
  const [topic, setTopic] = useState('All')
  const [messages, setMessages] = useState([
    {
    isBot: true,
    text: "How may I help you?",
    topic: "None"
    },
  ])
  const topics = ["Healthcare", "Education", "Technology", "All"]
  const renderReadReceipts = (message, isMyMessage) =>(
    <div
      className="read-receipt"
      style={{
        float: isMyMessage ? 'right' : 'left',
        backgroundImage:`url(https://www.freeiconspng.com/thumbs/checkmark-png/checkmark-png-5.png)`,
      }}
    />
  );

  useEffect(() => {
    const input = ref.current;
    if (input) input.setSelectionRange(cursor, cursor);
 }, [ref, cursor, value]);

 const renderTopics = () => {
  return topics.map((top, index) => {
   return (
  <div className='topics'>
  <label>
      <input type="radio" value= {top} onChange= {handleTopicChange} name="radio" checked={topic === top}/>
      <span>{top}</span>
  </label>
  </div>)
  });
 }
  const renderMessages = () => {

    return messages.map((val, index) => {
      const message = val.text;
      const isMyMessage = !val.isBot;

      return (
        <div key={`msg_${index}`} style={{ width: '100%' }}>
          <div className="message-block">
            {isMyMessage
              ? <MyMessage message={message} />
              : <BotMessage message={message} />}
          </div>
          <div className="read-receipts" style={{ marginRight: isMyMessage ? '18px' : '0px', marginLeft: isMyMessage ? '0px' : '68px' }}>
            {renderReadReceipts(message, isMyMessage)}
          </div>
        </div>
      );
    });
  };

const handleTopicChange = (e) => {
  let topic = e.target.value
  console.log('value of checkbox : ', topic);
  setTopic(topic)
  if(topic != 'All'){
    setTopicFlag(true)
  }
  else
    setTopicFlag(false)
}

const handleChange = (event) => {
    setCursor(event.target.selectionStart);
    setValue(event.target.value);
};

const handleSubmit = () => {
    // event.preventDefault();
    const text = value.trim();
    setLoading(true)
    if (text.length > 0) {
      let newText = {
        isBot: false,
        text: text,
        topic: topic
      }
      setMessages([...messages, newText])
      console.log(text+ " "+ isTopic+ " "+topic)
      axios.get('https://chat-bot-370504.uk.r.appspot.com/query/', {
        params: {
          query: text,
          topic_flag: isTopic,
          topic: topic
        }
      })
      .then(function (response) {
        console.log(response);
        let resText = {
          isBot: true,
          text: response.data.message,
          topic: topic
        }
        setMessages([...messages, newText, resText])
        setLoading(false)
      })
    }

    setValue('');
};
const MessageForm = () => {
    return(
    <form className="message-form" onSubmit={handleSubmit}>
        <input
          autoFocus="autofocus"
          className="message-input"
          placeholder="Send a message..."
          ref={ref}
          value={value}
          onChange={handleChange}
          onFocus={(e) => {e.target.selectionStart = cursor}}
          onSubmit={handleSubmit}
        />
  
        <button type="submit" className="send-button">
          <SendOutlined className="send-icon" />
        </button>
      </form>
    )
  }

  return (
    <div className="chat-feed">
      <div className='row'>
      <div className='column1'>
      <div className="team-row">
      <div
            className="avatar"
            style={{ backgroundImage: `url(https://st2.depositphotos.com/1030956/6989/v/950/depositphotos_69898539-stock-illustration-teamwork-and-business-team-icon.jpg)` }}
          />
           <div className="team" style={{ float: 'left', color: 'white', marginLeft: '2px' }}>
              Int-elligent
            </div>
          </div>

        <h4>Select a topic</h4>
        <div style={{marginTop: '10px'}}>
          {renderTopics()}
        </div>
        </div>

      <div className='column2'>
          <div className="chat-title-container">
        <div className="chat-title">Welcome User!</div>
      </div>
      {renderMessages()}
      {isLoading ? <div style={{ marginRight: '0px', marginLeft:  '68px', display: 'flex' }}> <div className="chat-subtitle">Typing</div>
            <Ellipsis size={30}/></div> : <></>}
      <div style={{ height: '100px' }} />
      <div className="message-form-container">
        <MessageForm />
      </div>
      </div>

      <div className='column3'>
        <BarChart />
        <LineChart />
        <PieChart />
        <WordCloud />
        </div>
      </div>
    </div>
    
  );
};

export default ChatFeed;
