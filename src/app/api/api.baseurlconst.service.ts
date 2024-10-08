export class ApiConst {
  constructor() { }
  IsLive: boolean = false;
  autohost(location) {
    debugger;
    var apiHost = '';
    if (this.IsLive) {
      apiHost = 'https://app.citygroupbd.com/SB_API/api/'//Real Live
    }
    else {
      apiHost = 'http://localhost:49942/api/'; //Local
    }

    //var apiHost='http://192.168.61.246:81/api/'; //Live

    return apiHost;
  }
}