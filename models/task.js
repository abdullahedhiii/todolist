const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A task must have a title']
    },
    date: {
        type: Date,
        required: [true, 'A task must have a date']
    },
    completed: {
        type: Boolean,
        default: false
    },
    starred: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
