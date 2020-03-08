import React, {Component} from 'react';
import Form from './Form';
import Restaurants from '../Restaurants/Restaurants'
import Modal from '../Modal/Modal';
import './Home.scss';
/* global google */

class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            location: {},
            coords: {},
            collections: [],
            nearbyRestaurants: [], 
            restaurants: [],
            display: false,
            status: false,
            loading: false,
            modal: false,
            modalInfo: {},
            map: {},
            infowindow: {},
            service: {}
        }

        this.geocode = this.geocode.bind(this);
        this.searchRestaurant = this.searchRestaurant.bind(this);
    }

    async ipLookUp(){
         try{
            const ip_response = await fetch(`http://api.ipstack.com/check?access_key=${process.env.REACT_APP_IPSTACKKEY}`);
            const data = await ip_response.json();
            this.setState({
                location: data
            })
            const coords = {
                lat: data.latitude,
                lng: data.longitude
            }
            this.getCollections(coords);
            return coords;
        }
        catch(err){
            throw new Error('Request failed');
        }
    }

    

    async getCollections(location){
        const response = await fetch(`https://developers.zomato.com/api/v2.1/collections?lat=${location.lat}&lon=${location.lng}&count=6`, {
        method: 'get',
        headers: {
            'user-key': process.env.REACT_APP_ZOMATOKEY,
            'accept': 'application/json'
        }
        })
        const collections = await response.json()
         this.setState({
            collections: collections.collections
        })
    }


    async geocode(coords){
        const response = await fetch(`https://developers.zomato.com/api/v2.1/geocode?lat=${coords.lat}&lon=${coords.lng}`, {
            method: 'get',
            headers: {
                'user-key': process.env.REACT_APP_ZOMATOKEY,
                'accept' : 'application/json'
        }
        })
        const data = await response.json();
        this.setState({
            location: data.location,
            nearbyRestaurants: data.nearby_restaurants
        })
        console.log(this.state.location.entity_id)
    }

    async searchRestaurant(query){ 
        if(query){
            this.setState({
                display: false,
                loading: true
            })
            const response = await fetch(`https://developers.zomato.com/api/v2.1/search?entity_id=${this.state.location.entity_id}&entity_type=subzone&q=${query}&count=9`, {
                method: 'get',
                headers: {
                    'user-key': process.env.REACT_APP_ZOMATOKEY,
                    'accept' : 'application/json'
            }
            })
            const data = await response.json();
    
            this.setState({
                restaurants: data.restaurants
            })

            console.log(this.state.restaurants);

            setTimeout(() => {
                this.setState({
                    display:true,
                    status: true,
                    loading: false
                })
            }, 1000);
        }else{
            this.setState({
                restaurants: this.state.nearbyRestaurants
            })
        }
    }

    modalOn = (item) =>{
        console.log(item);
            this.initMap(item.location);
        
            const{name, phone_numbers, location} = item
            this.setState({
                modal: !this.state.modal,
                modalInfo: {
                    name,
                    phone_numbers,
                    location: location.address
                }
            })       
    }

    modalClose = () => {
        this.setState({
            modal:false
        })
    }

    initMap(location) {
        var sydney = new google.maps.LatLng(location.latitude, location.longitude);

        const infowindow = new google.maps.InfoWindow();

        const map = new google.maps.Map(
            document.getElementById('map'), {center: sydney, zoom: 15});

        var request = {
          query: location.address,
          fields: ['name', 'geometry'],
        };
        
        const service = new google.maps.places.PlacesService(map);

        service.findPlaceFromQuery(request, function(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              new google.maps.Marker({
                map: map,
                position: results[i].geometry.location
              });
/*               google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(results[i].name);
                infowindow.open(map, this);
              }); */
            }

            map.setCenter(results[0].geometry.location);
          }
        });
      }

      handleLoad = () => {
          setTimeout(() => {
              console.log(document.getElementsById('loader')[0]);
          }, 3000)
      }

    componentDidMount(){
        this.ipLookUp();
    }

    render(){
        return(
            <div className='home'>
                <Form status={this.state.status} location={this.state.location} 
                    geocode={this.geocode}
                    searchRestaurant={this.searchRestaurant}
                    loading={this.state.loading}    
                />
                <Restaurants restaurants={this.state.restaurants}
                status={this.state.display}
                modal={this.state.modal}
                modalOn={this.modalOn}
                modalInfo={this.state.modalInfo}
                />
                <Modal modal={this.state.modal} modalInfo={this.state.modalInfo} modalClose={this.modalClose}/>
                <div className='loader'></div>
                {/* <Loader/> */}
            </div>
        )
    }
}

export default Home;