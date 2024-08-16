FROM neo4j:latest

ENV NEO4J_AUTH=neo4j/password

# Create a directory for import scripts
RUN mkdir -p /var/lib/neo4j/import/scripts

# Copy CSV files into the import directory
COPY ./dataset/*.csv /var/lib/neo4j/import/

# Copy the import script
COPY ./import_script.cypher /var/lib/neo4j/import/scripts/

# Set up an initialization script to run the import
COPY ./initialize.sh /docker-entrypoint.initdb.d/

# Make the initialization script executable
RUN chmod +x /docker-entrypoint.initdb.d/initialize.sh

EXPOSE 7474 7687

CMD ["neo4j"]
