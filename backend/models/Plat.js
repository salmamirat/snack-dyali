const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Plat = sequelize.define("Plat",{

    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },


    nom:{
        type:DataTypes.STRING(100),
        allowNull:false
    },


    prix:{
        type:DataTypes.DECIMAL(6,2),
        allowNull:false
    },


    categorie:{
        type:DataTypes.STRING(50),
        allowNull:false
    },


    disponible:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },


    created_at:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
    }


},{
    tableName:"plats",
    timestamps:false
});


module.exports=Plat;