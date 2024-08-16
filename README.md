# Neo4j GoT

A Game of Thrones based Node based UI written in NextJS, and some AI ;)

## Features

- Node Based UI to see information about GoT characters, houses and seats.
- Uses Anthropic's Claude Haiku AI for asking questions
- Neo4j as our graph database

Using NextJS as our frontend framework and backend written in NodeJS and express.

## Setup locally

NodeJS version: v18.19.0

### UI

```bash
# install deps
npm install

# run the dev version
npm run dev
```

### Backend

First we need to setup the database and fill it up with GoT characters. We use docker for the database.
The source of dataset from ["An API of Ice and Fire" repository](https://github.com/joakimskoog/AnApiOfIceAndFire).

```bash
# make sure you are in the `server/` directory

# first build the image
docker build -t got-neo4j .

# create a running container from the image
docker run -p 7474:7474 -p 7687:7687 --name neo4j-got got-neo4j

# Exec into the container
docker exec -it neo4j-got bash

# New we are going to fill the database with the dataset
# Inside bash shell in container

cd /docker-entrypoint.initdb.d/

# execute the script
./initialize.sh

# if you see "CSV import completed", the dataset has been imported.
# You can now run cypher query on neo4j UI at http://localhost:7474/
```

Now, setting up the backend. Make sure you have `.env` file for environment variables, or you can hardcode the keys for development purposes.

```bash
# install deps
npm install

# run the server
node index.js
```
