const { expect }=require("chai");
const sinon=require("sinon");

const { Note }=require("../src/models");
const notesService=require("../src/services/notes.service");

describe("Notes Service", ()=>{

  afterEach(()=>{
    sinon.restore();
  });

  it("returns all notes for a user", async ()=>{

    const fakeNotes=[
      { id: 1 },
      { id: 2 },
    ];

    const sortStub=sinon.stub().resolves(fakeNotes);

    const findStub=sinon
      .stub(Note, "find")
      .returns({
        sort: sortStub,
      });

    const notes=await notesService.getAllNotes(7);

    expect(notes).to.equal(fakeNotes);

    expect(
      findStub.calledWithMatch({
        userId: 7,
      })
    ).to.be.true;

    expect(
      sortStub.calledWithMatch({
        updatedAt: -1,
      })
    ).to.be.true;

  });

  it("creates a note", async ()=>{

    const createStub=sinon.stub(Note, "create").resolves({
      id: 10,
      title: "Groceries",
    });

    const note=await notesService.createNote({
      title: "Groceries",
      content: "milk, eggs",
      userId: 3,
    });

    expect(note.id).to.equal(10);
    expect(createStub.calledOnce).to.be.true;

  });

  it("throws when note is not found", async ()=>{

    sinon.stub(Note, "findOne").resolves(null);

    try {

      await notesService.getNoteById(999, 3);

      expect.fail("Expected getNoteById to throw");

    } catch (err) {

      expect(err.statusCode).to.equal(404);

    }

  });

  it("updates only the given fields", async ()=>{

    const existingNote={
      id: 4,
      title: "Old title",
      content: "Old content",
      save: sinon.stub().resolves(),
    };

    sinon.stub(Note, "findOne").resolves(existingNote);

    const updated=await notesService.updateNote(
      4,
      3,
      {
        title: "New title",
      }
    );

    expect(updated.title).to.equal("New title");
    expect(updated.content).to.equal("Old content");
    expect(existingNote.save.calledOnce).to.be.true;

  });

  it("deletes a note", async ()=>{

    const existingNote={
      id: 4,
      deleteOne: sinon.stub().resolves(),
    };

    sinon.stub(Note, "findOne").resolves(existingNote);

    await notesService.deleteNote(4, 3);

    expect(existingNote.deleteOne.calledOnce).to.be.true;

  });

});