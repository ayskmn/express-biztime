process.env.NODE_ENV === "test";

//npm packages
const request = require("supertest");

//app imports
const { createData } = require("../_test-common");
const app = require("../app");
const db = require("../db");


beforeEach(createData);

afterAll(async () => {
	await db.end()
})

describe("GET /", async function () {
	test ("It should return an array of companies", async function(){
		const response = await request(app).get("/companies");
		expect(response.body).toEqual({
			"companies": [
				{code: "apple", name: "Apple"},
				{code: "ibm", name: "IBM"},
			]
		});
	})
});


describe("GET /apple", function () {

	test("It returns a company info", async function () {
	  const response = await request(app).get("/companies/apple");
	  expect(response.body).toEqual(
	      {
		"company": {
		  code: "apple",
		  name: "Apple",
		  description: "Maker of OSX.",
		  invoices: [1, 2],
		}
	      }
	  );
	});
      
	test("It should return 404 for no-such-company", async function () {
	  const response = await request(app).get("/companies/banana");
	  expect(response.status).toEqual(404);
	})
      });
      

describe("POST /", function () {

  test("It should add company", async function () {
    const response = await request(app)
        .post("/companies")
        .send({name: "TacoTime", description: "Yum!"});

    expect(response.body).toEqual(
        {
          "company": {
            code: "tacotime",
            name: "TacoTime",
            description: "Yum!",
          }
        }
    );
  });

  test("It should return 500 for conflict", async function () {
    const response = await request(app)
        .post("/companies")
        .send({name: "Apple", description: "Huh?"});

    expect(response.status).toEqual(500);
  })
});

