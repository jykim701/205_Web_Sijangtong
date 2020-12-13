var express = require('express');
var http = require('http');
var serveStatic = require('serve-static'); //특정 폴더의 파일들을 특정 패스로 접근할 수 있도록 열어주는 역할
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');

var port = 3000;
var database;
var userSchema;
var userModel;

//몽고디비에 연결 ,  보통 웹서버 만든 직후 연결 , DB 먼저 연결 되도 상관 없음
//먼저 db를 가져온다 
function connectDB() {
    //localhost 로컬 호스트
    //:27017  몽고디비 포트
    // var databaseURL = 'mongodb+srv://sijangtong:205webprogramming@205.v8ndu.mongodb.net/SiJangTong?retryWrites=true&w=majority';

    var databaseURL = 'mongodb://localhost:27017/sijangtongDB';
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseURL);

    database = mongoose.connection; //db와 연결 시도
    
    database.on('open', //db 연결 될때의 이벤트
        function () {
            console.log('data base 연결됨 ' + databaseURL);

            //몽구스는 스키마를 정의하고 해당 스키마에 해당 하는 데이터를 집어넣는 방식으로 테이블과 유사
            userSchema = mongoose.Schema({
                id: String,
                password: String,
                name: String,
                nickName: String,
                Email: String,
                phone: String,
            });
            console.log('userSchema 정의함');

            //컬렏션과 스키마를 연결시킴
            userModel = mongoose.model('users', userSchema);
            console.log('userModel 정의함');
        }
    );

    database.on('disconnected', //db 연결 끊길떄
        function () {
            console.log('data base 연결 끊어짐');
        }
    );
    database.on('error', //에러 발생하는 경우
        console.error.bind(console, 'mongoose 연결 에러')
    );
}



var app = express(); //express 서버 객체 
app.set('port', 3000);
app.use(serveStatic(path.join('public', __dirname, 'public')));

var bodyParser_post = require('body-parser'); //post 방식 파서
//post 방식 일경우 begin
//post 의 방식은 url 에 추가하는 방식이 아니고 body 라는 곳에 추가하여 전송하는 방식
app.use(bodyParser_post.urlencoded({
    extended: false
})); // post 방식 세팅
app.use(bodyParser_post.json()); // json 사용 하는 경우의 세팅
//post 방식 일경우 end

app.use(serveStatic(path.join(__dirname, 'public')));

//쿠키와 세션을 미들웨어로 등록한다
app.use(cookieParser());

//세션 환경 세팅
//세션은 서버쪽에 저장하는 것을 말하는데, 파일로 저장 할 수도 있고 레디스라고 하는 메모리DB등 다양한 저장소에 저장 할 수가 있는데
app.use(expressSession({
    secret: 'my key', //이때의 옵션은 세션에 세이브 정보를 저장할때 할때 파일을 만들꺼냐 , 아니면 미리 만들어 놓을꺼냐 등에 대한 옵션들임
    resave: true,
    saveUninitialized: true
}));


