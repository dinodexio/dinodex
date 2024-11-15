sleep 15s
docker exec -it mongo1 mongosh -u root -p 9eALQ1w0e2gUfpg --eval "
db = db.getSiblingDB('dinodex_test');
db.createUser({ user: 'dinodex_test', pwd: 'FUX^ipZ3rQS7ZhE', roles: [{ role: 'readWrite', db: 'dinodex_test' }] });
"
