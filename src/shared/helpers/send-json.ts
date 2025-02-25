import { ServerResponse } from 'http';

export const sendJson = (response: ServerResponse, data: unknown, status = 200) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(data));
  };
