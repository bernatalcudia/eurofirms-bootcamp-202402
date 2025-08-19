import base64 from "base-64"
function extractPayload(token: string) {
    const [, payload64,]: string[] = token.split(".")
    const payloadJSON = base64.decode(payload64 as string)
    const payload = JSON.parse(payloadJSON)

    return payload
}

function formatDate(date: Date) {
    const day = date.getDate()

    const dayToString = day < 10 ? "0" + day : day
    const month = date.getMonth() + 1
    const monthToString = month < 10 ? "0" + month : month

    const year = date.getFullYear()

    const formattedDate = `${dayToString}-${monthToString}-${year}`

    return formattedDate
}



const utils = {
    extractPayload,
    formatDate
}

export default utils