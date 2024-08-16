# Server

## Neo4j docker setup

Build the container:

```bash
docker build -t my-neo4j .
```

Run the container:

```bash
docker run \
        --name neo4j-container \
        -p 7474:7474 \
        -p 7687:7687 \
        -d my-neo4j
```

```bash
docker exec -it neo4j-container bash

cd /docker-entrypoint.initdb.d
./initialize.sh
```

## Dataset

https://github.com/neo4j-examples/game-of-thrones


## toDo

all the descendants of the children are also in the json
nodes will have 2 objects id and data, data will have all the rest of the fields (for eg type)

extra intehgrate api