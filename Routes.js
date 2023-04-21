import express from 'express';
import { bookSlot, bookedSlot, bookingSuccess, bookingFailed } from './Controllers/bookingControllers.js';
import { allReports, getPaymentRequests, confirmPaymentRequest, turfWiseEarningReport, getPaymentDetails, getTurfGraphData, getTurfBookingCount, dashboardGraphDetails, getAdminProfit, withdrawalRequest } from './Controllers/earningReportControllers.js';
import { paymentIntent } from './Controllers/paymentControllers.js';
import { bookingDetails, userBookings } from './Controllers/requestControllers.js';
const router = express.Router()

//userrequests
router.get('/payment', paymentIntent)

router.post('/book-slot', bookSlot)


router.patch('/booking-success', bookingSuccess)

router.patch('/booking-failed', bookingFailed)




//turf requests

router.get('/turf-booked-details', bookingDetails)

router.get('/collection-report', turfWiseEarningReport)

router.get('/booked-slots', bookedSlot)


//turf req - dashboard

router.get('/turf-profit-details', getPaymentDetails)

router.get('/turf-graph-data', getTurfGraphData)

router.get('/turf-bookings-count', getTurfBookingCount)

router.get('/turf-payment-request', withdrawalRequest)

//user requests

router.get('/user-bookings', userBookings)




//superAdminrequests

router.get('/all-reports', allReports)

router.get('/payment-requests', getPaymentRequests)

router.patch('/payment-confirm', confirmPaymentRequest)

router.get('/dashboard-graph-details', dashboardGraphDetails)

router.get('/dashboard-get-admin-profit', getAdminProfit)


export default router  