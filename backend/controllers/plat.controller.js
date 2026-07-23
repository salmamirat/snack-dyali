const { Plat } = require("../models");



const getPlats = async(req,res)=>{

    try{

        const plats = await Plat.findAll();

        res.json(plats);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



const getPlatById = async(req,res)=>{

    try{

        const plat = await Plat.findByPk(req.params.id);


        if(!plat){

            return res.status(404).json({
                message:"Plat introuvable"
            });

        }


        res.json(plat);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




const createPlat = async(req,res)=>{

    try{

        const {nom,prix,categorie}=req.body;


        if(!nom || !prix || !categorie || prix<0){

            return res.status(400).json({
                message:"Données invalides"
            });

        }


        const plat = await Plat.create(req.body);


        res.status(201).json(plat);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




const updatePlat = async(req,res)=>{

    try{


        const plat = await Plat.findByPk(req.params.id);



        if(!plat){

            return res.status(404).json({
                message:"Plat introuvable"
            });

        }



        await plat.update(req.body);


        res.json(plat);



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




const deletePlat = async(req,res)=>{


    try{


        const plat = await Plat.findByPk(req.params.id);


        if(!plat){

            return res.status(404).json({
                message:"Plat introuvable"
            });

        }



        await plat.destroy();



        res.status(204).send();



    }catch(error){


        res.status(500).json({
            message:error.message
        });


    }

};




module.exports={getPlats, getPlatById, createPlat, updatePlat, deletePlat};