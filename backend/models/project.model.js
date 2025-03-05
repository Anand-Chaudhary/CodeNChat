import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
}, {
    timestamps: true
});

const Project = mongoose.model('project', projectSchema);
export default Project;