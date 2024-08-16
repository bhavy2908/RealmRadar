// Character aliases
LOAD CSV WITH HEADERS FROM 'file:///character_aliases.csv' AS row
MERGE (c:Character {id: row.character_id})
CREATE (a:Alias {name: row.alias})
CREATE (c)-[:HAS_ALIAS]->(a);

// Character relationships
LOAD CSV WITH HEADERS FROM 'file:///character_relationships.csv' AS row
WITH row
WHERE row.character_id IS NOT NULL AND row.character_id <> ''
MERGE (c:Character {id: row.character_id})
WITH row, c
WHERE row.father IS NOT NULL AND row.father <> ''
MERGE (f:Character {id: row.father})
WITH row, c, f
WHERE row.mother IS NOT NULL AND row.mother <> ''
MERGE (m:Character {id: row.mother})
WITH row, c, f, m
WHERE row.spouse IS NOT NULL AND row.spouse <> ''
MERGE (s:Character {id: row.spouse})
CREATE (c)-[:CHILD_OF]->(f)
CREATE (c)-[:CHILD_OF]->(m)
CREATE (c)-[:MARRIED_TO]->(s);

// Character titles
LOAD CSV WITH HEADERS FROM 'file:///character_titles.csv' AS row
MERGE (c:Character {id: row.character_id})
MERGE (t:Character {id: row.title_id})
CREATE (c)-[:HOLDS_TITLE]->(t);

// Character details
LOAD CSV WITH HEADERS FROM 'file:///characters.csv' AS row
MERGE (c:Character {id: row.id})
SET c.name = row.name,
    c.gender = row.gender,
    c.culture = row.culture,
    c.born = row.born,
    c.died = row.died;

// House ancestral weapons
LOAD CSV WITH HEADERS FROM 'file:///house_ancestral_weapons.csv' AS row
MERGE (h:House {id: row.house_id})
CREATE (w:AncestralWeapon {name: row.ancestral_weapon})
CREATE (h)-[:OWNS_WEAPON]->(w);

// House cadet branches
LOAD CSV WITH HEADERS FROM 'file:///house_cadet_branches.csv' AS row
MERGE (h:House {id: row.house_id})
MERGE (c:House {id: row.cadet_branch_id})
CREATE (h)-[:HAS_CADET_BRANCH]->(c);

// House characters
LOAD CSV WITH HEADERS FROM 'file:///house_characters.csv' AS row
MERGE (h:House {id: row.house_id})
MERGE (c:Character {id: row.character_id})
CREATE (c)-[:BELONGS_TO]->(h);

// Character relationships
LOAD CSV WITH HEADERS FROM 'file:///house_relationships.csv' AS row
WITH row
WHERE row.character_id IS NOT NULL AND row.character_id <> ''
MERGE (c:Character {id: row.character_id})
WITH row, c
WHERE row.father IS NOT NULL AND row.father <> ''
MERGE (f:Character {id: row.father})
WITH row, c, f
WHERE row.mother IS NOT NULL AND row.mother <> ''
MERGE (m:Character {id: row.mother})
WITH row, c, f, m
WHERE row.spouse IS NOT NULL AND row.spouse <> ''
MERGE (s:Character {id: row.spouse})
CREATE (c)-[:CHILD_OF]->(f)
CREATE (c)-[:CHILD_OF]->(m)
CREATE (c)-[:MARRIED_TO]->(s);

// House seats
LOAD CSV WITH HEADERS FROM 'file:///house_seats.csv' AS row
MERGE (h:House {id: row.house_id})
CREATE (s:Seat {name: row.seat})
CREATE (h)-[:HAS_SEAT]->(s);

// House titles
LOAD CSV WITH HEADERS FROM 'file:///house_titles.csv' AS row
MERGE (h:House {id: row.house_id})
CREATE (t:Title {name: row.title})
CREATE (h)-[:HOLDS_TITLE]->(t);

// Houses
LOAD CSV WITH HEADERS FROM 'file:///houses.csv' AS row
MERGE (h:House {id: row.id})
SET h.name = row.name,
    h.region = row.region,
    h.coat_of_arms = row.coat_of_arms,
    h.words = row.words,
    h.founded = row.founded,
    h.died_out = row.died_out;

// Titles
LOAD CSV WITH HEADERS FROM 'file:///titles.csv' AS row
MERGE (t:Title {id: row.id})
SET t.title = row.title;

// Query to return all descendants
MATCH (ancestor:Character)
OPTIONAL MATCH (ancestor)-[:CHILD_OF*]->(descendant:Character)
RETURN ancestor.name AS Ancestor, COLLECT(DISTINCT descendant.name) AS Descendants
ORDER BY ancestor.name;