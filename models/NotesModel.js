const mongoose = require('mongoose');

//TODO - Create Note Schema here having fields
//      - noteTitle
//      - noteDescription
//      - priority (Value can be HIGH, LOW or MEDUIM)
//      - dateAdded
//      - dateUpdated
const NoteSchema = new mongoose.Schema({
    noteTitle: {
        type: String,
        required: [true, 'noteTitle is required'],
        trim: true
    },
    noteDescription: {
        type: String,
        required: [true, 'noteDescription is required'],
        trim: true
    },
    priority: {
        type: String,
        enum: {
            values: ['HIGH', 'MEDIUM', 'LOW'],
            message: 'priority must be HIGH, MEDIUM or LOW'
        },
        uppercase: true,
        default: 'MEDIUM'
    },
    // Stored as text like "06/Oct/2025" to match the sample payload in the README
    dateAdded: {
        type: String
    },
    dateUpdated: {
        type: String
    }
});

module.exports = mongoose.model('Note', NoteSchema);
