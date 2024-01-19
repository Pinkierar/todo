import {config} from '#config';
import {UserEditionArgs} from '#global';
import {ValidatorType} from '#includes/validator';

const {min, max} = config.global.lengths;

export const UserValidator: ValidatorType<UserEditionArgs> = {
  id: key => key.isInteger(),
  name: key => key.isString(min.name, max.base),
  email: key => key.isEmail(),
  password: key => key.isString(min.password, max.base),
};