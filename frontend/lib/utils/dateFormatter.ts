export const TimestampToDate = (timestamp: String) => {
    const date = new Date(timestamp);

    return date.toLocaleString('en-US', {
        weekday: "long",
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    })
}

