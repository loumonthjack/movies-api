import http from 'http';
import MovieManagement from './movies-management';
import RatingsManagement from './ratings-management';
import env from './env';
import requestHandler from './request-handler';

const PORT = env.PORT;

export const startServer = async () => {
  await MovieManagement.DB.getSchema();
  await RatingsManagement.DB.getSchema();
  const server = http.createServer(requestHandler);
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT} 🚀`);
  });

  return server;
};

startServer().catch(console.error);