//라우트를 미들웨어에 등록하기 전에 라우터에 설정할 경로와 함수를 등록한다
//라우터를 사용 (특정 경로로 들어오는 요청에 대하여 함수를 수행 시킬 수가 있는 기능을 express 가 제공해 주는것)
var router = express.Router();
/*
router.route('/process/login').post(
    function (req, res) {
        console.log('process/login 호출됨');
        var paramID = req.body.id || req.query.id;
        var paramPW = req.body.password || req.query.password;
        console.log('paramID : ' + paramID + ', paramPW : ' + paramPW);

        if (database) {
            authUser(database, paramID, paramPW,
                function (err, docs) {
                    if (database) {
                        if (err) {
                            console.log('Error!!!');
                            res.writeHead(200, {
                                "Content-Type": "text/html;characterset=utf8"
                            });
                            res.write('<h1>에러발생</h1>');
                            res.end();
                            return;
                        }

                        if (docs) {
                            console.dir(docs);
                            res.writeHead(200, {
                                "Content-Type": "text/html;characterset=utf8"
                            });
                            res.write('<h1>Login Success</h1>');
                            res.write('<h1> user </h1>' + docs[0].id + '  :   ' + docs[0].name);
                            res.write('<br><a href="/login.html"> re login </a>');
                            res.end();

                        } else {
                            console.log('empty Error!!!');
                            res.writeHead(200, {
                                "Content-Type": "text/html;characterset=utf8"
                            });
                            res.write('<h1>user data not exist</h1>');
                            res.write('<a href="/login.html"> re login</a>');
                            res.end();
                        }

                    } else {
                        console.log('DB 연결 안됨');
                        res.writeHead(200, {
                            "Content-Type": "text/html;characterset=utf8"
                        });
                        res.write('<h1>databasae 연결 안됨</h1>');
                        res.end();
                    }



                }
            );
        }
    }
);


router.route('/process/addUser').post(
    function (req, res) {
        console.log('process/addUser 호출됨');
        var paramID = req.body.id || req.query.id;
        var paramPW = req.body.password || req.query.password;
        var paramName = req.body.name || req.query.name;
        console.log('paramID : ' + paramID + ', paramPW : ' + paramPW);

        if (database) {
            addUser(database, paramID, paramPW, paramName,
                function (err, result) {
                    if (err) {
                        console.log('Error!!!');
                        res.writeHead(200, {
                            "Content-Type": "text/html;characterset=utf8"
                        });
                        res.write('<h1>에러발생</h1>');
                        res.end();
                        return;
                    }

                    if (result) {
                        console.dir(result);
                        res.writeHead(200, {
                            "Content-Type": "text/html;characterset=utf8"
                        });
                        res.write('<h1>Add Success</h1>');
                        res.write('<h1> name </h1>' + paramName);
                        res.write('<br><a href="/login.html"> re login </a>');
                        res.end();
                    } else {
                        console.log('추가 안됨 Error!!!');
                        res.writeHead(200, {
                            "Content-Type": "text/html;characterset=utf8"
                        });
                        res.write('<h1>can not add user</h1>');
                        res.write('<a href="/login.html"> re login</a>');
                        res.end();
                    }

                }
            );
        } else {
            console.log('DB 연결 안됨');
            res.writeHead(200, {
                "Content-Type": "text/html;characterset=utf8"
            });
            res.write('<h1>databasae 연결 안됨</h1>');
            res.end();
        }
    }
);
*/

//라우터 미들웨어 등록하는 구간에서는 라우터를 모두  등록한 이후에 다른 것을 세팅한다
//그렇지 않으면 순서상 라우터 이외에 다른것이 먼저 실행될 수 있다
app.use('/', router); //라우트 미들웨어를 등록한다

var id_check = function (database, id, callback) {
    userModel.find({
            'id': id,
        },
        function (err, docs) {
            if (err) {
                callback(err, null);
                return;
            }
            if (docs.length > 0) {
                console.log('There is [ ' + docs + ' ]');
                callback(null, docs);
            } else {
                console.log('There are not [ ' + docs + ' ]');
                callback(null, null);
            }
        }
    );
};


var authUser = function (database, id, password, callback) {
    console.log('input id :' + id.toString() + '  :  pw : ' + password);
    userModel.find({
            'id': id,
            'password': password
        },
        function (err, docs) {
            if (err) {
                callback(err, null);
                return;
            }
            if (docs.length > 0) {
                console.log('find user [ ' + docs + ' ]');
                callback(null, docs);
            } else {
                console.log('can not find user [ ' + docs + ' ]');
                callback(null, null);
            }
        }
    );
};

var addUser = function (database, id, password, name, nickName, Email, phone, callback) {
    console.log('add User 호출됨' + id + '  , ' + password);
    var user = new userModel({
        "id": id,
        "password": password,
        "name": name,
        "nickName": nickName,
        "Email": Email,
        "phone": phone,
    });

    //user 정보를 저장하겠다는 함수
    user.save(
        function (err) {
            if (err) {
                callback(err, null);
                return;
            }
            //데이터가 추가됐다면 insertedCount 카운트가 0 보다 큰값이 된다
            console.log('사용자가 추가 됨');
            callback(null, user);
        }
    );
};

