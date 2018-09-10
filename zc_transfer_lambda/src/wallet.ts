import {Account, NEMLibrary, NetworkTypes, TransactionHttp, 
    MosaicHttp, TransferTransaction, TimeWindow, 
    Address, EmptyMessage, MosaicId, AccountHttp, Mosaic} from 'nem-library';
import {config} from '../config/config';
import {Observable} from "rxjs/Observable";

NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
//const account = Account.createWithPrivateKey(config.PRIVATE_KEY);
//const transactionHttp = new TransactionHttp();
//const mosaicHttp = new MosaicHttp();


export class AutoZCSender {
    account: Account;

    constructor(){
        this.account = Account.createWithPrivateKey(config.PRIVATE_KEY);
    }

    public sendZCTo(addr: string, qty:number,  callback:Function){
        const transactionHttp = new TransactionHttp(); 
        const mosaicHttp = new MosaicHttp();
        
        return new Promise ((resolve) => {

            Observable.from([
                {mosaic: new MosaicId(config.ZC_MOSAIC.namespace, config.ZC_MOSAIC.mosaic_name), quantity: qty},
            ]).flatMap(_ => mosaicHttp.getMosaicTransferableWithAmount(_.mosaic, _.quantity))
                .toArray()
                .map(mosaics => TransferTransaction.createWithMosaics(
                    TimeWindow.createWithDeadline(),
                    new Address(addr),
                    mosaics,
                    EmptyMessage
                    )
                )
                .map(transaction => this.account.signTransaction(transaction))
                .flatMap(signedTransaction => transactionHttp.announceTransaction(signedTransaction))
                .subscribe(nemAnnounceResult => {
                    resolve(nemAnnounceResult);
                });
        });

    }

    private getAccountBalance() :Promise<Array<Mosaic>> {
        return new Promise<Array<Mosaic>> ((resolve, reject) => {
            const accountHttp = new AccountHttp();
            accountHttp.getMosaicOwnedByAddress(this.account.address).subscribe(mosaics => {
                resolve(mosaics);
            }, err => {
                reject(err);
            })
        });
    }

    public async mosaicBalance(){
        const balances = await this.getAccountBalance();
        const mFound = balances.find((mosaic) => {
            return mosaic.mosaicId.name === config.ZC_MOSAIC.mosaic_name;
        });

        if(!mFound) return 0;
        return mFound.quantity;
    }

    public async xemBalance() {
        const balances = await this.getAccountBalance();
        const xemFound = balances.find((mosaic) => {
            return mosaic.mosaicId.name === 'xem';
        })
        if (!xemFound){
            return 0;
        }
        return xemFound.quantity;
    }
    
}
