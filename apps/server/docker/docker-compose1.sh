docker compose down -v
sudo rm -rf /mnt/mongo*
sudo rm mongo-keyfile
openssl rand -base64 756 > mongo-keyfile
sudo chmod 400 mongo-keyfile
docker compose up -d
# sleep 2s
docker exec -it mongo1 bash -c "echo 'vm.max_map_count=262144' | tee -a /etc/sysctl.conf && sysctl -p"
docker exec -it mongo2 bash -c "echo 'vm.max_map_count=262144' | tee -a /etc/sysctl.conf && sysctl -p"
docker exec -it mongo3 bash -c "echo 'vm.max_map_count=262144' | tee -a /etc/sysctl.conf && sysctl -p"