/*
var http = require('http'),
    path = require('path'),
    mime = require('mime'),
    fs = require('fs');

var app = http.createServer(function (req, res) {
    if (req.url === '/') {
        fs.readFile('./main.html', function (err, page) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(page);
            res.end();
        });
    } 
    else if (req.url === 'main.css') {
        fs.readFile('./main.css', function (err, page) {
            res.writeHead(200, {
                'Content-Type': 'text/css'
            });
            res.write(page);
            res.end();
        });
    }
    else if (req.url === '/user_add.html') {
        fs.readFile('./user_add.html', function (err, page) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(page);
            res.end();
        });
    } 
   else {
        res.writeHead(301, {
            Location: './'
        });
        res.end();
    }
});

app.listen(port);
console.log('Server running on port: ' + port);
*/


var Connect = require('connect');
var connect_router = require("connect_router");
var fs = require("fs");
var url = require("url");
// app.use(serveStatic(path.join('public', __dirname, 'public')));
//서버 객체를 얻어옵니다.
//const publicPath = path.join('public', __dirname, 'public');
var server = Connect.createServer()
    //.use(Connect.static(__dirname + "public")) // 각종 리소스 폴더
    .use(serveStatic(path.join('public', __dirname, 'public')))
    .use(Connect.bodyParser()) // post 방식 전송된 데이터 읽어오기 위해
    .use(connect_router(main)) // 페이지 라우팅 처리할 함수
    .use(Connect.errorHandler({
        stack: true,
        message: true,
        dump: true
    })) // 에러출력 및 처리
    .listen(3000);

