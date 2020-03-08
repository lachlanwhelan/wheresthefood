import React, {Component} from 'react';
import loading from '../Assets/loading.gif'
import './Home.scss';
/* global google */

class Form extends Component{
    constructor(props){
        super(props);
        this.state = {
            query: '',
            loading: false
        }
        this.autocompleteInput = React.createRef();
        this.autocomplete = null;
    }


    handleLocationChange = () => {
        const place = this.autocomplete.getPlace();

        console.log(place);

        if(!place.geometry){
            //ADD INPUT TIP HERE!!!
            console.log('Invalid Input')
        }else{
            this.props.geocode({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            })
        }
    }

    handleSearchChange = (event) => {
        let query = event.target.value
        this.setState({
            query: query
        })
    }

    handleKeyPress = (event) =>{

        if(event.key === 'Enter'){
            event.preventDefault()
            if(event.target.name === 'location'){
                document.getElementsByName('query')[0].focus();
            }
            
            if(event.target.name === 'query'){
                this.props.searchRestaurant(this.state.query);
            }   
        }
        
    }

    handleOnClick = () => {
        if(!this.state.query){
            console.log('nearby restaurants');
        }else{
            this.props.searchRestaurant(this.state.query);
        }
    }

    handleLoad(){
        console.log(document.getElementsByClassName('.home')[0]);
    }

    componentDidMount(){
        setTimeout(() => {
            document.getElementsByTagName('form')[0].style.display = 'flex';
            //document.getElementsByClassName('loading-bg')[0].style.backgroundImage= 'none';
            document.getElementsByClassName('loader')[0].style.display= 'none';
        }, 2000);
        this.autocomplete = new google.maps.places.Autocomplete(this.autocompleteInput.current,
            {types: ["geocode"], componentRestrictions: {country: 'au'}});
    
        this.autocomplete.addListener('place_changed', this.handleLocationChange);
    }

    render(){
        return (
            <form className={this.props.status ? 'form form-searching' : 'form'}  onSubmit={(e) => e.preventDefault()}>
            <h1>w<span className='spread spread-out'>here's</span>t<span className='spread spread-out'>he</span>f<span className='spread spread-out'>ood</span>?</h1> <div className={this.props.loading ? 'loading' : 'not-loading'}>{/* <img src={loading}/> */}</div>
                <input className='location-input input' ref={this.autocompleteInput}
                id="autocomplete" 
                type='text' 
                placeholder={this.props.location.city}
                name='location'
                onKeyPress={this.handleKeyPress}  
                  
                />
                <input className='text-input input' type='text' 
                placeholder='Search for Restaurants or Cusines'
                onChange={this.handleSearchChange}  
                name='query'
                onKeyPress={this.handleKeyPress}
                autoComplete='off'  
                />
                <button className='search-btn btn' type='submit' onClick={this.handleOnClick}>search</button>
            </form>
         )
    }
}

export default Form;

