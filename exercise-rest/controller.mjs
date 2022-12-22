import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as exercises from './model.mjs';

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

function isBodyValid(name, reps, weight, unit, date) {
    console.log(name, reps, weight, unit, date)
    console.log(typeof (name), typeof (reps), typeof (weight), typeof (unit), typeof (date))

    if (typeof (reps) !== 'number') {
        return false;
    } else if (name === undefined || reps === undefined || weight === undefined || unit === undefined || date === undefined) {
        return false;
    } else if (name === null || reps < 1 || weight < 1) {
        return false;
    } else if (typeof (name) !== 'string' || typeof (reps) !== 'number' || typeof (weight) !== 'number') {
        return false;
    }
    return true;
}

/**
    *
    * @param {string} date
    * Return true if the date format is MM-DD-YY where MM, DD and YY are 2 digit integers
    */
function isDateValid(date) {
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

// create exercise
app.post('/exercises', asyncHandler(async (req, res) => {
    const exercise = req.body;
    const newExercise = await exercises.createExercise(
        exercise.name,
        exercise.reps,
        exercise.weight,
        exercise.unit,
        exercise.date);

    if (!isBodyValid(exercise.name,
        exercise.reps,
        exercise.weight,
        exercise.unit,
        exercise.date)) {
        res.statusCode = 400;
        res.send(res.statusCode);
    }
    else {
        res.statusCode = 201;
        res.send(newExercise);
    }
}));

// read all using GET /exercises
app.get('/exercises', asyncHandler(async (req, res) => {
    const results = await exercises.findExercises();
    res.send(results);
}));

// read one using GET /exercises
app.get('/exercises/:id', asyncHandler(async (req, res) => {
    const exerciseSearch = req.params;
    const filter = { _id: exerciseSearch.id };
    const results = await exercises.findExercise(filter);
    res.send(results);
}));

// update exercise
app.put('/exercises/:id', asyncHandler(async (req, res) => {
    const exerciseSearch = req.params;
    const filter = { _id: exerciseSearch.id };
    const resultVal = await exercises.updateExercise(filter, req.body);
    // update success and returns an object of updated results
    const updatedExercise = await exercises.findExercise(filter);

    if (!isBodyValid(updatedExercise.name,
        updatedExercise.reps,
        updatedExercise.weight,
        updatedExercise.unit,
        updatedExercise.date)) {
        res.statusCode = 400;
        res.send(res.body);
    } else {
        res.statusCode = 201;
        res.send(updatedExercise);
    }
    // res.send(updatedExercise);
}));

// delete exercise
app.delete('/exercises/:id', asyncHandler(async (req, res) => {
    const exerciseSearch = req.params;
    const filter = { _id: exerciseSearch.id }
    const resultVal = await exercises.deleteExercise(filter);
    // delete success and returns an object of deleted counts
    res.sendStatus(204);
}));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});