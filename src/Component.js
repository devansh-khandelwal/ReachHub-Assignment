import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Component.css";

const StockSymbols = () => {
  const [stockData, setStockData] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    fetchStockSymbols();
  }, []);

  const fetchStockSymbols = async () => {
    const apiKey = "cn7fb8hr01qgjtj4iue0cn7fb8hr01qgjtj4iueg";
    const baseUrl = "https://finnhub.io/api/v1/";

    try {
      const response = await axios.get(
        `${baseUrl}stock/symbol?exchange=US&token=${apiKey}`
      );

      console.log(response.data);

      const stocks = response.data.slice(0, 5);
      const promises = stocks.map((stock) => fetchAdditionalData(stock.symbol));

      Promise.all(promises)
        .then((additionalDataArray) => {
          const updatedStockData = stocks.map((stock, index) => ({
            ...stock,
            additionalData: additionalDataArray[index],
          }));
          updatedStockData.sort(
            (a, b) => b.additionalData.c - a.additionalData.c
          );
          setStockData(updatedStockData);
        })
        .catch((error) => {
          console.error("Error fetching additional data:", error);
          setStockData(stocks);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAdditionalData = async (symbol) => {
    const apiKey = "cn7fb8hr01qgjtj4iue0cn7fb8hr01qgjtj4iueg";
    const baseUrl = "https://finnhub.io/api/v1/";

    try {
      const response = await axios.get(
        `${baseUrl}quote?symbol=${symbol}&token=${apiKey}`
      );

      console.log(response.data);

      return response.data;
    } catch (error) {
      console.error("Error fetching additional data:", error);
      return null;
    }
  };

  const handleStockSelect = (event) => {
    const selectedSymbol = event.target.value;
    setSelectedStock(selectedSymbol);
  };

  return (
    <div className="stock-symbols-container">
      <h1>Most popular stocks according to the current price.</h1>
      <div>
        <select onChange={handleStockSelect}>
          <option value="">Select a stock</option>
          {stockData.map((stock, index) => (
            <option key={index} value={stock.symbol}>
              {stock.symbol} - {stock.description}
            </option>
          ))}
        </select>
      </div>
      {selectedStock && (
        <div className="stock-details">
          <h2>Details for {selectedStock}</h2>
          {stockData.map((stock) => {
            if (stock.symbol === selectedStock) {
              return (
                <div key={stock.symbol} className="stock-item">
                  <p>
                    <strong>Symbol:</strong> {stock.symbol}
                  </p>
                  <p>
                    <strong>Description:</strong> {stock.description}
                  </p>
                  <p>
                    <strong>Currency:</strong> {stock.currency}
                  </p>
                  <p>
                    <strong>Type:</strong> {stock.type}
                  </p>
                  {stock.additionalData && (
                    <div>
                      <p>
                        <strong>Current Price:</strong> {stock.additionalData.c}
                      </p>
                      <p>
                        <strong>Change:</strong>{" "}
                        <span
                          className={
                            stock.additionalData.d > 0 ? "positive" : "negative"
                          }
                        >
                          {stock.additionalData.d}
                        </span>
                      </p>
                      <p>
                        <strong>Percent Change:</strong>{" "}
                        <span
                          className={
                            stock.additionalData.dp > 0
                              ? "positive"
                              : "negative"
                          }
                        >
                          {stock.additionalData.dp}%
                        </span>
                      </p>
                      <p>
                        <strong>High:</strong> {stock.additionalData.h}
                      </p>
                      <p>
                        <strong>Low:</strong> {stock.additionalData.l}
                      </p>
                      <p>
                        <strong>Open:</strong> {stock.additionalData.o}
                      </p>
                      <p>
                        <strong>Previous Close Price:</strong>{" "}
                        {stock.additionalData.pc}
                      </p>
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default StockSymbols;
