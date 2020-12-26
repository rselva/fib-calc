import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import OtherPage from './OtherPage';
import Fib from './Fib';

function App() {
  return (
    <Router>
    
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Link to="/">Home</Link>
          <Link to="/otherpage">Otherpage</Link>
        </header>
        <div>
          <h3>Fib Calculator</h3>
        </div>
        <div className="Custom"> 
            <Route exact path="/" component={Fib} />
            <Route path ="/otherpage" component={OtherPage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
