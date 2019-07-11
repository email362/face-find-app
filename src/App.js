import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Particles from 'react-particles-js';



const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    email: '',
    password: '',
    name: '',
    entries: 0,
    joined: ''
  }
};

class App extends React.Component {
  constructor() {
    super();
    this.state=initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    let left_col = clarifaiFace.left_col * width;
    let right_col = width - (clarifaiFace.right_col * width);
    let top_row = clarifaiFace.top_row * height;
    let bottom_row = height - (clarifaiFace.bottom_row * height);
    let imgValues = {
      left: left_col,
      right: right_col,
      top: top_row,
      bottom: bottom_row
    };
    console.log('calc position', imgValues);
    return imgValues;
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box});
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState);
    }
    else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {

    this.setState({imageUrl: this.state.input});
    fetch('https://evening-caverns-31182.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input 
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response) {
        fetch('https://evening-caverns-31182.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries:count}));
        })
        .catch(console.log);
      }
      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(err => console.log(err));
  }

  render() {
    const {imageUrl, isSignedIn, route, box} = this.state;
    const particlesOptions = {
      particles: {
        number: {
          value: 30,
          density: {
            enable: true,
            value_are: 800
          }
        }
      }
    };
    return (
      <div className="App">  
          <Particles className='particles' params={particlesOptions} />
          <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
          { (() => {
            switch (route) {
              case 'home':
                return (
                  <div>
                  <Logo />
                  <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                  <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
                  <FaceRecognition imageUrl={imageUrl} box={box}/>
                  </div>
                );
              case 'signin':
                return (<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />);
              case 'register':
                return (<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>);
              case 'signout':
                return (<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />);
              default:
                console.log('err');
            }

            })()
          }
      </div>
    );
  }
  
}

export default App;
