import React from 'react';
import star from '../Assets/star.png';
import defaultImage from '../Assets/defaultImage.jpg'


const Restaurants = ({restaurants, status, modalOn}) => {
return(
    <div className={restaurants.length === 0 ? 'hide' : 'restaurant-list'} >
        {
            restaurants.map(item => {
                return (
                    <div key={item.restaurant.id} id='box' className={status? 'display' : 'hide'}>
                    <div className='box-title'>
                        <h2>
                            {item.restaurant.name} 
                        </h2>
                        <p>{item.restaurant.establishment}</p>
                    </div>
                        <img className='box-img' src={item.restaurant.thumb === '' ? defaultImage : item.restaurant.thumb} alt='food'/>
                        <p className='box-location'>{item.restaurant.location.address}</p>
                    <div className='box-rating'>
                        <p className='rate-number'>{item.restaurant.user_rating.aggregate_rating}</p>
                        <div className='star'><img src={star} alt='user-rating'/></div>
                    </div>

                    <div className='contact'>
                    <button className='call-btn' onClick={() => modalOn(item.restaurant)}>More</button>
                    </div>
                        <p className='box-time'>{item.restaurant.timings}</p>
                    </div>
                )
            })
        }
    </div>
)
}


export default Restaurants;