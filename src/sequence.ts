import {
  AuthenticateFn,
  AuthenticationBindings,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';
import {Context, inject} from '@loopback/core';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  ResolvedRoute,
  RestBindings,
  Send,
  SequenceActions,
  SequenceHandler,
} from '@loopback/rest';
import {LogService} from './services/log.service';
export class MySequence implements SequenceHandler {
  constructor(
    // ---- ADD THIS LINE ------
    @inject(RestBindings.Http.CONTEXT) public ctx: Context,
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
    @inject('services.LogService') private logService: LogService,
  ) {}
  async handle(context: RequestContext) {
    let reqBody;
    let resBody;
    let reqHeaders;
    let reqParams;
    let resHeaders;
    let route;
    try {
      const {request, response} = context;
      // console.log({request, response});
      route = this.findRoute(request);
      reqHeaders = request.headers;
      reqParams = request.params;
      reqBody = JSON.stringify(request.body);
      // - enable jwt auth -
      // call authentication action
      // ---------- ADD THIS LINE -------------
      await this.authenticateRequest(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      resHeaders = response.getHeaders();
      resBody = JSON.stringify(result);
      this.logRequestResponse(
        route,
        reqParams,
        reqHeaders,
        reqBody,
        resHeaders,
        resBody,
      );
      this.send(response, result);
    } catch (err) {
      console.error({err});
      // ---------- ADD THIS SNIPPET -------------
      // if error is coming from the JWT authentication extension
      // make the statusCode 401
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, {statusCode: 401 /* Unauthorized */});
      }
      this.logRequestResponse(
        route,
        reqParams,
        reqHeaders,
        reqBody,
        resHeaders,
        resBody,
      );
      // throw new Error(err);
      // ---------- END OF SNIPPET -------------
      this.reject(context, err);
    }
  }
  private logRequestResponse(
    route: ResolvedRoute | undefined,
    reqParam: unknown,
    reqHeader: unknown,
    reqBody: unknown,
    resHeader: unknown,
    resBody: unknown,
  ): void {
    const verb = route ? route.verb : '';
    const path = route ? route.path : '';
    this.logService.logger.info({
      message: 'Log-RequestResponse',
      meta: {
        request: {
          verb: verb,
          path: path,
          param: reqParam,
          header: reqHeader,
          body: reqBody,
        },
        response: {
          header: resHeader,
          body: resBody,
        },
      },
    });
  }
}
