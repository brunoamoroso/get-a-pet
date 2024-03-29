import mongoose from "../db/conn";
const { Schema } = mongoose;

const Pet = mongoose.model(
  "Pet",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      images: {
        type: Array,
        required: true,
      },
      avaiable: {
        type: Boolean,
        required: true,
      },
      user: Object,
      adopter: Object,
    },
    { timestamps: true }
  )
);

export default Pet;
