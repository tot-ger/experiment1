import { useState, useEffect, useRef } from 'react';
import './PhaseOne.css';

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomNames = ['Chloe', 'Brian', 'Trevor', 'Krissy', 'Donna', 'Taylor', 'Lottie', 'Megan', 'Katie', 'Stewart']
let feedArr = []


export default function PhaseOne({ endPhaseOne, username }) {
    
    const maxRounds = 10
    const [round, setRound] = useState(1)
    const [isRoundStarted, setIsRoundStarted] = useState(false)

    const overlayRef = useRef(null)
    const roundLogRef = useRef([])
    const phaseLogRef = useRef([])
    const ageRef = useRef(null)
    const genderRef = useRef(null)
    const scrollFocusRef = useRef(null)

    function handleSubmit(e) {
        e.preventDefault()

        if (ageRef.current === null || genderRef.current === null) {
            return
        }
   
        phaseLogRef.current.push(
            { 
                round: round,
                age: ageRef.current,
                gender: genderRef.current,
                onverlay: overlayRef.current ?? 'username',
                log: roundLogRef.current
            })

        roundLogRef.current = []
        scrollFocusRef.current = null
        overlayRef.current = null
        genderRef.current = null


        if (round === maxRounds) {
            endPhaseOne(phaseLogRef.current)
        } else {
            setRound(prev => prev + 1)
        }
    }

    function updateFeed() {
        const items = []
        const isUsernameOverlay = getRandom(1, 100) % 2 === 0

        if(!isUsernameOverlay) {
            overlayRef.current = randomNames[getRandom(0, randomNames.length)]
            randomNames.splice(randomNames.indexOf(overlayRef.current), 1)
        }

        
        for (let i = 1; i <= 20; i++) {
            if (i <= 10) {
                items.push({ 
                            type: 'profile',
                            name: `p${round}profile_${i}.jpg`,
                            src: `${process.env.PUBLIC_URL}/assets/images/profiles/p${round}profile_${i}.jpg`,
                            overlay: null
                        })
            } else if (i <= 15) {
                let random = getRandom(1, 21);
                
                while(items.filter(item => item.name === `advertsNoName_${random}.jpg`).length > 0) {
                    random = getRandom(1, 21);
                }

                items.push({ 
                    type: 'advertsNoName',
                    name: `advertsNoName_${random}.jpg`,
                    src: `${process.env.PUBLIC_URL}/assets/images/advertsNoName/advertsNoName_${random}.jpg`,
                    overlay: null
                })
            } else {
                let random = getRandom(1, 20);

                if (isUsernameOverlay) {

                    while(items.filter(item => item.name === `advertsUserName_${random}.jpg`).length > 0) {
                        random = getRandom(1, 20);
                    }

                    items.push({ 
                        type: 'advertsUserName',
                        name: `advertsUserName_${i}.jpg`,
                        src: `${process.env.PUBLIC_URL}/assets/images/advertsUserName/advertsUserName_${i}.jpg`,
                        overlay: username
                    })
                } else {

                    while(items.filter(item => item.name === `advertsRandomName_${random}.jpg`).length > 0) {
                        random = getRandom(1, 20);
                    }

                    items.push({ 
                        type: 'advertsRandomName',
                        name: `advertsRandomName_${i}.jpg`,
                        src: `${process.env.PUBLIC_URL}/assets/images/advertsRandomName/advertsRandomName_${i}.jpg`,
                        overlay: overlayRef.current
                    })                   
                }
            }
        }

        
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = items[i]
            items[i] = items[j]
            items[j] = temp
        }

        feedArr = items

        setTimeout(() => {
            setIsRoundStarted(true)
        }, 2500)
    }

    function updateRoundLog(name) {
        if (roundLogRef.current.filter(item => item.name === name).length === 0) {
            roundLogRef.current.push({ name: name, time: 0, refTime: Date.now() })
        } else {
            roundLogRef.current = roundLogRef.current.map(item => {
                if (item.name === name) {
                    item.time += Date.now() - item.refTime
                    item.refTime = Date.now()
                }
                return item
            })
        }
    }

    function handleScroll(e) {
        
        const feedImages = document.querySelectorAll('.feed-image')
        const feedImagesArr = Array.from(feedImages)
        const visibleImages = feedImagesArr.filter(item => {
            const rect = item.getBoundingClientRect()
            return rect.top >= 0 && rect.bottom <= window.innerHeight
        })

        const visibleImage = visibleImages[visibleImages?.length - 1]

        if (!visibleImage && !scrollFocusRef.current) {
            return
        }

        if (visibleImage && !scrollFocusRef.current) {
            updateRoundLog(visibleImage.name)
            scrollFocusRef.current = visibleImage.name
            return
        }

        if (!visibleImage && scrollFocusRef.current) {
            updateRoundLog(scrollFocusRef.current)
            scrollFocusRef.current = null
            return
        }

        if (visibleImage.name === scrollFocusRef.current) {
            return
        }

        updateRoundLog(scrollFocusRef.current)
        scrollFocusRef.current = visibleImage.name
    }

    useEffect(() => {
        setIsRoundStarted(false)   
        updateFeed()
    },[round])

    return (
        <div className='feed'>
            {!isRoundStarted && <div className='feed-loading full-height'> <p>LOADING</p></div>}
            {isRoundStarted && <div className='feed-grid' onScroll={handleScroll}>
                <div className='feed-start full-height'>
                    <h1>Scroll down to start</h1>
                    <div className='scroll-down-arrow-container'>
                        <div className='scroll-down-arrow'></div>
                        <div className='scroll-down-arrow'></div>
                        <div className='scroll-down-arrow'></div>
                    </div>
                </div>
                {feedArr.map((item, index) => {
                    return (
                        <div    key={index}
                                name={item.name}
                                className='feed-item full-height'>
                            <img    src={item.src} 
                                    alt={item.name}
                                    name={item.name}
                                    className='feed-image'/>
                            {item.overlay && <div className='feed-item-overlay'>{item.overlay}</div>}
                        </div>)})}   
                <div className='feed-end full-height'>
                    <form className='feed-end-form' onSubmit={handleSubmit} >
                        <h4>Guess the age and gender that you think this feed belongs to</h4>
                        <div className='feed-end-form-input-container'>
                            <label className='age-label'>Age:</label>
                            <input type='number' name='ageInput' className='age-input' min={1} max={99} required onChange={(e) => ageRef.current = e.target.value}/>
                        </div>
                        <div className='feed-end-form-input-container'>
                            <label>Gender:</label>
                            <div className='feed-end-form-radio-container'>
                                <label className='radio-input'><input type='radio' name='genderInput' value='male' onChange={(e) => genderRef.current = e.target.value} />Male</label>
                                <label className='radio-input'><input type='radio' name='genderInput' value='female' onChange={(e) => genderRef.current = e.target.value}/>Female</label>
                                <label className='radio-input'><input type='radio' name='genderInput' value='nonbinary' onChange={(e) => genderRef.current = e.target.value}/>Non-binary</label>
                            </div>
                        </div>
                    <button type='submit'>Submit</button>
                    </form>
                </div>   
            </div>}
        </div>
    )
};