import mongoose from "mongoose";
import { monthwiseReportCreation } from "../Helpers/helpers.js";
import bookingModel from "../Models/BookingModel.js";
import paymentModel from "../Models/PaymentDetails.js";
import requestModel from "../Models/PaymentRequest.js";

export const turfWiseEarningReport = async (req, res) => {
    try {

        let DaysAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
        let report = await bookingModel.aggregate([
            { $match: { turf: new mongoose.Types.ObjectId(req.query.turf), bookDate: { $gte: DaysAgo }, payment: 'Success' } },
            {
                $group: {
                    _id: "$bookDate",
                    totalPrice: { $sum: "$rate" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])
        return res.status(200).json(report)
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error', err: err })
    }
}

export const allReports = async (req, res, next) => {
    try {
        let report = await bookingModel.aggregate([
            { $match: { payment: 'Success' } },
            { $lookup: { from: 'turfs', localField: 'turf', foreignField: '_id', as: 'turf' } },
            {
                $group: {
                    _id: "$turf._id",
                    name: { "$first": "$turf.courtName" },
                    totalPrice: { $sum: "$rate" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { totalPrice: 1 } }
        ])
        return res.status(200).json(report)
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', err: error })
    }
}

export const getPaymentRequests = async (req, res) => {
    try {
        const result = await requestModel.aggregate([
            { $match: {} },
            { $lookup: { from: 'turfs', localField: 'turf', foreignField: '_id', as: 'turf' } },
            { $project: { amount: 1, createdAt: 1, 'turf.courtName': 1, 'turf.mobile': 1, 'turf._id': 1 } },
            { $sort: { createdAt: 1 } }
        ])
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', err: error })
    }
}

export const confirmPaymentRequest = async (req, res) => {
    try {
        const date = Date.now();

        const { turf, amount } = await requestModel.findByIdAndDelete(req.body.id)
        const result = await paymentModel.updateOne({ turf }, {
            $push: { withdrawn: { amount, date } },
        })
        return res.status(200).json({ message: 'Payment updated successfully' })
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', err: error })
    }
}

//turf dashboard

export const getPaymentDetails = async (req, res) => {
    try {
        const { balance } = await paymentModel.findOne({ turf: req.query.turf })
        const result = await paymentModel.aggregate([
            { $match: { turf: new mongoose.Types.ObjectId(req.query.turf) } },
            { $unwind: "$withdrawn" },
            { $group: { _id: null, totalWithdrawn: { $sum: "$withdrawn.amount" } } },
            { $project: { _id: 0, balance: 1, totalWithdrawn: 1 } }
        ])
        result[0].balance = balance;
        return res.status(200).json(result[0])
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', err: error })
    }
}


export const getTurfGraphData = async (req, res) => {
    try {
        const y = new Date().getFullYear();
        const firstDay = new Date(y, 0, 1);
        let bookings = await bookingModel.find({ bookDate: { $gte: firstDay }, payment: 'Success', turf: new mongoose.Types.ObjectId(req.query.turf) }).select('bookDate rate').lean()
        const monthlyReport = monthwiseReportCreation(bookings)
        return res.status(200).json({ monthlyReport })
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', err: error })
    }
}

export const getTurfBookingCount = async (req, res) => {
    try {
        let total = await bookingModel.find({ payment: 'Success', turf: new mongoose.Types.ObjectId(req.query.turf) }).count()
        let today = await bookingModel.find({ payment: 'Success', turf: new mongoose.Types.ObjectId(req.query.turf), bookDate: Date.now() }).count()
        return res.status(200).json({ total, today })
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', err: error })
    }
}

export const withdrawalRequest = async (req, res) => {
    try {
        const turf = req.query.turf
        const result = await paymentModel.findOneAndUpdate({ turf }, { $set: { balance: 0 } })
        const newReq = new requestModel({
            turf, amount: result?.balance
        });
        await newReq.save();
        return res.status(200).json({ message: 'Request submitted successfully' })
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', err: error })
    }
}

//superadmin

export const dashboardGraphDetails = async (req, res) => {
    try {
        const y = new Date().getFullYear();
        const firstDay = new Date(y, 0, 1);
        let bookings = await bookingModel.find({ bookDate: { $gte: firstDay }, payment: 'Success' }).select('bookDate rate').lean()
        const monthlyReport = monthwiseReportCreation(bookings)
        let turfWiseReport = await bookingModel.aggregate([
            { $match: { payment: 'Success' } },
            { $lookup: { from: 'turfs', localField: 'turf', foreignField: '_id', as: 'turf' } },
            { $group: { _id: "$turf._id", name: { "$first": "$turf.courtName" }, totalPrice: { $sum: "$rate" } } },
            { $project: { _id: 0 } },
            { $sort: { totalPrice: -1 } }
        ])
        return res.status(200).json({ turfWiseReport, monthlyReport })
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', err: error })
    }
}

export const getAdminProfit = async (req, res) => {
    try {
        const result = await bookingModel.aggregate([
            { $match: { payment: 'Success' } },
            { $group: { _id: null, total: { $sum: "$rate" } } },
            { $project: { _id: 0, total: 1 } }
        ])
        return res.status(200).json({ profit: result[0]?.total * 5 / 100 })
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', err: error })
    }
}