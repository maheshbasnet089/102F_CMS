module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull : false
      },
      password: {
        type: DataTypes.TEXT,
        allowNull:false
      },
      otp : {
        type : DataTypes.STRING,
        allowNull : true
      },
      otpGeneratedTime : {
        type : DataTypes.STRING,
        allowNull : true
      },
      role  : {
        type : DataTypes.ENUM("user","admin"),
        defaultValue : "user"
      }
    
    });
    return User;
  };