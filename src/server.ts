import * as http from 'http';
import App from './app';
const port = process.env.PORT || 8080;
App.set('port', port);

const server = http.createServer(App);
server.on('error', onError);
server.on('listening', onListening);
function onError(error: NodeJS.ErrnoException): void {
   if (error.syscall !== 'listen') { throw error; }
   const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
   switch (error.code) {
     case 'EACCES':
       console.error(`${bind} requires elevated privileges`);
       process.exit(1);
       break;
     case 'EADDRINUSE':
       console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
   }
 }
  
 function onListening(): void {
   const addr = server.address();
   const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
 }
server.listen(port,  () => console.log(`Server running at: ${port}`));


/*
this.app.use((req, res, next) => {
            const err: { status?: number, message:string } = new Error('Not Found');
            err.status = 404;
            next(err);
         });
         
         if (this.app.get('env') === 'development') {
         
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err['status'] || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
         }
  
         this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
         });
 */