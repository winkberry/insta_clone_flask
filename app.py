from flask import Flask, render_template, request, jsonify, redirect, url_for, send_file
from pymongo import MongoClient
import certifi
import gridfs
import codecs
from bson.objectid import ObjectId

ca = certifi.where()

client = MongoClient('mongodb+srv://space:space123@cluster0.gpjhq.mongodb.net/Cluster0?retryWrites=true&w=majority',
                     tlsCAFile=ca)

db = client.dbSpace

app = Flask(__name__)

# Token 발행용 SECRET_KEY 설정
SECRET_KEY = '3iI3j63EmUww246bXHUVghUnYkTwQ6lm'

# gridfs 초기화
fs = gridfs.GridFS(db)

# JWT 패키지를 사용합니다. (설치해야할 패키지 이름: PyJWT)
import jwt

# 토큰에 만료시간을 줘야하기 때문에, datetime 모듈도 사용합니다.
import datetime




#################################
##  토큰 확인 함수                ##
#################################

def check_token():
    # 현재 이용자의 컴퓨터에 저장된 cookie 에서 mytoken 을 가져옵니다.
    token_receive = request.cookies.get('token')
    # token을 decode하여 payload를 가져오고, payload 안에 담긴 유저 id를 통해 DB에서 유저의 정보를 가져옵니다.
    payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
    return db.users.find_one({'id': payload['id']})


#################################
##  이미지 리턴 함수               ##
#################################

def return_img(userinfo):
    profile_img_binary = fs.get(userinfo["img"])
    profile_img_base64 = codecs.encode(profile_img_binary.read(), 'base64')
    return profile_img_base64.decode('utf-8')

# flask에서 만든 함수를 그대로 jinja2에 적용하기 위해 context_processor 데코레이터를 사용합니다.
# gridfs로 저장한 이미지는 애초에 여러 파일로 나눠지고 binary값으로 저장되기 때문에 post 데이터에 img객체를 그대로 집어넣지 못합니다.
@app.context_processor
def utility_processor():
    def return_profile_img(user_id):
        user = db.users.find_one({'_id':user_id})
        profile_img_binary = fs.get(user["img"])
        profile_img_base64 = codecs.encode(profile_img_binary.read(), 'base64')
        return profile_img_base64.decode('utf-8')
    # return값을 다음과 같이 설정하여 템플릿에 return_profile_img(post.user) 와 같이 사용가능합니다.
    return dict(return_profile_img = return_profile_img)

#################################
##  이미지 파일 전송부분            ##
#################################


import hashlib


#################################
##  HTML을 주는 부분             ##
#################################
@app.route('/')
def home():
    try:
        user_info = check_token()
        posts = reversed(list(db.posts.find({}))) # 최신순으로 나오게 정렬을 뒤집음.

        return render_template('index.html', posts=posts, user=user_info)
        # # 만약 해당 token의 로그인 시간이 만료되었다면, 아래와 같은 코드를 실행합니다.
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
        # 만약 해당 token이 올바르게 디코딩되지 않는다면, 아래와 같은 코드를 실행합니다.
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))


# 프로필 화면 기본 정보들입니다. mongodb에서 GET 요청으로 원하는 조건의 데이터를 불러왔습니다.
@app.route('/profile', methods=['GET'])
def profile_info():
    # key값인 id 값을 불러옵니다.(pip install 내부 라이브러리 사용 시 requests 사용)
    id = request.args.get('id')
    if id:
        userinfo = db.users.find_one({"id": id}) #현재 보고 있는 user id 값을 찾습니다.
        profile_img = return_img(userinfo) # return_img 함수를 사용하여 profile_img를 정의합니다.
        posts = list(db.posts.find({'user.id': userinfo['id']})) # mongodb posts list에서 해당 id와 일치하는 posts를 가져옵니다.
        # render_template 를 사용하여 불러온 정보들을 profile.html에서 보여줄 수 있도록 합니다.
        return render_template('profile.html', user=userinfo, profile_img=profile_img, posts=posts)
    else:
        userinfo = check_token() # mongodb에서 로그인한 유저id와 일치하는 id를 찾습니다.
        profile_img = return_img(userinfo) # return_img 함수를 사용하여 로그인한 유저의 profile_img를 정의합니다.
        posts = list(db.posts.find({'user.id':userinfo['id']})) # mongodb posts list에서 해당 id와 일치하는 posts를 가져옵니다.
        # render_template 를 사용하여 불러온 정보들을 profile.html에서 보여줄 수 있도록 합니다.
        return render_template('profile.html', user=userinfo, profile_img=profile_img, posts=posts)




#################################
##  로그인을 위한 API            ##
#################################

# [회원가입 API]
# id, pw, nickname을 받아서, mongoDB에 저장합니다.
# 저장하기 전에, pw를 sha256 방법(=단방향 암호화. 풀어볼 수 없음)으로 암호화해서 저장합니다.
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == "POST":
        id = request.form['id']
        pw = request.form['pw']
        email = request.form['email']
        profile_img = request.files['profile_img']
        # gridfs로 유저가 업로드한 프로필 이미지를 DB에 분할하여 저장합니다.
        fs_image_id = fs.put(profile_img)

        pw_hash = hashlib.sha256(pw.encode('utf-8')).hexdigest()

        doc = {
            "id": id,
            "pw": pw_hash,
            "email": email,
            "img": fs_image_id,
            "description": "",
        }

        db.users.insert_one(doc)

        return jsonify({"result": "어라운드 스페이스의 멤버가 되신 것을 축하합니다!"})
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
        info = {"id": data["id"], "pw": pw_hash}
        user = db.users.find_one(info)
        # token issue: 토큰을 발행하고, ajax response에서 사용자 쿠키에 토큰을 저장합니다.
        if user != None:
            payload = {
                "id": data["id"],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=60 * 60 * 24)
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm='HS256').decode('utf-8')

            return jsonify({"result": "success", "token": token})
        else:
            return jsonify({"msg": "회원 정보가 없습니다."})
    else:
        token = request.cookies.get('token')
        if token != None:
            return redirect(url_for('home'))
        else:
            msg = request.args.get("msg")
            return render_template('login.html', msg=msg)


