var http = require('http');
var server = http.createServer();

var IndexController = require('./IndexController');
var indexController = new IndexController();

var UserController = require('./UserController');
var userController = new UserController();

var ArticleController = require('./ArticleController');
var articleController = new ArticleController();

server.on('request', function (request, response) {
    var url = request.url

    /* 所有请求都允许跨域访问 */
    response.setHeader('Access-Control-Allow-Origin','*');
    /* 业务分流 */
    switch (url) {
        case '/':
            indexController.index(request,response);
            break;
        case '/login':
            userController.login(request,response);
            break;
        case '/register':
            userController.register(request,response);
            break;
        case '/list':
            articleController.list(request,response);
            break;
        case '/write':
            articleController.write(request,response);
            break;
        case '/view':
            articleController.view(request,response);
            break;
        default:
            indexController.invalidPath(request,response);
            break;
    }
});

var port = 80;
server.listen(port);

console.log('Server at: http://127.0.0.1:' + port + '/');