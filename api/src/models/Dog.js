const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('dog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    life_span: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
      // defaultValue: "https://st.depositphotos.com/1798678/3986/v/600/depositphotos_39864187-stock-illustration-dog-silhouette-vector.jpg",
      validate: {
        isUrl: true,
        isCorrectFormat: (value) => {
          if (value.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) === null){
            throw new Error ("Image format not valid!");
          }
          // const tiposImgen = ["jpg", "png", "gif", "tiff", "psd", "bmp"];
          // let valueImg = value.split(".");
          // valueImg = valueImg[valueImg.length - 1];
          // if (!tiposImgen.includes(valueImg)) {
          //   throw new Error ("Image format not valid!");
          // }
        }
      },
    },
    // fromApi: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true,
    // },
  });
};


