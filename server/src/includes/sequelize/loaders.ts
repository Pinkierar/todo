import {config} from '#config';
import {Priority} from '#entities/Priority';
import {Status} from '#entities/Status';
import {Task} from '#entities/Task';
import {User} from '#entities/User';
import {Relation} from '#includes/sequelize/Relation';
import {Sequelize} from 'sequelize';

export const sequelize = new Sequelize(
  config.db.name,
  config.db.login,
  config.db.password,
  {
    host: config.db.host,
    dialect: 'postgres',
    logging: config.logs.db,
  },
);

const initModels = () => {
  Priority.initialize();
  User.initialize();
  Status.initialize();
  Task.initialize();
};

const initRelations = () => {
  Relation.oneIn(User, Task);
  Relation.oneIn(Status, Task);
  Relation.oneIn(Priority, Task);
};

const fillModels = async () => {
  await Priority.fill();
  await Status.fill();
};

export const initializeModels = async () => {
  initModels();
  initRelations();

  await sequelize.authenticate();

  await sequelize.sync();

  await fillModels();
};