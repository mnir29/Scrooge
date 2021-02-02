# Scrooge
Simple stock analysis app

Simple web application with React application in the front and simple node.js web-server in the back.

# Application can be runned by following instructions:

(Download source code, download node package manager if you don't have it)

Go to folder Srcooge/src
1. type "npm install" to console

Go to folder Srcooge/src/srgrooge-app
1. type "npm install" to console
2. type "npm run build" to console

Go back to folder Srcooge/src
1. type "npm start"
2. Application should run in your browser in "localhost:3000"

You can also utilize virtual machine. Vagrantfile is provided in source code.
1. Go to folder Scrooge/vagrant
2. type "vagrant up"
3. when VM is up, type "vagrant ssh" to connect to VM
4. You can get to synced Scrooge/src by typing "cd ../../src" after you are connected to VM

# Short instructions for using Application

First, upload stock data in CSV format. 

Sample data can be downloaded via Nasdaq web site or API.
Apple stock historical data:
https://www.nasdaq.com/market-activity/stocks/aapl/historical
https://www.nasdaq.com/api/v1/historical/AAPL/stocks/2020-01-20/2021-01-20
CSV data format example:
“Date, Close/Last, Volume, Open, High, Low
01/19/2021, $127.83, 90757330, $127.78, $128.71, $126.938”

Choose and import stock data file.

Next you should pick dates. Note, if dates exceed oldest and latest date of the data, whole data will be analyzed. End date should be later than start date, of course!

After picking valid dates, application analyzes data in following ways: 

1. How many days was the longest bullish (upward) trend within a given date range?
2. Which dates within a given date range had a) the highest trading volume and b) the most
significant stock price change within a day?
3. Within a given date range, which dates had the best opening price compared to 5 days
simple moving average (SMA 5)?

It is okay to analyze another data file, just pick it and import it and repeat phases above!

Happy analyzing!
