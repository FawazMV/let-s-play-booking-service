import sendMail from "./nodemailer.js";

export const successEmail = (data) => {
    const { _id, bookDate, time,email, username } = data;
    const { courtName } = data.turf;

    const text = `Dear ${username},

Thank you for booking a turf with us. We are pleased to confirm your reservation for the following details:

Turf Name: ${courtName}
Date: ${new Date(bookDate).toLocaleDateString()}
Time: ${time}
Your booking confirmation number is: ${_id}

Please ensure that you arrive at the venue at least 15 minutes before the start of your booking. If you have any questions or need to make any changes to your booking, please contact us at +919072879663.

Thank you for choosing us for your turf booking needs.

Best regards,

Let's Play`;

    sendMail(email, 'Your Turf Booking Receipt', text);
}


export const getMonthName = (monthNumber) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return months[monthNumber - 1]
}

export const monthwiseReportCreation = (bookings) => {
    let monthlyReport = []
    for (let i = 1; i <= 12; i++) {
        let totalSales = 0
        for (let k = 0; k < bookings.length; k++) {
            if (bookings[k].bookDate.getMonth() + 1 === i) {
                totalSales += bookings[k].rate
            }
        }
        monthlyReport.push({ month: getMonthName(i), totalPrice: totalSales })
    }
    return monthlyReport
}