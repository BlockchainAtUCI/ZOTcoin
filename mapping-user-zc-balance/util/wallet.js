var {AccountHttp,NetworkTypes,NEMLibrary,Address} = require("nem-library");
var MOSAIC = require("../util/config").ZC_MOSAIC;

NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

var getAccountBalance = (address) => {
    return new Promise((resolve) => {
        const accountHttp = new AccountHttp();
        accountHttp.getMosaicOwnedByAddress(new Address(address)).subscribe(mosaics => {
            resolve(mosaics);
        });
    });
}

var mosaicBalance = async (address_list) => {
    let result = {};

    for (let i = 0;i <  address_list.length; i++){
        let addr = address_list[i];
    
        var balance = await getAccountBalance(addr);
    
        let mFound = balance.find((mosaic) => {
            return mosaic.mosaicId.name === MOSAIC.mosaic_name;
        });

        if (!mFound){
            result[addr] = 0;
        }
        else{
            result[addr] = mFound.quantity;
        }
    }

    return result;
}


module.exports = {mosaicBalance};
