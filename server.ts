import app from './src/app';
import { CONFIG } from './src/config';

const PORT = CONFIG.PORT || 8080;

const startServer = async (PORT: number) => {
  try {
    app.listen(PORT || 8080, () => {
      console.log(`Listening on ${PORT}`);
    });
  } catch (error) {
    console.log(`Something went wrong `);
  }
};

startServer(PORT as number);
