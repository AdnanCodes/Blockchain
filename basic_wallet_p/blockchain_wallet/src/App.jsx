import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import "./App.scss";

function App() {
  const { register, handleSubmit, errors } = useForm();
  const [user, setUser] = useState({ Username: "adnan-chowdhury" });
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/chain")
      .then(res => {
        console.log(res.data.chain);
        let sum = 0;
        let trans = [];
        res.data.chain.forEach(element => {
          element.transactions.forEach(item => {
            if (item.recipient === user.Username) {
              sum += item.amount;
              trans.push(item);
            }
          });
          setBalance(sum);
          setTransactions(trans);
        });
      })
      .catch(err => console.log(err));
  }, []);
  const onSubmit = data => {
    setBalance(0);
    setTransactions([]);
    setUser(data);
    requestDataForUser(data);
  };
  const requestDataForUser = data => {
    axios
      .get("http://localhost:5000/chain")
      .then(res => {
        console.log(res.data.chain);
        let sum = 0;
        let trans = [];
        res.data.chain.forEach(element => {
          element.transactions.forEach(item => {
            if (item.recipient === data.Username) {
              sum += item.amount;
              trans.push(item);
            }
          });
          setBalance(sum);
          setTransactions(trans);
        });
      })
      .catch(err => console.log(err));
  };
  return (
    <div className="App">
      <h1>Simple Wallet App</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <select name="Username" ref={register}>
          <option value="adnan-chowdhury">adnan-chowdhury</option>
          <option value="dude5000">dude5000</option>
          <option value="mega-miner">mega-miner</option>
        </select>
        <input type="submit" />
      </form>
      <p>Total amount of money for selected user: {balance}</p>
      <h3>All Transactions for selected user</h3>
      {transactions.map(item => {
        if (item.recipient === user.Username) {
          return (
            <>
              <p>Amount: {item.amount}</p>
              <p>Recipient: {item.recipient}</p>
              <p>Sender: {item.sender}</p>
            </>
          );
        }
      })}
    </div>
  );
}

export default App;
