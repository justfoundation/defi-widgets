import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
    return (
        <section className="menu">
            <h3>Menu: </h3>
            <Link to="/connector">Connector Demo</Link>
            <Link to="/contract">Contract-Interact Demo</Link>
            {/* <Link to="/confirm">Transaction-Confirm Demo</Link> */}
            <Link to="/transaction">Transaction-Confirm Demo</Link>
            <Link to="/tokenlist">Token-List Demo</Link>
            <Link to="/signsteps">Sign-Steps Demo</Link>
        </section>
    )
}

export default Menu;