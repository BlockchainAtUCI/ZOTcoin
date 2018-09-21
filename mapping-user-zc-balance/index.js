var {mosaicBalance} = require("./util/wallet");
var AWS = require("aws-sdk");
const config = require("./util/config");
AWS.config.update({region: config.Region});
var documentClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const getParam = {
    TableName:config.TableName
}

function getAddress() {
    
    return new Promise((resolve) => {
        let result = [];
        documentClient.scan(getParam, function(err, data) {
            if (err) {
                console.log(err);
                return;
            }
            else {
                data.Items.forEach(function(elem){
                    result.push(elem.address);
                });
                resolve(result);
            }
          });

    });
    
}


exports.handler = async (event, context, callback) => {
    var test_list = await getAddress();
    let result = await mosaicBalance(test_list);

    console.log(result);
};


/*
var main = async () => {
    var test_list = await getAddress();
    let result = await mosaicBalance(test_list);
    console.log(result);
    
}

main();
*/
