const neo4j = require("neo4j-driver");

exports.formatNeo4jResult = (records) => {
  const nodes = [];
  const edges = [];
  const nodeIds = new Set();

  records.forEach((record) => {
    record.forEach((value) => {
      if (neo4j.isNode(value)) {
        if (!nodeIds.has(value.identity.toString())) {
          nodes.push({
            id: value.identity.toString(),
            data: {
              label: value.properties.name || value.properties.title,
              ...value.properties,
              name: undefined,
              id: undefined,
              type: value.labels[0].toLowerCase(),
            },
            position: { x: 0, y: 0 },
          });
          nodeIds.add(value.identity.toString());
        }
      } else if (neo4j.isRelationship(value)) {
        const source = value.startNodeElementId.split(":")[2];
        const target = value.endNodeElementId.split(":")[2];
        edges.push({
          id: value.identity.toString(),
          source,
          target,
          type: value.type.toLowerCase(),
        });
      }
    });
  });

  if (nodes.length > 0) {
    nodes[0].data.isCrowned = true;
  }

  return { nodes, edges };
};
