'use strict';

import {Handler, Context, Callback} from 'aws-lambda';
import {AutoZCSender} from "./src/wallet";

interface HelloResponse {
  statusCode : number;
  body:string;
}

const zc_send_trigger: Handler = (event: any, context: Context, callback: Callback) => {
  
  const response: HelloResponse = {
    statusCode: 200,
    body: JSON.stringify({})
  }

  var addr = event.address;
  var amount = event.amount; 
  var autoSender = new AutoZCSender();

  autoSender.sendZCTo(addr, amount, callback).then((nemAnnounceResult)=> {
    response.body= JSON.stringify(nemAnnounceResult);
    console.log(nemAnnounceResult);
    callback(undefined, response);
  });
  
};



export { zc_send_trigger }