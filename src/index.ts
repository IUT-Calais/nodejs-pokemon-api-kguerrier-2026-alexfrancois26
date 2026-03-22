import express from 'express';
import { pokemonCardRouter } from './pokemonCard/pokemonCard.router';
import { userRouter } from './user/user.router';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';


export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Configuration Swagger
const swaggerDocument = YAML.load(path.join('.', 'swagger', 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// modification de l'export pour permettre l'arrêt du serveur dans les tests car sinon cela ne fonctionne pas et les tests ne se terminent jamais
export let server: any;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port);
  console.log(`Serveur lancé sur http://localhost:${port}`);
  console.log(`Documentation Swagger disponible sur http://localhost:${port}/api-docs`);
}

app.use('/pokemon-cards', pokemonCardRouter);
app.use('/users', userRouter);
app.use('/users/login', userRouter);

// Stop le serveur après les tests pour éviter que les tests ne se terminent jamais
export function stopServer() {
  if (server) {
    server.close();
  }
}
