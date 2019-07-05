import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, box}) => {
    console.log('image style', box);
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputimage' width='500px' height='auto' src={imageUrl} alt='sample input' />
                <div className='bounding-box' style={box}></div>
            </div>
        </div>
    );
};

export default FaceRecognition;