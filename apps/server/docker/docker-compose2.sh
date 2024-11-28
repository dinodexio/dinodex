docker exec -it mongo1 mongosh -u root -p 9eALQ1w0e2gUfpg --eval "
rs.initiate({
 _id: 'rs0',
 members: [
   { _id: 0, host: 'mongo1:27017' },
   { _id: 1, host: 'mongo2:27017' },
   { _id: 2, host: 'mongo3:27017' }
 ]
});
"
