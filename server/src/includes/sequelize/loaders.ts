import {QueryTypes, Sequelize} from 'sequelize';
import {User} from '#entities/User';
import {Relation} from '#includes/sequelize/Relation';
import {config} from '#config';

export const sequelize = new Sequelize(config.db.host, {
  dialect: 'mysql',
  username: config.db.login,
  password: config.db.password,
  database: config.db.name,
  logging: false,
});

const initModels = () => {
  User.initialize();
};

const initRelations = () => {
};

const fillModels = async () => {
  await User.fill();
};

export const initializeModels = async () => {
  if (config.app.isProduction || !config.db.resetting) {
    initModels();
    initRelations();

    await sequelize.authenticate();

    await sequelize.sync();
  } else {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    const table_names = (await sequelize.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = '${config.db.name}'`,
      {type: QueryTypes.SELECT},
    )).map(({table_name}) => table_name);

    await sequelize.query(table_names.map(
      table_name => `DROP TABLE IF EXISTS \`${table_name}\`;`,
    ).join(' '));

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    initModels();
    initRelations();

    await sequelize.authenticate();

    await sequelize.sync({force: true});
  }
  await fillModels();
};