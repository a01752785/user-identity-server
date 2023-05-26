'use strict';

import { userInfo } from "os";
import { Model } from "sequelize";

interface ProjectUserAttributes {
  idProject: number,
  idUser: string,
  budget: number
};

module.exports = (sequelize: any, DataTypes: any) => {
  class ProjectUser extends Model<ProjectUserAttributes> implements ProjectUserAttributes {
    idProject!: number;
    idUser!: string;
    budget!: number;
    static associate(models: any) {
      // 
    }
  }
  ProjectUser.init({
    idProject: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "Project",
        key: "id"
      }
    },
    idUser: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "User",
        key: "awsCognitoId"
      }
    }, 
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ProjectUser',
  });
  return ProjectUser;
};