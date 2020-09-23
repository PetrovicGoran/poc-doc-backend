const http = require("http");
var ip = require("ip");
var fs = require("fs");
var path = require('path');


var ConnectionClass = class Connection {
	
	static sendHttpGet(path) {
		const options = {
			hostname: "localhost",
			port: 8080,
			path: path.toString(),
			method: 'GET',
			timeout: 10000
		};
		
		const req = http.request(options, res => {
			//console.log("statusCode: " + res.statusCode + ";");
			
			res.on('data', d => {
				//process.stdout.write(d)
			});
		});
		
		req.on('timeout', function () {
			console.log("timeout! " + (options.timeout / 1000) + " seconds expired");
			req.destroy();
        });

		req.on('error', error => {
			//pomeni, da tista adresa ni dosegljiva --> brisemo je iz seznama
			//ne bomo serverja izklopili iz p2p omrežja
			if(this.address.toString() !== saServerIp || parseInt(this.port) !== parseInt(saServerPort)) {
				connected.removeNode(this.address.toString(), this.port);
				console.log("[[in get]]removed from connection with port: " + this.port.toString());
			}
			
			if(ip.address().toString() === saServerIp && parseInt(serverPortNumber) === saServerPort && connected.getConnectedNodesLength() <= 1) {	//samo server je v p2p omrezju
				writeToFile();
			}
			
			
			//posiljanje spremembe vsemi ostalimi vozlisci
			connected.sendHttpPostToAll(ip.address().toString(), parseInt(serverPortNumber), "/nodes/nodeNetworkChanged", JSON.stringify(connected));
		});

		req.end();
	}
	
	static sendHttpPost(path, data) {
		
        const sendData = JSON.stringify({"data": data});
        console.log("im here");
		
		const options = {
			hostname: "192.168.18.7",
			port: 8080,
			path: path.toString(),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': sendData.length
			}
		};
		
		const req = http.request(options, res => {
            //console.log("statusCode: " + res.statusCode + ";");
            let data = '';

			res.on('data', d => {
                //process.stdout.write(d)
                //console.log(JSON.stringify(d, null, "\t"));

                //return d;

                data += d;
            });
            
            res.on('end', () => {
                return JSON.parse(data).privateKey;
                //console.log(JSON.parse(data).privateKey);
            });
		});

		req.on('error', error => {
			//pomeni, da tista adresa ni dosegljiva --> brisemo je iz seznama
			/*connected.removeNode(this.address.toString(), this.port);
			console.log("[[in post]]removed from connection with port: " + this.port.toString());
			
			if(ip.address().toString() === saServerIp && parseInt(serverPortNumber) === saServerPort && connected.getConnectedNodesLength() <= 1) {	//samo server je v p2p omrezju
				writeToFile();
			}
		
			//posiljanje spremembe vsemi ostalimi vozlisci
			connected.sendHttpPostToAll(ip.address().toString(), parseInt(serverPortNumber), "/nodes/nodeNetworkChanged", JSON.stringify(connected));
			*/
			
            //console.error(error);
            
            console.log("error: " + JSON.stringify(error));
		});
	
		req.write(sendData);
		req.end();
	}
};

module.exports = ConnectionClass;