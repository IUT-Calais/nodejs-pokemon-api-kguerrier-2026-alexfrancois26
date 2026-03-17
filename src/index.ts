import express from 'express';
import { pokemonCardRouter } from './pokemonCard/pokemonCard.router';
import { userRouter } from './user/user.router';


export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// modification de l'export pour permettre l'arrêt du serveur dans les tests car sinon cela ne fonctionne pas et les tests ne se terminent jamais
export let server: any;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port);
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
