/**
 * @class IndexController
 * @desc Index控制器
 */
class IndexController{
    constructor(){

    }

    index(request, response){
        response.setHeader('Content-Type','text/plain;charset=UTF-8');
        response.end('index');
    }

    invalidPath(request, response){
        response.setHeader('Content-Type','text/plain;charset=UTF-8');
        response.end('invalid path');
    }
}
module.exports = IndexController;