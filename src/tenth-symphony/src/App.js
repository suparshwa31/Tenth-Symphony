import Main from './pages/Main';
import Footer from './Footer';
import Header from './Header';
import './App.css';
import Homepage from './homepage';


// BEM - Block Element Modifier
function App() {
  return (
    <div className="app flex flex-column justify-center" >
      <Header />
      <Main/>
      <Footer/>
    </div>
  );
}

export default App;
