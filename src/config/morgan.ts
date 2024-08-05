import morgan from 'morgan';
import logger from "./winston";


const morganMiddleware = morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
});

export default morganMiddleware;
