from flask import Flask, render_template, request, jsonify, redirect, url_for
from pymongo import MongoClient
import certifi

ca = certifi.where()

client = MongoClient('mongodb+srv://space:space123@cluster0.gpjhq.mongodb.net/Cluster0?retryWrites=true&w=majority',
                     tlsCAFile=ca)

db = client.dbSpace

app = Flask(__name__)

SECRET_KEY = '3iI3j63EmUww246bXHUVghUnYkTwQ6lm'

# JWT 패키지를 사용합니다. (설치해야할 패키지 이름: PyJWT)
import jwt

# 토큰에 만료시간을 줘야하기 때문에, datetime 모듈도 사용합니다.
import datetime

# 회원가입 시엔, 비밀번호를 암호화하여 DB에 저장해두는 게 좋습니다.
# 그렇지 않으면, 개발자(=나)가 회원들의 비밀번호를 볼 수 있으니까요.^^;
import hashlib

import json
from bson import ObjectId


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


#################################
##  HTML을 주는 부분             ##
#################################
@app.route('/')
def home():
    # # 현재 이용자의 컴퓨터에 저장된 cookie 에서 mytoken 을 가져옵니다.
    token_receive = request.cookies.get('mytoken')
    try:
         # token을 decode하여 payload를 가져오고, payload 안에 담긴 유저 id를 통해 DB에서 유저의 정보를 가져옵니다.
         payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
         user_info = db.user.find_one({"id": payload['id']})
         return render_template('index.html', user = user_info)  

    # # 만약 해당 token의 로그인 시간이 만료되었다면, 아래와 같은 코드를 실행합니다.
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
        # 만약 해당 token이 올바르게 디코딩되지 않는다면, 아래와 같은 코드를 실행합니다.
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))



# mongodb에서 원하는 조건의 데이터를 불러왔습니다. 이후 filter를 통해서 가져오는 방식으로 조건을 줄 생각입니다.
@app.route('/profile')
def profile():
    # myname = "seunghwan"
    # myphoto = "photo"
    # return render_template("profile.html", name=myname, photo=myphoto)
    user = db.users.find_one({'username': '123'}, {'_id': False})
    return render_template('profile.html', user=user)


@app.route('/posting')
def posting():
    return render_template('create_post.html')


#################################
##  로그인을 위한 API            ##
#################################

# [회원가입 API]
# id, pw, nickname을 받아서, mongoDB에 저장합니다.
# 저장하기 전에, pw를 sha256 방법(=단방향 암호화. 풀어볼 수 없음)으로 암호화해서 저장합니다.
@app.route('/register', methods=['GET','POST'])
def register():
    if request.method == "POST":
        data = request.json    

        pw_hash = hashlib.sha256(data["pw"].encode('utf-8')).hexdigest()
        
        doc = {
            "id": data["id"],
            "pw": pw_hash,
            "email": data["email"],
            "img" : data["img"]
        }

        db.users.insert_one(doc)

        return jsonify({"result" : "어라운드 스페이스의 멤버가 되신 것을 축하합니다!"})
    else:
        return render_template('regist.html')

# [로그인 API]
# id, pw를 받아서 맞춰보고, 토큰을 만들어 발급합니다.
@app.route('/login', methods=['GET', 'POST'])
def login():
    
    if request.method == 'POST':
        data = request.json
        # PW hash: DB에 hash값으로 저장했기 때문에 다시 hash값으로 전환해 조회합니다.
        pw_hash = hashlib.sha256(data["pw"].encode("utf-8")).hexdigest()
        # find query
        info = {"id" : data["id"], "pw": pw_hash}        
        user = db.users.find_one(info)       
        # token issue: 토큰을 발행하고, ajax response에서 사용자 쿠키에 토큰을 저장합니다.
        if user != None:
            payload = {
                "id": data["id"],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=60 * 60 * 24)
            }            
            token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')  
                      
            return jsonify({"result" : "success", "token" : token})        
        else:
            return jsonify({"msg" : "회원 정보가 없습니다."})    
    else:
        msg = request.args.get("msg")
        return render_template('login.html', msg=msg)


# [아이디 중복확인 API]
# 유저 인풋으로 받은 계정을 DB에서 조회하고, 이미 존재하면 True 반환합니다.
@app.route("/register/check_id", methods = ["POST"])
def check_id():
    id = request.form['id']
    duplicated_id = db.users.find_one({'id':id})

    return jsonify({"duplicated" : bool(duplicated_id)}) 

# [유저 정보 확인 API]
# 로그인된 유저만 call 할 수 있는 API입니다.
# 유효한 토큰을 줘야 올바른 결과를 얻어갈 수 있습니다.
# (그렇지 않으면 남의 장바구니라든가, 정보를 누구나 볼 수 있겠죠?)
@app.route('/api/nick', methods=['GET'])
def api_valid():
    token_receive = request.cookies.get('mytoken')

    # try / catch 문?
    # try 아래를 실행했다가, 에러가 있으면 except 구분으로 가란 얘기입니다.

    try:
        # token을 시크릿키로 디코딩합니다.
        # 보실 수 있도록 payload를 print 해두었습니다. 우리가 로그인 시 넣은 그 payload와 같은 것이 나옵니다.
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        print(payload)

        # payload 안에 id가 들어있습니다. 이 id로 유저정보를 찾습니다.
        # 여기에선 그 예로 닉네임을 보내주겠습니다.
        userinfo = db.user.find_one({'id': payload['id']}, {'_id': False})
        return jsonify({'result': 'success', 'nickname': userinfo['nick']})
    except jwt.ExpiredSignatureError:
        # 위를 실행했는데 만료시간이 지났으면 에러가 납니다.
        return jsonify({'result': 'fail', 'msg': '로그인 시간이 만료되었습니다.'})
    except jwt.exceptions.DecodeError:
        return jsonify({'result': 'fail', 'msg': '로그인 정보가 존재하지 않습니다.'})

    #################################
    ##  메인화면을 위한 API            ##
    #################################


@app.route('/api/feed', methods=['GET'])
def api_feed():
    all_feed = list(db.posts.find({}, {'_id': 0}))
    jsonfeed = JSONEncoder().encode(all_feed)
    return jsonify(jsonfeed)


@app.route('/api/posting', methods=['POST'])
def create_post():
    url_receive = request.form['url_give']
    title_receive = request.form['title_give']
    doc = {
        'title': title_receive,
        'photo': url_receive,
        'username': '123',
    }
    db.posts.insert_one(doc)
    return jsonify({'msg': "저장 완료"})

    #################################
    ##  프로필화면을 위한 API            ##
    #################################


if __name__ == '__main__':
    app.run('0.0.0.0', port=5002, debug=True)
