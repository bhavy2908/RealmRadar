#!/bin/bash
set -e

# Run the import script
cat /var/lib/neo4j/import/scripts/import_script.cypher | cypher-shell -u neo4j -p password

echo "CSV import completed"