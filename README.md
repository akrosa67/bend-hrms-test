# zg_worklife-server

## Tech stack
* Nodejs Api service
* MongoDB - Database

## Project Setup

#### Server
```sh
$ cd server
$ npm install
$ cp .env.example .env 
$ npm start
```

#### Location dump seed
```sh
$ node
$ var seeder = require('./app/seeder/location-seed');

## then run methods one by one

$ seeder.saveCountries();
$ seeder.saveStates();
$ seeder.saveCities();
```