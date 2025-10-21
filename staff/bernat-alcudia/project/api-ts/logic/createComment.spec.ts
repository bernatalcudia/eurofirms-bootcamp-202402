import mongoose from "mongoose"
import { expect } from "chai"
import { CommentDocType, Comment } from "../data/models"
import { createComment } from "./createComment"
import { errors } from "com"

const { NotFoundError } = errors

// describe("createComment", () => {
//      before(() => mongoose.connect(process.env.MONGO_URL_TEST!))

//      beforeEach(() => Comment.deleteMany({}))

//      it("creates a comment", () => {
//          let value: void, comment: CommentDocType | null
//          const text = "hi world coders"
//          return createComment("68c2e427cbfeb33bb36e1e85", "68cd57cd19df9862698fc3b4", text)
//              .then((_value) => (value = _value))
//              .finally(() => {
//                  expect(comment).to.deep.equal({
//                      _id: comment?._id,
//                      product: "68cd57cd19df9862698fc3b4",
//                      author: "68c2e427cbfeb33bb36e1e85",
//                      text
//                  })
//              })
//      })

//      after(() => mongoose.disconnect())

//      afterEach(() => Comment.deleteMany({}))
// })