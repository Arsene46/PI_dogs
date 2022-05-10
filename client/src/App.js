import './App.css';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Home from './components/Home/Home';
// import Detail from './components/Detail/Detail';
import BreedCreation from './components/BreedCreation/BreedCreation';
import Nav from './components/Nav/Nav.jsx';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/" element={<Nav />} >
          <Route path="/home" element={<Home />} />
          {/* <Route path="/details/:id" element={<Detail />} /> */}
          <Route path="/breedCreation" element={<BreedCreation />} />
          <Route path="/modifyBreed/:id" element={<BreedCreation  modify={true}/>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
