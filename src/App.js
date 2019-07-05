import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '8ceb03503dc84c15a909f82d3b1e938b'
});


class App extends React.Component {
  constructor() {
    super();
    this.state={
      input: '',
      imageUrl: '',
      box: {}
    };
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

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {

    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  render() {
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
          <Navigation />
          <Logo />
          <Signin />
          <Rank />
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
          <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
      </div>
    );
  }
  
}

export default App;
