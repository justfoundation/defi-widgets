import { Link } from 'react-router-dom';
import './App.scss';

function App() {
    return (
        <div className="App">
            <section className="menu">
                <h3>Menu: </h3>
                <Link to="./connector">Connector Demo</Link>
                <Link to="./contract">Contract-Interact Demo</Link>
                <Link to="./transaction">Transaction Demo</Link>
                <Link to="./confirm">Transaction-Confirm Demo</Link>
                <Link to="./tokenlist">Token-List Demo</Link>
            </section>
        </div>
    );
}

export default App;
