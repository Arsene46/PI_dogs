const axios = require("axios");
const { Op, Temperament, Dog } = require('../db.js');

require('dotenv').config();

const { API_KEY } = process.env;

const formatWeight = (weight) => {
    let w = weight?.metric.split(" - ");
    if (w[0] === "NaN") w.shift();
    if (w[1] === "NaN") w.pop();
    w = w.join(" - ");
    return w === "NaN" ? "" : w;
}
const formatLife = (life) => {
    return life.includes("years") ? life.slice(0, -6) : life;
}

let getApiDetail = async () => {
    try {
        let apiInfo = await axios.get(`https://api.thedogapi.com/v1/breeds/?api_key=${API_KEY}`);
        return apiInfo.data.map(d => {
            return {
                id: d.id,
                name: d.name,
                height: d.height?.metric,
                weight: formatWeight(d.weight),
                life_span: formatLife(d.life_span),
                image: d.image?.url,
                temperaments: d.temperament?.split(", "),
            };
        });
    } catch (error) {
        throw new Error(error);
    }
};

let getAllData = async () => {
    try {
        let apiInfo = await getApiDetail();
        apiInfo = apiInfo.map(d => {
            return { id: d.id, name: d.name, weight: d.weight, image: d.image, temperaments: d.temperaments, };
        });

        let breeds = await Dog.findAll({
            attributes: ["id", "name", "weight", "image"],
            include: Temperament,
        });
        breeds = breeds.map(b => {
            return {
                ...b.dataValues,
                temperaments: b.temperaments?.map(t => t.name),
            }
        });
        return [...breeds, ...await apiInfo];
    } catch (error) {
        throw new Error(error);
    }
};

let preLoadDb = async () => {
    try {
        let apiInfo = await getApiDetail();
        //finds all temperaments and adds them to db
        let temperaments = new Set();
        apiInfo.forEach(d => d.temperaments?.forEach(t => temperaments.add(capitalize(t))));
        Promise.all([...temperaments].map(async (t) => await Temperament.findOrCreate({ where: { name: t } })))
        //[...temperaments].forEach(async (t) => await Temperament.findOrCreate({ where: { name: t } }));
        //await Temperament.bulkCreate([...temperaments].map(t => { return { name: t } }), { validate: true });

        //adds all dog breeds to db and connect them with their temperaments (NOT ALLOWED!)
        // apiInfo.forEach(async (d) => {
        //     let resDog = await Dog.findOrCreate({
        //         where: {
        //             name: d.name,
        //             height: d.height,
        //             weight: d.weight,
        //             life_span: d.life_span,
        //             image: d.image,
        //         }
        //     });
        //     if (resDog[1]) {
        //         let actualDog = await Dog.findByPk(resDog[0].dataValues.id);
        //         d.temperament?.forEach(async (t) => {
        //             let temp = await Temperament.findOne({ where: { name: t } });
        //             await actualDog.addTemperament(temp);
        //         });
        //     }
        // });
    } catch (error) {
        throw new Error(error);
    }
};

let capitalize = (str) => {
    return str.split(" ")?.map(w => ((w[0]?.toUpperCase()) || "") + (w.slice(1)?.toLowerCase() || "")).join(" ");
}

module.exports = {
    getAllData,
    getApiDetail,
    preLoadDb,
    capitalize,
}

