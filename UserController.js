/* 引入mysql模块 */
var mysql = require('mysql');
/* 引入mysql配置类 */
var MysqlConfiguration = require('./MysqlConfiguration');

/**
 * @class UserController
 * @desc 用户控制器
 */
class UserController{
    constructor(){
    }

    login(request, response){
        /* 解析post报文 */
        var queryString = require('querystring');
        var requestData = '';
        request.on('data',function (chunk) {
            /* chunked回调：即分段接收 */
            requestData += chunk;
        });
        request.on('end',function(){ /* 接收完成回调 */
            console.log(requestData);

            /* 反序列化成对象 */
            try{
                requestData = JSON.parse(requestData);

                var username = requestData.username;
                var password = requestData.password;

                response.setHeader('Content-Type','text/plain;charset=UTF-8');

                var connection = mysql.createConnection(MysqlConfiguration.config());
                connection.connect();
                var sql = 'select * from `user` where `username`=\'' + username + '\' and `password`=\'' + password + '\';';
                console.log(sql);
                connection.query(sql,function (err, result) {
                    if(err){
                        console.log('[select error] - ',err.message);
                        return;
                    }

                    var responseContent = new Object();

                    if(result.length > 0) {
                        responseContent.result = 'success';
                    } else {
                        responseContent.result = 'failed';
                    }

                    responseContent = JSON.stringify(responseContent);
                    response.end(responseContent);
                });
                connection.end();
            } catch (e) {
                var responseContent = new Object();
                responseContent.result = 'failed';
                responseContent = JSON.stringify(responseContent);
                response.end(responseContent);
            }
        });
    }

    register(request, response){
        /* 解析post报文 */
        var queryString = require('querystring');
        var requestData = '';
        request.on('data',function (chunk) {
            /* chunked回调：即分段接收 */
            requestData += chunk;
        });
        request.on('end',function(){ /* 接收完成回调 */
            console.log(requestData);

            /* 反序列化成对象 */
            try{
                requestData = JSON.parse(requestData);

                var username = requestData.username;
                var password = requestData.password;

                response.setHeader('Content-Type','text/plain;charset=UTF-8');

                var connection = mysql.createConnection(MysqlConfiguration.config());
                connection.connect();
                var sql = 'insert into `user` (username,password) VALUES(?,?)';
                var parammeters = [username,password];
                console.log(sql);
                connection.query(sql,parammeters,function (err, result) {
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    }

                    var responseContent = new Object();
                    responseContent.result = 'success';
                    responseContent = JSON.stringify(responseContent);
                    response.end(responseContent);
                });
                connection.end();
            } catch (e) {
                var responseContent = new Object();
                responseContent.result = 'failed';
                responseContent = JSON.stringify(responseContent);
                response.end(responseContent);
            }
        });
    }
}
module.exports = UserController;