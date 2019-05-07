import * as express from 'express';
import * as graphqlHttp from 'express-graphql';
import schema from './Schemas/Schema';

const app: express.Express = express();

app.use('/graphql', graphqlHttp({
    schema,
    graphiql: true
}));

app.listen(8080, () => console.log('Listening on port 8080'));
