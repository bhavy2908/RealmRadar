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

## Dataset

https://github.com/neo4j-examples/game-of-thrones
