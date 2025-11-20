docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=pass mongo:latest

# to inspect the db: 
# docker exec -it test-mongo mongosh

### mongosh:  
# use food_test
# show collections
# db.dailyintakes.find().pretty()1ebb003b3f8c