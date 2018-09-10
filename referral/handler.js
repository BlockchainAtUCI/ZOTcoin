var AWS = require("aws-sdk");
const config = require("./util/config");
AWS.config.update({region: config.Region});
var lambda = new AWS.Lambda({region: config.Region})
var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});


exports.handler = (event, context, callback) => {

    var getParams = {
        TableName: config.TableName,
        Key: {'address': event.to}
    };
    var invokedParams = {
      FunctionName: "aws-nodejs-dev-zc_send_trigger",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        address: event.from,
        amount: config.RewardAmount
      })
    };
    var updateForToParams = {
        TableName: config.TableName,
        Key:{
            'address': event.to
        },
        UpdateExpression: 'set referredBy = :f',
        ExpressionAttributeValues: {
            ':f' : event.from
        }
    };
    var updateForFromParams = {
        TableName: config.TableName,
        Key:{
            'address': event.from
        },
        UpdateExpression: "set #attrName = list_append(#attrName, :t)",
        ExpressionAttributeNames : {
            "#attrName" : "referTo"
        },
        ExpressionAttributeValues: {
            ':t' : [event.to]
        }
    };
    const response = {
        statusCode: 202,
        body: JSON.stringify('')
    };
    
    docClient.get(getParams, function(err, data){
        if(err){
            console.log("Error", err);
        }else{
            if(!data.Item.referredBy){
                docClient.update(updateForToParams, function(err, data){
                    if(err){
                      console.log("Error", err); 
                    }else{
                        log("updateForToParams: ", data);
                    }
                });
                lambda.invoke(invokedParams, function(err, resultData){
                    if(err){
                        console.log(err);
                    }
                    else{
                        var res = JSON.parse(resultData.Payload);
                        
                        if((JSON.parse(res.body).message) === 'SUCCESS'){
                            docClient.update(updateForFromParams, function(err, data){
                                if(err){
                                    console.log(err);
                                }else{
                                    response.body = JSON.stringify(data);
                                    callback(undefined, response);
                                }
                            })
                        }
                    }
                })
                
            }
            
        }
    })
};