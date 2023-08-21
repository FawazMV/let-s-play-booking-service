import mongoose from "mongoose"
import bookingModel from "../Models/BookingModel.js"

export const bookingDetails = async (req, res, next) => {
    try {
        const result = await bookingModel.aggregate([
            { $match: { turf: new mongoose.Types.ObjectId(req.query.id), payment: 'Success' } },
            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { 'user.password': 0 } },
            { $sort: { bookDate: -1, time: 1 } }
        ])
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const userBookings = async (req, res, next) => {
    try {
        const data = await bookingModel.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.query.user) } },
            { $lookup: { from: 'turfs', localField: 'turf', foreignField: '_id', as: 'turf' } },
            { $unwind: '$turf' },
            { $project: { 'turf.courtName': 1, bookDate: 1, time: 1, payment: 1, createdAt: 1 } },
            { $sort: { bookDate: -1 } }
        ])
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}