'use strict';

import { userInfo } from "os";
import { Model } from "sequelize";

interface UserAttributes {
  awsCognitoId: string,
  name: string,
  role: string,
  email: string
};

export enum UserRoles {
  ADMIN = "ADMIN",
  SUPERVISOR = "SUPERVISOR",
  AGENTE = "AGENTE",
  CUSTOMER = "CUSTOMER"
};

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    awsCognitoId!: string;
    name!: string;
    role!: string;
    email!: string;
    static associate(models: any) {
      User.belongsToMany(models.Project, {through: "ProjectUser"});
    }
  }
  User.init({
    awsCognitoId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: UserRoles.CUSTOMER
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};