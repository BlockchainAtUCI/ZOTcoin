function Referral(address){
    return {
        TableName:"Referral",
        Item: {
            "address":address,
            "referredBy": null,
            "referTo": []
        }
    }
}

module.exports = {Referral};