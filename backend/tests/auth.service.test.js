const { expect }=require("chai");
const sinon=require("sinon");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const { User }=require("../src/models");
const authService=require("../src/services/auth.service");

describe("Auth Service", ()=>{

  afterEach(()=>{
    sinon.restore();
  });

  describe("signup", ()=>{

    it("creates a new user and returns a token when the email is not taken", async ()=>{

      sinon.stub(User, "findOne").resolves(null);
      sinon.stub(bcrypt, "hash").resolves("hashed_password");

      sinon.stub(User, "create").resolves({
        _id: "1",
        name: "Ali",
        email: "ali@test.com",
      });

      sinon.stub(jwt, "sign").returns("fake.jwt.token");

      const result=await authService.signup({
        name: "Ali",
        email: "ali@test.com",
        password: "secret123",
      });

      expect(result).to.have.property(
        "token",
        "fake.jwt.token"
      );

      expect(result.user).to.deep.equal({
        id: "1",
        name: "Ali",
        email: "ali@test.com",
      });

    });

    it("throws when the email already exists", async ()=>{

      sinon.stub(User, "findOne").resolves({
        _id: "5",
        email: "ali@test.com",
      });

      try {

        await authService.signup({
          name: "Ali",
          email: "ali@test.com",
          password: "secret123",
        });

        expect.fail("Expected signup to throw");

      } catch (err) {

        expect(err.statusCode).to.equal(409);

      }

    });

  });

  describe("login", ()=>{

    it("returns a token when email and password are correct", async ()=>{

      sinon.stub(User, "findOne").resolves({
        _id: "2",
        name: "Sara",
        email: "sara@test.com",
        password: "hashed_password",
      });

      sinon.stub(bcrypt, "compare").resolves(true);
      sinon.stub(jwt, "sign").returns("another.fake.token");

      const result=await authService.login({
        email: "sara@test.com",
        password: "secret123",
      });

      expect(result.token).to.equal("another.fake.token");
      expect(result.user.email).to.equal("sara@test.com");

    });

    it("throws when password is wrong", async ()=>{

      sinon.stub(User, "findOne").resolves({
        _id: "2",
        password: "hashed_password",
      });

      sinon.stub(bcrypt, "compare").resolves(false);

      try {

        await authService.login({
          email: "sara@test.com",
          password: "wrongpass",
        });

        expect.fail("Expected login to throw");

      } catch (err) {

        expect(err.statusCode).to.equal(401);

      }

    });

    it("throws when user is not found", async ()=>{

      sinon.stub(User, "findOne").resolves(null);

      try {

        await authService.login({
          email: "nobody@test.com",
          password: "whatever",
        });

        expect.fail("Expected login to throw");

      } catch (err) {

        expect(err.statusCode).to.equal(401);

      }

    });

  });

});