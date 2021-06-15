import './App.css';
import { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognisation from './components/FaceRecognisation/FaceRecognisation';




const app = new Clarifai.App({
  apiKey: 'f631bbfc5a9a4240bcb0e258ab1c5e05'
 });

const particlesOptions = {
    particles:{ 
              number:{
                value: 150,
                density:{
                      enable : true,
                      value_area : 800
                }
              }
    }
}


class App extends Component {
      constructor(){
          super();
          this.state ={
              input : '',
              imageUrl :'',
              box : {}
          }
      }

      calculateFaceLocation = (data) => {
            const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box; 
            const image = document.getElementById('inputImage');
            const width = Number(image.width);
            const height= Number(image.height);
            return {
                topRow : clarifaiFace.right_col * height ,
                rightCol : width - (clarifaiFace.right_col * width),
                bottomRow : height - (clarifaiFace.bottom_row * height),
                leftCol : clarifaiFace.left_col * width 
            }
      }

      diaplayFaceBox = (box) =>{
          this.setState({box : box});
          console.log(box);
      }
 
      onInputChange =(event) => {
          this.setState({input : event.target.value});
      }

      onButtonSubmit = () =>{
          this.setState({imageUrl : this.state.input});
          // if  FACE_DETECT_MODEL not works use c0c0ac362b03416da06ab3fa36fb58e3
          app.models.predict( Clarifai.FACE_DETECT_MODEL, this.state.input)
          .then(response => this.diaplayFaceBox(this.calculateFaceLocation(response)))
          .catch(error => console.log(error));
      }

      render(){
        return (
            <div className="App">
                <Particles  className = 'particles' params = {particlesOptions} />
                <Navigation />
                <Logo />
                <Rank />
                <ImageLinkForm onInputChange = {this.onInputChange}  onButtonSubmit ={this.onButtonSubmit} />
                <FaceRecognisation box = {this.state.box} imageUrl = {this.state.imageUrl}/>
            </div>
        );
      }
}

export default App;
