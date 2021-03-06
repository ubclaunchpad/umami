<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/ubclaunchpad/umami">
    <img src="frontend/src/assets/Logo.png" alt="Logo" height="100" resize>
  </a>
  <h3 align="center">Umami</h3>
</p>


<!-- TABLE OF CONTENTS -->
  <h2 style="display: inline-block">Table of Contents</h2>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#contributing">Contributing</a></li>
  </ol>



<!-- ABOUT THE PROJECT -->
## About The Project

Umami has many recipes


### Built With

* React Native - Frontend
* FastAPI - Backend
* MySQL - Database
* Nginx - Proxy
* Firebase - Auth/Storage Bucket
* Docker Compose - Build/Deployment
* Python - Scraping
* GCP Compute Engine - Hosting


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

* yarn
* docker
* docker-compose

### Installation
#### Docker Backend

1. `cd` into root folder
2. run `docker-compose -f docker-compose.dev.yml up --build -d`

Backend will be exposed on port 8080
MySQL will be exposed on port 3306

#### React Native Frontend

1. `cd` into umami/frontend
2. run `yarn`
3. start server with `npx react-native start`
4. open a new cli window in the same folder

##### iOS:

5. `cd` into ios and run `pod install`
6. run `npx react-native run-ios`

##### Android: 

5. run `npx react-native run-android`

<!-- DEPLOYMENT -->
## Deployment

1. Clone repo to VM
2. run `docker-compose up --build -d`
3. run chmod +x init-letsencrypt.sh
4. run sudo ./init-letsencrypt.sh

## Further deployment changes 
Inide of Production machine from root umami folder
1. On a local device, run `bash ./export.sh` to save a csv copy of data
2. `docker-compose down`
3. sudo rm -rf ./database/data
4. sudo ./init-letsencrypt.sh
5. run `docker-compose up --build -d` 
6. run `python3 recipe_data_update.py`
7. On a local device, run `bash ./import.sh` to re-upload saved data

## Database Backup & Restore
### Backup
1. Run `mysqldump -u root -p -h umami.harinwu.com -P 3306 -R umami_db > umami.sql`

### Restore
1. Drop database with `drop database umami_db`
2. Create database with `create database umami_db`
3. Run `mysql -u root -p -h umami.harinwu.com -P 3306 umami_db < umami.sql`

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
