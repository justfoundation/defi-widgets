import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Connector from './routes/connector';
import Contract from './routes/contract';
import Confirm from './routes/confirm';
// import Transaction from './routes/transaction';
import TokenList from './routes/tokenList';
import './index.css';

const rootElement = document.getElementById('root');
render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="connector" element={<Connector />} />
            <Route path="contract" element={<Contract />} />
            <Route path="confirm" element={<Confirm />} />
            {/* <Route path="transaction" element={<Transaction />} /> */}
            <Route path="tokenlist" element={<TokenList />} />
        </Routes>
    </BrowserRouter>,
    rootElement
);
