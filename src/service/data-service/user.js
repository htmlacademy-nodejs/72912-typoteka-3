'use strict';

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async create(userData) {
    const existAdmin = await this._User.findByPk(1);
    let user;
    if (existAdmin) {
      user = await this._User.create({...userData, role: `user`});
    } else {
      user = await this._User.create({...userData, role: `admin`});
    }

    return user.get();
  }

  async findByEmail(email) {

    const user = await this._User.findOne({
      where: {email}
    });

    return user && user.get();
  }
}

module.exports = UserService;
