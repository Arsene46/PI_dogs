/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Dog, conn } = require('../../src/db.js');

const agent = session(app);

const dog = {
  name: 'PugVerde',
  height: "20 - 30",
  weight: "5 - 10"
};

const findDogByName = (dogs, name) => {
  return dogs.filter(d => d.name === name);
}

describe('Dog routes', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  beforeEach(() => Dog.sync({ force: true })
    .then(() => Dog.create(dog)));

  xdescribe('GET /dogs', () => {
    it('GET responds with api info', () =>
      agent
        .get('/dogs')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.have.lengthOf.above(150)
        })
    )

    it('responds with db info aswell', () =>
      agent
        .get('/dogs')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          // console.log(findDogByName(res.body, "PugVerde"));
          expect(findDogByName(res.body, "PugVerde")[0]).to.deep.include({ name: "PugVerde" })
        })
    )

    it('/dogs?name= responds with corresponding dogs', () =>
      agent
        .get('/dogs?name=pug')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          // console.log(res.body);
          expect(res.body).to.have.lengthOf(2)
        })
    )
    
    it('/dogs?name= responds with dogs in the correct format {id: ,name: , weight: , image: , temperaments: []}', () =>
      agent
        .get('/dogs?name=pug')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body[0]).to.deep.include(
            { name: 'PugVerde', weight: '5 - 10', image: null, temperaments: [] }
          )
          expect(res.body[1]).to.deep.include(
            {
              name: 'Pug', weight: '6 - 8', image: 'https://cdn2.thedogapi.com/images/HyJvcl9N7.jpg',
              temperaments: [
                'Docile', 'Clever',
                'Charming', 'Stubborn',
                'Sociable', 'Playful',
                'Quiet', 'Attentive'
              ]
            }
          )
        })
    )

  });

  // afterAll( async ()=>{conn.close()})

});