# [아이디 중복확인 API]
# 유저 인풋으로 받은 계정을 DB에서 조회하고, 이미 존재하면 True 반환합니다.
@app.route("/register/check_id", methods=["POST"])
def check_id():
    id = request.form['id']
    duplicated_id = db.users.find_one({'id': id})

    return jsonify({"duplicated": bool(duplicated_id)})


#################################
##  메인화면을 위한 API            ##
#################################


@app.route('/post/create', methods=['GET', 'POST'])
def post_create():
    user = check_token()

    if request.method == 'POST':

        content = request.form['content']
        file = request.files['file']
        extension = file.filename.split('.')[-1]
        create_date = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
        filename = f'{user["id"]}-{create_date}'  # 파일이름
        save_to = f'static/post/{filename}.{extension}'  # 파일 경로
        file.save(save_to)  # 파일 저장

        doc = {
            'content': content,
            'user': user['_id'],
            'create_time': create_date,
            'file': f'{filename}.{extension}',
        }

        db.posts.insert_one(doc)

        return jsonify({'msg': "저장 완료"})
    else:
        return render_template('create_post.html')


@app.route('/comment/create', methods=['GET', 'POST'])
def comment_create():
    # 코멘트를 작성하는 유저 정보를 받습니다.
    user = check_token()

    if request.method == 'POST':
        post_id = request.form['post_id']
        user_id = user['id']
        content = request.form['content']
        # '_id'로 받은 id값을 데이터 객체의 OjbectId(_id) 형태로 만들기 위해 ObjectId 객체로 전환합니다.
        object_post_id = ObjectId(post_id)
        # print(object_post_id)

        doc = {
            'user': user_id,
            'content': content,
            'create_time': datetime.datetime.now(),
        }

        comment_id = db.comments.insert_one(doc).inserted_id
        # doc 는 Comments db 에 저장

        doc_for_comment = {
            'comment_id': comment_id,
            'user': user_id,
            'content': content,
            'create_time': datetime.datetime.now(),
        }

        db.posts.update_one({'_id': object_post_id}, {'$addToSet': {'comments': doc_for_comment}})
        # doc_for_comment 는 posts 디비에 추가 업데이트를 해준다. 어떤 포스트 디비에 해주는 조건은 post_id 값을 받아와 해당하는 포스트에 저장

        return redirect(url_for('home'))

@app.route('/api/deletecomment', methods=['POST'])
def del_comment():
    comment_id = request.json['comment_id']
    post_id = request.json['post_id']
    db.posts.update_one({'_id': ObjectId(post_id)},
                        {'$pull': {'comments': {'comment_id': ObjectId(comment_id)}}})
    db.comments.delete_one({'_id': ObjectId(comment_id)})

    return jsonify({'msg': '댓글을 삭제했습니다'})


#################################
##  프로필화면을 위한 API            ##
#################################

## 계정 삭제가 가능합니다. post요청을 사용한 이유는 전송해야할 데이터들을 Http body에 담아서 전송할 것이기 때문입니다. ##
## 또한 POST 요청은 서버의 상태나 데이터를 변경시킬 때 사용합니다. 데이터를 삭제하기 위해 POST 요청을 하는 것이 바람직합니다. ##
## 이와 달리 GET 요청은 서버로부터 정보를 조회하기 위해서 사용합니다.
@app.route('/api/user_delete', methods=['POST'])
def remove():
    ## 자신만의 고유한 쿠키에서 token 값을 가져옵니다.
    token_receive = request.cookies.get('token')
    payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
    ## 해당 정보에서 id 값을 삭제합니다.
    db.users.delete_one({'id': payload['id']})
    return jsonify({'msg': '삭제되었습니다'})


## 프로필 업데이트 기능,
@app.route('/profile/update', methods=['GET', 'POST'])
def profile_update():
    # 쿠키에서 토큰 정보를 받고 이를 통해 현재 user를 조회합니다.
    token_receive = request.cookies.get('token')
    payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
    user = db.users.find_one({'id': payload['id']})        
    # AJAX 통신으로 데이터를 전달 받습니다.
    if request.method == 'POST':        
        email = request.form['email']
        description = request.form['description']                      
        # profile 이미지를 바꾸는 경우 form에서 profile_img 키를 탐색 후 있으면 DB에 업데이트 합니다.
        if "profile_img" in request.files :
            print('exist')                   
            fs.delete(user['img'])
            profile_img = request.files['profile_img']            
            fs_image_id = fs.put(profile_img)
            db.users.update_one({'id':user['id']},{'$set':{'email':email, 'description':description, 'img':fs_image_id}})
        else:
            db.users.update_one({'id':user['id']},{'$set':{'email':email, 'description':description}})
        return jsonify({'msg': '프로필을 수정하였습니다.'})
        
    else:
        profile_img = return_img(user)
               
        return render_template('profile_update.html', user = user, profile_img = profile_img)


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True, use_reloader=True)
