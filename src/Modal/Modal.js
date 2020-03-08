import React from 'react';


const Modal = ({modal, modalInfo, modalClose}) => {
        return(
            <div className={modal? 'modal' : 'hide'}>

            <div className='modal-card'>
                <div className='modal-title'>
                <h3>{modalInfo.name}</h3>
                <button className='modal-btn' onClick={() => modalClose()}>Close</button>
                </div>
                
                <div className='location-details'>
                    <div className='details'>
                        <div className='contact'>
                            Phone Number: <a href={`tel${modalInfo.phone_numbers}`}>{modalInfo.phone_numbers}</a>
                        </div>
                        <div id="map"></div> 
                        <div className='address'>Address: {modalInfo.location}</div>    
                    </div>     
 
                </div>


            </div>
            
            </div>
        )
}

export default Modal;