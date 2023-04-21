import mongoose from 'mongoose'

const requestSchema = new mongoose.Schema(
    {
        turf: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "turfs",
            required: true
        },
        amount: {
            type: Number,
            required: true,
            default: 0
        },
    },
    {
        timestamps: true
    }
)

const requestModel = mongoose.model('requests', requestSchema)


export default requestModel