/* 引入mysql模块 */
var mysql = require('mysql');
/* 引入mysql配置类 */
var MysqlConfiguration = require('./MysqlConfiguration');
/* 引入文件系统模块 */
var fileSystem = require('fs')
/* 引入uuid模块 */
var uuid = require('node-uuid');

/**
 * @class ArticleController
 * @desc 文章控制器
 */
class ArticleController{
    constructor(){
    }

    list(request, response){
        /* 解析post报文 */
        var queryString = require('querystring');
        var requestData = '';
        request.on('data',function (chunk) {
            /* chunked回调：即分段接收 */
            requestData += chunk;
        });
        request.on('end',function() { /* 接收完成回调 */
            console.log(requestData);

            /* 反序列化成对象 */
            try{
                requestData = JSON.parse(requestData);

                var pageSize = requestData.pageSize;
                var pageIndex = requestData.pageIndex;

                var connection = mysql.createConnection(MysqlConfiguration.config());
                connection.connect();
                var sql = 'select * from `article` order by `update_time` desc limit ' + (pageIndex-1)*pageSize + ',' + pageSize + ';';
                console.log(sql);
                connection.query(sql,function (err, result) {
                    if(err){
                        console.log('[select error] - ',err.message);
                        return;
                    }

                    var responseContent = new Object();
                    if(result.length > 0) {
                        responseContent.result = 'success';
                        responseContent.topics = new Array();
                        for(var i=0;i<result.length;i++){
                            responseContent.topics[i] =  new Object();
                            responseContent.topics[i].id = result[i]['id'];
                            responseContent.topics[i].topic = result[i]['topic'];
                            responseContent.topics[i].user = result[i]['user'];
                            responseContent.topics[i].updateTime = result[i]['update_time'];
                        }
                        responseContent = JSON.stringify(responseContent);
                        response.end(responseContent);
                    } else {
                        responseContent.result = 'failed';
                        responseContent = JSON.stringify(responseContent);
                        response.end(responseContent);
                    }
                });
                connection.end();
            } catch (e) {
                var responseContent = new Object();
                responseContent.result = 'failed';
                responseContent = JSON.stringify(responseContent);
                response.end(responseContent);
            }
        })
    }

    write(request, response){
        /* 解析post报文 */
        var queryString = require('querystring');
        var requestData = '';
        request.on('data',function (chunk) {
            /* chunked回调：即分段接收 */
            requestData += chunk;
        });
        request.on('end',function() { /* 接收完成回调 */
            console.log(requestData);

            /* 反序列化成对象 */
            try{
                requestData = JSON.parse(requestData);

                var user = requestData.user;
                var topic = requestData.topic;
                var content = requestData.content;

                var contentFilePath = './articles/' + uuid.v1() + '.txt';

                fileSystem.writeFile(contentFilePath,content, function (error) {
                    if (error) {
                        var responseContent = new Object();
                        responseContent.result = 'failed';
                        responseContent = JSON.stringify(responseContent);
                        response.end(responseContent);
                    } else {
                        var connection = mysql.createConnection(MysqlConfiguration.config());
                        connection.connect();
                        var sql = 'insert into `article` (topic,content_file_path,user) VALUES(?,?,?)';
                        var parammeters = [topic,contentFilePath,user];
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
                    }
                })
            } catch (e) {
                var responseContent = new Object();
                responseContent.result = 'failed';
                responseContent = JSON.stringify(responseContent);
                response.end(responseContent);
            }
        })
    }

    view(request, response){
        /* 解析post报文 */
        var queryString = require('querystring');
        var requestData = '';
        request.on('data',function (chunk) {
            /* chunked回调：即分段接收 */
            requestData += chunk;
        });
        request.on('end',function() { /* 接收完成回调 */
            console.log(requestData);

            /* 反序列化成对象 */
            try{
                requestData = JSON.parse(requestData);

                var articleId = requestData.articleId;

                var connection = mysql.createConnection(MysqlConfiguration.config());
                connection.connect();
                var sql = 'select * from `article` where `id`=' + articleId + ';';
                console.log(sql);
                connection.query(sql,function (err, result) {
                    if(err){
                        console.log('[select error] - ',err.message);
                        return;
                    }

                    if(result.length > 0) {
                        fileSystem.readFile(result[0]['content_file_path'], function (error, data) {
                            var responseContent = new Object();
                            if (error) {
                                responseContent.result = 'failed';
                            } else {
                                responseContent.result = 'success';
                                responseContent.content = data.toString();
                            }
                            responseContent = JSON.stringify(responseContent);
                            response.end(responseContent);
                        })
                    } else {
                        var responseContent = new Object();
                        responseContent.result = 'failed';
                        responseContent = JSON.stringify(responseContent);
                        response.end(responseContent);
                    }
                });
                connection.end();
            } catch (e) {
                var responseContent = new Object();
                responseContent.result = 'failed';
                responseContent = JSON.stringify(responseContent);
                response.end(responseContent);
            }
        })
    }
}
module.exports = ArticleController;