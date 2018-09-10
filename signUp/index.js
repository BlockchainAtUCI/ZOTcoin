var AWS = require("aws-sdk");
const config = require("./util/config");
AWS.config.update({region: config.Region});
var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const {User} = require("./model/User"); 
const {Referral} = require("./model/Referral");

function errCallback(_statusCode, _message, callback){
    
    callback(undefined, {
        statusCode: _statusCode,
        body:{
            message: _message
        }
    });
}
function registorNewUser(event, docClient, callback) {

        var user = new User(event.address, event.mailAddr);
        var referral = new Referral(event.address);
        
        var param = {
            RequestItems: {
                "User": [{
                    PutRequest: {
                        Item:user.Item
                    }
                }],
                "Referral": [{
                    PutRequest: {
                        Item:referral.Item
                    }
                }]
            }
        };
        
        docClient.batchWrite(param, function(err, result){
            if(err){
                errCallback(400,err,callback);
            }else{
                callback(undefined, {
                    statusCode: 202,
                    body:{
                        message: `A new user ${user.address} has successfully signed up`
                    }
                })
            }
        })
    
}

exports.handler = (event, context, callback) => {
    
    var aUser = {
        TableName:"User",
        Key:{'address': event.address}
    };
    
    docClient.get(aUser, function(err, result){
        // If user does not exists
        if(err){
            errCallback(400, err,callback);
        
        }else{
            if(!result.Item){
                try{
                    registorNewUser(event, docClient, callback);  
                }catch(err){
                    errCallback(400,err,callback);
                }
            }
            else{
                errCallback(400, `User ${event.address} already exists`, callback);
            }
        }
    });
};

