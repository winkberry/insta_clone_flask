from pymongo import MongoClient
import certifi

ca = certifi.where()

client = MongoClient('mongodb+srv://space:space123@cluster0.gpjhq.mongodb.net/Cluster0?retryWrites=true&w=majority',
                     tlsCAFile=ca)

db = client.dbSpace


# codes = [
#     {'username':'123','email':'123','password':'123'},{'username':'1234','email':'1234','password':'1234'}
# ]
user = db.users.find_one({'username':'123'})
print(user)

codes = {'title':'이건테스트','username':user,'content':'content 유저에 유저저장','photo':'http://www.syesd.co.kr/homepage/syStoryImageFolder/1580721398040_9e9f7e7bd9454932a9d46886459bee23_main.png','like':user}

db.posts.insert_one(codes)