//페이지 라우팅을 해서 클라이언트에 서비스할 함수
function main(app) {
    app.get("/", function (request, response) {
        console.log("main.html 클라이언트의 요청이 왔습니다.");
        connectDB();
        //클라이언트에 응답할 html 파일을 읽어서 응답한다.
        fs.readFile("./main.html", function (error, data) {
            response.writeHead(200, {
                "Content-Type": "text/html"
            });
            response.end(data);
        });
    });

    app.get("/user_add", function (request, response) {
        console.log("login.html 클라이언트의 요청이 왔습니다.");
        //클라이언트에 응답할 html 파일을 읽어서 응답한다.
        fs.readFile("./user_add.html", function (error, data) {
            response.writeHead(200, {
                "Content-Type": "text/html"
            });
            response.end(data);
        });
    });
    app.get("/mypage", function (request, response) {
        fs.readFile("./mypage.html", function (error, data) {
            response.writeHead(200, {
                "Content-Type": "text/html"
            });
            response.end(data);
        });
    });

    app.post("/process/login", function (req, res) {
        console.log('process/login 호출됨');
        var paramID = req.body.id || req.query.id;
        var paramPW = req.body.password || req.query.password;
        console.log('paramID : ' + paramID + ', paramPW : ' + paramPW);

        if (database) {
            authUser(database, paramID, paramPW,
                function (err, docs) {
                    if (database) {
                        if (err) {
                            console.log('Error!!!');
                            return;
                        }

                        if (docs) {
                            console.dir(docs);
                            res.writeHead(200, {
                                "Content-Type": "text/html;characterset=utf8"
                            });
                            res.write('<h1>Login Success</h1>');
                            res.write('<h1> user id :</h1>' + docs[0].id + '<br>name :' + docs[0].name);
                            res.write('<br><br><a href="/"> Go to Main </a>');
                            res.end();

                        } else {
                            console.log('empty Error!!!');
                            res.writeHead(200, {
                                "Content-Type": "text/html;characterset=utf8"
                            });
                            res.write('<h3>Not a member !</h3>');
                            res.write('<a href="/">Go to main  </a><br>');
                            res.write('<a href="../user_add">  Go to Join</a>');
                            res.end();
                        }

                    } else {
                        console.log('DB 연결 안됨');
                        res.writeHead(200, {
                            "Content-Type": "text/html;characterset=utf8"
                        });
                        res.write('<h1>databasae 연결 안됨</h1>');
                        res.end();
                    }
                }
            );
        }
    });
    app.post("/process/id_check", function (req, res) {
        console.log('process/id_check 호출됨');
        var paramID = req.body.check || req.query.check;

        if (database) {
            id_check(database, paramID,
                function (err, docs) {
                    if (database) {
                        if (docs) {
                            console.dir(docs);
                            res.write ("<script language='javascript'>alert('Cannot use this ID');</script>");
                            res.end();

                        } else {
                            res.write ("<script language='javascript'>alert('Can use this ID');</script>");                    
                            res.end();
                        }

                    }
                }
            );
        }
    });

    app.post("/process/addUser", function (req, res) {
        console.log('process/addUser 호출됨');
        var paramID = req.body.id || req.query.id;
        var paramPW = req.body.password || req.query.password;
        var paramNAME = req.body.name || req.query.name;
        var paramNICKNAME = req.body.nickName || req.query.nickName;
        var paramEMAIL = req.body.Email || req.query.Email;
        var paramPHONE = req.body.phone || req.query.phone;
        console.log('paramID : ' + paramID + ', paramPW : ' + paramPW);

        if (database) {
            addUser(database, paramID, paramPW, paramNAME, paramNICKNAME, paramEMAIL, paramPHONE,
                function (err, result) {
                    if (err) {
                        console.log('Error!!!');
                        res.writeHead(200, {
                            "Content-Type": "text/html;characterset=utf8"
                        });
                        res.write('<h1>에러발생</h1>');
                        res.end();
                        return;
                    }

                    if (result) {
                        console.dir(result);
                        res.writeHead(200, {
                            "Content-Type": "text/html;characterset=utf8"
                        });
                        res.write('<h1>Add Success</h1>');
                        res.write('<br><a href="/">Go to Main </a>');
                        res.end();
                     }
                    // else {
                    //     console.log('추가 안됨 Error');
                    //     res.writeHead(200, {
                    //         "Content-Type": "text/html;characterset=utf8"
                    //     });
                    //     res.write('<h1>can not add user</h1>');
                    //     res.write('<a href="/"> Go to Main</a>');
                    //     res.end();
                    // }

                }
            );
        } else {
            console.log('DB 연결 안됨');
            res.writeHead(200, {
                "Content-Type": "text/html;characterset=utf8"
            });
            res.write('<h1>databasae 연결 안됨</h1>');
            res.end();
        }
    });

    /*
    // post 방식으로 form 전송햇을때
    app.post("/login", function (request, response) {
        console.log("post / memIn.html 클라이언트의 요청이 왔습니다.");
        // body 부분에 붙어서 오는 데이터를 읽어오기 위해.
        var body = request.body;
        console.log(body.id + " / " + body.pwd);
        // 페이지 강제이동
        response.writeHead(302, {
            "Location": "/member/memIn.html"
        });
        response.end();
    });
*/
}


/*
var connect = require('connect');
var fs = require('fs');
function get(path, cd) {
    return function (req, res, next) {
        if (req.method != 'GET' || req.url != path)
            return next();
        cd(req, res, next);
    }
}

//웹서버를 app 기반으로 생성
var appServer = http.createServer(app);
appServer.listen(app.get('port'),
    function () {
        console.log('express 웹서버 실행' + app.get('port'));
        connectDB(); //DB 연결 , DB 연결 먼저해도 상관 없음
    }
);

appServer.listen(app.get('port'),
    function () {
        console.log('express 웹서버 실행' + app.get('port'));
        connectDB();        //DB 연결 , DB 연결 먼저해도 상관 없음
    }
);

app.get("/", function(){
    console.log('express 웹서버 실행');
    connectDB();
})
appServer.listen(port, ()=> console.log('App server is on port' +port));
*/