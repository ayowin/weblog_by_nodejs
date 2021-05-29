/**
 * @class MysqlConfiguration
 * @desc MySQL配置
 */
class MysqlConfiguration{
    static config(){
        var config = new Object();
        config.host = 'localhost';
        config.user = 'root';
        config.password = '123456';
        config.database = 'weblog';
        return config;
    }
}
module.exports = MysqlConfiguration;