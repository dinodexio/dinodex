docker run --name mongodb -v /mnt/mongodb:/data/db -d --restart=always -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD="9eALQ1w0e2gUfpg" mongo:latest
sleep 15s
docker exec -it mongodb mongosh -u root -p 9eALQ1w0e2gUfpg --eval "
db = db.getSiblingDB('dinodex_test');
db.createUser({ user: 'dinodex_test', pwd: 'FUX^ipZ3rQS7ZhE', roles: [{ role: 'readWrite', db: 'dinodex_test' }] });
"
