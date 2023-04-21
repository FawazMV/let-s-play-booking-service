import mongoose from "mongoose";
import { successEmail } from "../Helpers/helpers.js";
import bookingModel from "../Models/BookingModel.js";
import paymentModel from "../Models/PaymentDetails.js";

export const bookSlot = async (req, res, next) => {
    try {
        const { user, turf, date, time } = req.body
        const newBooking = new bookingModel({
            bookDate: date, time, turf, user
        });
        const result = await newBooking.save();
        return res.status(200).json({ message: 'Booking saved successfully', booking_id: result._id })
    } catch (error) {
        return res.status(500).json({ error: 'internal server error', err: error })
    }
}

export const bookedSlot = async (req, res, next) => {
    try {
        const result = await bookingModel.find({ turf: req.query.id, bookDate: req.query.date, payment: 'Success' }, { time: 1, _id: 0 })
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ error: 'internal server error', err: error })
    }
}

export const bookingSuccess = async (req, res, next) => {
    try {
        const { id, username, email } = req.body
        const result = await bookingModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id), payment: 'Pending' } },
            { $lookup: { from: 'turfs', localField: 'turf', foreignField: '_id', as: 'turf' } },
            { $unwind: '$turf' },
            { $project: { 'turf._id': 1, payment: 1, 'turf.courtName': 1, 'turf.Price': 1, bookDate: 1, time: 1 } },
        ])
        if (result.length) {
            await bookingModel.updateOne({ _id: id }, { $set: { payment: 'Success' }, rate: result[0].turf.Price })
            const turf = await paymentModel.findOneAndUpdate({ turf: result[0].turf._id }, { $inc: { balance: result[0].turf.Price - (result[0].turf.Price * 5 / 100) } })
            if (!turf) {
                const newOne = new paymentModel({ turf: result[0].turf._id, balance: result[0].turf.Price - (result[0].turf.Price * 5 / 100) });
                newOne.save()
            }
            successEmail({ ...result[0], username, email })
            return res.status(200).json(result[0])
        }
    } catch (error) {
        return res.status(500).json({ error: 'internal server error', err: error })
    }
}


export const bookingFailed = async (req, res, next) => {
    try {
        await bookingModel.updateOne({ _id: req.body.id, payment: 'Pending' }, { $set: { payment: 'Failed' } })
        return res.status(200).json()
    } catch (error) {
        return res.status(500).json({ error: 'internal server error', err: error })
    }
}