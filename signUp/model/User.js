function User(address, mailAddr){
    return {
        TableName: "User",
        Item:{
            "address" : address,
            "mailAddr": mailAddr,
            "createdAt": new Date().toString()
        }
    };
}

module.exports = {User};