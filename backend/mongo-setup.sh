docker run -d -p 27017:27017 mongo:latest
# -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=pass
# to inspect the db: 
# docker exec -it test-mongo mongosh

### mongosh:  
# use trackbite
# show collections
# db.dailyintakes.find().pretty()