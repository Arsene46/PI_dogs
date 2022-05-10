const { Router } = require('express');
const { Op, Temperament, Dog } = require('../db.js');
const { getAllData, getApiDetail, preLoadDb, capitalize } = require('./controllers.js')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();
const isUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

preLoadDb();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/", (req,res) => {
    res.send("si funco");
})

router.get("/dogs", async (req, res, next) => {
    try {
        const { name } = req.query;
        let allInfo = await getAllData();
        if (name) {
            allInfo = allInfo.filter(b => b.name.toLowerCase().includes(name.toLowerCase()));
            if (allInfo.length === 0) return res.status(404).send("Dog breed not found!");
        }
        return res.send(allInfo);
    } catch (error) {
        next(error);
    }
});

router.get("/dogs/:idBreed", async (req, res, next) => {
    try {
        const { idBreed } = req.params;
        if (isUUID.test(idBreed)) {
            let breed = await Dog.findByPk(idBreed, { include: Temperament });
            if (!breed) return res.status(404).send("Dog id not found!");
            breed = {
                ...breed.dataValues,
                temperaments: breed.temperaments?.map(t => t.name),
            }
            return res.send(breed);
        };
        const apiData = await getApiDetail();
        const breed = apiData.find(b => b.id === parseInt(idBreed));
        if (!breed) return res.status(404).send("Dog id not found!");
        return res.send(breed);
    } catch (error) {
        next(error);
    }
});

router.get("/temperament", async (req, res, next) => {
    try {
        //preLoadDb();
        const temperaments = await Temperament.findAll({ attributes: ["name"], order: [["name", "ASC"]] })
        return res.send(temperaments.map(t => t.name));
    } catch (error) {
        next(error);
    }
});

router.post("/dog", async (req, res, next) => {
    try {
        let { name, height, weight, life_span, image, temperaments } = req.body;
        if (!name, !height, !weight) return res.status(404).send("Missing required data!");
        name = capitalize(name);
        const added = await Dog.findOrCreate({ where: { name }, defaults: { name, height, weight, life_span, image } });
        if (added[1]) {
            await Promise.all(temperaments?.map(async (t) => await Temperament.findOrCreate({ where: { name: capitalize(t) } })))
                .then((dbTemperament) => { added[0].addTemperaments(dbTemperament?.map(t => t[0])) })
                .then(() => res.status(201).send("New breed created successfully."))
            // temperaments?.forEach(async (t) => {
            //     let dbTemperament = await Temperament.findOrCreate({ where: { name: capitalize(t) } });
            //     await added[0].addTemperament(dbTemperament[0]);
            // });
            // res.status(201).send("New breed created successfully.");
        } else return res.status(302).send("Breeds already exists in DB!");
    } catch (error) {
        next(error);
    }
});

router.delete("/dog/:idBreed", async (req, res, next) => {
    try {
        const { idBreed } = req.params;
        const deleted = await Dog.destroy({ where: { id: idBreed } });
        if (!deleted) return res.status(404).send("Dog id not found!");
        return res.send("Deleted");
    } catch (error) {
        next(error);
    }
});

router.put("/dog/:idBreed", async (req, res, next) => {
    try {
        const { idBreed } = req.params;
        let { name, height, weight, life_span, image, temperaments } = req.body;
        name = capitalize(name);
        temperaments = temperaments.map(t => capitalize(t));
        const response = await Dog.update({ name, height, weight, life_span, image }, {
            where: { id: idBreed }
        });
        if (response) {
            const updatedDog = await Dog.findByPk(idBreed);
            await Promise.all(temperaments?.map(async (t) => await Temperament.findOrCreate({ where: { name: capitalize(t) } })))
                .then((dbTemperament) => { updatedDog.setTemperaments(dbTemperament?.map(t => t[0])) })
                .then(() => res.send(`${name} updated.`))
        } else return res.status(404).send("Dog id not found!");
    } catch (error) {
        next(error);
    }
});

module.exports = router;
