const { Dog, conn } = require('../../src/db.js');
const { expect } = require('chai');

const dog = {
  name: 'PugVerde',
  height: "20 - 30",
  weight: "5 - 10"
};

describe('Dog model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));

  beforeEach(() => Dog.sync({ force: true }));

  xdescribe('Dog', () => {

    it('should throw an error if name is null', (done) => {
      Dog.create({ ...dog, name: null })
        .then(() => done(new Error('It requires a valid name')))
        .catch(() => done());
    });

    it('should throw an error if height is null', (done) => {
      Dog.create({ ...dog, height: null })
        .then(() => done(new Error('It requires a valid height')))
        .catch(() => done());
    });

    it('should throw an error if weight is null', (done) => {
      Dog.create({ ...dog, weight: null })
        .then(() => done(new Error('It requires a valid weight')))
        .catch(() => done());
    });

    it('should throw an error if image is not an url with .jpg|.jpeg|.gif|.png|.tiff|.bmp', (done) => {
      Dog.create({ ...dog, image: "should throw error" })
        .then(() => done(new Error('It requires a valid image')))
        .catch(() => done());
    });


    it('should work when its a valid dog', async () => {
      newdog = await Dog.create(dog)
      expect(newdog.toJSON()).to.deep.include({ name: "PugVerde", height: "20 - 30", weight: "5 - 10", life_span: null, image: null });
    });

    it('should not allow more than one dog with the same name', async () => {
      newdog = await Dog.create(dog)
      try {
        expect(newdog.toJSON()).to.deep.include({ name: "PugVerde", height: "20 - 30", weight: "5 - 10", life_span: null, image: null });
        otherDog = await Dog.create(dog);
        expect(!!otherDog).to.eql(false);
      } catch (error) {
        expect(error.message).to.eql("Validation error");
      }

    });
  });
});
