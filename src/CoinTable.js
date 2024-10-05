import React, { useState, useEffect } from 'react';
import './CoinTable.css'; 

const CryptoTable = () => {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(''); 

  const fetchCoins = async () => {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
    );
    const data = await response.json();
    setCoins(data);
  };

  useEffect(() => {
    fetchCoins(); 
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSort = (type) => {
    let sortedCoins = [];
    if (type === 'market_cap') {
      sortedCoins = [...coins].sort((a, b) => b.market_cap - a.market_cap);
    } else if (type === 'percentage_change') {
      sortedCoins = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    }
    setCoins(sortedCoins); 
    setSortBy(type); 
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase()) || coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="crypto-table-container">
      <input
        type="text"
        placeholder="Search By Name or Symbol"
        value={search}
        onChange={handleSearch}
        className="search-input"
      />
      <button onClick={() => handleSort('market_cap')}>Sort By Mkt Cap</button>
      <button onClick={() => handleSort('percentage_change')}>Sort by percentage</button>

      <table>
        <tbody>
          {filteredCoins.map((coin) => (
            <tr key={coin.id}>
              <td>
                <img src={coin.image} alt={coin.name} width="25" /> {coin.name}
              </td>
              <td>{coin.symbol.toUpperCase()}</td>
              <td>${coin.current_price}</td>
              <td>${coin.total_volume.toLocaleString()}</td>
              <td style={{ color: coin.price_change_percentage_24h < 0 ? 'red' : 'green' }}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td>Mkt Cap : ${coin.market_cap.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
