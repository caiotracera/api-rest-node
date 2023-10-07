module.exports = {
    '*.{ts,tsx}': (filenames) => [
        `npm run lint --fix ${filenames.join(' ')}`,
        // `npm test -- --findRelatedTests ${filenames.join(' ')}`,
        `bash -c tsc --noEmit`,
    ]
}
