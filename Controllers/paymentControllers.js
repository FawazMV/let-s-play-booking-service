import mongoose from 'mongoose';
import { paymentIntentSetup, paymentStripe } from '../Helpers/stripe.js';
import bookingModel from '../Models/BookingModel.js';


export const paymentIntent = async (req, res) => {
    try {
        const { book_id, email, intent } = req.query
        const result = await bookingModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(book_id) } },
            { $lookup: { from: 'turfs', localField: 'turf', foreignField: '_id', as: 'turf' } },
            { $unwind: '$turf' },
            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
            { $project: { 'turf.courtName': 1, 'turf.Price': 1, _id: 0 } },
        ])
        if (!intent) {
            const response = await paymentStripe(result[0]?.turf, email, book_id);
            res.status(200).json(response)
        } else {
            const response = await paymentIntentSetup(result[0]?.turf, email)
            res.status(200).json({ paymentIntent: response, book_id: book_id })
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error !" });
    }
}







