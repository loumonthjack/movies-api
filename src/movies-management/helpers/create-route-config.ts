import { IncomingMessage, ServerResponse } from "http";
import { URL } from "url";

export type RouteParams = (string | number | URL)[];

export type RouteHandler = (
  request: IncomingMessage, 
  response: ServerResponse, 
  ...params: RouteParams
) => Promise<void>;

export type RouteConfig = {
  pattern: RegExp;
  handler: RouteHandler;
  parseParams: (pathParts: string[], url: URL) => RouteParams;
}

export const createRouteConfig = (
  pattern: RegExp,
  handler: RouteHandler,
  parseParams: (pathParts: string[], url: URL) => RouteParams
): RouteConfig => ({
  pattern,
  handler,
  parseParams,
});
