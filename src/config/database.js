import {Sequelize} from 'sequelize'
import * as dotenv from 'dotenv' 
dotenv.config()

export const sequelize = new Sequelize({
  host : process.env.POSTGRE_HOST,
  port : process.env.POSTGRE_PORT,
  username : process.env.POSTGRE_USER,
  password : process.env.POSTGRE_PSWRD,
  database :process.env.POSTGRES_DATABASE,
  dialect: 'postgres'
});


try {
  await sequelize.authenticate();
  logger.info(`======== ADSequelize Connected========`)
} catch (error) {
  logger.error(`========Unable to connect to the database ${error} ==========`)
}

