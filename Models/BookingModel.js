import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        turf: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "turfs",
            required: true
        },
        bookDate:
        {
            type: Date,
            required: true
        },

        time: {
            type: String,
            required: true
        },
        payment: {
            type: String,
            required: true,
            default: 'Pending'
        },
        rate:{
            type: Number,
        }
    },
    {
        timestamps: true
    }
)

const bookingModel = mongoose.model('bookings', bookingSchema)


export default bookingModel