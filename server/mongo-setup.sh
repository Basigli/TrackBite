docker run -d -p 27017:27017 --name test-mongo mongo:latest

# to inspect the db: 
docker exec -it test-mongo mongosh

### mongosh:  
# use food_test
# show collections
# db.dailyintakes.find().pretty()