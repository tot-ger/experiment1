import { useState, useRef } from 'react';

import PhaseOne from './PhaseOne';
import PhaseTwo from './PhaseTwo';

import './App.css';

function downloadLog(log, username) {
  const element = document.createElement("a");
  const file = new Blob([log], {type: 'text/plain'});
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const filename = username.replace(' ', '_').toLowerCase() + timestamp + "_log.txt";
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}

function App() {
  const [isPhaseOneStarted, setIsPhaseOneStarted] = useState(false)
  const [isPhaseOneFinished, setIsPhaseOneFinished] = useState(false)
  const [isPhaseTwoStarted, setIsPhaseTwoStarted] = useState(false)
  const [isPhaseTwoFinished, setIsPhaseTwoFinished] = useState(false)
  const [username, setUsername] = useState('')
  const log = useRef(null)
  const advertsRef = useRef(null)
  

  function handleNameInputChange(e) {
    setUsername(e.target.value)
  }

  function setSeenAdverts() {
    advertsRef.current = log.current.phaseOneLog.map(log => {
      return log.log.map(item => {
        if (item.name.includes('advert')) {
          return item.name
        }
        return null
      })
    })

    advertsRef.current = advertsRef.current.flat().filter(item => item !== null)

    //remove duplicates
    advertsRef.current = advertsRef.current.filter((item, index) => {
      return advertsRef.current.indexOf(item) === index
    })
  }

  function handleStartButtonClick() {
    if (!isPhaseOneStarted) {
      log.current = {...log.current, username: username}
      setIsPhaseOneStarted(true)
    } 
    
    if (isPhaseOneFinished && !isPhaseTwoStarted) {
      setSeenAdverts()
      setIsPhaseTwoStarted(true)
    }
  }

  function endPhaseOne(phaseOneLog) {
    log.current = {...log.current, phaseOneLog: phaseOneLog}
    setIsPhaseOneFinished(true)
  }

  function endPhaseTwo(phaseTwoLog) {
    log.current = {...log.current, phaseTwoLog: phaseTwoLog}
    setIsPhaseTwoFinished(true)
    downloadLog(JSON.stringify(log.current), username)
  }

  return (
    <div className="App">
      {!isPhaseOneStarted && !isPhaseOneFinished &&
        <div className='phase-one-instructions'>
          <h1>Welcome to the Experiment</h1>
          <h4>Please read the instructions below</h4>
          <p>You are required to look at 10 separate feeds, these are the social media feeds of
            individuals.</p>
          <p>All personal information pertaining to them has been removed.</p>
          <p>Your task is to guess the age and gender of the person who would see this feed on their
              social media.</p>
          <div className='name-input-container'>
            <label>Enter your name:</label>
            <input type='text' onChange={handleNameInputChange} required/>
          </div>
          <button name='startPhaseOneButton'
                  onClick={handleStartButtonClick}
                  disabled={username.length > 0 ? null : 'disabled'}>Start</button>
        </div>}
      {isPhaseOneStarted && !isPhaseOneFinished &&
        <div className='feed-container'>
          <PhaseOne endPhaseOne={endPhaseOne} username={username} />
        </div>}
        {isPhaseOneFinished && !isPhaseTwoStarted &&
        <div className='phase-two-welcome'>
          <h1>Thank you for your responses</h1>
          <p>Next, we would like you to identify if any of the following images were images that you have
              seen before.</p>
          <button name='startPhaseTwoButton' onClick={handleStartButtonClick}>Start</button>
        </div>}
        {isPhaseTwoStarted && !isPhaseTwoFinished && <PhaseTwo adverts={advertsRef.current} endPhaseTwo={endPhaseTwo}/>}
        {isPhaseTwoFinished && <div className='thank-you-page'>
          <h1>Thank you for your participation in this experiment</h1>
          <p>You will now be debriefed on the aims of the study.</p>
        </div>}
    </div>
  );
}

export default App;