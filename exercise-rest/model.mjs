import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;
const exerciseSchema = mongoose.Schema({
    name: { type: String },
    reps: { type: Number },
    weight: { type: Number },
    unit: { type: String },
    date: { type: String },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

// creates one exercise
const createExercise = async (name, reps, weight, unit, date) => {
    const exercise = new Exercise({
        name: name,
        reps: reps,
        weight: weight,
        unit: unit,
        date: date
    });
    console.log(exercise)
    return exercise.save();
};

// finds one exercise
const findExercise = async (filter) => {
    const query = Exercise.findOne(filter);
    return query.exec();
};

// finds all exercises
const findExercises = async () => {
    const query = Exercise.find();
    return query.exec();
};

// updates one exercise
const updateExercise = async (filter, update) => {
    const result = await Exercise.updateOne(filter, update);
};

// deletes one exercise
const deleteExercise = async (filter) => {
    const result = await Exercise.deleteMany(filter);
};

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

export { createExercise, findExercises, findExercise, updateExercise, deleteExercise }