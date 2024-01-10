# sfc-prj-main-app

## Overview

sfc-prj-main-app is a sub-project of sfc-prj. 
Web application following Microservice Architecture, using Kafka and ZooKeeper.
The Main Microservice is Producer and Consumer.

The service has a Github Actions workflow file which has a few steps :

-	**Test**: it setups test environment ; installing services such as Postgres and NodeJS, then it installs application dependencies, build the application and finally run the test suite.
-	**merge-master-into-preprod**: once testing step is valid, it merges master branch into preproduction branch
-	**merge-master-into-prod**: same logic but into production branch
- **build-preproduction**: install services and application dependencies, build the application to build the Docker Hub image and publish it to Docker Hub.
- **build-production**: same logic but the objective is to deploy the application to production
  
## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Installation

Clone the Repository:
Open a terminal or command prompt and use the git clone command to clone the repository.

```
git clone https://github.com/clementnunes/sfc-prj-main-app
```

Navigate to the Project Directory:
Change your current directory to the one where the project has been cloned.

```
cd repository
```

## Usage
Use [sfc-prj](https://github.com/clementnunes/sfc-prj) to deploy the microservice application.


## Features
The microservice works using NodeJS platform. They are written in TypeScript and uses various dependencies:
-	TypeORM: ORM for NodeJS applications, i.e., Javascript and Typescript
-	Fastify: Web framework used to provide server features especially routing
-	Postgres: Postgres Client
-	KafkaJS: Kafka Client for NodeJS applications
-	Chai & Mocha: used for testing
-	Faker: Fake data generation

The microservices provide basic usage : create, modify, delete, get and get collection of User entity.
The architecture is MVC with internal services.
The microservices are covered by several tests to ensure it’s running smoothly. The test suite is based on Chai and Mocha and tests internal services and also using routing feature.

## Contact

**Clement Nunes**\
**clement.nunes@efrei.net**
