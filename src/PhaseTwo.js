import { useState, useEffect } from 'react';

import './PhaseTwo.css';

export default function PhaseTwo({adverts, endPhaseTwo}) {
    const allAdverts = adverts
    const [seenAdverts, setSeenAdverts] = useState()

    useEffect(() => {
        const tmpArray = []
        let nonameAds = allAdverts.filter(ad => ad.includes('NoName'))
        let usernameAds = allAdverts.filter(ad => ad.includes('UserName'))
        let randomNameAds = allAdverts.filter(ad => ad.includes('RandomName'))
        let randomImages = [
            'randomImages_1.jpg', 'randomImages_2.jpg', 'randomImages_3.jpg', 'randomImages_4.jpg', 'randomImages_5.jpg',
            'randomImages_6.jpg', 'randomImages_7.jpg', 'randomImages_8.jpg', 'randomImages_9.jpg', 'randomImages_10.jpg',
            'randomImages_11.jpg', 'randomImages_12.jpg', 'randomImages_13.jpg', 'randomImages_14.jpg', 'randomImages_15.jpg',
            'randomImages_16.jpg', 'randomImages_17.jpg', 'randomImages_18.jpg', 'randomImages_19.jpg', 'randomImages_20.jpg',
            'randomImages_21.jpg', 'randomImages_22.jpg', 'randomImages_23.jpg'
        ]
        
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * nonameAds.length)
            tmpArray.push(['blank_' + nonameAds[randomIndex], false])
            if (nonameAds.length > 1) {
                nonameAds.splice(randomIndex, 1)
            }
        }

        for (let i = 0; i < (usernameAds.length > 0 ? randomNameAds.length > 0 ? 3 : 6 : 0); i++) {
            const randomIndex = Math.floor(Math.random() * usernameAds.length)
            tmpArray.push(['blank_' + usernameAds[randomIndex], false])
            if (usernameAds.length > 1) {
                usernameAds.splice(randomIndex, 1)
            }
        }

        for (let i = 0; i < (randomNameAds.length > 0 ? usernameAds.length > 0 ? 3 : 6 : 0); i++) {
            const randomIndex = Math.floor(Math.random() * randomNameAds.length)
            tmpArray.push(['blank_' + randomNameAds[randomIndex], false])
            if (randomNameAds.length > 1) {
                randomNameAds.splice(randomIndex, 1)
            }
        }

        for (let i = 0; i < 9; i++) {
            const randomIndex = Math.floor(Math.random() * randomImages.length)
            tmpArray.push([randomImages[randomIndex], false])
            randomImages.splice(randomIndex, 1)
        }

        for (let i = tmpArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = tmpArray[i]
            tmpArray[i] = tmpArray[j]
            tmpArray[j] = temp
        }

        setSeenAdverts(tmpArray)
    },[])        


    return (
        <div className='phase-two-container'>
            <div className='phase-two-instructions'>
                <h4 className='phase-two-hint'>Please select all the images that you have seen</h4>
            </div>
            <div className='phase-two-image-grid'>
                {seenAdverts && seenAdverts.map((ad, index) => {
                    return (
                        <div    key={index} 
                                className={`phase-two-image-container ${ad[1] && 'selected'}`}
                                onClick={() => {
                                    const tmpArray = [...seenAdverts]
                                    tmpArray[index][1] = !tmpArray[index][1]
                                    setSeenAdverts(tmpArray)
                                }}>
                            <img    src={`${process.env.PUBLIC_URL}/assets/images/blanks/${ad[0]}`} 
                                    alt='ad' 
                                    className='phase-two-image'/>
                        </div>
                    )})
                }
            </div>
            <div className='phase-two-button-container'>
                <button onClick={() => {
                    endPhaseTwo([...seenAdverts])
                }}>Submit</button>
            </div>
            
        </div>
    )
}